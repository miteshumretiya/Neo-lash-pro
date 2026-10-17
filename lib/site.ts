import { photos } from "@/data/media";
import type { ImageRef } from "@/data/types";

// Client code only sees NEXT_PUBLIC_* variables; Vercel exposes the production
// domain to the browser as NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL.
const vercelDomain = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? (vercelDomain ? `https://${vercelDomain}` : "http://localhost:3000");

export const site = {
  name: "Neo Lash®",
  fullName: "Neo Lash® Pro",
  tagline: "Give your eyes the look they deserve.",
  description:
    "Lash & brow experts in St. Julian's, Malta. Signature lash and brow treatments, professional lash products and certified eyelash extension courses by Daniela.",
  founder: "Daniela Ionel",
  booking:
    "https://www.fresha.com/book-now/neo-lash-lash-brow-experts-a9dnhipn/all-offer?share=true&pId=2583497",
  whatsapp: {
    number: "35677772951",
    display: "+356 7777 2951",
  },
  instagram: {
    handle: "@neolashpro",
    url: "https://www.instagram.com/neolashpro/",
  },
  summitUrl: "https://lashbrowsummitmalta.com/",
  address: {
    street: "Triq Birkirkara, Shop 2",
    locality: "St. Julian's",
    postalCode: "STJ 1305",
    country: "Malta",
    countryCode: "MT",
  },
  mapUrl: "https://www.google.com/maps/search/?api=1&query=Neo+Lash+St+Julian%27s+Malta",
} as const;

export type NavItem = { label: string; href: string; caption: string; image: ImageRef };

export const primaryNav: NavItem[] = [
  { label: "Salon", href: "/#services", caption: "Lash & brow treatments", image: photos.workBrow },
  { label: "Shop", href: "/shop", caption: "Pro tools & lashes", image: photos.toolsGlove },
  { label: "Academy", href: "/courses", caption: "Certified courses", image: photos.applicationClient },
  { label: "Journal", href: "/journal", caption: "Aftercare & insights", image: photos.workWispy },
  { label: "About", href: "/about", caption: "Daniela & the studio", image: photos.salon },
  { label: "Contact", href: "/contact", caption: "Visit us in St. Julian's", image: photos.maltaWaterfront },
];

export const footerNav = {
  explore: [
    { label: "Shop", href: "/shop" },
    { label: "Academy", href: "/courses" },
    { label: "Journal", href: "/journal" },
    { label: "Wishlist", href: "/wishlist" },
  ],
  studio: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Book on Fresha", href: site.booking, external: true },
    { label: "Lash & Brow Summit", href: site.summitUrl, external: true },
  ],
  legal: [
    { label: "Returns", href: "/returns" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
} as const;

/** Human readable titles used by the page transition curtain. */
export const routeTitles: Record<string, string> = {
  "/": "Neo Lash®",
  "/shop": "The Shop",
  "/courses": "Academy",
  "/journal": "Journal",
  "/about": "The Studio",
  "/contact": "Contact",
  "/wishlist": "Wishlist",
  "/returns": "Returns",
  "/privacy": "Privacy",
  "/terms": "Terms",
};
