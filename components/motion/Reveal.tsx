"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { useRevealReady } from "@/lib/motion/useRevealReady";
import { useReducedMotion } from "@/lib/hooks";

type RevealProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  /** Stagger direct children instead of animating the wrapper. */
  stagger?: number;
  start?: string;
  immediate?: boolean;
};

/** Soft fade-and-rise for blocks of content (also the reduced-motion style). */
export function Reveal({
  as: Tag = "div",
  children,
  className,
  delay = 0,
  y = 36,
  stagger,
  start = "top 90%",
  immediate = false,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const ready = useRevealReady();
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !ready) return;
      const targets = stagger !== undefined ? Array.from(el.children) : el;
      gsap.from(targets, {
        autoAlpha: 0,
        y: reduced ? 0 : y,
        duration: reduced ? 0.6 : 1.2,
        delay,
        stagger: stagger ?? 0,
        ease: "luxe",
        clearProps: "transform",
        scrollTrigger: immediate ? undefined : { trigger: el, start, once: true },
      });
    },
    { dependencies: [ready, reduced], scope: ref, revertOnUpdate: true },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
