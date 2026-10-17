"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { useFinePointer, useReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/cn";

/** Subtle perspective tilt that follows the pointer across the card. */
export function Tilt({ children, className, max = 6 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const reduced = useReducedMotion();

  useGSAP(
    (_, contextSafe) => {
      const el = ref.current;
      if (!el || !fine || reduced || !contextSafe) return;
      gsap.set(el, { transformPerspective: 900, transformStyle: "preserve-3d" });
      const rx = gsap.quickTo(el, "rotationX", { duration: 0.7, ease: "power3.out" });
      const ry = gsap.quickTo(el, "rotationY", { duration: 0.7, ease: "power3.out" });
      const move = contextSafe((e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        rx(-py * max);
        ry(px * max);
      });
      const leave = contextSafe(() => {
        rx(0);
        ry(0);
      });
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      };
    },
    { dependencies: [fine, reduced, max], scope: ref, revertOnUpdate: true },
  );

  return (
    <div ref={ref} className={cn("will-change-transform", className)}>
      {children}
    </div>
  );
}
