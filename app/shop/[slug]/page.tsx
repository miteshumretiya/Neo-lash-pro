import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Accordion } from "@/components/ui/Accordion";
import { Check } from "@/components/ui/Icons";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal } from "@/components/motion/Reveal";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { PurchasePanel } from "@/components/shop/PurchasePanel";
import { ProductCard } from "@/components/shop/ProductCard";
import { SaleBadge } from "@/components/shop/Price";
import { WishlistButton } from "@/components/shop/WishlistButton";
import { JsonLd } from "@/components/seo/JsonLd";
import { TransitionLink } from "@/components/motion/Transition";
import { categoryLabels } from "@/data/products";
import { productRepository } from "@/data/repository";
import { breadcrumbJsonLd, productJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";

export async function generateStaticParams() {
  const products = await productRepository.list();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: PageProps<"/shop/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await productRepository.get(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: `${product.short} Order on WhatsApp from Neo Lash® Pro, Malta.`,
    alternates: { canonical: `/shop/${product.slug}` },
    openGraph: {
      title: `${product.name} · Neo Lash® Pro`,
      description: product.short,
      images: [{ url: product.images[0].src, alt: product.images[0].alt }],
    },
  };
}

export default async function ProductPage({ params }: PageProps<"/shop/[slug]">) {
  const { slug } = await params;
  const product = await productRepository.get(slug);
  if (!product) notFound();
  const related = await productRepository.related(slug, 4);
  const category = categoryLabels[product.category];

  return (
    <>
      <section className="px-gutter pb-section pt-[calc(var(--header-h)+clamp(1.5rem,4vw,3rem))]">
        <Reveal immediate y={12}>
          <Breadcrumbs
            className="mb-8"
            items={[{ label: "Shop", href: "/shop" }, { label: category, href: "/shop" }, { label: product.name }]}
          />
        </Reveal>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+1rem)]">
              <ProductGallery product={product} />
            </div>
          </div>

          <div className="lg:col-span-5 lg:pt-4">
            <div className="flex items-center justify-between gap-4">
              <p className="eyebrow text-muted">
                {category}
                {product.detail && <span className="normal-case tracking-normal"> · {product.detail}</span>}
              </p>
              <div className="flex items-center gap-2">
                <SaleBadge product={product} />
                <WishlistButton slug={product.slug} name={product.name} className="border border-line" />
              </div>
            </div>
            <SplitReveal as="h1" type="chars" immediate className="mt-5 text-[clamp(2.6rem,5vw,4.6rem)] font-light leading-[0.95] tracking-[-0.04em]">
              {product.name}
            </SplitReveal>
            <Reveal immediate delay={0.2}>
              <p className="mt-6 text-lead text-muted">{product.short}</p>
              <div className="mt-10">
                <PurchasePanel product={product} sticky />
              </div>

              {product.highlights && (
                <ul className="mt-10 grid gap-3 sm:grid-cols-2">
                  {product.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-3 text-sm">
                      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-sage/30 text-sage-ink">
                        <Check size={14} />
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>
              )}

              <Accordion
                className="mt-12"
                headingLevel={2}
                defaultOpen={0}
                items={[
                  {
                    title: "Description",
                    content: (
                      <div className="space-y-4">
                        {product.description.map((p) => (
                          <p key={p.slice(0, 24)}>{p}</p>
                        ))}
                      </div>
                    ),
                  },
                  {
                    title: "How ordering works",
                    content: (
                      <ol className="list-decimal space-y-2 pl-5">
                        <li>Choose your options and quantity above.</li>
                        <li>Tap “Buy on WhatsApp” — your order is written for you in the chat to {site.whatsapp.display}.</li>
                        <li>We confirm availability, delivery and payment with you directly.</li>
                      </ol>
                    ),
                  },
                  {
                    title: "Delivery & returns",
                    content: (
                      <p>
                        Orders ship from our studio in Malta. Delivery options and costs are confirmed with you on WhatsApp before you pay.
                        Not happy with your order? Let us know within 14 days of delivery — see our{" "}
                        <TransitionLink href="/returns" className="link-u text-ink">
                          returns policy
                        </TransitionLink>
                        .
                      </p>
                    ),
                  },
                ]}
              />
            </Reveal>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="px-gutter pb-section">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6 border-t border-line pt-10">
            <SplitReveal as="h2" id="related-title" className="text-display font-light tracking-[-0.04em]">
              You may <em className="italic-serif">also</em> like
            </SplitReveal>
          </div>
          <div className="grid grid-cols-2 gap-x-[clamp(0.75rem,1.4vw,1.25rem)] gap-y-12 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}

      <JsonLd data={productJsonLd(product)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Shop", path: "/shop" },
          { name: product.name, path: `/shop/${product.slug}` },
        ])}
      />
    </>
  );
}
