"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { gsap, SplitText, useGSAP } from "@/lib/motion/gsap";
import { useExperience } from "@/lib/store/experience";
import { useIsomorphicLayoutEffect } from "@/lib/hooks";

const STACK = [
  "/media/site/202212-neolashpro-3.jpg",
  "/media/site/202212-img-20221122-143644-640.jpg",
  "/media/site/202212-neolashpro-1.jpg",
  "/media/site/202212-img-20221122-143809-988.jpg",
  "/media/site/202212-neolashpro-4.jpg",
];

export const INTRO_KEY = "neolash:intro";

/**
 * First-visit intro: 000 → 100 counter tied to real loading (fonts + stack
 * images + window load), lash close-ups revealing in a stack, then the logo
 * splits away and the panel lifts. Skipped for the rest of the session.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [skip, setSkip] = useState(false);
  const setLoaded = useExperience((s) => s.setLoaded);

  useIsomorphicLayoutEffect(() => {
    const html = document.documentElement;
    const seen = html.dataset.intro === "skip";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduced) {
      setSkip(true);
      setLoaded();
    }
  }, [setLoaded]);

  useGSAP(
    () => {
      const el = root.current;
      if (!el || skip || document.documentElement.dataset.intro === "skip") return;
      const counter = el.querySelector<HTMLElement>("[data-counter]");
      const frames = gsap.utils.toArray<HTMLElement>("[data-stack]", el);
      const logo = el.querySelector<HTMLElement>("[data-logo]");
      const bar = el.querySelector<HTMLElement>("[data-bar]");
      const split = logo ? SplitText.create(logo, { type: "chars", mask: "chars" }) : null;

      const progress = { value: 0, target: 0 };
      const loaders: Promise<unknown>[] = [
        document.fonts?.ready ?? Promise.resolve(),
        new Promise((r) => (document.readyState === "complete" ? r(null) : window.addEventListener("load", r, { once: true }))),
        ...Array.from(el.querySelectorAll("img")).map((img) =>
          img.complete ? Promise.resolve() : new Promise((r) => img.addEventListener("load", r, { once: true })),
        ),
      ];
      let done = 0;
      loaders.forEach((p) =>
        p.finally(() => {
          done += 1;
          progress.target = done / loaders.length;
        }),
      );
      // Never wait longer than 4.5s for slow assets.
      const timeout = gsap.delayedCall(4.5, () => (progress.target = 1));

      gsap.set(frames, { clipPath: "inset(100% 0% 0% 0%)" });
      if (split) gsap.set(split.chars, { yPercent: 110 });
      gsap.to(split?.chars ?? [], { yPercent: 0, stagger: 0.04, duration: 1, ease: "luxe", delay: 0.15 });

      let revealed = -1;
      let finished = false;
      const minDuration = 1.9;
      const start = performance.now();
      const tick = () => {
        const elapsed = (performance.now() - start) / 1000;
        const cap = Math.min(1, elapsed / minDuration);
        progress.value += (Math.min(progress.target, cap) - progress.value) * 0.08;
        if (Math.min(progress.target, cap) >= 1 && progress.value > 0.995) progress.value = 1;
        const pct = Math.round(progress.value * 100);
        if (counter) counter.textContent = String(pct).padStart(3, "0");
        if (bar) bar.style.transform = `scaleX(${progress.value})`;
        const index = Math.min(frames.length - 1, Math.floor(progress.value * frames.length));
        while (revealed < index) {
          revealed += 1;
          gsap.to(frames[revealed], { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "silk" });
        }
        if (progress.value === 1 && !finished) {
          finished = true;
          gsap.ticker.remove(tick);
          exit();
        }
      };
      gsap.ticker.add(tick);

      const exit = () => {
        try {
          sessionStorage.setItem(INTRO_KEY, "1");
        } catch {}
        const tl = gsap.timeline({
          delay: 0.25,
          onComplete: () => {
            document.documentElement.dataset.intro = "skip";
            setSkip(true);
          },
        });
        tl.to(split?.chars ?? [], { yPercent: -110, stagger: 0.03, duration: 0.7, ease: "silk" })
          .to("[data-meta]", { autoAlpha: 0, duration: 0.4 }, 0)
          .to(frames, { scale: 1.08, duration: 1, ease: "silk" }, 0)
          .to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 1.1, ease: "silk" }, 0.35)
          .add(() => setLoaded(), 0.75);
      };

      return () => {
        gsap.ticker.remove(tick);
        timeout.kill();
        split?.revert();
      };
    },
    { scope: root, dependencies: [skip] },
  );

  if (skip) return null;

  return (
    <div
      ref={root}
      data-preloader
      className="fixed inset-0 z-[90] flex flex-col justify-between bg-canvas px-gutter py-6 text-ink"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
      aria-hidden="true"
    >
      <div data-meta className="flex items-start justify-between">
        <span className="eyebrow">Lash &amp; Brow Experts</span>
        <span className="eyebrow text-right">St. Julian&apos;s — Malta</span>
      </div>

      <div className="pointer-events-none absolute left-1/2 top-1/2 aspect-[3/4] w-[min(56vw,19rem)] -translate-x-1/2 -translate-y-1/2">
        {STACK.map((src, i) => (
          <div key={src} data-stack className="absolute inset-0 overflow-hidden rounded-[999px_999px_1.25rem_1.25rem]" style={{ zIndex: i }}>
            <Image src={src} alt="" fill sizes="(max-width: 640px) 56vw, 19rem" className="object-cover" priority={i < 2} />
          </div>
        ))}
      </div>

      <div className="relative flex items-end justify-between gap-6">
        <span data-counter className="font-display text-[clamp(4.5rem,16vw,13rem)] leading-[0.8] tabular-nums">
          000
        </span>
        <span data-logo className="mb-2 font-display text-[clamp(2rem,5vw,4.5rem)] leading-none">
          Neo Lash®
        </span>
        <span className="absolute inset-x-0 -bottom-3 h-px origin-left bg-line">
          <span data-bar className="block h-full origin-left scale-x-0 bg-ink" />
        </span>
      </div>
    </div>
  );
}
