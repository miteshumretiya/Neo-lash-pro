"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ReactLenis, type LenisRef } from "lenis/react";
import { gsap, ScrollTrigger } from "@/lib/motion/gsap";
import { scroll } from "@/lib/motion/scroll";

/**
 * Global Lenis instance driven by GSAP's ticker so ScrollTrigger, Lenis and the
 * WebGL layer all advance in the same frame.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    const lenis = lenisRef.current?.lenis;
    if (!lenis) return;
    scroll.set(lenis);

    let smoothed = 0;
    const onScroll = () => {
      ScrollTrigger.update();
    };
    lenis.on("scroll", onScroll);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
      smoothed += (lenis.velocity - smoothed) * 0.12;
      scroll.setVelocity(Math.abs(smoothed) < 0.01 ? 0 : smoothed);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);

    return () => {
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(tick);
      window.removeEventListener("load", refresh);
      scroll.set(null);
    };
  }, []);

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        lerp: 0.085,
        smoothWheel: true,
        syncTouch: false,
        autoRaf: false,
        stopInertiaOnNavigate: true,
        anchors: { offset: -96, duration: 1.6 },
      }}
    >
      {children}
    </ReactLenis>
  );
}
