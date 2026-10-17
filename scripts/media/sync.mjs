// Media pipeline: pulls photography from the original neolashpro.com site and
// curated Unsplash picks, optimises it with sharp and writes it to /public/media.
// Runs in CI (.github/workflows/media.yml) so the site never hotlinks images.
//
//   node scripts/media/sync.mjs site     -> photos from the original site
//   node scripts/media/sync.mjs stock    -> Unsplash contact sheets for review
//   node scripts/media/sync.mjs pexels   -> Pexels contact sheets for review
//   node scripts/media/sync.mjs content  -> original copy (products, pages, posts)
//   node scripts/media/sync.mjs final    -> download picks from picks.json
// Steps can be combined: "stock,content".
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const MEDIA = path.join(ROOT, "public/media");
const REVIEW = path.join(ROOT, ".media-review");
const UA = {
  "user-agent":
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36",
  accept: "application/json, text/html;q=0.9, */*;q=0.8",
};

const mode = process.argv[2] ?? "review";

async function get(url, as = "text") {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, { headers: UA });
      if (!res.ok) throw new Error(`${res.status} ${url}`);
      if (as === "json") return await res.json();
      if (as === "buffer") return Buffer.from(await res.arrayBuffer());
      return await res.text();
    } catch (err) {
      if (attempt === 2) {
        console.warn("  ! failed", url, err.message);
        return null;
      }
      await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
    }
  }
}

async function saveJpeg(buffer, file, maxWidth = 2000) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  const img = sharp(buffer, { failOn: "none" }).rotate();
  const meta = await img.metadata();
  await img
    .resize({ width: Math.min(maxWidth, meta.width ?? maxWidth), withoutEnlargement: true })
    .flatten({ background: "#f5f1eb" })
    .jpeg({ quality: 82, mozjpeg: true, progressive: true })
    .toFile(file);
  const out = await sharp(file).metadata();
  return { width: out.width, height: out.height };
}

