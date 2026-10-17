"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/motion/gsap";
import { useRevealReady } from "@/lib/motion/useRevealReady";
import { useReducedMotion } from "@/lib/hooks";

type SplitRevealProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  id?: string;
  /** lines: masked line reveal, chars: hero titles, words: softer stagger */
  type?: "lines" | "words" | "chars";
  delay?: number;
  stagger?: number;
  duration?: number;
  start?: string;
  /** Play as soon as the page is ready instead of on scroll. */
  immediate?: boolean;
};

export function SplitReveal({
  as: Tag = "div",
  children,
  className,
  id,
  type = "lines",
  delay = 0,
  stagger,
  duration = 1.25,
  start = "top 88%",
  immediate = false,
}: SplitRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const ready = useRevealReady();
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (reduced) {
        gsap.set(el, { visibility: "visible" });
        return;
      }
      if (!ready) return;

      const split = SplitText.create(el, {
        type: type === "lines" ? "lines" : `lines,${type}`,
        mask: "lines",
        linesClass: "split-line",
        autoSplit: true,
        onSplit(self) {
          gsap.set(el, { visibility: "visible" });
          const targets = type === "chars" ? self.chars : type === "words" ? self.words : self.lines;
          return gsap.from(targets, {
            yPercent: 118,
            rotate: type === "lines" ? 2.5 : 0,
            transformOrigin: "0% 100%",
            duration,
            delay,
            stagger: stagger ?? (type === "chars" ? 0.028 : type === "words" ? 0.05 : 0.11),
            ease: "luxe",
            scrollTrigger: immediate ? undefined : { trigger: el, start, once: true },
          });
        },
      });
      return () => split.revert();
    },
    { dependencies: [ready, reduced], scope: ref, revertOnUpdate: true },
  );

  return (
    <Tag ref={ref} id={id} data-reveal="split" className={className}>
      {children}
    </Tag>
  );
}
