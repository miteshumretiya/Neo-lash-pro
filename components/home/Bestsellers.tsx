"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { Flip } from "gsap/Flip";
import type { GlState } from "@/lib/gl/registry";
import { GlStage } from "@/components/gl/GlLayers";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal } from "@/components/motion/Reveal";
import { TransitionLink } from "@/components/motion/Transition";
import { ProductCard } from "@/components/shop/ProductCard";
import { WhatsAppBuy } from "@/components/shop/WhatsAppBuy";
import { Price } from "@/components/shop/Price";
import { ArrowRight } from "@/components/ui/Icons";
import { categoryLabels } from "@/data/products";
import type { Product, ProductCategory } from "@/data/types";
import { cn } from "@/lib/cn";

gsap.registerPlugin(Flip);

type Props = { products: Product[]; spotlight: Product | null };

/** 3D tweezer spotlight + bestseller grid with Flip-animated category tabs. */
export function Bestsellers({ products, spotlight }: Props) {
  const root = useRef<HTMLElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const stage = useRef<GlState | null>(null);
  const [filter, setFilter] = useState<ProductCategory | "all">("all");
  const flipState = useRef<Flip.FlipState | null>(null);

  const categories = (["all", ...new Set(products.map((p) => p.category))] as const).map((id) => ({
    id,
    label: id === "all" ? "All" : categoryLabels[id],
    count: id === "all" ? products.length : products.filter((p) => p.category === id).length,
  }));
  const visible = filter === "all" ? products : products.filter((p) => p.category === filter);

  const choose = (id: ProductCategory | "all") => {
    if (grid.current) flipState.current = Flip.getState(grid.current.querySelectorAll("[data-product-card]"));
    setFilter(id);
  };

  useGSAP(
    () => {
      if (!flipState.current || !grid.current) return;
      Flip.from(flipState.current, {
        targets: grid.current.querySelectorAll("[data-product-card]"),
        duration: 0.9,
        ease: "luxe",
        scale: true,
        absolute: true,
        stagger: 0.03,
        onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: "luxe" }),
        onLeave: (els) => gsap.to(els, { autoAlpha: 0, scale: 0.9, duration: 0.4 }),
      });
      flipState.current = null;
    },
    { dependencies: [filter], scope: grid },
  );

  // The tweezers rotate as the spotlight scrolls through the viewport.
  useGSAP(
    () => {
      gsap.to(
        {},
        {
          scrollTrigger: {
            trigger: "[data-spotlight]",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            onUpdate: (self) => {
              if (stage.current) stage.current.progress = self.progress;
            },
          },
        },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="bestsellers-title" className="px-gutter py-section">
      <div className="mb-12 grid gap-6 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <p className="eyebrow mb-6 text-muted">(07) — Neo Lash® Pro</p>
          <SplitReveal as="h2" id="bestsellers-title" className="text-display font-light tracking-[-0.04em]">
            Pro tools, <em className="italic-serif">loved</em> by artists
          </SplitReveal>
        </div>
        <Reveal className="md:col-span-4 md:col-start-9">
          <p className="text-muted">
            The tweezers, lashes and aftercare we trust in our own studio. Choose your products and order them directly on WhatsApp —
            we&apos;ll confirm delivery with you.
          </p>
        </Reveal>
      </div>

      {spotlight && (
        <div data-spotlight className="mb-[clamp(3rem,7vw,6rem)] grid items-center gap-8 overflow-hidden rounded-frame border border-line md:grid-cols-12">
          <GlStage stateRef={stage} className="aspect-square md:col-span-7 md:aspect-[5/4]">
            {/* Own tile: <main> is a stacking context, so multiply can't reach the canvas. */}
            <div className="absolute inset-0 bg-tile">
              <Image
                src={spotlight.images[0].src}
                alt={spotlight.images[0].alt}
                fill
                sizes="(max-width: 768px) 100vw, 55vw"
                className="blend-tile object-contain p-10"
              />
            </div>
          </GlStage>
          <div className="px-6 pb-10 md:col-span-5 md:px-0 md:pb-0 md:pr-[clamp(1.5rem,4vw,4rem)]">
            <p className="eyebrow mb-4 text-muted">Spotlight</p>
            <h3 className="font-display text-title">{spotlight.name}</h3>
            <p className="mt-4 max-w-md text-muted">{spotlight.short}</p>
            {spotlight.options?.[0] && (
              <ul className="mt-6 flex flex-wrap gap-2">
                {spotlight.options[0].values.map((v) => (
                  <li key={v} className="rounded-full border border-line px-3 py-1.5 text-xs">
                    {v}
                  </li>
                ))}
              </ul>
            )}
            <Price product={spotlight} className="mt-8 text-2xl" />
            <div className="mt-6 flex flex-wrap gap-3">
              <TransitionLink href={`/shop/${spotlight.slug}`} className="btn btn-solid" transitionTitle={spotlight.name}>
                <span className="inline-flex items-center gap-2">
                  Choose your profile <ArrowRight size={15} />
                </span>
              </TransitionLink>
              <WhatsAppBuy
                variant="ghost"
                label="Ask on WhatsApp"
                lines={[{ name: spotlight.name, quantity: 1, priceLabel: "profile & price to confirm", path: `/shop/${spotlight.slug}` }]}
              />
            </div>
          </div>
        </div>
      )}

      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div role="tablist" aria-label="Filter bestsellers" className="flex flex-wrap gap-x-7 gap-y-3">
          {categories.map((c) => (
            <button
              key={c.id}
              role="tab"
              type="button"
              aria-selected={filter === c.id}
              onClick={() => choose(c.id)}
              className={cn(
                "text-[clamp(1.5rem,2.6vw,2.4rem)] font-light tracking-[-0.03em] transition-colors duration-500",
                filter === c.id ? "text-ink" : "text-ink/50 hover:text-ink/75",
              )}
            >
              {c.label}
              <sup className="ml-1 text-[0.4em] align-super tabular-nums">{c.count}</sup>
            </button>
          ))}
        </div>
        <TransitionLink href="/shop" className="group inline-flex items-center gap-2 text-sm">
          <span className="link-u">Shop all products</span>
          <ArrowRight size={15} className="transition-transform duration-500 ease-luxe group-hover:translate-x-1" />
        </TransitionLink>
      </div>

      <div ref={grid} role="tabpanel" className="grid grid-cols-2 gap-x-[clamp(0.75rem,1.4vw,1.25rem)] gap-y-10 md:grid-cols-4">
        {visible.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </section>
  );
}
