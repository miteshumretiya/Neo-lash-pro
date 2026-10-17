import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/ui/PageHero";
import { MediaReveal } from "@/components/motion/MediaReveal";
import { Reveal } from "@/components/motion/Reveal";
import { ContactForm } from "@/components/contact/ContactForm";
import { ArrowUpRight, Instagram, MapPin, WhatsApp } from "@/components/ui/Icons";
import { JsonLd } from "@/components/seo/JsonLd";
import { photos } from "@/data/media";
import { breadcrumbJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";
import { whatsappUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contact — Visit Us in St. Julian's",
  description: `Message Neo Lash® on WhatsApp (${site.whatsapp.display}), book on Fresha or visit the studio at ${site.address.street}, ${site.address.locality}, Malta.`,
  alternates: { canonical: "/contact" },
};

const channels = [
  {
    label: "WhatsApp",
    value: site.whatsapp.display,
    note: "Orders, courses and questions",
    href: whatsappUrl("Hi Neo Lash!"),
    icon: <WhatsApp size={18} />,
  },
  {
    label: "Bookings",
    value: "Fresha",
    note: "Live availability for every treatment",
    href: site.booking,
    icon: <ArrowUpRight size={18} />,
  },
  {
    label: "Instagram",
    value: site.instagram.handle,
    note: "Our latest work",
    href: site.instagram.url,
    icon: <Instagram size={18} />,
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="(Contact) — Say hello"
        title={
          <>
            Let&apos;s talk <em className="italic-serif">lashes</em>
          </>
        }
        intro="Questions about a treatment, an order or a course? Write to us below or message us directly — we usually reply on WhatsApp."
      />

      <section className="grid gap-[clamp(3rem,6vw,6rem)] px-gutter pb-section lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Reveal>
            <ContactForm />
          </Reveal>
        </div>

        <Reveal as="ul" stagger={0.08} className="space-y-3 lg:col-span-4 lg:col-start-9">
          {channels.map((c) => (
            <li key={c.label}>
              <a
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-4 rounded-frame bg-surface p-5 transition-colors duration-500 hover:bg-tile"
              >
                <span>
                  <span className="eyebrow block text-muted">{c.label}</span>
                  <span className="mt-2 block font-display text-[1.75rem] leading-none">{c.value}</span>
                  <span className="mt-2 block text-sm text-muted">{c.note}</span>
                </span>
                <span className="grid size-11 shrink-0 place-items-center rounded-full border border-line transition-colors duration-500 group-hover:bg-ink group-hover:text-canvas">
                  {c.icon}
                </span>
              </a>
            </li>
          ))}
        </Reveal>
      </section>

      <section aria-labelledby="find-us" className="px-gutter pb-section">
        <div className="relative overflow-hidden rounded-frame">
          <MediaReveal parallax={8} className="aspect-[4/5] sm:aspect-[16/9] lg:aspect-[2.4/1]">
            <Image src={photos.maltaAerial.src} alt={photos.maltaAerial.alt} fill sizes="100vw" className="object-cover" />
          </MediaReveal>
          <div className="absolute inset-0 bg-gradient-to-t from-night/75 via-night/20 to-transparent" aria-hidden="true" />
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-6 p-[clamp(1.25rem,4vw,3.5rem)] text-cream md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow mb-4 text-cream/70">The studio</p>
              <h2 id="find-us" className="font-display text-[clamp(2.2rem,5vw,4.8rem)] leading-[0.95]">
                {site.address.street}
                <br />
                {site.address.locality} {site.address.postalCode}
              </h2>
            </div>
            <a href={site.mapUrl} target="_blank" rel="noopener noreferrer" className="btn btn-light self-start md:self-auto" data-cursor="Map">
              <span className="inline-flex items-center gap-2">
                <MapPin size={16} /> Open in Google Maps
              </span>
            </a>
          </div>
        </div>
        <p className="mt-6 text-sm text-muted">
          Treatments are by appointment only — please book on Fresha before visiting.
        </p>
      </section>

      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
    </>
  );
}
