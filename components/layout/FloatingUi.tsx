"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/motion/gsap";
import { site } from "@/lib/site";
import { ArrowUpRight } from "@/components/ui/Icons";

/** Thin sage line tracking page progress. */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      if (!bar.current) return;
      const set = gsap.quickSetter(bar.current, "scaleX");
      const st = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => set(self.progress),
      });
      set(0);
      return () => st.kill();
    },
    { dependencies: [pathname] },
  );

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px]">
      <div ref={bar} className="h-full origin-left scale-x-0 bg-sage" />
    </div>
  );
}

/** "Book now" pill that floats in after the hero and steps aside for the footer. */
export function BookPill() {
  const ref = useRef<HTMLAnchorElement>(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      gsap.set(el, { yPercent: 160, autoAlpha: 0 });
      const show = (visible: boolean) =>
        gsap.to(el, { yPercent: visible ? 0 : 160, autoAlpha: visible ? 1 : 0, duration: 0.8, ease: "luxe", overwrite: true });
      const st = ScrollTrigger.create({
        start: () => (pathname === "/" ? window.innerHeight * 0.9 : window.innerHeight * 0.4),
        end: () => ScrollTrigger.maxScroll(window) - window.innerHeight * 0.9,
        onToggle: (self) => show(self.isActive),
      });
      return () => st.kill();
    },
    { dependencies: [pathname] },
  );

  return (
    <a
      ref={ref}
      href={site.booking}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="Book"
      className="invisible fixed bottom-[max(0.9rem,env(safe-area-inset-bottom))] right-1/2 z-[45] flex translate-x-1/2 items-center gap-2.5 rounded-full bg-ink py-1.5 pl-1.5 pr-4 text-sm font-medium text-canvas shadow-[0_18px_50px_-20px_rgb(0_0_0/0.45)] sm:right-[var(--gutter)] sm:translate-x-0 sm:gap-3 sm:py-2 sm:pl-2 sm:pr-5"
    >
      <span className="grid size-8 place-items-center rounded-full bg-sage text-night sm:size-9">
        <span className="size-2 animate-pulse-dot rounded-full bg-night" aria-hidden="true" />
      </span>
      <span>
        Book now
        <span className="hidden text-[0.7rem] font-normal opacity-60 sm:block">Next availability on Fresha</span>
      </span>
      <ArrowUpRight size={16} className="ml-1" />
    </a>
  );
}
