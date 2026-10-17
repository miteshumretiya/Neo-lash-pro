"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { useFinePointer } from "@/lib/hooks";
import { TransitionLink } from "@/components/motion/Transition";
import { ArrowRight } from "@/components/ui/Icons";
import type { Course } from "@/data/types";
import { pad } from "@/lib/format";

/**
 * Typographic course list. Rows slide on hover while the course photo follows
 * the cursor (fine pointers); touch screens get inline thumbnails instead.
 */
export function CourseIndex({ courses }: { courses: Course[] }) {
  const root = useRef<HTMLDivElement>(null);
  const follower = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const fine = useFinePointer();

  useGSAP(
    (_, contextSafe) => {
      const el = root.current;
      if (!fine || !follower.current || !el || !contextSafe) return;
      const xTo = gsap.quickTo(follower.current, "x", { duration: 0.75, ease: "power3.out" });
      const yTo = gsap.quickTo(follower.current, "y", { duration: 0.75, ease: "power3.out" });
      const move = contextSafe((e: PointerEvent) => {
        const bounds = el.getBoundingClientRect();
        xTo(e.clientX - bounds.left);
        yTo(e.clientY - bounds.top);
      });
      el.addEventListener("pointermove", move);
      return () => el.removeEventListener("pointermove", move);
    },
    { scope: root, dependencies: [fine] },
  );

  return (
    <div ref={root} className="relative" onPointerLeave={() => setActive(null)}>
      <ul className="border-t border-line">
        {courses.map((course, i) => (
          <li key={course.slug} className="border-b border-line">
            <TransitionLink
              href={`/courses/${course.slug}`}
              transitionTitle={course.name}
              onPointerEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              data-cursor="Explore"
              className="group grid grid-cols-[2.25rem_1fr_auto] items-center gap-4 py-6 md:grid-cols-[4rem_minmax(0,1.3fr)_minmax(0,1fr)_auto] md:gap-8 md:py-9"
            >
              <span className="eyebrow text-muted">{pad(i + 1)}</span>
              <span className="flex items-center gap-4 transition-transform duration-700 ease-luxe group-hover:translate-x-3 md:group-hover:translate-x-6">
                <span className="relative size-16 shrink-0 overflow-hidden rounded-2xl md:hidden">
                  <Image src={course.image.src} alt="" fill sizes="4rem" className="object-cover" />
                </span>
                <span>
                  <span className="block font-display text-[clamp(2rem,4.6vw,4.4rem)] leading-[0.98] transition-[font-style] group-hover:italic">
                    {course.name}
                  </span>
                  <span className="eyebrow mt-2 block text-muted">
                    {course.level} · {course.duration}
                  </span>
                </span>
              </span>
              <span className="hidden max-w-sm text-[0.95rem] leading-relaxed text-muted transition-colors duration-500 group-hover:text-ink md:block">
                {course.summary}
              </span>
              <span className="grid size-11 place-items-center rounded-full border border-line transition-[background-color,color,transform,border-color] duration-500 ease-luxe group-hover:border-ink group-hover:bg-ink group-hover:text-canvas">
                <ArrowRight size={16} />
              </span>
            </TransitionLink>
          </li>
        ))}
      </ul>

      {fine && (
        <div
          ref={follower}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 z-10 aspect-[4/5] w-[16rem] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[999px_999px_1.25rem_1.25rem] shadow-[0_30px_60px_-30px_rgb(20_20_20/0.5)] transition-[opacity,scale] duration-500 ease-luxe"
          style={{ opacity: active === null ? 0 : 1, scale: active === null ? "0.6" : "1" }}
        >
          {courses.map((course, i) => (
            <Image
              key={course.slug}
              src={course.image.src}
              alt=""
              fill
              sizes="16rem"
              className="object-cover transition-[opacity,transform] duration-700 ease-luxe"
              style={{ opacity: active === i ? 1 : 0, transform: active === i ? "scale(1)" : "scale(1.2)" }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
