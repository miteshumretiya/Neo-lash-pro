import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { MediaReveal } from "@/components/motion/MediaReveal";
import { Reveal } from "@/components/motion/Reveal";
import { PostBody } from "@/components/journal/PostBody";
import { PostCard } from "@/components/journal/PostCard";
import { ArrowUpRight, WhatsApp } from "@/components/ui/Icons";
import { JsonLd } from "@/components/seo/JsonLd";
import { posts } from "@/data/posts";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";
import { whatsappUrl } from "@/lib/whatsapp";
import { formatDate } from "@/lib/format";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps<"/journal/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/journal/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      ...(post.date ? { publishedTime: post.date } : {}),
      images: [{ url: post.cover.src, alt: post.cover.alt }],
    },
  };
}

export default async function ArticlePage({ params }: PageProps<"/journal/[slug]">) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();
  const more = posts.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <>
      <article>
        <PageHero
          crumbs={[{ label: "Journal", href: "/journal" }, { label: post.category }]}
          eyebrow={[post.category, post.readingTime, post.date && formatDate(post.date)].filter(Boolean).join(" · ")}
          title={post.title}
          intro={post.excerpt}
          size="display"
        />

        <div className="px-gutter pb-[clamp(3rem,7vw,6rem)]">
          <MediaReveal parallax={8} className="aspect-[4/3] rounded-frame md:aspect-[2/1]">
            <Image src={post.cover.src} alt={post.cover.alt} fill priority sizes="100vw" className="object-cover" />
          </MediaReveal>
        </div>

        <div className="grid gap-12 px-gutter pb-section lg:grid-cols-12">
          <aside className="order-last lg:order-none lg:col-span-3">
            <div className="rounded-frame bg-surface p-6 lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
              <p className="eyebrow text-muted">From the studio</p>
              <p className="mt-2 font-display text-2xl">Neo Lash® Journal</p>
              <p className="mt-4 text-sm leading-relaxed text-muted">Questions about your lashes or aftercare? Ask us — we&apos;re happy to help.</p>
              <div className="mt-6 flex flex-col gap-2">
                <a
                  href={whatsappUrl(`Hi Neo Lash! I just read "${post.title}" and have a question.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm bg-whatsapp text-white hover:bg-[#17703c]"
                >
                  <span className="inline-flex items-center gap-2">
                    <WhatsApp size={15} /> Ask a question
                  </span>
                </a>
                <a href={site.booking} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm" data-cursor="Book">
                  <span className="inline-flex items-center gap-2">
                    Book a treatment <ArrowUpRight size={14} />
                  </span>
                </a>
              </div>
            </div>
          </aside>
          <div className="lg:col-span-7 lg:col-start-5">
            <PostBody blocks={post.body} />
          </div>
        </div>
      </article>

      {more.length > 0 && (
        <section aria-labelledby="more-title" className="px-gutter pb-section">
          <Reveal>
            <h2 id="more-title" className="eyebrow mb-10 border-t border-line pt-10 text-muted">
              Keep reading
            </h2>
          </Reveal>
          <div className="grid gap-x-[clamp(1rem,3vw,3rem)] gap-y-16 md:grid-cols-2">
            {more.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      )}

      <JsonLd data={articleJsonLd(post)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Journal", path: "/journal" },
          { name: post.title, path: `/journal/${post.slug}` },
        ])}
      />
    </>
  );
}
