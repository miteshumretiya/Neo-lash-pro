"use client";

import { useSyncExternalStore } from "react";
import { useWishlist } from "@/lib/store/wishlist";
import { ProductCard } from "@/components/shop/ProductCard";
import { WhatsAppBuy } from "@/components/shop/WhatsAppBuy";
import { TransitionLink } from "@/components/motion/Transition";
import { ArrowRight, Heart } from "@/components/ui/Icons";
import type { Product } from "@/data/types";

const subscribeHydration = (cb: () => void) => useWishlist.persist.onFinishHydration(cb);

/** Saved products, read from localStorage once the wishlist store has rehydrated. */
export function WishlistView({ products }: { products: Product[] }) {
  const hydrated = useSyncExternalStore(subscribeHydration, () => useWishlist.persist.hasHydrated(), () => false);
  const slugs = useWishlist((s) => s.slugs);
  const clear = useWishlist((s) => s.clear);
  const saved = slugs.map((slug) => products.find((p) => p.slug === slug)).filter((p): p is Product => Boolean(p));

  if (!hydrated) {
    return <div className="min-h-[40vh] px-gutter pb-section" aria-busy="true" />;
  }

  if (saved.length === 0) {
    return (
      <section className="px-gutter pb-section">
        <div className="frame flex flex-col items-center bg-surface px-6 py-[clamp(4rem,10vw,8rem)] text-center">
          <span className="grid size-16 place-items-center rounded-full bg-blush/40 text-[#b45d4c]">
            <Heart size={26} />
          </span>
          <p className="mt-8 font-display text-title">Nothing saved yet</p>
          <p className="mt-3 max-w-sm text-muted">
            Tap the heart on any product to keep it here — then send your whole list to us on WhatsApp in one message.
          </p>
          <TransitionLink href="/shop" className="btn btn-solid mt-9">
            <span className="inline-flex items-center gap-2">
              Browse the shop <ArrowRight size={15} />
            </span>
          </TransitionLink>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="saved-title" className="px-gutter pb-section">
      <h2 id="saved-title" className="sr-only">
        Saved products
      </h2>
      <div className="mb-12 flex flex-col gap-6 border-y border-line py-6 md:flex-row md:items-center md:justify-between">
        <p className="text-muted">
          <span className="text-ink">{saved.length}</span> saved {saved.length === 1 ? "product" : "products"} — order them together in one
          message.
        </p>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={clear} className="btn btn-ghost btn-sm">
            <span>Clear list</span>
          </button>
          <WhatsAppBuy
            size="sm"
            label="Send list on WhatsApp"
            lines={saved.map((p) => ({
              name: p.name,
              quantity: 1,
              unitPrice: p.priceMax ? undefined : p.price,
              priceLabel: p.priceMax ? "option & price to confirm" : undefined,
              path: `/shop/${p.slug}`,
            }))}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-[clamp(0.75rem,1.4vw,1.25rem)] gap-y-12 md:grid-cols-3 xl:grid-cols-4">
        {saved.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </section>
  );
}
