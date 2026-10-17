"use client";

import { ViewTransition } from "react";
import Image from "next/image";
import { GlImage } from "@/components/gl/GlImage";
import { useExperience } from "@/lib/store/experience";
import { categoryLabels } from "@/data/products";
import type { Product } from "@/data/types";
import { Eye, Plus } from "@/components/ui/Icons";
import { Price, SaleBadge } from "./Price";
import { ProductLink } from "./ProductLink";
import { WishlistButton } from "./WishlistButton";
import { WhatsAppBuy } from "./WhatsAppBuy";
import { cn } from "@/lib/cn";

type ProductCardProps = {
  product: Product;
  sizes?: string;
  priority?: boolean;
  className?: string;
  layout?: "grid" | "list";
};

/**
 * Product tile: WebGL ripple image (or CSS crossfade to the second shot),
 * sale badge, wishlist heart, and quick actions that slide up on hover.
 */
export function ProductCard({ product, sizes = "(max-width: 768px) 50vw, 25vw", priority, className, layout = "grid" }: ProductCardProps) {
  const setQuickView = useExperience((s) => s.setQuickView);
  const href = `/shop/${product.slug}`;
  const [cover, second] = product.images;
  const simple = !product.options?.length;

  return (
    <article
      data-product-card
      data-flip-id={product.slug}
      className={cn(
        "group/card relative",
        layout === "list" && "grid grid-cols-[minmax(0,9rem)_1fr] items-center gap-5 sm:grid-cols-[minmax(0,13rem)_1fr]",
        className,
      )}
    >
      <div className="relative">
        <ProductLink href={href} aria-label={product.name} className="block">
          <ViewTransition name={`product-${product.slug}`} share="morph" default="none">
            <GlImage
              image={cover}
              sizes={sizes}
              priority={priority}
              tile="#ebe5db"
              radius={22}
              cursor="View"
              className="aspect-[4/5] w-full"
            >
              {second && (
                <Image
                  src={second.src}
                  alt=""
                  fill
                  sizes={sizes}
                  className="blend-tile object-cover opacity-0 transition-opacity duration-700 ease-luxe group-hover/card:opacity-100 group-data-[gl=on]/gl:hidden"
                />
              )}
            </GlImage>
          </ViewTransition>
        </ProductLink>

        <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between">
          <SaleBadge product={product} />
          <WishlistButton slug={product.slug} name={product.name} className="pointer-events-auto ml-auto" />
        </div>

        {layout === "grid" && (
          <div className="absolute inset-x-3 bottom-3 flex translate-y-3 gap-2 opacity-0 transition-[opacity,transform] duration-500 ease-luxe group-focus-within/card:translate-y-0 group-focus-within/card:opacity-100 group-hover/card:translate-y-0 group-hover/card:opacity-100 max-md:hidden">
            <button
              type="button"
              onClick={() => setQuickView(product)}
              className="btn btn-sm flex-1 bg-surface/90 text-ink backdrop-blur hover:bg-surface"
            >
              <span className="inline-flex items-center gap-2">
                <Eye size={15} /> Quick view
              </span>
            </button>
            {simple && (
              <WhatsAppBuy
                size="sm"
                label="Order"
                lines={[{ name: product.name, quantity: 1, unitPrice: product.price, path: href }]}
                className="flex-1"
              />
            )}
          </div>
        )}
      </div>

      <div className={cn("flex items-start justify-between gap-3", layout === "grid" ? "mt-4" : "")}>
        <div className="min-w-0">
          <p className="eyebrow mb-1.5 text-muted">{categoryLabels[product.category]}</p>
          <h3 className="text-[1.02rem] font-medium leading-snug tracking-tight">
            <ProductLink href={href} className="link-u">
              {product.name}
            </ProductLink>
          </h3>
          {product.detail && <p className="mt-1 text-sm text-muted">{product.detail}</p>}
          {layout === "list" && <p className="mt-3 max-w-md text-sm text-muted">{product.short}</p>}
          <Price product={product} className="mt-2 text-[0.95rem]" />
        </div>
        <button
          type="button"
          onClick={() => setQuickView(product)}
          aria-label={`Quick view ${product.name}`}
          className="icon-btn size-10 shrink-0 md:hidden"
        >
          <Plus size={16} />
        </button>
      </div>
    </article>
  );
}
