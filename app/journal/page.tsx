import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { CtaBand } from "@/components/ui/CtaBand";
import { Reveal } from "@/components/motion/Reveal";
import { PostCard } from "@/components/journal/PostCard";
import { Instagram, ArrowUpRight } from "@/components/ui/Icons";
import { JsonLd } from "@/components/seo/JsonLd";
import { posts } from "@/data/posts";
import { breadcrumbJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Journal — Lash Aftercare & Insights",
  description: "Aftercare advice and lash insights from the Neo Lash® studio in Malta: before and after your appointment, retention and why extensions shed.",
  alternates: { canonical: "/journal" },
};

export default function JournalPage() {
  const [featured, ...rest] = posts;

  return (
    <>
      <PageHero
        eyebrow="(Journal) — Notes from the studio"
        title={
          <>
            Aftercare &amp; <em className="italic-serif">insights</em>
          </>
        }
        intro="Simple habits that keep your lashes beautiful for longer — straight from our lash artists."
      />

      <section aria-label="Articles" className="px-gutter pb-section">
        <Reveal className="border-t border-line pt-10">
          <PostCard post={featured} featured />
        </Reveal>
        <Reveal stagger={0.1} className="mt-[clamp(4rem,8vw,7rem)] grid gap-x-[clamp(1rem,3vw,3rem)] gap-y-16 border-t border-line pt-10 md:grid-cols-2">
          {rest.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </Reveal>
      </section>

      <CtaBand
        tone="night"
        eyebrow={site.instagram.handle}
        title={
          <>
            Daily lashes on <em className="italic-serif">Instagram</em>
          </>
        }
        text="Fresh sets, behind the scenes at the studio and Academy moments."
      >
        <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" className="btn btn-light" data-cursor="Follow">
          <span className="inline-flex items-center gap-2">
            <Instagram size={16} /> Follow {site.instagram.handle} <ArrowUpRight size={14} />
          </span>
        </a>
      </CtaBand>

      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Journal", path: "/journal" },
        ])}
      />
    </>
  );
}
