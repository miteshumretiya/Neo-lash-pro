"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { useReducedMotion } from "@/lib/hooks";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal } from "@/components/motion/Reveal";
import { Marquee } from "@/components/motion/Marquee";
import { Magnetic } from "@/components/motion/Magnetic";
import { ArrowUpRight } from "@/components/ui/Icons";
import { photos } from "@/data/media";
import { site } from "@/lib/site";

const words = ["International event", "Artists", "Educators", "Brands", "Every year in Malta"];

/**
 * Cinematic full-bleed block: the frame expands from a rounded card to the
 * full viewport while the photo drifts (Ken Burns) under a dark grade.
 */
export function Summit() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      gsap.fromTo(
        "[data-summit-frame]",
        { clipPath: "inset(6% 4% 6% 4% round 2rem)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 0rem)",
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "top top", scrub: true },
        },
      );
      gsap.fromTo(
        "[data-summit-media]",
        { scale: 1.3, yPercent: -6 },
        {
          scale: 1.05,
          yPercent: 6,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section ref={root} aria-labelledby="summit-title" className="relative mt-section">
      <div data-summit-frame className="relative min-h-[110svh] overflow-hidden bg-night text-cream">
        <div data-summit-media className="absolute inset-0 will-change-transform">
          <div className="absolute inset-0 animate-[hero-drift_24s_ease-in-out_infinite]">
            <Image src={photos.summitStage.src} alt={photos.summitStage.alt} fill sizes="100vw" className="object-cover opacity-55" />
          </div>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_38%,rgb(20_20_20/0.55)_0%,rgb(20_20_20/0.35)_55%,#141414_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-night to-transparent" />

        <div className="relative flex min-h-[110svh] flex-col justify-between px-gutter pb-10 pt-[calc(var(--section)*0.9)]">
          <div className="mx-auto max-w-5xl text-center">
            <Reveal>
              <p className="eyebrow mb-8 text-cream/70">(05) — An international event in Malta</p>
            </Reveal>
            <SplitReveal as="h2" id="summit-title" type="chars" className="text-mega font-light tracking-[-0.05em]">
              Lash &amp; Brow <em className="italic-serif text-blush">Summit</em>
            </SplitReveal>
            <Reveal delay={0.2} className="mx-auto mt-8 max-w-xl text-[1.05rem] leading-relaxed text-cream/75">
              <p>
                Founded by Daniela, the Lash &amp; Brow Summit is the international event that brings lash and brow artists,
                educators and brands together in Malta every year.
              </p>
            </Reveal>
            <Reveal delay={0.35} className="mt-10 flex justify-center">
              <Magnetic>
                <a href={site.summitUrl} target="_blank" rel="noopener noreferrer" className="btn btn-light" data-cursor="Visit">
                  <span data-magnetic-label className="inline-flex items-center gap-2">
                    Discover the Summit <ArrowUpRight size={16} />
                  </span>
                </a>
              </Magnetic>
            </Reveal>
          </div>

          <Marquee speed={45} className="mt-16 border-y border-white/15 py-5" velocityFactor={1.2}>
            {words.map((word) => (
              <span key={word} className="flex items-center gap-8 pr-8 font-display text-[clamp(1.6rem,3vw,2.8rem)] italic text-cream/85">
                {word}
                <span className="size-2 rounded-full bg-sage" aria-hidden="true" />
              </span>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
