"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/motion/gsap";
import { useRevealReady } from "@/lib/motion/useRevealReady";
import { useReducedMotion } from "@/lib/hooks";

type ScrubWordsProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  start?: string;
  end?: string;
};

/** Manifesto text whose words brighten from 15% to 100% with scroll. */
export function ScrubWords({ as: Tag = "p", children, className, start = "top 82%", end = "bottom 52%" }: ScrubWordsProps) {
  const ref = useRef<HTMLElement>(null);
  const ready = useRevealReady();
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reduced || !ready) return;
      const split = SplitText.create(el, {
        type: "words",
        wordsClass: "scrub-word",
        autoSplit: true,
        onSplit(self) {
          return gsap.fromTo(
            self.words,
            { opacity: 0.15 },
            {
              opacity: 1,
              ease: "none",
              stagger: 0.1,
              scrollTrigger: { trigger: el, start, end, scrub: 0.6 },
            },
          );
        },
      });
      return () => split.revert();
    },
    { dependencies: [ready, reduced], scope: ref, revertOnUpdate: true },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
