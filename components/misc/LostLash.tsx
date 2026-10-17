"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/motion/gsap";

const EYE = "M10 70 Q100 -12 190 70 Q100 152 10 70Z";
const GAP = 5;

// Lashes rooted along the upper lid curve, leaning outward; one is missing.
const lashes = Array.from({ length: 9 }, (_, i) => {
  const t = 0.12 + i * 0.095;
  const x = (1 - t) ** 2 * 10 + 2 * (1 - t) * t * 100 + t ** 2 * 190;
  const y = (1 - t) ** 2 * 70 + 2 * (1 - t) * t * -12 + t ** 2 * 70;
  const lean = (t - 0.5) * 1.6;
  const len = 26 + Math.sin(t * Math.PI) * 12;
  const ex = x + Math.sin(lean) * len + lean * 8;
  const ey = y - Math.cos(lean) * len;
  const cx = x + Math.sin(lean) * len * 0.2;
  const cy = y - len * 0.75;
  return { i, x, y, d: `M${x.toFixed(1)} ${y.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}` };
});
const gap = lashes[GAP];

/** "404" whose zero is an eye: it blinks, follows the pointer and loses a lash. */
export function LostLash() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ repeat: -1, repeatDelay: 0.6 })
          .fromTo("[data-falling]", { x: 0, y: 0, rotation: 0, autoAlpha: 1 }, { y: 70, x: 26, rotation: 50, duration: 1.3, ease: "sine.inOut" })
          .to("[data-falling]", { y: 140, x: -18, rotation: -35, duration: 1.3, ease: "sine.inOut" })
          .to("[data-falling]", { y: 210, x: 14, rotation: 20, autoAlpha: 0, duration: 1.3, ease: "sine.inOut" });

        gsap
          .timeline({ repeat: -1, repeatDelay: 2.8, delay: 1 })
          .to("[data-lid]", { scaleY: 0.06, duration: 0.09, ease: "power2.in" })
          .to("[data-lid]", { scaleY: 1, duration: 0.16, ease: "power2.out" });

        const eye = root.current?.querySelector<SVGSVGElement>("[data-eye]");
        if (!eye || !contextSafe) return;
        const xTo = gsap.quickTo("[data-pupil]", "x", { duration: 0.6, ease: "power3.out" });
        const yTo = gsap.quickTo("[data-pupil]", "y", { duration: 0.6, ease: "power3.out" });
        const move = contextSafe((e: PointerEvent) => {
          const r = eye.getBoundingClientRect();
          const dx = e.clientX - (r.left + r.width / 2);
          const dy = e.clientY - (r.top + r.height / 2);
          const angle = Math.atan2(dy, dx);
          const reach = Math.min(1, Math.hypot(dx, dy) / 400);
          xTo(Math.cos(angle) * 34 * reach);
          yTo(Math.sin(angle) * 18 * reach);
        });
        window.addEventListener("pointermove", move);
        return () => window.removeEventListener("pointermove", move);
      });
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="flex select-none items-center justify-center gap-[0.04em] font-display text-[clamp(8rem,32vw,28rem)] leading-[0.8]"
    >
      <span>4</span>
      <svg data-eye viewBox="0 -40 200 190" className="mx-[0.04em] h-[0.78em] w-[0.86em] overflow-visible">
        <defs>
          <clipPath id="lost-lash-eye">
            <path d={EYE} />
          </clipPath>
        </defs>
        <g data-lid style={{ transformOrigin: "100px 70px" }}>
          <path d={EYE} fill="var(--surface)" />
          <g clipPath="url(#lost-lash-eye)">
            <g data-pupil>
              <circle cx="100" cy="70" r="34" fill="var(--sage)" />
              <circle cx="100" cy="70" r="15" fill="var(--ink)" />
              <circle cx="110" cy="60" r="5.5" fill="var(--surface)" />
            </g>
          </g>
          <path d={EYE} fill="none" stroke="var(--ink)" strokeWidth="3.2" />
          {lashes
            .filter((l) => l.i !== GAP)
            .map((l) => (
              <path key={l.i} d={l.d} fill="none" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
            ))}
        </g>
        <g transform={`translate(${gap.x} ${gap.y})`}>
          <path data-falling d="M0 0 Q1 -24 8 -34" fill="none" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
        </g>
      </svg>
      <span>4</span>
    </div>
  );
}
