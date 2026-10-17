"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/motion/gsap";
import { useExperience } from "@/lib/store/experience";
import { useReducedMotion } from "@/lib/hooks";
import type { GlState } from "@/lib/gl/registry";
import { GlParticles, GlSilk } from "@/components/gl/GlLayers";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Magnetic } from "@/components/motion/Magnetic";
import { TextRoll } from "@/components/motion/TextRoll";
import { TransitionLink } from "@/components/motion/Transition";
import { ArrowRight, ArrowUpRight } from "@/components/ui/Icons";
import { photos } from "@/data/media";
import { site } from "@/lib/site";

export function Hero() {
  const section = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const silk = useRef<GlState | null>(null);
  const particles = useRef<GlState | null>(null);
  const loaded = useExperience((s) => s.loaded);
  const reduced = useReducedMotion();

  // Intro, once the preloader (or curtain) is out of the way.
  useGSAP(
    () => {
      if (!loaded || reduced) return;
      const tl = gsap.timeline({ defaults: { ease: "luxe" } });
      tl.fromTo(
        frame.current,
        { clipPath: "inset(6% 4% 6% 4% round 2rem)" },
        { clipPath: "inset(0% 0% 0% 0% round 0rem)", duration: 1.6, ease: "silk", clearProps: "clipPath" },
      )
        .fromTo("[data-hero-arch]", { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "silk" }, 0.25)
        .fromTo("[data-hero-arch] img", { scale: 1.3 }, { scale: 1, duration: 2.2 }, 0.25)
        .from("[data-hero-fade]", { autoAlpha: 0, y: 24, duration: 1.1, stagger: 0.08 }, 0.7)
        .from("[data-hero-card]", { autoAlpha: 0, y: 30, scale: 0.96, duration: 1.2 }, 1.1);
    },
    { scope: section, dependencies: [loaded, reduced] },
  );

  // Scroll-out: silk morphs into the next section's colour, layers part ways.
  useGSAP(
    () => {
      if (reduced) return;
      const st = ScrollTrigger.create({
        trigger: section.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          if (silk.current) silk.current.progress = self.progress;
        },
      });
      gsap.to("[data-hero-arch]", {
        yPercent: -14,
        ease: "none",
        scrollTrigger: { trigger: section.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to("[data-hero-title]", {
        yPercent: -35,
        ease: "none",
        scrollTrigger: { trigger: section.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(frame.current, {
        scale: 0.94,
        ease: "none",
        scrollTrigger: { trigger: section.current, start: "top top", end: "bottom top", scrub: true },
      });
      return () => st.kill();
    },
    { scope: section, dependencies: [reduced] },
  );

  return (
    <section ref={section} aria-label="Introduction" className="relative h-[100svh] min-h-[40rem] px-gutter pb-[var(--gutter)] pt-[var(--gutter)]">
      <div ref={frame} className="relative h-full overflow-hidden rounded-frame will-change-transform">
        <GlSilk stateRef={silk} className="rounded-frame" />

        <GlParticles
          stateRef={particles}
          revealed={loaded}
          className="aspect-[2/1] max-md:hidden md:left-[29%] md:top-[19%] md:w-[38%]"
        />

        <span aria-hidden="true" className="absolute bottom-0 left-1/2 z-10 hidden h-14 w-px overflow-hidden bg-ink/15 xl:block">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scroll-cue_2.2s_var(--ease-silk)_infinite] bg-ink" />
        </span>

        <div className="relative z-10 flex h-full flex-col justify-between px-[clamp(1.25rem,3vw,3rem)] pb-[clamp(1.25rem,3vw,2.75rem)] pt-[calc(var(--header-h)+0.75rem)]">
          <div className="max-md:hidden">
            <p data-hero-fade className="eyebrow mb-4 text-ink/70">
              Lash &amp; brow experts · Since 2015
            </p>
            <p data-hero-fade className="max-w-[19rem] text-[0.95rem] leading-relaxed text-ink/80">
              Signature lash &amp; brow treatments, professional products and certified training — by Daniela and the Neo Lash® team in
              St. Julian&apos;s, Malta.
            </p>
          </div>

          <div
            data-hero-arch
            className="arch absolute right-[clamp(1.25rem,3vw,3rem)] top-[calc(var(--header-h)+0.5rem)] h-[40%] w-[min(60vw,20rem)] max-md:left-1/2 max-md:-translate-x-1/2 md:top-[11%] md:h-[70%] md:w-[min(25vw,24rem)]"
          >
            <Image
              src={photos.heroLashes.src}
              alt={photos.heroLashes.alt}
              fill
              priority
              sizes="(max-width: 768px) 60vw, 25vw"
              className="object-cover object-[50%_40%]"
              style={{ backgroundColor: photos.heroLashes.color }}
            />
          </div>

          <div className="relative mt-auto">
            <div data-hero-title className="will-change-transform">
              <SplitReveal
                as="h1"
                type="chars"
                immediate
                delay={0.45}
                stagger={0.022}
                duration={1.3}
                className="text-[clamp(3.1rem,9.4vw,11.5rem)] font-light leading-[0.9] tracking-[-0.055em] text-ink max-md:text-[clamp(2.9rem,13.5vw,4.6rem)]"
              >
                Give your eyes
                <br />
                <em className="italic-serif pr-[0.06em] font-normal tracking-[-0.03em]">the look</em> they deserve
              </SplitReveal>
            </div>

            <div className="mt-[clamp(1.25rem,3vw,2.5rem)] flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div className="flex flex-wrap items-center gap-2.5" data-hero-fade>
                <Magnetic>
                  <a href={site.booking} target="_blank" rel="noopener noreferrer" className="btn btn-solid roll-host" data-cursor="Book">
                    <span data-magnetic-label className="inline-flex items-center gap-2.5">
                      <span className="size-1.5 animate-pulse-dot rounded-full bg-sage" aria-hidden="true" />
                      <TextRoll text="Book now" />
                    </span>
                  </a>
                </Magnetic>
                <Magnetic strength={0.25}>
                  <TransitionLink href="/shop" className="btn btn-ghost roll-host">
                    <span data-magnetic-label className="inline-flex items-center gap-2">
                      <TextRoll text="Shop products" /> <ArrowRight size={15} />
                    </span>
                  </TransitionLink>
                </Magnetic>
                <Magnetic strength={0.25}>
                  <TransitionLink href="/courses" className="btn btn-ghost roll-host">
                    <span data-magnetic-label className="inline-flex items-center gap-2">
                      <TextRoll text="Explore courses" /> <ArrowRight size={15} />
                    </span>
                  </TransitionLink>
                </Magnetic>
              </div>

              <TransitionLink
                href="/#services"
                data-hero-card
                data-cursor="Explore"
                className="glass group hidden items-center gap-4 rounded-[1.25rem] p-2 pr-4 lg:flex"
              >
                <span className="relative size-16 shrink-0 overflow-hidden rounded-[0.9rem]">
                  <Image src={photos.workVolume.src} alt="" fill sizes="4rem" className="object-cover" />
                </span>
                <span>
                  <span className="eyebrow block text-ink/60">Signature</span>
                  <span className="mt-0.5 block font-display text-[1.4rem] leading-tight">Russian Volume</span>
                  <span className="block text-[0.8rem] text-ink/65">Handmade fans, featherlight</span>
                </span>
                <span className="ml-2 grid size-10 shrink-0 place-items-center rounded-full bg-ink text-canvas transition-transform duration-500 ease-luxe group-hover:rotate-45">
                  <ArrowUpRight size={16} />
                </span>
              </TransitionLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
