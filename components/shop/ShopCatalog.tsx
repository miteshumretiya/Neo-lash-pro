"use client";

import { useId, useMemo, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { Flip } from "gsap/Flip";
import { ProductCard } from "@/components/shop/ProductCard";
import { Grid, List } from "@/components/ui/Icons";
import { categoryLabels } from "@/data/products";
import type { Product, ProductCategory } from "@/data/types";
import { useReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/cn";

gsap.registerPlugin(Flip);

const priceRanges = [
  { id: "all", label: "Any price", test: () => true },
  { id: "under-10", label: "Under €10", test: (p: Product) => p.price < 10 },
  { id: "10-25", label: "€10 – €25", test: (p: Product) => p.price >= 10 && p.price < 25 },
  { id: "25-up", label: "€25 & up", test: (p: Product) => p.price >= 25 },
] as const;

const sorts = {
  featured: { label: "Featured", compare: () => 0 },
  "price-asc": { label: "Price: low to high", compare: (a: Product, b: Product) => a.price - b.price },
  "price-desc": { label: "Price: high to low", compare: (a: Product, b: Product) => b.price - a.price },
  name: { label: "Name: A–Z", compare: (a: Product, b: Product) => a.name.localeCompare(b.name) },
} as const;

type CategoryFilter = ProductCategory | "all";
type PriceFilter = (typeof priceRanges)[number]["id"];
type SortKey = keyof typeof sorts;
type Layout = "grid" | "list";

/**
 * Shop grid with category tabs, price chips, sorting and a grid/list toggle.
 * Filtering and sorting re-flow the cards with GSAP Flip.
 */
export function ShopCatalog({ products }: { products: Product[] }) {
  const grid = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const layoutChanged = useRef(false);
  const reduced = useReducedMotion();
  const sortId = useId();
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [price, setPrice] = useState<PriceFilter>("all");
  const [sort, setSort] = useState<SortKey>("featured");
  const [layout, setLayout] = useState<Layout>("grid");

  const categories = useMemo(
    () =>
      (["all", ...new Set(products.map((p) => p.category))] as CategoryFilter[]).map((id) => ({
        id,
        label: id === "all" ? "All" : categoryLabels[id],
        count: id === "all" ? products.length : products.filter((p) => p.category === id).length,
      })),
    [products],
  );

  const visible = useMemo(() => {
    const range = priceRanges.find((r) => r.id === price) ?? priceRanges[0];
    return products
      .filter((p) => (category === "all" || p.category === category) && range.test(p))
      .sort(sorts[sort].compare);
  }, [products, category, price, sort]);

  // Capture card positions before React re-renders the grid.
  const update = (apply: () => void, isLayout = false) => {
    if (grid.current && !reduced) {
      flipState.current = Flip.getState(grid.current.querySelectorAll("[data-product-card]"));
      layoutChanged.current = isLayout;
    }
    apply();
  };

  useGSAP(
    () => {
      const el = grid.current;
      if (!el || !flipState.current) return;
      const cards = el.querySelectorAll("[data-product-card]");
      if (layoutChanged.current) {
        // Grid ↔ list changes each card's shape: a soft cascade reads better than a morph.
        gsap.fromTo(cards, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.035, ease: "luxe" });
      } else {
        Flip.from(flipState.current, {
          targets: cards,
          duration: 0.9,
          ease: "luxe",
          absolute: true,
          scale: true,
          stagger: 0.02,
          onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: "luxe" }),
          onLeave: (els) => gsap.to(els, { autoAlpha: 0, scale: 0.92, duration: 0.4 }),
        });
      }
      flipState.current = null;
    },
    { dependencies: [category, price, sort, layout], scope: grid },
  );

  const reset = () =>
    update(() => {
      setCategory("all");
      setPrice("all");
    });

  return (
    <section aria-labelledby="catalog-title" className="px-gutter pb-section">
      <h2 id="catalog-title" className="sr-only">
        Products
      </h2>
      <div className="mb-10 flex flex-col gap-8 border-t border-line pt-8">
        <div role="group" aria-label="Category" className="flex flex-wrap gap-x-7 gap-y-3">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={category === c.id}
              onClick={() => update(() => setCategory(c.id))}
              className={cn(
                "text-[clamp(1.6rem,3vw,2.8rem)] font-light tracking-[-0.03em] transition-colors duration-500",
                category === c.id ? "text-ink" : "text-ink/50 hover:text-ink/75",
              )}
            >
              {c.label}
              <sup className="ml-1 align-super text-[0.4em] tabular-nums">{c.count}</sup>
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div role="group" aria-label="Price" className="flex flex-wrap gap-2">
            {priceRanges.map((r) => (
              <button
                key={r.id}
                type="button"
                aria-pressed={price === r.id}
                onClick={() => update(() => setPrice(r.id))}
                className={cn(
                  "h-10 rounded-full border px-4 text-sm transition-colors duration-300",
                  price === r.id ? "border-ink bg-ink text-canvas" : "border-line hover:border-ink",
                )}
              >
                {r.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <label htmlFor={sortId} className="sr-only">
              Sort products
            </label>
            <div className="relative">
              <select
                id={sortId}
                value={sort}
                onChange={(e) => update(() => setSort(e.target.value as SortKey))}
                className="h-10 appearance-none rounded-full border border-line bg-transparent pl-4 pr-10 text-sm hover:border-ink focus-visible:border-ink"
              >
                {(Object.keys(sorts) as SortKey[]).map((key) => (
                  <option key={key} value={key}>
                    {sorts[key].label}
                  </option>
                ))}
              </select>
              <svg aria-hidden="true" viewBox="0 0 12 12" className="pointer-events-none absolute right-4 top-1/2 size-3 -translate-y-1/2">
                <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </div>
            <div role="group" aria-label="Layout" className="flex rounded-full border border-line p-1">
              {(["grid", "list"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  aria-pressed={layout === mode}
                  aria-label={mode === "grid" ? "Grid view" : "List view"}
                  onClick={() => layout !== mode && update(() => setLayout(mode), true)}
                  className={cn(
                    "grid size-8 place-items-center rounded-full transition-colors duration-300",
                    layout === mode ? "bg-ink text-canvas" : "text-muted hover:text-ink",
                  )}
                >
                  {mode === "grid" ? <Grid size={15} /> : <List size={15} />}
                </button>
              ))}
            </div>
          </div>
        </div>
        <p aria-live="polite" className="text-sm text-muted">
          {visible.length} {visible.length === 1 ? "product" : "products"}
        </p>
      </div>

      <div
        ref={grid}
        className={cn(
          layout === "grid"
            ? "grid grid-cols-2 gap-x-[clamp(0.75rem,1.4vw,1.25rem)] gap-y-12 md:grid-cols-3 xl:grid-cols-4"
            : "grid grid-cols-1 gap-y-6 lg:grid-cols-2 lg:gap-x-10",
        )}
      >
        {visible.map((product, i) => (
          <ProductCard
            key={product.slug}
            product={product}
            layout={layout}
            priority={i < 4}
            sizes={layout === "grid" ? "(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw" : "13rem"}
            className={layout === "list" ? "border-b border-line pb-6" : undefined}
          />
        ))}
      </div>

      {visible.length === 0 && (
        <div className="rounded-frame border border-dashed border-line px-6 py-16 text-center">
          <p className="font-display text-title">Nothing matches — yet.</p>
          <p className="mt-3 text-muted">Try another price range or category.</p>
          <button type="button" onClick={reset} className="btn btn-ghost mt-7">
            <span>Clear filters</span>
          </button>
        </div>
      )}
    </section>
  );
}
