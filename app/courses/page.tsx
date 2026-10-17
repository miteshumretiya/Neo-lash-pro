import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/ui/PageHero";
import { Accordion } from "@/components/ui/Accordion";
import { CtaBand } from "@/components/ui/CtaBand";
import { MediaReveal } from "@/components/motion/MediaReveal";
import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { CourseIndex } from "@/components/academy/CourseIndex";
import { CertificationPath } from "@/components/academy/CertificationPath";
import { StudentReviews } from "@/components/academy/StudentReviews";
import { ArrowDown, WhatsApp } from "@/components/ui/Icons";
import { JsonLd } from "@/components/seo/JsonLd";
import { academyFaq, academyPerks, courses } from "@/data/courses";
import { photos } from "@/data/media";
import { breadcrumbJsonLd, courseJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";
import { whatsappUrl } from "@/lib/whatsapp";
import { pad } from "@/lib/format";

export const metadata: Metadata = {
  title: "Academy — Eyelash Extension Courses in Malta",
  description:
    "Certified eyelash extension courses in St. Julian's, Malta: Basic, Volume, Combo and Masterclass. Small groups, live models, a €300 pro kit and lifetime support.",
  alternates: { canonical: "/courses" },
};

const enquire = whatsappUrl("Hi Neo Lash! I'd like information about the Academy courses — next dates and prices, please.");

export default function CoursesPage() {
  return (
    <>
      <PageHero
        eyebrow="(Academy) — Neo Lash® Academy"
        title={
          <>
            Learn the <em className="italic-serif">art</em> of lashing
          </>
        }
        intro="Certified eyelash extension courses in St. Julian's, Malta — from your very first classic set to masterclass, taught by Daniela and the Neo Lash® educators."
      >
        <a href={enquire} target="_blank" rel="noopener noreferrer" className="btn bg-whatsapp text-white hover:bg-[#17703c]" data-cursor="Enquire">
          <span className="inline-flex items-center gap-2">
            <WhatsApp size={17} /> Ask about dates
          </span>
        </a>
        <a href="#courses" className="btn btn-ghost">
          <span className="inline-flex items-center gap-2">
            The courses <ArrowDown size={15} />
          </span>
        </a>
      </PageHero>

      <section className="px-gutter pb-section">
        <MediaReveal parallax={10} className="aspect-[4/5] rounded-frame sm:aspect-[16/9] lg:aspect-[21/9]">
          <Image src={photos.applicationClient.src} alt={photos.applicationClient.alt} fill priority sizes="100vw" className="object-cover" />
        </MediaReveal>
        <Reveal stagger={0.1} className="mt-[clamp(2.5rem,5vw,4rem)] grid gap-8 md:grid-cols-3">
          {academyPerks.map((perk, i) => (
            <div key={perk.title} className="border-t border-line pt-6">
              <span className="eyebrow text-muted">{pad(i + 1)}</span>
              <h2 className="mt-4 text-[clamp(1.35rem,2vw,1.75rem)] font-medium tracking-tight">{perk.title}</h2>
              <p className="mt-2 max-w-sm leading-relaxed text-muted">{perk.text}</p>
            </div>
          ))}
        </Reveal>
      </section>

      <section id="courses" aria-labelledby="courses-title" className="scroll-mt-[var(--header-h)] px-gutter pb-section">
        <div className="mb-12 grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="eyebrow mb-6 text-muted">Four courses</p>
            <SplitReveal as="h2" id="courses-title" className="text-display font-light tracking-[-0.04em]">
              Choose your <em className="italic-serif">level</em>
            </SplitReveal>
          </div>
          <Reveal className="md:col-span-4 md:col-start-9">
            <p className="text-muted">
              Every course includes online theory, live demonstrations, practice on live models, a full professional kit and your Neo
              Lash® certificate. Prices and next dates on request.
            </p>
          </Reveal>
        </div>
        <CourseIndex courses={courses} />
      </section>

      <CertificationPath />
      <StudentReviews />

      <section aria-labelledby="faq-title" className="grid gap-12 px-gutter pb-section lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="eyebrow mb-6 text-muted">FAQ</p>
          <SplitReveal as="h2" id="faq-title" className="text-display font-light tracking-[-0.04em]">
            Good <em className="italic-serif">questions</em>
          </SplitReveal>
        </div>
        <Accordion
          className="lg:col-span-7 lg:col-start-6"
          defaultOpen={0}
          items={academyFaq.map((f) => ({ title: f.q, content: <p>{f.a}</p> }))}
        />
      </section>

      <CtaBand
        eyebrow="Enrolment"
        title={
          <>
            Reserve your <em className="italic-serif">place</em>
          </>
        }
        text="Classes are kept small. Message us with the course you're interested in and we'll send the next dates, the price and everything you need to enrol."
      >
        <a href={enquire} target="_blank" rel="noopener noreferrer" className="btn bg-night text-cream hover:bg-black" data-cursor="Enquire">
          <span className="inline-flex items-center gap-2">
            <WhatsApp size={17} /> {site.whatsapp.display}
          </span>
        </a>
      </CtaBand>

      {courses.map((course) => (
        <JsonLd key={course.slug} data={courseJsonLd(course)} />
      ))}
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Academy", path: "/courses" },
        ])}
      />
    </>
  );
}
