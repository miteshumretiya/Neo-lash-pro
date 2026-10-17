import { MediaReveal } from "@/components/motion/MediaReveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowUpRight, MapPin, WhatsApp } from "@/components/ui/Icons";
import Image from "next/image";
import { photos } from "@/data/media";
import { site } from "@/lib/site";
import { whatsappUrl } from "@/lib/whatsapp";

/** Location block before the footer. */
export function Visit() {
  return (
    <section aria-labelledby="visit-title" className="px-gutter pb-8">
      <div className="grid gap-[clamp(1.5rem,3vw,3rem)] lg:grid-cols-12 lg:items-end">
        <MediaReveal parallax={8} className="aspect-[4/3] rounded-frame lg:col-span-7 lg:aspect-[16/10]">
          <Image src={photos.maltaWaterfront.src} alt={photos.maltaWaterfront.alt} fill sizes="(max-width: 1024px) 100vw, 58vw" className="object-cover" />
        </MediaReveal>
        <div className="lg:col-span-5">
          <p className="eyebrow mb-6 text-muted">(11) — Visit</p>
          <SplitReveal as="h2" id="visit-title" className="text-display font-light tracking-[-0.04em]">
            Find us in <em className="italic-serif">St. Julian&apos;s</em>
          </SplitReveal>
          <Reveal className="mt-8 space-y-6">
            <a href={site.mapUrl} target="_blank" rel="noopener noreferrer" className="group flex gap-3 text-lg">
              <MapPin size={20} className="mt-1 shrink-0 text-sage-ink" />
              <span className="link-u">
                {site.address.street}, {site.address.locality} {site.address.postalCode}, {site.address.country}
              </span>
            </a>
            <p className="max-w-md text-muted">
              Treatments are by appointment — choose your time on Fresha. For products and courses, message us on WhatsApp and we&apos;ll
              take care of the rest.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href={site.booking} target="_blank" rel="noopener noreferrer" className="btn btn-solid" data-cursor="Book">
                <span className="inline-flex items-center gap-2">
                  Book on Fresha <ArrowUpRight size={15} />
                </span>
              </a>
              <a href={whatsappUrl("Hi Neo Lash!")} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                <span className="inline-flex items-center gap-2">
                  <WhatsApp size={16} /> {site.whatsapp.display}
                </span>
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