function escapeXml(s) {
  return String(s).replace(/[<>&"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

async function contactSheet(tiles, file, title) {
  const cols = 6;
  const cell = 280;
  const rows = Math.ceil(tiles.length / cols);
  const header = 56;
  const width = cols * cell;
  const height = rows * cell + header;
  const composites = [];
  for (const [i, t] of tiles.entries()) {
    if (!t.buffer) continue;
    const x = (i % cols) * cell;
    const y = header + Math.floor(i / cols) * cell;
    const thumb = await sharp(t.buffer, { failOn: "none" })
      .resize(cell - 6, cell - 6, { fit: "cover", position: "attention" })
      .jpeg({ quality: 70 })
      .toBuffer();
    composites.push({ input: thumb, left: x + 3, top: y + 3 });
    const label = Buffer.from(
      `<svg width="${cell}" height="34"><rect width="${Math.max(40, String(t.label).length * 13 + 16)}" height="34" fill="#111"/><text x="8" y="24" font-family="DejaVu Sans, Arial" font-size="20" fill="#fff">${escapeXml(t.label)}</text></svg>`,
    );
    composites.push({ input: label, left: x + 3, top: y + 3 });
  }
  composites.push({
    input: Buffer.from(
      `<svg width="${width}" height="${header}"><rect width="100%" height="100%" fill="#f5f1eb"/><text x="16" y="38" font-family="DejaVu Sans, Arial" font-size="26" fill="#141414">${escapeXml(title)}</text></svg>`,
    ),
    left: 0,
    top: 0,
  });
  await fs.mkdir(path.dirname(file), { recursive: true });
  await sharp({ create: { width, height, channels: 3, background: "#ddd" } })
    .composite(composites)
    .jpeg({ quality: 72 })
    .toFile(file);
}

// ---------------------------------------------------------------- site photos
async function crawlSite() {
  const index = await get("https://neolashpro.com/sitemap_index.xml");
  const maps = [...(index ?? "").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const pages = new Set(["https://neolashpro.com/"]);
  const images = new Set();
  for (const map of maps) {
    const xml = (await get(map)) ?? "";
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      if (/\.(jpe?g|png|webp)$/i.test(m[1])) images.add(m[1]);
      else pages.add(m[1]);
    }
    for (const m of xml.matchAll(/<image:loc>([^<]+)<\/image:loc>/g)) images.add(m[1]);
  }
  for (const page of pages) {
    const html = (await get(page)) ?? "";
    for (const m of html.matchAll(
      /https?:\/\/neolashpro\.com\/wp-content\/uploads\/[^"' )\s,]+\.(?:jpe?g|png|webp)/gi,
    )) {
      images.add(m[0]);
    }
  }
  const full = new Set(
    [...images]
      .map((u) => u.replace(/-\d+x\d+(?=\.(jpe?g|png|webp)$)/i, "").replace(/-scaled(?=\.)/, ""))
      .filter((u) => !/favikon|platnosci|vertical-line|cropped-|woocommerce-placeholder/i.test(u)),
  );
  console.log(`site: ${pages.size} pages, ${full.size} unique images`);

  const manifest = [];
  const tiles = [];
  for (const url of full) {
    const buffer = await get(url, "buffer");
    if (!buffer) continue;
    const meta = await sharp(buffer, { failOn: "none" }).metadata().catch(() => null);
    if (!meta || (meta.width ?? 0) < 240) continue;
    const name = path
      .basename(url)
      .replace(/\.(jpe?g|png|webp)$/i, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const year = url.match(/uploads\/(\d{4})\/(\d{2})/);
    const file = `site/${year ? `${year[1]}${year[2]}-` : ""}${name}.jpg`;
    const dims = await saveJpeg(buffer, path.join(MEDIA, file));
    manifest.push({ file, source: url, ...dims });
    tiles.push({ buffer, label: manifest.length - 1 });
  }
  await fs.writeFile(path.join(MEDIA, "site/index.json"), JSON.stringify(manifest, null, 2));
  for (let i = 0; i < tiles.length; i += 30) {
    await contactSheet(
      tiles.slice(i, i + 30),
      path.join(REVIEW, `site-${i / 30}.jpg`),
      `neolashpro.com uploads ${i}-${Math.min(i + 29, tiles.length - 1)}`,
    );
  }
}

// ------------------------------------------------------------ Unsplash review
// The JSON API needs a key, so candidates come from public search pages and the
// /download redirect, which only resolves for free (non Unsplash+) photos.
const SEARCHES = [
  "lash-extensions",
  "eyelash-extensions",
  "lashes",
  "eye-close-up",
  "eyebrows",
  "lash-artist",
  "beauty-portrait",
  "natural-beauty-woman",
  "beauty-editorial",
  "skincare-aesthetic",
  "malta",
  "conference-audience",
];
const EXTRA_IDS = [
  "GEct9d7zgos", "Ky4XkgxoUbo", "I9qWzMTuL5k", "ugqI4poLV-g", "xFvGVDp3cYE",
  "uIJtDZIbSwI", "nKyxhvjFzdk", "fvInY-Gh7sc", "De36tNJI-mU", "e9IB1BpfQRI",
  "DnXT8yM_63I", "fDpqQQqmQ20",
];

async function freeImageUrl(id) {
  try {
    const res = await fetch(`https://unsplash.com/photos/${id}/download?force=true`, {
      headers: UA,
      redirect: "manual",
    });
    const location = res.headers.get("location");
    return location?.startsWith("https://images.unsplash.com") ? location : null;
  } catch {
    return null;
  }
}

async function unsplashReview() {
  const groups = [];
  for (const term of SEARCHES) {
    const html = (await get(`https://unsplash.com/s/photos/${term}?license=free`)) ?? "";
    const ids = [
      ...new Set([...html.matchAll(/href="\/photos\/(?:[a-z0-9-]+-)?([A-Za-z0-9_-]{11})"/g)].map((m) => m[1])),
    ];
    console.log(`search ${term}: ${ids.length} ids`);
    groups.push({ name: term, ids: ids.slice(0, 18) });
  }
  groups.push({ name: "extra", ids: EXTRA_IDS });

  for (const group of groups) {
    const tiles = [];
    const info = [];
    for (const id of group.ids) {
      const url = await freeImageUrl(id);
      if (!url) continue;
      const buffer = await get(`${url}&w=420&q=60`, "buffer");
      if (!buffer) continue;
      tiles.push({ buffer, label: tiles.length });
      info.push({ i: info.length, id });
    }
    console.log(`unsplash ${group.name}: ${tiles.length} free`);
    if (!tiles.length) continue;
    await contactSheet(tiles, path.join(REVIEW, `u-${group.name}.jpg`), `unsplash: ${group.name}`);
    await fs.writeFile(path.join(REVIEW, `u-${group.name}.json`), JSON.stringify(info));
  }
}

// -------------------------------------------------------------- Pexels review
// Pexels' CDN is open to CI runners. Candidates come from known photo ids,
// neighbouring ids of the lash shoots, and search pages when reachable.
const PEXELS_IDS = [
  7755523, 7755531, 256380, 7479587, 20623368, 21412169, 3154, 11503675, 1510634, 32039798,
  8554941, 5128113, 3762664, 39351603, 29708266, 31129059, 13767162, 15569274, 7298680,
  3373716, 19248753, 6567969,
];
const PEXELS_RANGES = [
  [7755490, 7755570],
  [8554925, 8554965],
];
const PEXELS_SEARCHES = ["st julian's", "malta coast", "valletta", "lash studio", "eyelash extensions", "beauty face", "brow"];

const pexelsCdn = (id, file, w) =>
  `https://images.pexels.com/photos/${id}/${file}?auto=compress&cs=tinysrgb&w=${w}`;

async function pexelsUrl(ref, w) {
  const [id, file] = String(ref).split("/");
  const names = file ? [file] : [`pexels-photo-${id}.jpeg`, `pexels-photo-${id}.jpg`, `pexels-photo-${id}.png`];
  for (const name of names) {
    try {
      const res = await fetch(pexelsCdn(id, name, w), { method: "HEAD", headers: UA });
      if (res.ok && (res.headers.get("content-type") ?? "").startsWith("image")) return pexelsCdn(id, name, w);
    } catch {}
  }
  return null;
}

async function pexelsReview() {
  const groups = [{ name: "known", refs: PEXELS_IDS }];
  for (const [from, to] of PEXELS_RANGES) {
    groups.push({ name: `range-${from}`, refs: Array.from({ length: to - from }, (_, i) => from + i) });
  }
  for (const q of PEXELS_SEARCHES) {
    const html = (await get(`https://www.pexels.com/search/${encodeURIComponent(q)}/`)) ?? "";
    const refs = [
      ...new Set([...html.matchAll(/images\.pexels\.com\/photos\/(\d+)\/([a-z0-9-]+\.(?:jpe?g|png))/gi)].map((m) => `${m[1]}/${m[2]}`)),
    ];
    console.log(`pexels search "${q}": ${refs.length}`);
    if (refs.length) groups.push({ name: `q-${q.replace(/[^a-z0-9]+/gi, "-")}`, refs: refs.slice(0, 30) });
  }
  for (const group of groups) {
    const tiles = [];
    const info = [];
    for (const ref of group.refs) {
      const url = await pexelsUrl(ref, 420);
      if (!url) continue;
      const buffer = await get(url, "buffer");
      if (!buffer) continue;
      tiles.push({ buffer, label: tiles.length });
      info.push({ i: info.length, ref: String(ref) });
    }
    console.log(`pexels ${group.name}: ${tiles.length}`);
    for (let i = 0; i < tiles.length; i += 30) {
      const slice = tiles.slice(i, i + 30);
      await contactSheet(slice, path.join(REVIEW, `p-${group.name}-${i / 30}.jpg`), `pexels ${group.name} ${i}+`);
    }
    if (info.length) await fs.writeFile(path.join(REVIEW, `p-${group.name}.json`), JSON.stringify(info));
  }
}

// ------------------------------------------------------------- final picks
async function unsplashFinal() {
  const picks = JSON.parse(await fs.readFile(path.join(ROOT, "scripts/media/picks.json"), "utf8"));
  const credits = [];
  for (const [key, id] of Object.entries(picks)) {
    const url = id.startsWith("pexels:") ? await pexelsUrl(id.slice(7), 2400) : await freeImageUrl(id);
    if (!url) {
      console.warn("  ! not free or missing", id);
      continue;
    }
    const buffer = await get(id.startsWith("pexels:") ? url : `${url}&w=2400&q=85`, "buffer");
    if (!buffer) continue;
    const file = `stock/${key}.jpg`;
    const dims = await saveJpeg(buffer, path.join(MEDIA, file), 2400);
    const link = id.startsWith("pexels:")
      ? `https://www.pexels.com/photo/${id.slice(7).split("/")[0]}/`
      : `https://unsplash.com/photos/${id}`;
    credits.push({ key, file, source: id, ...dims, link });
    console.log("saved", file);
  }
  await fs.writeFile(path.join(MEDIA, "stock/credits.json"), JSON.stringify(credits, null, 2));
}

// ------------------------------------------------------- original site copy
const htmlToText = (html = "") =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<img[^>]*?src="([^"]+)"[^>]*>/gi, (_, src) => ` [img ${path.basename(src)}] `)
    .replace(/<(h[1-6])[^>]*>/gi, "\n## ")
    .replace(/<\/(p|li|div|h[1-6]|tr)>|<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8211;|&ndash;/g, "-")
    .replace(/&#8217;|&#8216;/g, "'")
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&euro;|&#8364;/g, "€")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n+/g, "\n")
    .trim();

async function siteContent() {
  const out = path.join(REVIEW, "content");
  await fs.mkdir(out, { recursive: true });

  const products = (await get("https://neolashpro.com/wp-json/wc/store/v1/products?per_page=100", "json")) ?? [];
  const slim = products.map((p) => ({
    name: p.name,
    slug: p.slug,
    permalink: p.permalink,
    prices: p.prices,
    on_sale: p.on_sale,
    categories: p.categories?.map((c) => c.name),
    attributes: p.attributes?.map((a) => ({ name: a.name, terms: a.terms?.map((t) => t.name) })),
    variations: p.variations,
    short: htmlToText(p.short_description),
    description: htmlToText(p.description),
    images: p.images?.map((i) => i.src),
  }));
  await fs.writeFile(path.join(out, "products.json"), JSON.stringify(slim, null, 1));
  console.log(`products: ${slim.length}`);

  for (const type of ["pages", "posts"]) {
    const items = (await get(`https://neolashpro.com/wp-json/wp/v2/${type}?per_page=100`, "json")) ?? [];
    for (const item of items) {
      const text = `# ${htmlToText(item.title?.rendered)}\n${item.link}\n\n${htmlToText(item.content?.rendered)}`;
      await fs.writeFile(path.join(out, `${type}-${item.slug}.txt`), text);
    }
    console.log(`${type}: ${items.length}`);
  }

  // Page builders often render outside the REST content, so keep the raw homepage text too.
  for (const slug of ["", "about-us", "courses", "contact", "basic-course", "volume-course", "combo-course", "masterclass-course"]) {
    const html = await get(`https://neolashpro.com/${slug}${slug ? "/" : ""}`);
    if (!html) continue;
    const body = html.replace(/<header[\s\S]*?<\/header>/gi, " ").replace(/<footer[\s\S]*?<\/footer>/gi, " ");
    await fs.writeFile(path.join(out, `html-${slug || "home"}.txt`), htmlToText(body));
  }
}

const steps = { site: crawlSite, stock: unsplashReview, pexels: pexelsReview, content: siteContent, final: unsplashFinal };
const requested = mode === "review" ? ["site", "stock"] : mode.split(",");
for (const step of requested) {
  if (!steps[step]) throw new Error(`Unknown mode ${step}`);
  await steps[step]();
}
