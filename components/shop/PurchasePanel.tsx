"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Product } from "@/data/types";
import { Minus, Plus } from "@/components/ui/Icons";
import { Price } from "./Price";
import { WhatsAppBuy } from "./WhatsAppBuy";
import { useMounted } from "@/lib/hooks";
import { cn } from "@/lib/cn";

/**
 * Option pills, quantity and the WhatsApp order button. There is no cart and
 * no online payment: the order is confirmed in the WhatsApp conversation.
 */
export function PurchasePanel({ product, compact = false, sticky = false }: { product: Product; compact?: boolean; sticky?: boolean }) {
  const [selected, setSelected] = useState<Record<string, string>>(() =>
    Object.fromEntries((product.options ?? []).map((o) => [o.name, o.values[0]])),
  );
  const [quantity, setQuantity] = useState(1);
  const groupId = useId();
  const options = product.options ?? [];
  const optionLabels = options.map((o) => `${o.name}: ${selected[o.name]}`);
  const unitPrice = product.priceMax ? undefined : product.price;
  const lines = [
    {
      name: product.name,
      options: optionLabels,
      quantity,
      unitPrice,
      priceLabel: product.priceMax ? "price to confirm" : undefined,
      path: `/shop/${product.slug}`,
    },
  ];

  // Mobile buy bar: shown once the main order button has scrolled away.
  const actions = useRef<HTMLDivElement>(null);
  const [showBar, setShowBar] = useState(false);
  const mounted = useMounted();
  useEffect(() => {
    const el = actions.current;
    if (!sticky || !el) return;
    const io = new IntersectionObserver(([entry]) => setShowBar(!entry.isIntersecting && entry.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, [sticky]);

  return (
    <div className="space-y-7">
      <Price product={product} className={cn("text-2xl", compact && "text-xl")} />

      {options.map((option) => (
        <fieldset key={option.name}>
          <legend className="eyebrow mb-3 text-muted">
            {option.name} <span className="ml-2 normal-case tracking-normal text-ink">{selected[option.name]}</span>
          </legend>
          <div role="radiogroup" aria-label={option.name} className="flex flex-wrap gap-2">
            {option.values.map((value) => {
              const checked = selected[option.name] === value;
              return (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={checked}
                  onClick={() => setSelected((s) => ({ ...s, [option.name]: value }))}
                  className={cn(
                    "h-10 rounded-full border px-4 text-sm transition-colors duration-300",
                    checked ? "border-ink bg-ink text-canvas" : "border-line hover:border-ink",
                  )}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}

      <div ref={actions} className="flex flex-wrap items-center gap-3">
        <div className="flex h-[3.25rem] items-center rounded-full border border-line" role="group" aria-labelledby={`${groupId}-qty`}>
          <span id={`${groupId}-qty`} className="sr-only">
            Quantity
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
            className="grid size-12 place-items-center rounded-full hover:bg-tile"
          >
            <Minus size={16} />
          </button>
          <output aria-live="polite" className="w-8 text-center tabular-nums">
            {quantity}
          </output>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(99, q + 1))}
            aria-label="Increase quantity"
            className="grid size-12 place-items-center rounded-full hover:bg-tile"
          >
            <Plus size={16} />
          </button>
        </div>
        <WhatsAppBuy className="flex-1" lines={lines} />
      </div>

      <p className="text-sm leading-relaxed text-muted">
        No checkout, no card details. Tap the button to send your order on WhatsApp ({product.priceMax ? "we'll confirm the price of your profile, " : ""}availability, delivery and payment) to{" "}
        <span className="whitespace-nowrap text-ink">+356 7777 2951</span>.
      </p>

      {sticky &&
        mounted &&
        createPortal(
          <div
            aria-hidden={!showBar}
            inert={!showBar}
            className={cn(
              "fixed inset-x-0 bottom-0 z-[46] flex items-center gap-3 border-t border-line bg-canvas/85 px-gutter pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl transition-transform duration-700 ease-luxe md:hidden",
              showBar ? "translate-y-0" : "translate-y-full",
            )}
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{product.name}</p>
              <p className="truncate text-xs text-muted">
                {options.map((o) => selected[o.name]).join(" · ")}
                {options.length ? " · " : ""}× {quantity}
              </p>
            </div>
            <WhatsAppBuy size="sm" label="Buy" lines={lines} />
          </div>,
          document.body,
        )}
    </div>
  );
}
