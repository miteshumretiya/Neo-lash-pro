"use client";

import { useRef, type ElementType } from "react";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { useReducedMotion } from "@/lib/hooks";

gsap.registerPlugin(ScrambleTextPlugin);

type ScrambleProps = {
  text: string;
  as?: ElementType;
  className?: string;
  /** Scramble when the nearest `[data-scramble-host]` is hovered (defaults to self). */
  hostSelector?: string;
};

/** Small labels that decode themselves on hover. */
export function Scramble({ text, as: Tag = "span", className, hostSelector = "[data-scramble-host]" }: ScrambleProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    (_, contextSafe) => {
      const el = ref.current;
      if (!el || reduced || !contextSafe) return;
      const host = (el.closest(hostSelector) as HTMLElement | null) ?? el;
      const play = contextSafe(() => {
        gsap.to(el, {
          duration: 0.7,
          ease: "none",
          scrambleText: { text, chars: "lowerCase", speed: 0.5, revealDelay: 0.15 },
          overwrite: true,
        });
      });
      host.addEventListener("pointerenter", play);
      host.addEventListener("focus", play);
      return () => {
        host.removeEventListener("pointerenter", play);
        host.removeEventListener("focus", play);
      };
    },
    { dependencies: [text, reduced], scope: ref },
  );

  return (
    <Tag className={className}>
      <span className="sr-only">{text}</span>
      <span ref={ref} aria-hidden="true">
        {text}
      </span>
    </Tag>
  );
}
