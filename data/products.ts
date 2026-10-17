import { img } from "./media";
import type { CategoryInfo, Product, ProductCategory } from "./types";

export const categoryLabels: Record<ProductCategory, string> = {
  tweezers: "Tweezers",
  lashes: "Lashes",
  "lash-care": "Lash Care",
  accessories: "Accessories",
};

const lashTrayImages = (name: string) => [
  img("site/202212-progetto-senza-titolo-2-1", `${name} — Black Diamond Line packaging`),
  img("site/202212-progetto-senza-titolo-3-1", `${name} — open lash tray`),
  img("site/202212-progetto-senza-titolo-5", `${name} — silk lash box`),
];

const lashCopy = [
  "Neo Lash® lashes are 100% synthetic and cruelty free.",
  "Each row is checked for quality before it ships, so every set you build starts from consistent curl, length and thickness.",
];

/**
 * The Neo Lash® Pro catalogue. Prices are in EUR; `regularPrice` marks a sale.
 * Swap this module for the WooCommerce repository (see data/repository.ts)
 * without touching the UI.
 */
export const catalog: Product[] = [
  {
    slug: "neo-lash-tweezers",
    name: "Neo Lash® Tweezers",
    category: "tweezers",
    price: 25,
    priceMax: 35,
    short: "Six precision profiles for isolation, classic and volume work.",
    description: [
      "Neo Lash® tweezers are finished in rose gold with a textured grip that stays comfortable through long sessions.",
      "Choose the profile that matches your technique — a fine curved tip for isolating natural lashes, L-shaped tips for classic placement, or wider-angle closures for picking up and pinching volume fans.",
    ],
    highlights: ["Six profiles to choose from", "Textured grip", "Rose-gold finish"],
    options: [
      {
        name: "Profile",
        values: ["Russian Volume 75°", "Russian Volume", "L Type Volume", "L Classic", "L Classic Thin", "Curved Isolation"],
      },
    ],
    images: [
      img("site/202212-prodotti-website-2-1", "Fan of six Neo Lash rose-gold tweezers"),
      img("site/202212-prodotti-website", "Neo Lash tweezers displayed on a black stand"),
      img("site/202212-prodotti-website-3", "Neo Lash tweezer profiles labelled by name"),
      img("site/202212-12-1", "Neo Lash Russian volume tweezer"),
      img("site/202212-14", "Neo Lash L-shaped tweezer"),
      img("site/202212-13-1", "Neo Lash curved tweezer with a textured grip"),
      img("site/202212-15", "Neo Lash tweezer with a fine angled tip"),
    ],
    bestseller: true,
  },
  {
    slug: "black-diamond-collection-0-06-i-single-trays",
    name: "Black Diamond Collection 0.06",
    category: "lashes",
    price: 23,
    detail: "Single length trays · 20 rows",
    short: "Ultra-fine 0.06 lashes for airy, weightless volume fans.",
    description: lashCopy,
    options: [
      { name: "Curl", values: ["C", "CC", "D"] },
      { name: "Length", values: ["6mm", "7mm", "8mm", "9mm", "10mm", "11mm", "12mm", "13mm", "14mm"] },
    ],
    images: lashTrayImages("Black Diamond Collection 0.06"),
  },
  {
    slug: "black-diamond-collection-0-08-i-single-trays",
    name: "Black Diamond Collection 0.08",
    category: "lashes",
    price: 23,
    detail: "Single length trays · 20 rows",
    short: "Soft 0.08 lashes for fluffy hybrids and lightweight volume.",
    description: lashCopy,
    options: [
      { name: "Curl", values: ["B", "C", "CC"] },
      { name: "Length", values: ["6mm", "7mm", "8mm", "9mm", "10mm", "11mm", "12mm", "13mm"] },
    ],
    images: lashTrayImages("Black Diamond Collection 0.08"),
    bestseller: true,
  },
  {
    slug: "black-diamond-collection-0-10-i-single-trays",
    name: "Black Diamond Collection 0.10",
    category: "lashes",
    price: 21,
    detail: "Single length trays · 16 rows",
    short: "Defined 0.10 lashes for crisp classic and light volume sets.",
    description: lashCopy,
    options: [
      { name: "Curl", values: ["CC", "D"] },
      { name: "Length", values: ["7mm", "8mm", "9mm", "10mm", "11mm", "12mm", "13mm"] },
    ],
    images: lashTrayImages("Black Diamond Collection 0.10"),
  },
  {
    slug: "black-diamond-line-0-08-mix-i-7-13mm-i",
    name: "Black Diamond Line 0.08 Mix",
    category: "lashes",
    price: 23,
    detail: "Mixed tray 7–13mm · 16 rows",
    short: "Faux-mink mixed tray, 7–13mm, for mapping full sets from one tray.",
    description: [
      "Neo Lash® uses the highest quality faux-mink fibres. Each row is quadruple checked so every order arrives consistent, tray after tray.",
      "A mixed 7–13mm tray in a lifted D curl — everything you need to map a full set without switching trays.",
    ],
    options: [{ name: "Curl", values: ["D"] }],
    images: lashTrayImages("Black Diamond Line 0.08 Mix"),
    bestseller: true,
  },
  {
    slug: "black-diamond-line-0-10-mix-trays-i-7-13mm-i",
    name: "Black Diamond Line 0.10 Mix",
    category: "lashes",
    price: 23,
    detail: "Mixed tray 7–13mm · 16 rows",
    short: "Faux-mink mixed tray in C, CC or D curl for defined classic sets.",
    description: [
      "Neo Lash® uses the highest quality faux-mink fibres. Each row is quadruple checked so every order arrives consistent, tray after tray.",
      "A mixed 7–13mm tray in 0.10 thickness for classic sets with definition. Available in C, CC and D curls.",
    ],
    options: [{ name: "Curl", values: ["C", "CC", "D"] }],
    images: lashTrayImages("Black Diamond Line 0.10 Mix"),
  },
  {
    slug: "lash-shampoo-50-ml",
    name: "Neo Lash® Lash Shampoo 50 ml",
    category: "lash-care",
    price: 15,
    regularPrice: 18,
    detail: "50 ml · with tea tree extract",
    short: "Gentle foaming cleanser that prepares lashes for a stronger bond.",
    description: [
      "Neo Lash's lash shampoo with tea tree extract cleans natural lashes and removes remaining proteins and oils, preparing the surface for a better bond with adhesive and longer retention.",
      "Safe for eyelash extensions and gentle enough for daily aftercare at home.",
    ],
    highlights: ["Deep cleansing", "Removes make-up", "Safe for extensions", "Oil free", "Helps glue adhesion", "Cruelty free & vegan"],
    images: [
      img("site/202212-prodotti-website-1", "Neo Lash lash shampoo bottle with its box"),
      img("site/202212-img-20221205-111652-475", "Neo Lash lash cleanser box held in the studio"),
      img("site/202212-prodotti-website-3-1", "Neo Lash lash shampoo benefits illustrated"),
      img("site/202212-progetto-senza-titolo-7", "Ingredient list on the Neo Lash lash shampoo box"),
    ],
    bestseller: true,
  },
  {
    slug: "lash-shampoo",
    name: "Neo Lash® Lash Shampoo 200 ml",
    category: "lash-care",
    price: 25,
    regularPrice: 29,
    detail: "200 ml · salon & home use",
    short: "The salon size of our tea tree lash shampoo.",
    description: [
      "The same tea tree formula in a 200 ml size for salons. It cleans natural lashes and removes remaining proteins and oils before application, so adhesive bonds better and sets last longer.",
    ],
    highlights: ["Deep cleansing", "Removes make-up", "Safe for extensions", "Oil free", "Helps glue adhesion", "Cruelty free & vegan"],
    images: [
      img("site/202212-prodotti-website-4", "Neo Lash lash shampoo 200 ml bottle"),
      img("site/202212-prodotti-website-3-1", "Neo Lash lash shampoo benefits illustrated"),
      img("site/202212-progetto-senza-titolo-7", "Ingredient list on the Neo Lash lash shampoo box"),
    ],
  },
  {
    slug: "tweezer-cleanser",
    name: "Tweezer Cleanser",
    category: "accessories",
    price: 9,
    regularPrice: 12,
    short: "Lifts cured glue from your tips in seconds, mid-appointment.",
    description: [
      "This solution removes unwanted glue from your tweezers quickly and efficiently, so you can keep working without interrupting the application.",
      "Dip your tweezers into the solution and pinch the sponge for 10–15 seconds, then wipe with a clean paper towel.",
    ],
    images: [img("site/202212-13", "Neo Lash tweezer cleanser jar with sponge")],
    bestseller: true,
  },
  {
    slug: "glue-stone",
    name: "Glue Stone",
    category: "accessories",
    price: 6.97,
    regularPrice: 7.97,
    short: "Crystal adhesive stone that keeps your glue cool and beaded.",
    description: [
      "The Neo Lash® crystal stone is a premium adhesive surface that keeps glue cool and fresh during application. Its smooth surface makes cleaning simple.",
      "It keeps extension adhesive beaded and at a consistent temperature from the first lash to the last.",
    ],
    images: [img("site/202212-prodotti-website-2", "Neo Lash crystal glue stone")],
    bestseller: true,
  },
  {
    slug: "nebulizer",
    name: "Nebulizer",
    category: "accessories",
    price: 25,
    short: "Handheld nano mister to help cure adhesive and finish every set.",
    description: [
      "A handheld nano mister for the end of the appointment: a fine mist helps cure lash adhesive and leaves the eye area feeling fresh.",
    ],
    images: [img("site/202212-12", "Pink Neo Lash handheld nebulizer")],
    bestseller: true,
  },
  {
    slug: "neo-lash-cleansing-brush",
    name: "Neo Lash® Cleansing Brush",
    category: "accessories",
    price: 6.97,
    regularPrice: 8.97,
    short: "Soft, round-headed brush for lash shampoo and aftercare.",
    description: [
      "Aftercare is everything. Neo Lash® shampoo brushes have a round head, soft bristles and a metallic middle section for a strong, comfortable grip.",
      "Dispose of after one use, or sterilise properly and use for one person only.",
    ],
    images: [img("site/202212-11", "Three Neo Lash cleansing brushes with gold ferrules")],
    bestseller: true,
  },
  {
    slug: "adhesive-tape-roll",
    name: "Adhesive Tape Roll",
    category: "accessories",
    price: 4.27,
    regularPrice: 4.97,
    short: "Gentle isolation tape, kind to every skin type.",
    description: ["Adhesive tape for eyelash isolation, gentle on all skin types."],
    images: [img("site/202212-414bi71nlql", "Roll of gentle adhesive tape for lash isolation")],
  },
  {
    slug: "micro-brushes",
    name: "Micro Brushes",
    category: "accessories",
    price: 6.97,
    regularPrice: 7.97,
    detail: "Pack of 100",
    short: "Ultra-fine, lint-free swabs for precise product application.",
    description: [
      "Micro brush swabs sold in packs of 100. The ultra-fine, flexible tip allows precise, waste-free and lint-free application of product to eyelash extensions while keeping your station hygienic.",
    ],
    images: [img("site/202212-71ncw5lw9dl", "Pile of black micro brush swabs")],
  },
  {
    slug: "brush",
    name: "Silicone Brushes",
    category: "accessories",
    price: 7.97,
    regularPrice: 9.17,
    detail: "Pack of 50",
    short: "Smooth-gliding wands to comb, separate and finish lashes.",
    description: [
      "Smooth gliding silicone brushes are essential for any lash artist. They comb, separate and smooth lashes instead of fluffing and deep brushing.",
    ],
    images: [img("site/202212-brush-1", "Bundle of disposable silicone lash wands")],
  },
];

export function categoryList(products: Product[]): CategoryInfo[] {
  return (Object.keys(categoryLabels) as ProductCategory[]).map((id) => ({
    id,
    label: categoryLabels[id],
    count: products.filter((p) => p.category === id).length,
  }));
}
