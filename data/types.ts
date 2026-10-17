export type ImageRef = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  /** Dominant colour shown while the image loads. */
  color?: string;
};

export type ProductCategory = "tweezers" | "lashes" | "lash-care" | "accessories";

export type ProductOption = {
  name: string;
  values: string[];
};

export type Product = {
  slug: string;
  name: string;
  category: ProductCategory;
  /** Current price in EUR (the lowest price for ranges). */
  price: number;
  /** Upper bound when the price depends on the chosen option. */
  priceMax?: number;
  /** Original price when the product is on sale. */
  regularPrice?: number;
  short: string;
  description: string[];
  highlights?: string[];
  options?: ProductOption[];
  images: ImageRef[];
  bestseller?: boolean;
  /** Short spec line shown under the title, e.g. "100 pcs". */
  detail?: string;
};

export type CategoryInfo = {
  id: ProductCategory;
  label: string;
  count: number;
};

export type CourseModule = {
  title: string;
  topics: string[];
};

export type Course = {
  slug: string;
  name: string;
  level: string;
  duration: string;
  format: string;
  priceLabel: string;
  summary: string;
  intro: string[];
  audience: string;
  /** Course topics grouped into modules. */
  curriculum: CourseModule[];
  included: string[];
  image: ImageRef;
  gallery: ImageRef[];
};

export type Service = {
  name: string;
  category: "Lashes" | "Brows";
  description: string;
  image: ImageRef;
};

export type Review = {
  name: string;
  quote: string;
  context?: string;
};

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  /** ISO publish date, when known. */
  date?: string;
  readingTime: string;
  category: string;
  cover: ImageRef;
  body: PostBlock[];
};

export type PostBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ol"; items: string[] }
  | { type: "ul"; items: string[] }
  | { type: "quote"; text: string };
