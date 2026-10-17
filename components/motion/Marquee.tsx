"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { scroll } from "@/lib/motion/scroll";
import { useReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/cn";

type MarqueeProps = {
  children: ReactNode;
  className?: string;
  /** Pixels per second at rest. */
  speed?: number;
  direction?: 1 | -1;
  pauseOnHover?: boolean;
  /** How strongly scroll velocity accelerates the loop. */
  velocityFactor?: number;
};

/**
 * Infinite marquee on the GSAP ticker. Scroll velocity speeds it up (and
 * reverses it when scrolling back up); hovering eases it to a stop.
 */
export function Marquee({
  children,
  className,
  speed = 60,
  direction = -1,
  pauseOnHover = true,
  velocityFactor = 0.9,
}: MarqueeProps) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    (_, contextSafe) => {
      const el = track.current;
      const host = root.current;
      if (!el || !host || !contextSafe) return;
      let x = 0;
      let hover = 1;
      let hoverTarget = 1;
      let visible = true;
      const half = () => el.scrollWidth / 2;

      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
      });
      io.observe(host);

      const tick = (_t: number, dt: number) => {
        if (!visible) return;
        hover += (hoverTarget - hover) * 0.06;
        const v = scroll.velocity;
        const boost = reduced ? 0 : Math.min(Math.abs(v) * velocityFactor, 14);
        const dir = v < -0.2 ? -direction : direction;
        x += ((speed * dt) / 1000) * (reduced ? 0.4 : 1) * hover * dir + boost * dir * hover;
        const w = half();
        if (w > 0) x = gsap.utils.wrap(-w, 0, x);
        gsap.set(el, { x });
      };
      gsap.ticker.add(tick);

      const enter = contextSafe(() => {
        if (pauseOnHover) hoverTarget = 0;
      });
      const leave = contextSafe(() => {
        hoverTarget = 1;
      });
      host.addEventListener("pointerenter", enter);
      host.addEventListener("pointerleave", leave);
      host.addEventListener("focusin", enter);
      host.addEventListener("focusout", leave);

      return () => {
        gsap.ticker.remove(tick);
        io.disconnect();
        host.removeEventListener("pointerenter", enter);
        host.removeEventListener("pointerleave", leave);
        host.removeEventListener("focusin", enter);
        host.removeEventListener("focusout", leave);
      };
    },
    { dependencies: [speed, direction, reduced], scope: root },
  );

  return (
    <div ref={root} className={cn("relative overflow-hidden", className)}>
      <div ref={track} className="flex w-max will-change-transform">
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden="true" inert>
          {children}
        </div>
      </div>
    </div>
  );
}
