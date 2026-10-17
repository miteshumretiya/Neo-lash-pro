"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { useFinePointer, useReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/cn";

type MagneticProps = {
  children: ReactNode;
  className?: string;
  /** How far the element follows the pointer (fraction of the offset). */
  strength?: number;
  /** The [data-magnetic-label] child travels further for a parallax feel. */
  labelStrength?: number;
};

/** Pulls its child toward the cursor and springs back elastically on leave. */
export function Magnetic({ children, className, strength = 0.32, labelStrength = 0.55 }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const fine = useFinePointer();
  const reduced = useReducedMotion();

  useGSAP(
    (_, contextSafe) => {
      const el = ref.current;
      if (!el || !fine || reduced || !contextSafe) return;
      const label = el.querySelector<HTMLElement>("[data-magnetic-label]");
      const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });
      const lxTo = label ? gsap.quickTo(label, "x", { duration: 0.6, ease: "power3.out" }) : null;
      const lyTo = label ? gsap.quickTo(label, "y", { duration: 0.6, ease: "power3.out" }) : null;

      const move = contextSafe((e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        xTo(dx * strength);
        yTo(dy * strength);
        lxTo?.(dx * labelStrength * 0.4);
        lyTo?.(dy * labelStrength * 0.4);
      });
      const leave = contextSafe(() => {
        gsap.to(el, { x: 0, y: 0, duration: 1.1, ease: "elastic.out(1, 0.32)" });
        if (label) gsap.to(label, { x: 0, y: 0, duration: 1.1, ease: "elastic.out(1, 0.32)" });
      });

      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      };
    },
    { dependencies: [fine, reduced], scope: ref, revertOnUpdate: true },
  );

  return (
    <span ref={ref} className={cn("will-change-transform", className || "inline-flex")}>
      {children}
    </span>
  );
}
