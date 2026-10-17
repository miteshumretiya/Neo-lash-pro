# Neo Lash® Pro

The website for **Neo Lash®** — Daniela Ionel's lash & brow studio in St. Julian's, Malta: signature treatments (booked on Fresha),
the Neo Lash® Pro product line (ordered on WhatsApp) and the Neo Lash® Academy.

Built with Next.js 16 (App Router, Cache Components), React 19, TypeScript, Tailwind CSS 4, GSAP 3 (ScrollTrigger, SplitText, Flip,
CustomEase, DrawSVG), Lenis, three.js via React Three Fiber, and Zustand.

---

## Quick start

```bash
npm ci
npm run dev        # http://localhost:3000
npm run build      # production build (also type-checks)
npm start          # serve the production build
npm run lint       # ESLint (the build does not lint)
```

Node 20.9+ is required (Node 22 recommended).

### Environment variables

All optional — the site works without any of them.

| Variable | Used for |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for metadata, sitemap, JSON-LD and the product links inside WhatsApp orders. On Vercel it falls back to the project's production domain automatically. |
| `WOOCOMMERCE_STORE_URL` | Read products from a WooCommerce shop instead of `data/products.ts` (see [WooCommerce](#woocommerce)). |
| `NEXT_PUBLIC_NEWSLETTER` | Set to `1` to post newsletter sign-ups to `/api/subscribe`. Otherwise the footer form hands off to WhatsApp. |
| `SUBSCRIBE_WEBHOOK_URL` | Where `/api/subscribe` forwards `{ email, source }` (e.g. a Zapier/Make hook or your email provider). |

---

## How buying and booking work

- **No cart, no checkout, no online payment.** Every "Buy on WhatsApp" button opens WhatsApp to **+356 7777 2951** with the order
  already written: product, chosen option, quantity, price (or "price to confirm" for ranges) and a link to the product. The wishlist
  can be sent as a single multi-item order. Message templates live in `lib/whatsapp.ts`; the number in `lib/site.ts`.
- **Treatments** are booked on Fresha — every "Book now" links to `site.booking` in `lib/site.ts`.
- **Courses** are enquired about / enrolled on WhatsApp ("Price on request").
- The **contact form** stores nothing: it composes the message into WhatsApp.

---

## Project structure

```
app/                 Routes (home, shop, shop/[slug], wishlist, courses, courses/[slug], about,
                     journal, journal/[slug], contact, returns, privacy, terms, not-found),
                     sitemap.ts, robots.ts, manifest.ts, icon.svg, opengraph-image.tsx, api/subscribe
components/
  home/              The 12 home-page sections
  shop/              Product card, gallery, purchase panel, WhatsApp button, wishlist, quick view, catalogue
  academy/           Course index, certification path, certificate card, student reviews
  journal/ contact/ legal/ misc/
  layout/            Header, menu overlay, footer, newsletter, floating "Book now", theme/sound toggles
  motion/            Reusable motion primitives (see below)
  gl/  webgl/        DOM bridges and the three.js scene
  ui/                Page hero, accordion, breadcrumbs, CTA band, icons
data/                Products, courses, services, reviews, journal posts, legal copy, media registry
lib/                 Site config, WhatsApp helpers, SEO/JSON-LD, motion setup, stores, WebGL registry
scripts/media/       Image download/optimise pipeline + manifest generator
public/media/        Self-hosted, optimised photography
```

---

## Motion system

- **Smooth scroll** — Lenis (`components/motion/SmoothScroll.tsx`) is driven by GSAP's ticker
  (`lenis.on("scroll", ScrollTrigger.update)`, `gsap.ticker.add(t => lenis.raf(t * 1000))`, `lagSmoothing(0)`), so ScrollTrigger,
  Lenis and the WebGL canvas share one clock.
- **Easing** — three CustomEase curves registered in `lib/motion/gsap.ts`: `luxe` (default), `silk` (in-out wipes), `glide`.
- **Primitives** (`components/motion/`): `SplitReveal` (masked line/word/char reveals with SplitText), `Reveal` (fade-rise, optional
  stagger), `MediaReveal` (clip-path reveal + scale + parallax), `ScrubWords` (manifesto words 15% → 100% with scroll), `Marquee`
  (velocity-reactive), `Magnetic`, `TextRoll`, `Scramble`, `Counter`, `Tilt`, `DrawLash` (DrawSVG lash line) and `Cursor`
  (dot + ring with labels from `data-cursor`).
- **Page transitions** — `TransitionLink` plays a sage curtain with the destination title (`components/motion/Transition.tsx`).
  Product cards instead morph into the product page with React's `<ViewTransition>` (shared name `product-<slug>`).
- **Preloader** — the 000 → 100 intro with the image stack plays once per session, only when a visit starts on the home page.
- **Readiness** — entrance animations wait for the preloader/curtain via `useRevealReady()`, so nothing animates behind a cover.
- **Reduced motion** — with `prefers-reduced-motion`, splits/scrubs/parallax are skipped, reveals become short fades, the preloader
  and WebGL are off, and Lenis falls back to native scrolling.

## WebGL

One persistent, fixed canvas renders behind the DOM (`components/webgl/WebGLRoot.tsx`). DOM components register an element with
`lib/gl/registry.ts` (`GlImage`, `GlSilk`, `GlParticles`, `GlStage`) and the canvas draws a matching object synced to that element's
rect every frame: the hero silk shader, the lash-line particles, rippling image planes and the 3D rose-gold tweezers.

- **Tiers** (`lib/gl/capability.ts`): `on` (all effects), `lite` (touch/modest hardware: no image planes), `off` (no WebGL, reduced
  motion, data saver). Everything has a DOM/CSS fallback.
- **Lazy** — three.js is only downloaded once a page actually registers a GL element; rendering pauses when nothing GL is on screen.

---

## Products

Edit `data/products.ts`. Each product:

```ts
{
  slug: "lash-shampoo-50-ml",          // URL: /shop/lash-shampoo-50-ml
  name: "Neo Lash® Lash Shampoo 50 ml",
  category: "lash-care",               // tweezers | lashes | lash-care | accessories
  price: 15,                           // EUR (lowest price for ranges)
  priceMax: 35,                        // optional: shows "€25 – €35" and "price to confirm" on WhatsApp
  regularPrice: 18,                    // optional: shows a sale badge and the struck-through price
  detail: "50 ml · with tea tree extract",
  short: "One-line summary for cards and metadata.",
  description: ["Paragraph one.", "Paragraph two."],
  highlights: ["Oil free", "Safe for extensions"],      // optional
  options: [{ name: "Curl", values: ["C", "CC", "D"] }],  // optional
  images: [img("site/202212-xyz", "Alt text")],          // first image is the cover
  bestseller: true,                    // optional: appears on the home page
}
```

### Images

1. Put the optimised file in `public/media/site/` (or `stock/`).
2. Run `node scripts/media/manifest.mjs` — it records width, height and colour in `data/media.generated.ts`.
3. Reference it with `img("site/<file-name-without-extension>", "Alt text")`, or add it to the `photos` registry in `data/media.ts`.

The **Media** GitHub Action (`.github/workflows/media.yml`, run manually) re-runs the download/optimise pipeline in
`scripts/media/sync.mjs` (original-site images, the Pexels picks in `scripts/media/picks.json`, and copy snapshots) and commits the
results.

### WooCommerce

The UI only talks to the `ProductRepository` interface in `data/repository.ts`. Set `WOOCOMMERCE_STORE_URL=https://your-shop.com`
and products are read from the public WooCommerce Store API (`/wp-json/wc/store/v1/products`, no keys needed), mapped to the same
`Product` shape and revalidated hourly. Local data is still used for the `bestseller` flag; categories are inferred from WooCommerce
category slugs (`toCategory`). The shop's hostname is added to `images.remotePatterns` automatically so its photos can be optimised.

### Other content

`data/courses.ts` (courses, curriculum modules, FAQ, student reviews), `data/services.ts`, `data/reviews.ts`, `data/posts.ts`
(journal), `data/results.ts` (comparison slider), `data/legal.tsx` (returns, privacy, terms), `lib/site.ts` (contact details, links,
navigation).

---

## SEO & accessibility

- Per-page metadata and canonical URLs, generated Open Graph image (`app/opengraph-image.tsx`), `sitemap.xml`, `robots.txt`, web
  manifest and icons.
- JSON-LD: `BeautySalon` (with reviews and a booking action), `Product`/`AggregateOffer`, `Course`, `Article` and breadcrumbs.
- Skip link, visible focus styles, keyboard-operable menu (focus trap, Escape), quick view dialog, accordions and gallery tabs;
  ARIA states on filters and toggles; no horizontal scrolling down to 360 px.

## Deployment

Deployed on Vercel from this repository. Production uses `next build`; no extra configuration is required. Add a custom domain in
the Vercel project and (optionally) set `NEXT_PUBLIC_SITE_URL` to it.

---

## Before launch — please review

- **Legal pages** (`data/legal.tsx`) were rewritten in plain English for the WhatsApp ordering model (the previous site used
  generic templates). Have them checked by a qualified professional.
- **Course prices and dates** are "on request"; services in `data/services.ts` should match the Fresha menu.
- **Comparison slider** (`data/results.ts`) shows two different sets side by side — replace with genuine before/after pairs when
  available.
- **Delivery** — the copy says delivery options are confirmed on WhatsApp; add shipping details if you want them on the site.

## Credits

- Studio, product and portfolio photography: Neo Lash®.
- Additional photography from [Pexels](https://www.pexels.com) (free to use under the Pexels licence) — photo IDs are listed in
  `scripts/media/picks.json` (`https://www.pexels.com/photo/<id>/`).
- Typefaces: Instrument Serif and Inter Tight (SIL Open Font License), served with `next/font`; TTF copies in `assets/fonts/` are
  used only to render the Open Graph image.
