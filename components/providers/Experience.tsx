"use client";

import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { gsap, ScrollTrigger } from "@/lib/motion/gsap";
import { scroll } from "@/lib/motion/scroll";
import { useWishlist } from "@/lib/store/wishlist";
import { useExperience } from "@/lib/store/experience";
import { glRegistry } from "@/lib/gl/registry";
import { detectGlMode } from "@/lib/gl/capability";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { TransitionProvider } from "@/components/motion/Transition";
import { Cursor } from "@/components/motion/Cursor";
import { Preloader } from "@/components/motion/Preloader";
import { Header } from "@/components/layout/Header";
import { MenuOverlay } from "@/components/layout/MenuOverlay";
import { Footer } from "@/components/layout/Footer";
import { BookPill, ScrollProgress } from "@/components/layout/FloatingUi";

const WebGLRoot = dynamic(() => import("@/components/webgl/WebGLRoot"), { ssr: false });
const QuickView = dynamic(() => import("@/components/shop/QuickView"), { ssr: false });

// Latches true once any page has registered a WebGL element.
let glWanted = false;
const glNeeded = () => (glWanted ||= glRegistry.snapshot().length > 0);

function useGlobalEffects() {
  const navigation = useExperience((s) => s.navigation);
  const setWebgl = useExperience((s) => s.setWebgl);

  useEffect(() => {
    void useWishlist.persist.rehydrate();
  }, []);

  // Decide the WebGL tier up front; three.js itself loads only when needed.
  useEffect(() => {
    const mode = detectGlMode();
    setWebgl(mode);
    document.documentElement.dataset.webgl = mode;
  }, [setWebgl]);

  // Late-loading images change layout: re-measure ScrollTriggers (debounced).
  useEffect(() => {
    let timer = 0;
    const onLoad = (e: Event) => {
      if ((e.target as HTMLElement)?.tagName !== "IMG") return;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 250);
    };
    document.addEventListener("load", onLoad, true);
    return () => {
      document.removeEventListener("load", onLoad, true);
      window.clearTimeout(timer);
    };
  }, []);

  // Velocity skew for elements marked [data-skew].
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let targets: HTMLElement[] = [];
    const collect = () => {
      targets = Array.from(document.querySelectorAll<HTMLElement>("[data-skew]"));
    };
    collect();
    let current = 0;
    let frame = 0;
    const tick = () => {
      if (++frame % 60 === 0) collect();
      const next = gsap.utils.clamp(-5, 5, scroll.velocity * -0.18);
      current += (next - current) * 0.15;
      if (Math.abs(current) < 0.01 && Math.abs(next) < 0.01) {
        if (current !== 0) {
          current = 0;
          targets.forEach((el) => (el.style.transform = ""));
        }
        return;
      }
      targets.forEach((el) => (el.style.transform = `skewY(${current.toFixed(3)}deg)`));
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [navigation]);
}

/**
 * Persistent client shell: smooth scrolling, page transitions, chrome,
 * cursor, preloader and the shared WebGL canvas. Pages render inside <main>.
 */
export function Experience({ children }: { children: ReactNode }) {
  useGlobalEffects();
  const webgl = useExperience((s) => s.webgl);
  const hasGl = useSyncExternalStore(glRegistry.subscribe, glNeeded, () => false);

  return (
    <SmoothScroll>
      <TransitionProvider>
        {hasGl && (webgl === "on" || webgl === "lite") && <WebGLRoot />}
        <Header />
        <MenuOverlay />
        <main id="main" className="relative z-[1]">
          {children}
        </main>
        <div className="relative z-[1]">
          <Footer />
        </div>
        <BookPill />
        <ScrollProgress />
        <QuickView />
        <Cursor />
        <Preloader />
        <div className="grain" aria-hidden="true" />
        <div className="vignette" aria-hidden="true" />
      </TransitionProvider>
    </SmoothScroll>
  );
}
