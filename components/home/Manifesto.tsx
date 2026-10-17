"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { useReducedMotion } from "@/lib/hooks";
import { ScrubWords } from "@/components/motion/ScrubWords";
import { Reveal } from "@/components/motion/Reveal";
import { DrawLash } from "@/components/motion/DrawLash";
import { TransitionLink } from "@/components/motion/Transition";
import { ArrowRight } from "@/components/ui/Icons";
import { photos } from "@/data/media";
import type { ImageRef } from "@/data/types";
import { cn } from "@/lib/cn";

const floating: { image: ImageRef; className: string; speed: number }[] = [
  { image: photos.workBrow, className: "left-[3%] top-[9%] w-[13vw] aspect-[4/3]", speed: -18 },
  { image: photos.lashTexture, className: "right-[5%] top-[4%] w-[9vw] aspect-[3/4]", speed: -32 },
  { image: photos.eyeNatural, className: "left-[9%] bottom-[16%] w-[10vw] aspect-[4/5]", speed: 22 },
  { image: photos.workDense, className: "right-[3%] bottom-[10%] w-[14vw] aspect-[4/3]", speed: 12 },
];

function Pill({ image }: { image: ImageRef }) {
  return (
    <span className="relative mx-[0.12em] inline-block h-[0.82em] w-[1.9em] translate-y-[0.08em] overflow-hidden rounded-full align-baseline">
      <Image src={image.src} alt="" fill sizes="10rem" className="object-cover" />
    </span>
  );
}

export function Manifesto() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      gsap.utils.toArray<HTMLElement>("[data-float]").forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: -Number(el.dataset.speed) },
          {
            yPercent: Number(el.dataset.speed),
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <section ref={root} id="manifesto" aria-labelledby="manifesto-title" className="relative overflow-hidden px-gutter py-section">
      {floating.map(({ image, className, speed }) => (
        <div
          key={image.src}
          data-float
          data-speed={speed}
          aria-hidden="true"
          className={cn("absolute hidden overflow-hidden rounded-card lg:block", className)}
        >
          <Image src={image.src} alt="" fill sizes="15vw" className="object-cover" />
        </div>
      ))}

      <div className="relative mx-auto max-w-[62rem] text-center">
        <Reveal>
          <p id="manifesto-title" className="eyebrow mb-10 text-muted">
            (01) — The studio
          </p>
        </Reveal>
        <ScrubWords className="text-balance text-[clamp(1.85rem,4.1vw,4.1rem)] font-light leading-[1.1] tracking-[-0.035em]">
          <em className="italic-serif">We are experts in the lash &amp; brow industry —</em> shaping lashes and brows
          <Pill image={photos.workNatural} /> to correct facial asymmetry and lift the whole look of the face. We never stop
          refining our craft <Pill image={photos.browBrush} /> with constant research and the latest technology.
        </ScrubWords>

        <DrawLash className="mx-auto mt-16 w-40 text-sage-ink md:w-52" />

        <Reveal stagger={0.12} className="mx-auto mt-14 grid max-w-3xl gap-8 text-left text-[0.98rem] leading-relaxed text-muted md:grid-cols-2">
          <p>
            Neo Lash® brings three crafts under one roof: signature lash and brow treatments, a professional product line used by
            artists, and certified courses that train the next generation.
          </p>
          <div>
            <p>
              Every set is mapped to your eye shape and natural lashes, so the result still looks like you — only more awake,
              lifted and defined.
            </p>
            <TransitionLink href="/about" className="group mt-5 inline-flex items-center gap-2 text-ink">
              <span className="link-u">Meet Daniela &amp; the studio</span>
              <ArrowRight size={15} className="transition-transform duration-500 ease-luxe group-hover:translate-x-1" />
            </TransitionLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
