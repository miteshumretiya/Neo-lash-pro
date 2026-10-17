"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Tilt } from "@/components/motion/Tilt";
import { TransitionLink } from "@/components/motion/Transition";
import { ArrowRight, Check, WhatsApp } from "@/components/ui/Icons";
import { courses, academyPerks } from "@/data/courses";
import { enquiryMessage, whatsappUrl } from "@/lib/whatsapp";
import { pad } from "@/lib/format";

/**
 * Academy courses on a pinned horizontal track (desktop) with a progress bar;
 * a native scroll-snap row on touch screens.
 */
export function Courses() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 64rem) and (prefers-reduced-motion: no-preference)", () => {
        const el = track.current!;
        const distance = () => {
          const last = el.lastElementChild as HTMLElement;
          const gutter = parseFloat(getComputedStyle(el).paddingLeft);
          return Math.max(0, last.offsetLeft + last.offsetWidth + gutter - window.innerWidth);
        };
        gsap
          .timeline({
            scrollTrigger: {
              trigger: "[data-courses-pin]",
              start: "top top",
              end: () => `+=${distance()}`,
              pin: true,
              scrub: 0.7,
              invalidateOnRefresh: true,
            },
          })
          .to(el, { x: () => -distance(), ease: "none" }, 0)
          .fromTo("[data-courses-progress]", { scaleX: 0 }, { scaleX: 1, ease: "none" }, 0);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="courses-title" className="relative pt-section">
      <div data-courses-pin className="lg:flex lg:h-[100svh] lg:flex-col lg:justify-center lg:overflow-hidden">
        <div className="mb-10 grid gap-6 px-gutter md:grid-cols-12 md:items-end lg:mb-12">
          <div className="md:col-span-7">
            <p className="eyebrow mb-6 text-muted">(06) — Neo Lash® Academy</p>
            <SplitReveal as="h2" id="courses-title" className="text-display font-light tracking-[-0.04em]">
              Become a <em className="italic-serif">certified</em> lash artist
            </SplitReveal>
          </div>
          <ul className="space-y-2 text-sm text-muted md:col-span-4 md:col-start-9">
            {academyPerks.map((perk) => (
              <li key={perk.title} className="flex gap-3">
                <Check size={16} className="mt-0.5 shrink-0 text-sage-ink" />
                <span>
                  <span className="text-ink">{perk.title}.</span> {perk.text}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div
          ref={track}
          className="no-scrollbar flex snap-x snap-mandatory gap-[clamp(0.75rem,1.4vw,1.25rem)] overflow-x-auto px-gutter pb-4 lg:snap-none lg:overflow-visible lg:pb-0"
          data-lenis-prevent-horizontal
        >
          {courses.map((course, i) => (
            <Tilt key={course.slug} max={3} className="w-[82vw] shrink-0 snap-start sm:w-[46vw] lg:w-[31vw] xl:w-[27vw]">
              <article className="group flex h-full flex-col overflow-hidden rounded-frame bg-surface">
                <div className="relative aspect-[5/4] overflow-hidden">
                  <Image
                    src={course.image.src}
                    alt={course.image.alt}
                    fill
                    sizes="(max-width: 640px) 82vw, (max-width: 1024px) 46vw, 30vw"
                    className="object-cover transition-transform duration-[1.4s] ease-luxe group-hover:scale-105"
                  />
                  <span className="glass absolute left-3 top-3 rounded-full px-3 py-1 text-[0.72rem] font-medium text-white">
                    {course.level}
                  </span>
                  <span className="absolute right-4 top-3 font-display text-3xl text-white/90">{pad(i + 1)}</span>
                </div>
                <div className="flex flex-1 flex-col p-[clamp(1.1rem,1.8vw,1.6rem)]">
                  <h3 className="font-display text-title">{course.name}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{course.summary}</p>
                  <dl className="mt-6 grid grid-cols-2 gap-3 border-t border-line pt-5 text-sm">
                    <div>
                      <dt className="eyebrow text-muted">Duration</dt>
                      <dd className="mt-1">{course.duration}</dd>
                    </div>
                    <div>
                      <dt className="eyebrow text-muted">Price</dt>
                      <dd className="mt-1">{course.priceLabel}</dd>
                    </div>
                  </dl>
                  <div className="mt-auto flex flex-wrap gap-2 pt-6">
                    <a
                      href={whatsappUrl(enquiryMessage(`the ${course.name} (next dates and price)`))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm flex-1 bg-whatsapp text-white hover:bg-[#17703c]"
                      data-cursor="Enrol"
                    >
                      <span className="inline-flex items-center gap-2">
                        <WhatsApp size={15} /> Enrol
                      </span>
                    </a>
                    <TransitionLink href={`/courses/${course.slug}`} className="btn btn-ghost btn-sm flex-1" transitionTitle={course.name}>
                      <span className="inline-flex items-center gap-2">
                        Details <ArrowRight size={14} />
                      </span>
                    </TransitionLink>
                  </div>
                </div>
              </article>
            </Tilt>
          ))}
          <div className="flex w-[70vw] shrink-0 snap-start flex-col justify-end rounded-frame border border-line p-8 sm:w-[40vw] lg:w-[24vw]">
            <p className="font-display text-title">
              Not sure where <em className="italic-serif">to start?</em>
            </p>
            <p className="mt-3 text-muted">Tell us about your experience and we&apos;ll recommend the right course.</p>
            <TransitionLink href="/courses" className="btn btn-solid mt-8 self-start">
              <span className="inline-flex items-center gap-2">
                All courses <ArrowRight size={15} />
              </span>
            </TransitionLink>
          </div>
        </div>

        <div className="mx-[var(--gutter)] mt-10 hidden h-px bg-line lg:block">
          <div data-courses-progress className="h-full origin-left scale-x-0 bg-ink" />
        </div>
      </div>
    </section>
  );
}
