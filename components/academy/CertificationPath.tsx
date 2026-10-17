"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { certificationSteps } from "@/data/courses";
import { pad } from "@/lib/format";

/** The six steps from enrolment to certification; the rail fills as you scroll. */
export function CertificationPath({ eyebrow = "Your path" }: { eyebrow?: string }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-rail]",
          { scaleY: 0 },
          { scaleY: 1, ease: "none", scrollTrigger: { trigger: "[data-steps]", start: "top 70%", end: "bottom 60%", scrub: 0.6 } },
        );
        gsap.utils.toArray<HTMLElement>("[data-step]").forEach((step) => {
          gsap.from(step, {
            autoAlpha: 0,
            x: 24,
            duration: 1,
            ease: "luxe",
            scrollTrigger: { trigger: step, start: "top 78%", once: true },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="path-title" className="grid gap-12 px-gutter pb-section lg:grid-cols-12">
      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
          <p className="eyebrow mb-6 text-muted">{eyebrow}</p>
          <SplitReveal as="h2" id="path-title" className="text-display font-light tracking-[-0.04em]">
            From enrolment to <em className="italic-serif">certified</em>
          </SplitReveal>
        </div>
      </div>
      <ol data-steps className="relative lg:col-span-6 lg:col-start-7">
        <span aria-hidden="true" className="absolute bottom-6 left-[1.4rem] top-6 w-px bg-line" />
        <span data-rail aria-hidden="true" className="absolute bottom-6 left-[1.4rem] top-6 w-px origin-top bg-ink" />
        {certificationSteps.map((step, i) => (
          <li key={step.title} data-step className="relative flex gap-6 pb-12 last:pb-0">
            <span className="relative z-10 grid size-11 shrink-0 place-items-center rounded-full border border-line bg-canvas text-sm tabular-nums">
              {pad(i + 1)}
            </span>
            <div className="pt-2">
              <h3 className="text-[clamp(1.25rem,1.8vw,1.6rem)] font-medium tracking-tight">{step.title}</h3>
              <p className="mt-2 max-w-md leading-relaxed text-muted">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
