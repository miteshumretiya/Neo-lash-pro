import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { Accordion } from "@/components/ui/Accordion";
import { CtaBand } from "@/components/ui/CtaBand";
import { MediaReveal } from "@/components/motion/MediaReveal";
import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { TransitionLink } from "@/components/motion/Transition";
import { CertificationPath } from "@/components/academy/CertificationPath";
import { CertificateCard } from "@/components/academy/CertificateCard";
import { ArrowRight, Check, WhatsApp } from "@/components/ui/Icons";
import { JsonLd } from "@/components/seo/JsonLd";
import { academyFaq, courses } from "@/data/courses";
import { photos } from "@/data/media";
import { breadcrumbJsonLd, courseJsonLd } from "@/lib/seo";
import { whatsappUrl } from "@/lib/whatsapp";
import { pad } from "@/lib/format";

export function generateStaticParams() {
  return courses.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({ params }: PageProps<"/courses/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const course = courses.find((c) => c.slug === slug);
  if (!course) return {};
  return {
    title: `${course.name} — Eyelash Extension Training`,
    description: `${course.summary} ${course.duration} at the Neo Lash® Academy in St. Julian's, Malta.`,
    alternates: { canonical: `/courses/${course.slug}` },
    openGraph: { images: [{ url: course.image.src, alt: course.image.alt }] },
  };
}

export default async function CoursePage({ params }: PageProps<"/courses/[slug]">) {
  const { slug } = await params;
  const course = courses.find((c) => c.slug === slug);
  if (!course) notFound();
  const others = courses.filter((c) => c.slug !== slug);
  const enrol = whatsappUrl(`Hi Neo Lash! I'd like to enrol in the ${course.name}. Could you send me the next dates and the price?`);
  const topicCount = course.curriculum.reduce((sum, m) => sum + m.topics.length, 0);
  const facts = [
    { label: "Level", value: course.level },
    { label: "Duration", value: course.duration },
    { label: "Format", value: course.format },
    { label: "Price", value: course.priceLabel },
  ];

  return (
    <>
      <PageHero
        crumbs={[{ label: "Academy", href: "/courses" }, { label: course.name }]}
        eyebrow={`(Academy) — ${course.level}`}
        title={course.name}
        intro={course.summary}
      >
        <a href={enrol} target="_blank" rel="noopener noreferrer" className="btn bg-whatsapp text-white hover:bg-[#17703c]" data-cursor="Enrol">
          <span className="inline-flex items-center gap-2">
            <WhatsApp size={17} /> Enrol on WhatsApp
          </span>
        </a>
      </PageHero>

      <section className="px-gutter pb-section">
        <MediaReveal parallax={8} className="aspect-[4/5] rounded-frame sm:aspect-[16/9] lg:aspect-[21/9]">
          <Image src={course.image.src} alt={course.image.alt} fill priority sizes="100vw" className="object-cover" />
        </MediaReveal>
        <Reveal as="dl" stagger={0.08} className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
          {facts.map((fact) => (
            <div key={fact.label} className="border-t border-line pt-4">
              <dt className="eyebrow text-muted">{fact.label}</dt>
              <dd className="mt-2 text-lg">{fact.value}</dd>
            </div>
          ))}
        </Reveal>
      </section>

      <section aria-labelledby="about-course" className="grid gap-10 px-gutter pb-section lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="eyebrow mb-6 text-muted">About the course</p>
          <SplitReveal as="h2" id="about-course" className="text-title font-light">
            What you&apos;ll <em className="italic-serif">master</em>
          </SplitReveal>
        </div>
        <Reveal className="space-y-5 text-lead lg:col-span-7 lg:col-start-6">
          {course.intro.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
          <p className="border-l-2 border-sage pl-5 text-base text-muted">
            <span className="text-ink">Who it&apos;s for — </span>
            {course.audience}
          </p>
        </Reveal>
      </section>

      <section aria-labelledby="curriculum-title" className="grid gap-10 px-gutter pb-section lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="eyebrow mb-6 text-muted">Curriculum · {topicCount} topics</p>
          <SplitReveal as="h2" id="curriculum-title" className="text-display font-light tracking-[-0.04em]">
            Module by <em className="italic-serif">module</em>
          </SplitReveal>
        </div>
        <Accordion
          className="lg:col-span-7 lg:col-start-6"
          numbered
          defaultOpen={0}
          items={course.curriculum.map((module) => ({
            title: module.title,
            meta: `${module.topics.length} topics`,
            content: (
              <ul className="space-y-2">
                {module.topics.map((topic) => (
                  <li key={topic} className="flex gap-3">
                    <span aria-hidden="true" className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-sage-ink" />
                    {topic}
                  </li>
                ))}
              </ul>
            ),
          }))}
        />
      </section>

      <section aria-labelledby="included-title" className="px-gutter pb-section">
        <div className="frame grid gap-12 bg-surface p-[clamp(1.5rem,4vw,4rem)] lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow mb-6 text-muted">Included</p>
            <SplitReveal as="h2" id="included-title" className="text-title font-light">
              Everything you need, <em className="italic-serif">from day one</em>
            </SplitReveal>
            <Reveal as="ul" stagger={0.06} className="mt-10 space-y-4">
              {course.included.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-sage/35 text-sage-ink">
                    <Check size={13} />
                  </span>
                  {item}
                </li>
              ))}
            </Reveal>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <MediaReveal className="relative aspect-[4/3] rounded-card">
              <Image src={photos.toolsGlove.src} alt={photos.toolsGlove.alt} fill sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover" />
            </MediaReveal>
            <div className="mt-6 grid gap-2 sm:grid-cols-[auto_1fr] sm:gap-6">
              <p className="font-display text-5xl leading-none text-sage-ink">€300</p>
              <p className="text-muted">
                <span className="text-ink">Your professional kit.</span> The lashes, tweezers and adhesives we use in the salon — yours to
                keep and practise with after the course.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="certificate-title" className="grid items-center gap-12 px-gutter pb-section lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="eyebrow mb-6 text-muted">Certificate</p>
          <SplitReveal as="h2" id="certificate-title" className="text-display font-light tracking-[-0.04em]">
            Certified by <em className="italic-serif">Neo Lash®</em>
          </SplitReveal>
          <Reveal className="mt-8 max-w-md space-y-4 text-muted">
            <p>
              When you complete the course you receive your Neo Lash® certificate — plus unlimited after-course assistance and 10% off Neo
              Lash® products for life.
            </p>
          </Reveal>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <CertificateCard course={course.name} />
        </div>
      </section>

      <section aria-label="Gallery" className="px-gutter pb-section">
        <div className="grid grid-cols-3 gap-[clamp(0.5rem,1vw,1rem)]">
          {course.gallery.map((image, i) => (
            <MediaReveal key={image.src} delay={i * 0.1} className={i === 1 ? "aspect-[3/4] rounded-card md:translate-y-10" : "aspect-[3/4] rounded-card"}>
              <Image src={image.src} alt={image.alt} fill sizes="33vw" className="object-cover" />
            </MediaReveal>
          ))}
        </div>
      </section>

      <CertificationPath eyebrow="How it works" />

      <section aria-labelledby="course-faq-title" className="grid gap-12 px-gutter pb-section lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="eyebrow mb-6 text-muted">FAQ</p>
          <SplitReveal as="h2" id="course-faq-title" className="text-display font-light tracking-[-0.04em]">
            Before you <em className="italic-serif">enrol</em>
          </SplitReveal>
        </div>
        <Accordion className="lg:col-span-7 lg:col-start-6" items={academyFaq.map((f) => ({ title: f.q, content: <p>{f.a}</p> }))} />
      </section>

      <CtaBand
        eyebrow={course.priceLabel}
        title={
          <>
            Enrol in the <em className="italic-serif">{course.name}</em>
          </>
        }
        text="Message us and we'll send the next dates, the price and how to reserve your place."
      >
        <a href={enrol} target="_blank" rel="noopener noreferrer" className="btn bg-night text-cream hover:bg-black" data-cursor="Enrol">
          <span className="inline-flex items-center gap-2">
            <WhatsApp size={17} /> Enrol on WhatsApp
          </span>
        </a>
      </CtaBand>

      <section aria-labelledby="other-courses" className="px-gutter pb-section">
        <h2 id="other-courses" className="eyebrow mb-8 text-muted">
          Other courses
        </h2>
        <ul className="grid gap-[clamp(0.75rem,1.4vw,1.25rem)] md:grid-cols-3">
          {others.map((other) => (
            <li key={other.slug}>
              <TransitionLink
                href={`/courses/${other.slug}`}
                transitionTitle={other.name}
                data-cursor="Explore"
                className="group flex h-full items-center gap-5 rounded-frame bg-surface p-4 pr-6"
              >
                <span className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-card">
                  <Image src={other.image.src} alt="" fill sizes="6rem" className="object-cover transition-transform duration-[1.2s] ease-luxe group-hover:scale-110" />
                </span>
                <span className="flex-1">
                  <span className="eyebrow block text-muted">
                    {pad(courses.indexOf(other) + 1)} · {other.level}
                  </span>
                  <span className="mt-1 block font-display text-2xl leading-tight">{other.name}</span>
                </span>
                <ArrowRight size={16} className="shrink-0 transition-transform duration-500 ease-luxe group-hover:translate-x-1" />
              </TransitionLink>
            </li>
          ))}
        </ul>
      </section>

      <JsonLd data={courseJsonLd(course)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Academy", path: "/courses" },
          { name: course.name, path: `/courses/${course.slug}` },
        ])}
      />
    </>
  );
}
