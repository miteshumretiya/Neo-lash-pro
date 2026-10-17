import type { Metadata, Viewport } from "next";
import { serif, sans } from "./fonts";
import "./globals.css";
import { Experience } from "@/components/providers/Experience";
import { JsonLd } from "@/components/seo/JsonLd";
import { localBusinessJsonLd } from "@/lib/seo";
import { site, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Neo Lash® Pro — Lash & Brow Experts in Malta",
    template: "%s · Neo Lash® Pro",
  },
  description: site.description,
  applicationName: site.fullName,
  keywords: [
    "lash extensions Malta",
    "eyelash extensions St Julian's",
    "brow lamination Malta",
    "lash lift Malta",
    "eyelash extension course Malta",
    "lash supplies",
    "Neo Lash",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.fullName,
    locale: "en_MT",
    url: "/",
    title: "Neo Lash® Pro — Lash & Brow Experts in Malta",
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Neo Lash® Pro — Lash & Brow Experts in Malta",
    description: site.description,
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f1eb" },
    { media: "(prefers-color-scheme: dark)", color: "#111311" },
  ],
  colorScheme: "light dark",
};

// Runs before first paint: theme, intro-skip (the intro only plays when a visit
// starts on the home page) and reduced-motion flags.
const boot = `(function(){var d=document.documentElement;d.classList.remove("no-js");try{var t=localStorage.getItem("neolash:theme");if(t==="dark"||t==="light")d.dataset.theme=t}catch(e){}var s=location.pathname!=="/";try{s=s||!!sessionStorage.getItem("neolash:intro")}catch(e){}if(s)d.dataset.intro="skip";if(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches)d.classList.add("reduced-motion")})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`no-js ${serif.variable} ${sans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Experience>{children}</Experience>
        <JsonLd data={localBusinessJsonLd()} />
      </body>
    </html>
  );
}
