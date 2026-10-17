import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { ShopCatalog } from "@/components/shop/ShopCatalog";
import { OrderSteps } from "@/components/shop/OrderSteps";
import { JsonLd } from "@/components/seo/JsonLd";
import { productRepository } from "@/data/repository";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Shop — Pro Lash Tweezers, Lashes & Aftercare",
  description:
    "Neo Lash® Pro tweezers, Black Diamond lashes, lash shampoo and accessories used in our Malta studio. Order directly on WhatsApp.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage() {
  const products = await productRepository.list();

  return (
    <>
      <PageHero
        eyebrow="(Shop) — Neo Lash® Pro"
        title={
          <>
            The <em className="italic-serif">pro</em> edit
          </>
        }
        intro="Tweezers, lashes and aftercare we trust in our own studio. Choose what you need and order it directly on WhatsApp — no account, no checkout."
      />
      <ShopCatalog products={products} />
      <OrderSteps />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Shop", path: "/shop" },
        ])}
      />
    </>
  );
}
