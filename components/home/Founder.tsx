"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Counter } from "@/components/motion/Counter";
import { Reveal } from "@/components/motion/Reveal";
import { TransitionLink } from "@/components/motion/Transition";
import { ArrowRight } from "@/components/ui/Icons";
import { photos } from "@/data/media";

const story = [
  "Daniela is the founder and CEO of Neo Lash®. She began her journey in the lash and brow industry in 2015 and today runs her own studio in St. Julian's, Malta.",
  "An international lash championship judge, speaker and trainer, she shares her technique with students from Malta and abroad through the Neo Lash® Academy.",
  "She also founded the Lash & Brow Summit — the international event that brings the industry together in Malta.",
];

/** Pinned founder story: portrait parallax on one side, story brightening on the other. */
export function Founder() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 64rem) and (prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({
            scrollTrigger: { trigger: root.current, start: "top top", end: "+=130%", pin: true, scrub: 0.8 },
          })
          .fromTo("[data-portrait]", { scale: 1.22, yPercent: -5 }, { scale: 1, yPercent: 5, ease: "none" }, 0)
          .fromTo("[data-story]", { opacity: 0.14 }, { opacity: 1, stagger: 0.32, ease: "none" }, 0.05)
          .fromTo("[data-signature]", { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none" }, 0.6);
      });
      mm.add("(max-width: 63.99rem), (prefers-reduced-motion: reduce)", () => {
        gsap.from("[data-story]", {
          autoAlpha: 0,
          y: 24,
          stagger: 0.12,
          duration: 1,
          ease: "luxe",
          scrollTrigger: { trigger: "[data-story-list]", start: "top 85%", once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="founder-title" className="relative flex min-h-[100svh] items-center px-gutter py-section lg:py-0">
      <div className="grid w-full items-center gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="relative mx-auto w-full max-w-[26rem] lg:col-span-5 lg:max-w-none">
          <div className="arch relative aspect-[4/5] lg:h-[78svh] lg:aspect-auto">
            <div data-portrait className="absolute inset-0 will-change-transform">
              <Image src={photos.daniela.src} alt={photos.daniela.alt} fill sizes="(max-width: 1024px) 26rem, 40vw" className="object-cover object-[50%_20%]" />
            </div>
          </div>
          <div className="absolute -bottom-6 left-1/2 w-[80%] -translate-x-1/2 rounded-card bg-night px-5 py-4 text-cream shadow-[0_24px_60px_-28px_rgb(20_20_20/0.6)] lg:-right-6 lg:bottom-10 lg:left-auto lg:w-60 lg:translate-x-0">
            <p className="eyebrow text-cream/70">Founder & CEO</p>
            <p className="mt-1 font-display text-2xl">Daniela Ionel</p>
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <p className="eyebrow mb-6 text-muted">(04) — The founder</p>
          <SplitReveal as="h2" id="founder-title" className="text-display font-light tracking-[-0.04em]">
            Meet <em className="italic-serif">Daniela</em>
          </SplitReveal>

          <div data-story-list className="mt-10 space-y-6 text-[clamp(1.1rem,1.5vw,1.4rem)] leading-[1.45] tracking-[-0.01em]">
            {story.map((paragraph) => (
              <p key={paragraph.slice(0, 20)} data-story>
                {paragraph}
              </p>
            ))}
          </div>

          <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-line pt-8 sm:grid-cols-4">
            {[
              { label: "In the industry since", value: <Counter value={2015} duration={2.6} /> },
              { label: "Years of experience", value: <Counter value={10} suffix="+" /> },
              { label: "Students trained", value: <Counter value={100} suffix="+" /> },
              { label: "International lash championships", value: <span className="italic">Judge</span> },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse gap-2">
                <dt className="text-sm leading-snug text-muted">{stat.label}</dt>
                <dd className="font-display text-[clamp(2.4rem,3.6vw,3.4rem)] leading-none">{stat.value}</dd>
              </div>
            ))}
          </dl>

          <Reveal className="mt-10 flex flex-wrap items-center gap-6">
            <span data-signature className="font-display text-4xl italic text-sage-ink">
              Daniela
            </span>
            <TransitionLink href="/about" className="group inline-flex items-center gap-2 text-sm">
              <span className="link-u">Her story & the studio</span>
              <ArrowRight size={15} className="transition-transform duration-500 ease-luxe group-hover:translate-x-1" />
            </TransitionLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
