"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { useRevealReady } from "@/lib/motion/useRevealReady";

type CounterProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
  pad?: number;
};

/** Counts up from zero when it scrolls into view. */
export function Counter({ value, prefix = "", suffix = "", duration = 2.2, className, pad = 0 }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const ready = useRevealReady();
  const format = (n: number) => `${prefix}${String(Math.round(n)).padStart(pad, "0")}${suffix}`;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !ready) return;
      const state = { n: 0 };
      el.textContent = format(0);
      gsap.to(state, {
        n: value,
        duration,
        ease: "expo.out",
        onUpdate: () => {
          el.textContent = format(state.n);
        },
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      });
    },
    { dependencies: [ready, value], scope: ref, revertOnUpdate: true },
  );

  return (
    <span ref={ref} className={className} suppressHydrationWarning>
      {format(value)}
    </span>
  );
}
