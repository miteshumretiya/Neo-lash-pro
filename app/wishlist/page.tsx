import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { WishlistView } from "@/components/shop/WishlistView";
import { productRepository } from "@/data/repository";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Your saved Neo Lash® Pro products — send the whole list to us on WhatsApp in one message.",
  alternates: { canonical: "/wishlist" },
  robots: { index: false, follow: true },
};

export default async function WishlistPage() {
  const products = await productRepository.list();

  return (
    <>
      <PageHero
        eyebrow="(Wishlist) — Saved for later"
        title={
          <>
            Your <em className="italic-serif">favourites</em>
          </>
        }
        intro="Saved on this device only — no account needed."
      />
      <WishlistView products={products} />
    </>
  );
}
