"use client";

import { useId, useState } from "react";
import type { Product } from "@/data/types";
import { Minus, Plus } from "@/components/ui/Icons";
import { Price } from "./Price";
import { WhatsAppBuy } from "./WhatsAppBuy";
import { cn } from "@/lib/cn";

/**
 * Option pills, quantity and the WhatsApp order button. There is no cart and
 * no online payment: the order is confirmed in the WhatsApp conversation.
 */
export function PurchasePanel({ product, compact = false }: { product: Product; compact?: boolean }) {
  const [selected, setSelected] = useState<Record<string, string>>(() =>
    Object.fromEntries((product.options ?? []).map((o) => [o.name, o.values[0]])),
  );
  const [quantity, setQuantity] = useState(1);
  const groupId = useId();
  const options = product.options ?? [];
  const optionLabels = options.map((o) => `${o.name}: ${selected[o.name]}`);
  const unitPrice = product.priceMax ? undefined : product.price;

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

      <div className="flex flex-wrap items-center gap-3">
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
        <WhatsAppBuy
          className="flex-1"
          lines={[
            {
              name: product.name,
              options: optionLabels,
              quantity,
              unitPrice,
              priceLabel: product.priceMax ? "price to confirm" : undefined,
              path: `/shop/${product.slug}`,
            },
          ]}
        />
      </div>

      <p className="text-sm leading-relaxed text-muted">
        No checkout, no card details. Tap the button to send your order on WhatsApp ({product.priceMax ? "we'll confirm the price of your profile, " : ""}availability, delivery and payment) to{" "}
        <span className="whitespace-nowrap text-ink">+356 7777 2951</span>.
      </p>
    </div>
  );
}
