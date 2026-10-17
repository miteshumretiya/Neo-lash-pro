"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { useFinePointer } from "@/lib/hooks";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal } from "@/components/motion/Reveal";
import { Tilt } from "@/components/motion/Tilt";
import { TransitionLink } from "@/components/motion/Transition";
import { ArrowUpRight } from "@/components/ui/Icons";
import { photos } from "@/data/media";
import type { ImageRef } from "@/data/types";
import { site } from "@/lib/site";
import { cn } from "@/lib/cn";

type Pillar = {
  index: string;
  title: string;
  text: string;
  href: string;
  external?: boolean;
  cta: string;
  image: ImageRef;
  reveal: ImageRef;
  className: string;
};

const pillars: Pillar[] = [
  {
    index: "01",
    title: "The Salon",
    text: "Signature lash and brow treatments in a calm, light-filled studio in St. Julian's.",
    href: site.booking,
    external: true,
    cta: "Book a treatment",
    image: photos.salon,
    reveal: photos.workBrow,
    className: "md:col-span-7 md:row-span-2 aspect-[4/5] md:aspect-auto md:min-h-[44rem]",
  },
  {
    index: "02",
    title: "Pro Products",
    text: "Tweezers, lashes and aftercare used by artists — ordered on WhatsApp, delivered worldwide.",
    href: "/shop",
    cta: "Shop the range",
    image: photos.toolsGlove,
    reveal: photos.tweezersHand,
    className: "md:col-span-5 aspect-[4/3] md:aspect-auto md:min-h-[21rem]",
  },
  {
    index: "03",
    title: "The Academy",
    text: "Certified eyelash extension courses, from your first set to masterclass.",
    href: "/courses",
    cta: "Explore courses",
    image: photos.applicationClient,
    reveal: photos.applicationClose,
    className: "md:col-span-5 aspect-[4/3] md:aspect-auto md:min-h-[21rem]",
  },
];

/** Image card whose second image is revealed through a circle at the cursor. */
function PillarCard({ pillar }: { pillar: Pillar }) {
  const ref = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();

  useGSAP(
    (_, contextSafe) => {
      const el = ref.current;
      const layer = el?.querySelector<HTMLElement>("[data-reveal-layer]");
      if (!el || !layer || !fine || !contextSafe) return;
      const state = { r: 0 };
      const apply = () => {
        layer.style.clipPath = `circle(${state.r}% at var(--x, 50%) var(--y, 50%))`;
      };
      apply();
      const move = contextSafe((e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--x", `${((e.clientX - r.left) / r.width) * 100}%`);
        el.style.setProperty("--y", `${((e.clientY - r.top) / r.height) * 100}%`);
      });
      const enter = contextSafe(() => gsap.to(state, { r: 75, duration: 1.1, ease: "luxe", onUpdate: apply }));
      const leave = contextSafe(() => gsap.to(state, { r: 0, duration: 0.8, ease: "silk", onUpdate: apply }));
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerenter", enter);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerenter", enter);
        el.removeEventListener("pointerleave", leave);
      };
    },
    { scope: ref, dependencies: [fine] },
  );

  const content = (
    <>
      <Image src={pillar.image.src} alt={pillar.image.alt} fill sizes="(max-width: 768px) 100vw, 55vw" className="object-cover transition-transform duration-[1.4s] ease-luxe group-hover:scale-105" />
      <div data-reveal-layer className="absolute inset-0" style={{ clipPath: "circle(0% at 50% 50%)" }} aria-hidden="true">
        <Image src={pillar.reveal.src} alt="" fill sizes="(max-width: 768px) 100vw, 55vw" className="object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-night/75 via-night/10 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-between p-[clamp(1.1rem,2.2vw,2rem)] text-cream">
        <span className="eyebrow text-cream/80">({pillar.index})</span>
        <div className="flex items-end justify-between gap-6">
          <div>
            <h3 className="font-display text-title">{pillar.title}</h3>
            <p className="mt-2 max-w-sm text-[0.95rem] leading-relaxed text-cream/80">{pillar.text}</p>
          </div>
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-cream text-night transition-transform duration-700 ease-luxe group-hover:rotate-45">
            <ArrowUpRight size={18} />
          </span>
        </div>
      </div>
    </>
  );

  return (
    <Tilt className={cn("[transform-style:preserve-3d]", pillar.className)} max={4}>
      <div ref={ref} className="group relative h-full w-full overflow-hidden rounded-frame" data-cursor={pillar.cta.split(" ")[0]}>
        {pillar.external ? (
          <a href={pillar.href} target="_blank" rel="noopener noreferrer" aria-label={`${pillar.title} — ${pillar.cta}`} className="absolute inset-0">
            {content}
          </a>
        ) : (
          <TransitionLink href={pillar.href} aria-label={`${pillar.title} — ${pillar.cta}`} className="absolute inset-0">
            {content}
          </TransitionLink>
        )}
      </div>
    </Tilt>
  );
}

export function Pillars() {
  return (
    <section aria-labelledby="pillars-title" className="px-gutter pb-section">
      <div className="mb-12 grid gap-6 md:mb-16 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <p className="eyebrow mb-6 text-muted">(02) — What we do</p>
          <SplitReveal as="h2" id="pillars-title" className="text-display font-light tracking-[-0.04em]">
            One studio, <em className="italic-serif">three</em> crafts
          </SplitReveal>
        </div>
        <Reveal className="text-muted md:col-span-4 md:col-start-9">
          <p>
            Whether you come for your lashes, your toolkit or your career, everything we do starts from the same standard: precise,
            gentle and made to last.
          </p>
        </Reveal>
      </div>

      <div className="grid gap-[clamp(0.75rem,1.4vw,1.25rem)] md:grid-cols-12 md:grid-rows-2">
        {pillars.map((pillar) => (
          <PillarCard key={pillar.index} pillar={pillar} />
        ))}
      </div>
    </section>
  );
}
