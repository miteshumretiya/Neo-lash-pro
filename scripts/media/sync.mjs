// Media pipeline: pulls photography from the original neolashpro.com site and
// curated Unsplash picks, optimises it with sharp and writes it to /public/media.
// Runs in CI (.github/workflows/media.yml) so the site never hotlinks images.
//
//   node scripts/media/sync.mjs review   -> site photos + Unsplash contact sheets
//   node scripts/media/sync.mjs content  -> original copy (products, pages, posts)
//   node scripts/media/sync.mjs final    -> download picks from picks.json
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
const QUERIES = [
  "eyelash extensions",
  "eyelashes close up",
  "woman eye macro",
  "eyebrows",
  "beauty salon interior",
  "beauty portrait natural light",
  "skincare editorial",
  "cosmetic products minimal",
  "tweezers",
  "malta",
  "conference audience",
  "beauty workshop",
];

async function unsplashReview() {
  for (const query of QUERIES) {
    const results = [];
    for (const page of [1, 2]) {
      const data = await get(
        `https://unsplash.com/napi/search/photos?query=${encodeURIComponent(query)}&per_page=30&page=${page}`,
        "json",
      );
      for (const r of data?.results ?? []) {
        const free = !r.premium && !r.plus && r.urls?.raw?.startsWith("https://images.unsplash.com");
        if (free) results.push(r);
      }
    }
    const picked = results.slice(0, 30);
    const slug = query.replace(/[^a-z0-9]+/g, "-");
    const tiles = [];
    const info = [];
    for (const [i, r] of picked.entries()) {
      const buffer = await get(`${r.urls.raw}&w=420&q=60&fm=jpg&fit=max`, "buffer");
      tiles.push({ buffer, label: i });
      info.push({
        i,
        id: r.id,
        w: r.width,
        h: r.height,
        alt: r.alt_description ?? r.description ?? "",
        by: r.user?.name ?? "",
      });
    }
    console.log(`unsplash "${query}": ${picked.length}`);
    if (!tiles.length) continue;
    await contactSheet(tiles, path.join(REVIEW, `u-${slug}.jpg`), `unsplash: ${query}`);
    await fs.writeFile(path.join(REVIEW, `u-${slug}.json`), JSON.stringify(info, null, 1));
  }
}

// ------------------------------------------------------------- final picks
async function unsplashFinal() {
  const picks = JSON.parse(await fs.readFile(path.join(ROOT, "scripts/media/picks.json"), "utf8"));
  const credits = [];
  for (const [key, id] of Object.entries(picks)) {
    const photo = await get(`https://unsplash.com/napi/photos/${id}`, "json");
    if (!photo?.urls?.raw) continue;
    const buffer = await get(`${photo.urls.raw}&w=2400&q=85&fm=jpg&fit=max`, "buffer");
    if (!buffer) continue;
    const file = `stock/${key}.jpg`;
    const dims = await saveJpeg(buffer, path.join(MEDIA, file), 2400);
    credits.push({
      key,
      file,
      id,
      ...dims,
      alt: photo.alt_description ?? photo.description ?? "",
      photographer: photo.user?.name ?? "",
      profile: photo.user?.links?.html ?? "",
      link: photo.links?.html ?? "",
    });
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

if (mode === "review") {
  await crawlSite();
  await unsplashReview();
} else if (mode === "content") {
  await siteContent();
} else if (mode === "final") {
  await unsplashFinal();
} else {
  throw new Error(`Unknown mode ${mode}`);
}
