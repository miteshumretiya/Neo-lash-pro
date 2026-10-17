"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useRevealReady } from "@/lib/motion/useRevealReady";
import { useReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/cn";

gsap.registerPlugin(DrawSVGPlugin);

// A lid line with a fan of lashes, drawn root-to-tip.
const LID = "M8 74 C 70 30, 170 14, 252 26 C 300 33, 340 48, 372 70";
const LASHES = Array.from({ length: 15 }, (_, i) => {
  const t = (i + 1) / 16;
  const x = 8 + t * 364;
  const y = 74 - Math.sin(t * Math.PI) * 50 + (t > 0.7 ? (t - 0.7) * 30 : 0);
  const len = 16 + Math.sin(t * Math.PI) * 26 + t * 10;
  const angle = -Math.PI / 2 - (t - 0.42) * 1.25;
  const cx = x + Math.cos(angle) * len * 0.55 - 4;
  const cy = y + Math.sin(angle) * len * 0.55;
  const ex = x + Math.cos(angle - 0.35) * len;
  const ey = y + Math.sin(angle - 0.35) * len;
  return `M${x.toFixed(1)} ${y.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`;
});

/** Decorative lash-line stroke drawn as it scrolls into view. */
export function DrawLash({ className, scrub = false }: { className?: string; scrub?: boolean }) {
  const ref = useRef<SVGSVGElement>(null);
  const ready = useRevealReady();
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (!ref.current || !ready || reduced) return;
      const lid = ref.current.querySelector("[data-lid]");
      const lashes = ref.current.querySelectorAll("[data-lash]");
      const tl = gsap.timeline({
        scrollTrigger: scrub
          ? { trigger: ref.current, start: "top 85%", end: "bottom 35%", scrub: 0.8 }
          : { trigger: ref.current, start: "top 85%", once: true },
      });
      tl.from(lid, { drawSVG: "0%", duration: 1.4, ease: "silk" }).from(
        lashes,
        { drawSVG: "0%", duration: 0.9, stagger: 0.05, ease: "luxe" },
        0.35,
      );
    },
    { dependencies: [ready, reduced, scrub], scope: ref, revertOnUpdate: true },
  );

  return (
    <svg
      ref={ref}
      viewBox="0 0 380 90"
      fill="none"
      aria-hidden="true"
      className={cn("overflow-visible", className)}
    >
      <path data-lid d={LID} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      {LASHES.map((d) => (
        <path key={d} data-lash d={d} stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      ))}
    </svg>
  );
}
