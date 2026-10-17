import type { MetadataRoute } from "next";
import { productRepository } from "@/data/repository";
import { courses } from "@/data/courses";
import { posts } from "@/data/posts";
import { siteUrl } from "@/lib/site";

const pages = ["/", "/shop", "/courses", "/journal", "/about", "/contact", "/returns", "/privacy", "/terms"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = (path: string) => new URL(path, siteUrl).toString();
  const products = await productRepository.list();
  return [
    ...pages.map((path) => ({ url: url(path), changeFrequency: "monthly" as const, priority: path === "/" ? 1 : 0.7 })),
    ...products.map((p) => ({ url: url(`/shop/${p.slug}`), changeFrequency: "weekly" as const, priority: 0.8 })),
    ...courses.map((c) => ({ url: url(`/courses/${c.slug}`), changeFrequency: "monthly" as const, priority: 0.8 })),
    ...posts.map((p) => ({ url: url(`/journal/${p.slug}`), ...(p.date ? { lastModified: p.date } : {}), priority: 0.6 })),
  ];
}
