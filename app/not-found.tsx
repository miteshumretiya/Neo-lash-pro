import type { Metadata } from "next";
import { LostLash } from "@/components/misc/LostLash";
import { Reveal } from "@/components/motion/Reveal";
import { TransitionLink } from "@/components/motion/Transition";
import { ArrowRight, ArrowUpRight } from "@/components/ui/Icons";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="flex min-h-[100svh] flex-col items-center justify-center px-gutter pb-section pt-[calc(var(--header-h)+3rem)] text-center">
      <LostLash />
      <Reveal immediate delay={0.2} className="mt-10 max-w-xl">
        <h1 className="font-display text-[clamp(2.2rem,5vw,4rem)] leading-[1]">
          <span className="sr-only">Error 404 — </span>
          This lash has <em className="italic-serif">fallen out</em>
        </h1>
        <p className="mx-auto mt-5 max-w-md text-lg text-muted">
          The page you&apos;re looking for isn&apos;t here — but your next favourite set might be.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <TransitionLink href="/" className="btn btn-solid">
            <span className="inline-flex items-center gap-2">
              Back home <ArrowRight size={15} />
            </span>
          </TransitionLink>
          <TransitionLink href="/shop" className="btn btn-ghost">
            <span>Shop the pro edit</span>
          </TransitionLink>
          <a href={site.booking} target="_blank" rel="noopener noreferrer" className="btn btn-ghost" data-cursor="Book">
            <span className="inline-flex items-center gap-2">
              Book on Fresha <ArrowUpRight size={14} />
            </span>
          </a>
        </div>
      </Reveal>
    </section>
  );
}
