import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/ui/PageHero";
import { CtaBand } from "@/components/ui/CtaBand";
import { MediaReveal } from "@/components/motion/MediaReveal";
import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { ScrubWords } from "@/components/motion/ScrubWords";
import { Counter } from "@/components/motion/Counter";
import { Marquee } from "@/components/motion/Marquee";
import { TransitionLink } from "@/components/motion/Transition";
import { ArrowRight, ArrowUpRight, WhatsApp } from "@/components/ui/Icons";
import { JsonLd } from "@/components/seo/JsonLd";
import { photos } from "@/data/media";
import { founderStory } from "@/data/studio";
import type { ImageRef } from "@/data/types";
import { breadcrumbJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";
import { whatsappUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "About — Daniela & the Studio",
  description:
    "Neo Lash® is Daniela Ionel's lash and brow studio in St. Julian's, Malta — home to signature treatments, the Neo Lash® Pro product line, the Academy and the Lash & Brow Summit.",
  alternates: { canonical: "/about" },
};

type World = { title: string; text: string; href: string; external?: boolean; image: ImageRef };

const worlds: World[] = [
  { title: "The Salon", text: "Lash and brow treatments mapped to your features.", href: site.booking, external: true, image: photos.workBrow },
  { title: "Neo Lash® Pro", text: "The tools and lashes we use, ordered on WhatsApp.", href: "/shop", image: photos.tweezersHand },
  { title: "The Academy", text: "Certified courses from beginner to masterclass.", href: "/courses", image: photos.applicationClose },
  { title: "The Summit", text: "Malta's international lash & brow event.", href: site.summitUrl, external: true, image: photos.summitAudience },
];

const gallery = [photos.workNatural, photos.workVolume, photos.workSoft, photos.workHybrid, photos.workWispy, photos.workLift, photos.workDense];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="(About) — The studio"
        title={
          <>
            A studio built on <em className="italic-serif">detail</em>
          </>
        }
        intro="Neo Lash® is Daniela's lash and brow studio in St. Julian's, Malta — home to our signature treatments, the Neo Lash® Pro product line and the Academy."
      />

      <section className="px-gutter pb-section">
        <MediaReveal parallax={10} className="aspect-[4/5] rounded-frame sm:aspect-[16/9] lg:aspect-[2.2/1]">
          <Image src={photos.salon.src} alt={photos.salon.alt} fill priority sizes="100vw" className="object-cover" />
        </MediaReveal>
      </section>

      <section aria-labelledby="daniela-title" className="grid items-center gap-12 px-gutter pb-section lg:grid-cols-12">
        <div className="mx-auto w-full max-w-[28rem] lg:col-span-5 lg:max-w-none">
          <MediaReveal className="arch aspect-[4/5]">
            <Image
              src={photos.danielaPortrait.src}
              alt={photos.danielaPortrait.alt}
              fill
              sizes="(max-width: 1024px) 28rem, 40vw"
              className="object-cover object-[50%_25%]"
            />
          </MediaReveal>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <p className="eyebrow mb-6 text-muted">Founder &amp; CEO</p>
          <SplitReveal as="h2" id="daniela-title" className="text-display font-light tracking-[-0.04em]">
            Meet <em className="italic-serif">Daniela</em>
          </SplitReveal>
          <Reveal stagger={0.12} className="mt-10 space-y-6 text-lead">
            {founderStory.map((paragraph) => (
              <p key={paragraph.slice(0, 20)}>{paragraph}</p>
            ))}
          </Reveal>
          <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-line pt-8 sm:grid-cols-4">
            {[
              { label: "In the industry since", value: <Counter value={2015} from={1990} duration={2.6} /> },
              { label: "Years of experience", value: <Counter value={10} suffix="+" /> },
              { label: "International lash championships", value: <span className="italic">Judge</span> },
              { label: "Lash & Brow Summit", value: <span className="italic">Founder</span> },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse gap-2">
                <dt className="text-sm leading-snug text-muted">{stat.label}</dt>
                <dd className="font-display text-[clamp(2.4rem,3.6vw,3.4rem)] leading-none">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-label="Our motto" className="px-gutter pb-section">
        <div className="mx-auto max-w-6xl border-y border-line py-[clamp(4rem,9vw,8rem)] text-center">
          <p className="eyebrow mb-10 text-muted">Written in neon on our studio wall</p>
          <ScrubWords className="font-display text-[clamp(2.4rem,6.2vw,6.4rem)] leading-[1] tracking-[-0.02em]">
            “Give your eyes the look they deserve.”
          </ScrubWords>
        </div>
      </section>

      <section aria-labelledby="worlds-title" className="px-gutter pb-section">
        <div className="mb-12 max-w-3xl">
          <p className="eyebrow mb-6 text-muted">One studio, four worlds</p>
          <SplitReveal as="h2" id="worlds-title" className="text-display font-light tracking-[-0.04em]">
            Everything <em className="italic-serif">Neo Lash®</em>
          </SplitReveal>
        </div>
        <Reveal stagger={0.08} className="grid gap-[clamp(0.75rem,1.4vw,1.25rem)] sm:grid-cols-2 lg:grid-cols-4">
          {worlds.map((world) => {
            const body = (
              <>
                <span className="relative block aspect-[4/5] overflow-hidden rounded-card">
                  <Image
                    src={world.image.src}
                    alt={world.image.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-[1.4s] ease-luxe group-hover:scale-105"
                  />
                </span>
                <span className="mt-5 flex items-start justify-between gap-4">
                  <span>
                    <span className="block font-display text-[1.9rem] leading-tight">{world.title}</span>
                    <span className="mt-1 block text-sm text-muted">{world.text}</span>
                  </span>
                  <span className="mt-1 grid size-10 shrink-0 place-items-center rounded-full border border-line transition-colors duration-500 group-hover:bg-ink group-hover:text-canvas">
                    {world.external ? <ArrowUpRight size={15} /> : <ArrowRight size={15} />}
                  </span>
                </span>
              </>
            );
            return world.external ? (
              <a key={world.title} href={world.href} target="_blank" rel="noopener noreferrer" className="group block" data-cursor="Visit">
                {body}
              </a>
            ) : (
              <TransitionLink key={world.title} href={world.href} className="group block" data-cursor="Explore">
                {body}
              </TransitionLink>
            );
          })}
        </Reveal>
      </section>

      <section aria-label="Our work" className="pb-section">
        <Marquee speed={40} velocityFactor={1.1}>
          {gallery.map((image) => (
            <span key={image.src} className="relative mr-[clamp(0.75rem,1.4vw,1.25rem)] block aspect-[4/5] w-[clamp(13rem,22vw,20rem)] shrink-0 overflow-hidden rounded-card">
              <Image src={image.src} alt={image.alt} fill sizes="20rem" className="object-cover" />
            </span>
          ))}
        </Marquee>
      </section>

      <CtaBand
        eyebrow="Visit us"
        title={
          <>
            Come and see us in <em className="italic-serif">St. Julian&apos;s</em>
          </>
        }
        text={`${site.address.street}, ${site.address.locality} ${site.address.postalCode}. Treatments are by appointment — choose your time on Fresha.`}
      >
        <a href={site.booking} target="_blank" rel="noopener noreferrer" className="btn bg-night text-cream hover:bg-black" data-cursor="Book">
          <span className="inline-flex items-center gap-2">
            Book on Fresha <ArrowUpRight size={15} />
          </span>
        </a>
        <a href={whatsappUrl("Hi Neo Lash!")} target="_blank" rel="noopener noreferrer" className="btn border border-night/25 text-night hover:bg-night/10">
          <span className="inline-flex items-center gap-2">
            <WhatsApp size={16} /> WhatsApp
          </span>
        </a>
      </CtaBand>

      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
    </>
  );
}
