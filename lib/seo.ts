import type { Course, Post, Product, Review } from "@/data/types";
import { site, siteUrl } from "./site";

const abs = (path: string) => new URL(path, siteUrl).toString();

export function localBusinessJsonLd(reviews: Review[] = []) {
  return {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    "@id": abs("/#salon"),
    name: site.fullName,
    description: site.description,
    url: siteUrl,
    image: abs("/media/site/202211-02.jpg"),
    logo: abs("/icon.svg"),
    telephone: "+35677772951",
    priceRange: "€€",
    founder: { "@type": "Person", name: site.founder },
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      postalCode: site.address.postalCode,
      addressCountry: site.address.countryCode,
    },
    sameAs: [site.instagram.url],
    potentialAction: {
      "@type": "ReserveAction",
      target: { "@type": "EntryPoint", urlTemplate: site.booking },
      name: "Book an appointment",
    },
    ...(reviews.length
      ? {
          review: reviews.map((r) => ({
            "@type": "Review",
            author: { "@type": "Person", name: r.name },
            reviewBody: r.quote,
          })),
        }
      : {}),
  };
}

export function productJsonLd(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description.join(" "),
    image: product.images.map((i) => abs(i.src)),
    brand: { "@type": "Brand", name: "Neo Lash®" },
    sku: product.slug,
    offers: {
      "@type": product.priceMax ? "AggregateOffer" : "Offer",
      priceCurrency: "EUR",
      ...(product.priceMax
        ? { lowPrice: product.price.toFixed(2), highPrice: product.priceMax.toFixed(2) }
        : { price: product.price.toFixed(2) }),
      availability: "https://schema.org/InStock",
      url: abs(`/shop/${product.slug}`),
      seller: { "@type": "Organization", name: site.fullName },
    },
  };
}

export function courseJsonLd(course: Course) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: `${course.name} — Neo Lash® Academy`,
    description: course.summary,
    url: abs(`/courses/${course.slug}`),
    educationalLevel: course.level,
    provider: { "@type": "Organization", name: "Neo Lash® Academy", sameAs: siteUrl },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "onsite",
      location: {
        "@type": "Place",
        name: site.fullName,
        address: `${site.address.street}, ${site.address.locality} ${site.address.postalCode}, ${site.address.country}`,
      },
    },
  };
}

export function articleJsonLd(post: Post) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: abs(post.cover.src),
    ...(post.date ? { datePublished: post.date } : {}),
    author: { "@type": "Organization", name: site.fullName, url: siteUrl },
    publisher: { "@type": "Organization", name: site.fullName, logo: { "@type": "ImageObject", url: abs("/icon.svg") } },
    mainEntityOfPage: abs(`/journal/${post.slug}`),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: abs(item.path),
    })),
  };
}
