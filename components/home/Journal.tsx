import Image from "next/image";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal } from "@/components/motion/Reveal";
import { TransitionLink } from "@/components/motion/Transition";
import { ArrowRight, ArrowUpRight, Instagram } from "@/components/ui/Icons";
import { posts } from "@/data/posts";
import { photos } from "@/data/media";
import { site } from "@/lib/site";
import { cn } from "@/lib/cn";

const grid = [photos.workLift, photos.workWispy, photos.workInstagram, photos.workSoft, photos.workNatural, photos.workDense];

// Resting and fanned-out transforms for the three stacked journal cards.
const fan = [
  "rotate-[-4deg] group-hover/stack:-translate-x-[58%] group-hover/stack:rotate-[-10deg]",
  "rotate-[1deg] z-10 group-hover/stack:-translate-y-3 group-hover/stack:rotate-0",
  "rotate-[5deg] group-hover/stack:translate-x-[58%] group-hover/stack:rotate-[10deg]",
];

export function Journal() {
  return (
    <section aria-labelledby="journal-title" className="px-gutter py-section">
      <div className="grid gap-[clamp(3rem,6vw,6rem)] lg:grid-cols-2">
        <div>
          <p className="eyebrow mb-6 text-muted">(10) — Journal</p>
          <SplitReveal as="h2" id="journal-title" className="text-display font-light tracking-[-0.04em]">
            Aftercare &amp; <em className="italic-serif">insights</em>
          </SplitReveal>

          {/* Desktop: stacked cards that fan out on hover. */}
          <div className="group/stack relative mx-auto mt-16 hidden h-[26rem] max-w-[22rem] lg:block">
            {posts.map((post, i) => (
              <TransitionLink
                key={post.slug}
                href={`/journal/${post.slug}`}
                transitionTitle="Journal"
                data-cursor="Read"
                className={cn(
                  "absolute inset-0 flex flex-col overflow-hidden rounded-frame bg-surface shadow-[0_30px_60px_-30px_rgb(20_20_20/0.35)] transition-transform duration-[0.9s] ease-luxe",
                  fan[i],
                )}
              >
                <div className="relative h-[58%]">
                  <Image src={post.cover.src} alt={post.cover.alt} fill sizes="22rem" className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col justify-between p-5">
                  <span className="eyebrow text-muted">
                    {post.category} · {post.readingTime}
                  </span>
                  <span className="font-display text-[1.6rem] leading-tight">{post.title}</span>
                </div>
              </TransitionLink>
            ))}
          </div>

          {/* Touch / small screens: a simple list. */}
          <ul className="mt-10 divide-y divide-line border-y border-line lg:hidden">
            {posts.map((post) => (
              <li key={post.slug}>
                <TransitionLink href={`/journal/${post.slug}`} className="flex items-center gap-4 py-4">
                  <span className="relative size-20 shrink-0 overflow-hidden rounded-card">
                    <Image src={post.cover.src} alt="" fill sizes="5rem" className="object-cover" />
                  </span>
                  <span>
                    <span className="eyebrow block text-muted">{post.category}</span>
                    <span className="mt-1 block font-display text-xl leading-tight">{post.title}</span>
                  </span>
                </TransitionLink>
              </li>
            ))}
          </ul>

          <TransitionLink href="/journal" className="group mt-12 inline-flex items-center gap-2 text-sm">
            <span className="link-u">Read the journal</span>
            <ArrowRight size={15} className="transition-transform duration-500 ease-luxe group-hover:translate-x-1" />
          </TransitionLink>
        </div>

        <div>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow mb-3 text-muted">Follow the studio</p>
              <p className="font-display text-title">{site.instagram.handle}</p>
            </div>
            <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
              <span className="inline-flex items-center gap-2">
                <Instagram size={15} /> Instagram <ArrowUpRight size={14} />
              </span>
            </a>
          </div>
          <Reveal stagger={0.08} className="relative mt-8 grid grid-cols-3 gap-[clamp(0.5rem,1vw,0.9rem)]">
            {grid.map((image, i) => (
              <a
                key={image.src}
                href={site.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="View"
                aria-label={`${image.alt} — view on Instagram`}
                className={cn(
                  "group relative aspect-[4/5] overflow-hidden rounded-card",
                  i % 2 === 1 && "translate-y-6",
                )}
              >
                <Image src={image.src} alt="" fill sizes="(max-width: 1024px) 33vw, 16vw" className="object-cover transition-transform duration-[1.2s] ease-luxe group-hover:scale-110" />
              </a>
            ))}
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -bottom-6 h-1/2 bg-gradient-to-t from-canvas to-transparent" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
