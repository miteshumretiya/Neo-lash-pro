"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { useRevealReady } from "@/lib/motion/useRevealReady";
import { useReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/cn";

type MediaRevealProps = {
  children: ReactNode;
  className?: string;
  /** Parallax travel in percent of the frame height (0 disables). */
  parallax?: number;
  delay?: number;
  from?: "bottom" | "top" | "left" | "right" | "center";
  immediate?: boolean;
};

const insets = {
  bottom: "inset(100% 0% 0% 0%)",
  top: "inset(0% 0% 100% 0%)",
  left: "inset(0% 100% 0% 0%)",
  right: "inset(0% 0% 0% 100%)",
  center: "inset(50% 50% 50% 50%)",
};

/**
 * Clip-path reveal with a 1.2 → 1 scale on the inner media, optional parallax
 * inside the overflow-hidden frame.
 */
export function MediaReveal({
  children,
  className,
  parallax = 0,
  delay = 0,
  from = "bottom",
  immediate = false,
}: MediaRevealProps) {
  const frame = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const ready = useRevealReady();
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (!frame.current || !inner.current || !ready) return;
      if (reduced) {
        gsap.from(frame.current, { autoAlpha: 0, duration: 0.8, scrollTrigger: { trigger: frame.current, start: "top 92%", once: true } });
        return;
      }
      const tl = gsap.timeline({
        delay,
        scrollTrigger: immediate ? undefined : { trigger: frame.current, start: "top 88%", once: true },
      });
      tl.fromTo(
        frame.current,
        { clipPath: insets[from] },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "silk" },
      ).fromTo(inner.current, { scale: 1.22 }, { scale: 1, duration: 1.9, ease: "luxe" }, 0);

      if (parallax) {
        gsap.fromTo(
          inner.current,
          { yPercent: -parallax },
          {
            yPercent: parallax,
            ease: "none",
            scrollTrigger: { trigger: frame.current, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      }
    },
    { dependencies: [ready, reduced], scope: frame, revertOnUpdate: true },
  );

  return (
    <div ref={frame} className={cn("relative overflow-hidden", className)}>
      <div
        ref={inner}
        className="absolute will-change-transform"
        style={{ inset: parallax ? `-${parallax * 1.1}% 0` : 0 }}
      >
        {children}
      </div>
    </div>
  );
}
