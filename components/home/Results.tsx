"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { useReducedMotion } from "@/lib/hooks";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowLeft, ArrowRight } from "@/components/ui/Icons";
import { resultPairs } from "@/data/results";
import { site } from "@/lib/site";
import { cn } from "@/lib/cn";

/** Drag-to-compare slider for lash results, keyboard accessible. */
export function Results() {
  const root = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [position, setPosition] = useState(50);
  const dragging = useRef(false);
  const reduced = useReducedMotion();
  const pair = resultPairs[index];

  const fromPointer = (e: PointerEvent<HTMLDivElement>) => {
    const rect = frame.current!.getBoundingClientRect();
    setPosition(Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100)));
  };

  // A little sweep the first time the slider comes into view, to hint it's draggable.
  useGSAP(
    () => {
      if (reduced) return;
      const state = { p: 50 };
      gsap
        .timeline({ scrollTrigger: { trigger: frame.current, start: "top 70%", once: true } })
        .to(state, { p: 28, duration: 0.9, ease: "silk", onUpdate: () => setPosition(state.p) })
        .to(state, { p: 68, duration: 1.1, ease: "silk", onUpdate: () => setPosition(state.p) })
        .to(state, { p: 50, duration: 0.9, ease: "luxe", onUpdate: () => setPosition(state.p) });
    },
    { scope: root, dependencies: [reduced] },
  );

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") setPosition((p) => Math.max(0, p - 5));
    if (e.key === "ArrowRight") setPosition((p) => Math.min(100, p + 5));
    if (e.key === "Home") setPosition(0);
    if (e.key === "End") setPosition(100);
  };

  return (
    <section ref={root} aria-labelledby="results-title" className="px-gutter py-section">
      <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-4">
          <p className="eyebrow mb-6 text-muted">(08) — Results</p>
          <SplitReveal as="h2" id="results-title" className="text-display font-light tracking-[-0.04em]">
            Find <em className="italic-serif">your</em> look
          </SplitReveal>
          <Reveal className="mt-6 max-w-sm text-muted">
            <p>
              Real sets from our studio. Drag to compare styles — then tell us which one feels like you, and we&apos;ll map it to your
              eyes.
            </p>
          </Reveal>
          <div className="mt-10 space-y-2" role="tablist" aria-label="Choose a comparison">
            {resultPairs.map((p, i) => (
              <button
                key={p.id}
                role="tab"
                type="button"
                aria-selected={i === index}
                onClick={() => {
                  setIndex(i);
                  setPosition(50);
                }}
                className={cn(
                  "flex w-full items-center justify-between border-b border-line py-3 text-left text-lg transition-colors duration-500",
                  i === index ? "text-ink" : "text-ink/40 hover:text-ink/70",
                )}
              >
                <span>{p.title}</span>
                <span className="eyebrow">
                  {p.left.label} / {p.right.label}
                </span>
              </button>
            ))}
          </div>
          <a href={site.booking} target="_blank" rel="noopener noreferrer" className="btn btn-solid mt-10" data-cursor="Book">
            Book your consultation
          </a>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <div
            ref={frame}
            data-cursor="Drag"
            className="relative aspect-[4/5] touch-pan-y select-none overflow-hidden rounded-frame sm:aspect-[5/4]"
            onPointerDown={(e) => {
              dragging.current = true;
              e.currentTarget.setPointerCapture(e.pointerId);
              fromPointer(e);
            }}
            onPointerMove={(e) => dragging.current && fromPointer(e)}
            onPointerUp={() => (dragging.current = false)}
            onPointerCancel={() => (dragging.current = false)}
          >
            <Image src={pair.right.image.src} alt={pair.right.image.alt} fill sizes="(max-width: 1024px) 100vw, 58vw" className="object-cover" />
            <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
              <Image src={pair.left.image.src} alt={pair.left.image.alt} fill sizes="(max-width: 1024px) 100vw, 58vw" className="object-cover" />
            </div>

            <span className="glass absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-medium text-white">{pair.left.label}</span>
            <span className="glass absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-medium text-white">{pair.right.label}</span>

            <div className="absolute inset-y-0 w-px bg-white/90" style={{ left: `${position}%` }}>
              <div
                role="slider"
                tabIndex={0}
                aria-label={`Compare ${pair.left.label} and ${pair.right.label}`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(position)}
                aria-valuetext={`${Math.round(position)}% ${pair.left.label}`}
                onKeyDown={onKey}
                className="absolute left-1/2 top-1/2 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-0.5 rounded-full bg-white text-night shadow-[0_10px_30px_-10px_rgb(0_0_0/0.5)]"
              >
                <ArrowLeft size={14} />
                <ArrowRight size={14} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
