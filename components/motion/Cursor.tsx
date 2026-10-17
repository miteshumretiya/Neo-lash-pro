"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { useFinePointer, useReducedMotion } from "@/lib/hooks";

/**
 * Dot + lagging ring. Elements opt into a labelled state with
 * `data-cursor="View"`; links and buttons get a hover state automatically.
 * Uses mix-blend-mode: difference so it inverts over imagery.
 */
export function Cursor() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);

  useGSAP(
    () => {
      if (!fine || !dot.current || !ring.current) return;
      const html = document.documentElement;
      html.classList.add("has-cursor");
      gsap.set([dot.current, ring.current], { xPercent: -50, yPercent: -50, autoAlpha: 0 });
      const dx = gsap.quickTo(dot.current, "x", { duration: 0.12, ease: "power3.out" });
      const dy = gsap.quickTo(dot.current, "y", { duration: 0.12, ease: "power3.out" });
      const rx = gsap.quickTo(ring.current, "x", { duration: reduced ? 0.12 : 0.55, ease: "power3.out" });
      const ry = gsap.quickTo(ring.current, "y", { duration: reduced ? 0.12 : 0.55, ease: "power3.out" });

      let shown = false;
      let base = 1;
      const move = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        if (!shown) {
          shown = true;
          gsap.set([dot.current, ring.current], { x: e.clientX, y: e.clientY });
          gsap.to([dot.current, ring.current], { autoAlpha: 1, duration: 0.3 });
        }
        dx(e.clientX);
        dy(e.clientY);
        rx(e.clientX);
        ry(e.clientY);
      };

      const over = (e: PointerEvent) => {
        const target = e.target as HTMLElement | null;
        const labelled = target?.closest<HTMLElement>("[data-cursor]");
        const interactive = target?.closest("a, button, [role='button'], input, textarea, select, label");
        const text = labelled?.dataset.cursor || null;
        setLabel(text);
        base = text ? 2.4 : interactive ? 1.55 : 1;
        gsap.to(ring.current, { scale: base, duration: 0.5, ease: "luxe" });
        gsap.to(dot.current, { scale: text ? 0 : interactive ? 0.4 : 1, duration: 0.35, ease: "luxe" });
      };

      const leaveWindow = () => {
        shown = false;
        gsap.to([dot.current, ring.current], { autoAlpha: 0, duration: 0.3 });
      };
      const down = () => gsap.to(ring.current, { scale: base * 0.8, duration: 0.2 });
      const up = () => gsap.to(ring.current, { scale: base, duration: 0.35, ease: "luxe" });

      window.addEventListener("pointermove", move, { passive: true });
      document.addEventListener("pointerover", over, { passive: true });
      document.documentElement.addEventListener("pointerleave", leaveWindow);
      window.addEventListener("pointerdown", down);
      window.addEventListener("pointerup", up);
      return () => {
        html.classList.remove("has-cursor");
        window.removeEventListener("pointermove", move);
        document.removeEventListener("pointerover", over);
        document.documentElement.removeEventListener("pointerleave", leaveWindow);
        window.removeEventListener("pointerdown", down);
        window.removeEventListener("pointerup", up);
      };
    },
    { dependencies: [fine, reduced] },
  );

  if (!fine) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[95] mix-blend-difference">
      <div ref={ring} className="absolute left-0 top-0 grid size-10 place-items-center rounded-full border border-white/90">
        <span
          className="eyebrow scale-[0.42] whitespace-nowrap text-white transition-opacity duration-300"
          style={{ opacity: label ? 1 : 0 }}
        >
          {label}
        </span>
      </div>
      <div ref={dot} className="absolute left-0 top-0 size-2 rounded-full bg-white" />
    </div>
  );
}
