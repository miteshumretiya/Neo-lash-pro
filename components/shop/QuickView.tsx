"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { scroll } from "@/lib/motion/scroll";
import { useExperience } from "@/lib/store/experience";
import { categoryLabels } from "@/data/products";
import { Close, ArrowRight } from "@/components/ui/Icons";
import { TransitionLink } from "@/components/motion/Transition";
import { PurchasePanel } from "./PurchasePanel";
import { SaleBadge } from "./Price";

/** Slide-in product drawer opened from any product card. */
export default function QuickView() {
  const product = useExperience((s) => s.quickView);
  const setQuickView = useExperience((s) => s.setQuickView);
  const root = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const open = !!product;

  useGSAP(
    () => {
      if (!root.current || !panel.current) return;
      if (open) {
        gsap.set(root.current, { visibility: "visible" });
        gsap.fromTo(root.current.querySelector("[data-backdrop]"), { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "glide" });
        gsap.fromTo(panel.current, { xPercent: 105 }, { xPercent: 0, duration: 0.9, ease: "luxe" });
        gsap.from(panel.current.querySelectorAll("[data-qv-fade]"), { y: 24, autoAlpha: 0, duration: 0.8, stagger: 0.05, delay: 0.2, ease: "luxe" });
      } else {
        gsap.to(panel.current, { xPercent: 105, duration: 0.6, ease: "silk" });
        gsap.to(root.current.querySelector("[data-backdrop]"), {
          opacity: 0,
          duration: 0.5,
          onComplete: () => gsap.set(root.current, { visibility: "hidden" }),
        });
      }
    },
    { dependencies: [open], scope: root },
  );

  useEffect(() => {
    if (!open) return;
    returnFocus.current = document.activeElement as HTMLElement;
    scroll.stop();
    const t = window.setTimeout(() => panel.current?.querySelector<HTMLElement>("button")?.focus(), 200);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setQuickView(null);
      if (e.key !== "Tab" || !panel.current) return;
      const items = Array.from(panel.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"));
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      scroll.start();
      returnFocus.current?.focus?.({ preventScroll: true });
    };
  }, [open, setQuickView]);

  return (
    <div ref={root} className="invisible fixed inset-0 z-[65]" aria-hidden={!open} inert={!open}>
      <div data-backdrop className="absolute inset-0 bg-night/40 backdrop-blur-[2px]" onClick={() => setQuickView(null)} />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={product ? `${product.name} — quick view` : "Quick view"}
        className="absolute inset-y-0 right-0 flex w-full max-w-[34rem] flex-col overflow-y-auto bg-canvas sm:inset-y-[var(--gutter)] sm:right-[var(--gutter)] sm:rounded-frame"
        data-lenis-prevent
      >
        {product && (
          <>
            <div className="flex items-center justify-between px-6 pb-2 pt-5">
              <p className="eyebrow text-muted">{categoryLabels[product.category]}</p>
              <button type="button" onClick={() => setQuickView(null)} aria-label="Close quick view" className="icon-btn size-10">
                <Close size={16} />
              </button>
            </div>
            <div data-qv-fade className="relative mx-6 aspect-[4/3] overflow-hidden rounded-card bg-tile">
              <Image src={product.images[0].src} alt={product.images[0].alt} fill sizes="34rem" className="blend-tile object-cover" />
              <SaleBadge product={product} className="absolute left-3 top-3" />
            </div>
            <div className="flex flex-1 flex-col px-6 pb-8 pt-6">
              <h2 data-qv-fade className="font-display text-title">
                {product.name}
              </h2>
              <p data-qv-fade className="mt-3 text-muted">
                {product.short}
              </p>
              <div data-qv-fade className="mt-8">
                <PurchasePanel key={product.slug} product={product} compact />
              </div>
              <TransitionLink
                href={`/shop/${product.slug}`}
                onClick={() => setQuickView(null)}
                data-qv-fade
                className="link-u mt-8 inline-flex items-center gap-2 self-start text-sm"
              >
                View full details <ArrowRight size={15} />
              </TransitionLink>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
