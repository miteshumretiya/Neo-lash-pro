import { discountPercent, formatPrice } from "@/lib/format";
import type { Product } from "@/data/types";
import { cn } from "@/lib/cn";

export function Price({ product, className }: { product: Pick<Product, "price" | "priceMax" | "regularPrice">; className?: string }) {
  const { price, priceMax, regularPrice } = product;
  return (
    <span className={cn("inline-flex items-baseline gap-2 tabular-nums", className)}>
      {regularPrice && (
        <s className="text-[0.85em] text-muted decoration-1">
          <span className="sr-only">Was </span>
          {formatPrice(regularPrice)}
        </s>
      )}
      <span>
        {regularPrice && <span className="sr-only">Now </span>}
        {priceMax ? `${formatPrice(price)} – ${formatPrice(priceMax)}` : formatPrice(price)}
      </span>
    </span>
  );
}

export function SaleBadge({ product, className }: { product: Pick<Product, "price" | "regularPrice">; className?: string }) {
  if (!product.regularPrice) return null;
  return (
    <span className={cn("rounded-full bg-blush px-3 py-1 text-[0.72rem] font-medium tracking-wide text-night", className)}>
      −{discountPercent(product.regularPrice, product.price)}%
    </span>
  );
}
