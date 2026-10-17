import { cacheLife } from "next/cache";
import { catalog, categoryList } from "./products";
import type { CategoryInfo, Product, ProductCategory } from "./types";

/**
 * The UI only talks to this interface. The default implementation serves the
 * local catalogue; set WOOCOMMERCE_STORE_URL to read the live WooCommerce
 * Store API instead (headless, no auth needed for public product data).
 */
export interface ProductRepository {
  list(filter?: { category?: ProductCategory }): Promise<Product[]>;
  get(slug: string): Promise<Product | null>;
  bestsellers(limit?: number): Promise<Product[]>;
  related(slug: string, limit?: number): Promise<Product[]>;
  categories(): Promise<CategoryInfo[]>;
}

function createRepository(load: () => Promise<Product[]>): ProductRepository {
  return {
    async list(filter) {
      const all = await load();
      return filter?.category ? all.filter((p) => p.category === filter.category) : all;
    },
    async get(slug) {
      return (await load()).find((p) => p.slug === slug) ?? null;
    },
    async bestsellers(limit = 8) {
      return (await load()).filter((p) => p.bestseller).slice(0, limit);
    },
    async related(slug, limit = 4) {
      const all = await load();
      const current = all.find((p) => p.slug === slug);
      const same = all.filter((p) => p.slug !== slug && p.category === current?.category);
      const rest = all.filter((p) => p.slug !== slug && p.category !== current?.category);
      return [...same, ...rest].slice(0, limit);
    },
    async categories() {
      return categoryList(await load());
    },
  };
}

// --------------------------------------------------------- WooCommerce Store API

type StoreProduct = {
  slug: string;
  name: string;
  short_description: string;
  description: string;
  on_sale: boolean;
  prices: {
    price: string;
    regular_price: string;
    currency_minor_unit: number;
    price_range: { min_amount: string; max_amount: string } | null;
  };
  categories: { slug: string; name: string }[];
  attributes: { name: string; terms: { name: string }[] }[];
  images: { src: string; alt: string }[];
};

const stripHtml = (html: string) =>
  html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

function toCategory(slugs: string[]): ProductCategory {
  if (slugs.some((s) => s.includes("tweezer"))) return "tweezers";
  if (slugs.some((s) => s.includes("lash") && !s.includes("shampoo"))) return "lashes";
  if (slugs.some((s) => s.includes("shampoo") || s.includes("care"))) return "lash-care";
  return "accessories";
}

async function fetchStoreProducts(baseUrl: string): Promise<Product[]> {
  "use cache";
  cacheLife("hours");
  const res = await fetch(`${baseUrl.replace(/\/$/, "")}/wp-json/wc/store/v1/products?per_page=100`);
  if (!res.ok) throw new Error(`WooCommerce Store API responded ${res.status}`);
  const data = (await res.json()) as StoreProduct[];
  return data.map((p) => {
    const unit = 10 ** p.prices.currency_minor_unit;
    const price = Number(p.prices.price) / unit;
    const regular = Number(p.prices.regular_price) / unit;
    const range = p.prices.price_range;
    const local = catalog.find((c) => c.slug === p.slug);
    return {
      slug: p.slug,
      name: p.name,
      category: toCategory(p.categories.map((c) => c.slug)),
      price: range ? Number(range.min_amount) / unit : price,
      priceMax: range ? Number(range.max_amount) / unit : undefined,
      regularPrice: p.on_sale && regular > price ? regular : undefined,
      short: stripHtml(p.short_description).slice(0, 140),
      description: stripHtml(p.description).split(/(?<=\.)\s+(?=[A-Z])/).filter(Boolean),
      options: p.attributes.map((a) => ({ name: a.name, values: a.terms.map((t) => t.name) })),
      images: p.images.map((i) => ({ src: i.src, alt: i.alt || p.name })),
      bestseller: local?.bestseller,
    } satisfies Product;
  });
}

const storeUrl = process.env.WOOCOMMERCE_STORE_URL;

export const productRepository: ProductRepository = storeUrl
  ? createRepository(() => fetchStoreProducts(storeUrl))
  : createRepository(async () => catalog);
