"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { useFinePointer } from "@/lib/hooks";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal } from "@/components/motion/Reveal";
import { Magnetic } from "@/components/motion/Magnetic";
import { ArrowUpRight } from "@/components/ui/Icons";
import { services } from "@/data/services";
import { site } from "@/lib/site";
import { pad } from "@/lib/format";

/**
 * Large typographic treatment list. On hover the row slides and an image
 * follows the cursor with inertia (fine pointers only).
 */
export function Services() {
  const root = useRef<HTMLElement>(null);
  const follower = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const fine = useFinePointer();

  useGSAP(
    (_, contextSafe) => {
      const list = root.current?.querySelector<HTMLElement>("[data-service-list]");
      if (!fine || !follower.current || !list || !contextSafe) return;
      const xTo = gsap.quickTo(follower.current, "x", { duration: 0.75, ease: "power3.out" });
      const yTo = gsap.quickTo(follower.current, "y", { duration: 0.75, ease: "power3.out" });
      const rTo = gsap.quickTo(follower.current, "rotation", { duration: 1.2, ease: "power3.out" });
      let lastX = 0;
      const move = contextSafe((e: PointerEvent) => {
        const bounds = root.current!.getBoundingClientRect();
        xTo(e.clientX - bounds.left);
        yTo(e.clientY - bounds.top);
        rTo(gsap.utils.clamp(-10, 10, (e.clientX - lastX) * 0.6));
        lastX = e.clientX;
      });
      list.addEventListener("pointermove", move);
      return () => list.removeEventListener("pointermove", move);
    },
    { scope: root, dependencies: [fine] },
  );

  return (
    <section ref={root} id="services" aria-labelledby="services-title" className="relative px-gutter">
      <div className="frame bg-night px-[clamp(1.25rem,3.4vw,3.5rem)] py-[clamp(4rem,9vw,8rem)] text-cream">
        <div className="mb-14 grid gap-8 md:mb-20 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="eyebrow mb-6 text-cream/50">(03) — Treatments</p>
            <SplitReveal as="h2" id="services-title" className="text-display font-light tracking-[-0.04em]">
              The art of <em className="italic-serif text-sage">a lifted look</em>
            </SplitReveal>
          </div>
          <Reveal className="space-y-6 md:col-span-4 md:col-start-9">
            <p className="text-cream/70">
              Each treatment begins with mapping your eyes and brows to your features — correcting asymmetry and opening up the face.
              Book any treatment on Fresha in a few taps.
            </p>
            <Magnetic>
              <a href={site.booking} target="_blank" rel="noopener noreferrer" className="btn btn-sage" data-cursor="Book">
                <span data-magnetic-label className="inline-flex items-center gap-2">
                  See availability <ArrowUpRight size={16} />
                </span>
              </a>
            </Magnetic>
          </Reveal>
        </div>

        <ul data-service-list className="border-t border-white/12" onPointerLeave={() => setActive(null)}>
          {services.map((service, i) => (
            <li key={service.name} className="border-b border-white/12">
              <a
                href={site.booking}
                target="_blank"
                rel="noopener noreferrer"
                onPointerEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                data-cursor="Book"
                className="group grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 py-5 md:grid-cols-[4rem_minmax(0,1.2fr)_minmax(0,1fr)_auto] md:gap-8 md:py-7"
              >
                <span className="eyebrow text-cream/45">{pad(i + 1)}</span>
                <span className="flex items-center gap-4 transition-transform duration-700 ease-luxe group-hover:translate-x-3 md:group-hover:translate-x-6">
                  <span className="relative size-14 shrink-0 overflow-hidden rounded-full md:hidden">
                    <Image src={service.image.src} alt="" fill sizes="3.5rem" className="object-cover" />
                  </span>
                  <span>
                    <span className="block font-display text-[clamp(1.6rem,3.6vw,3.4rem)] leading-[1.02] transition-[font-style] group-hover:italic">
                      {service.name}
                    </span>
                    <span className="eyebrow mt-1 block text-cream/45 md:hidden">{service.category}</span>
                  </span>
                </span>
                <span className="hidden max-w-sm text-[0.92rem] leading-relaxed text-cream/60 transition-colors duration-500 group-hover:text-cream/90 md:block">
                  {service.description}
                </span>
                <span className="grid size-11 place-items-center rounded-full border border-white/20 transition-[background-color,color,transform] duration-500 ease-luxe group-hover:rotate-45 group-hover:bg-cream group-hover:text-night">
                  <ArrowUpRight size={16} />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {fine && (
        <div
          ref={follower}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 z-10 aspect-[4/5] w-[17rem] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[999px_999px_1.25rem_1.25rem] transition-[opacity,scale] duration-500 ease-luxe"
          style={{ opacity: active === null ? 0 : 1, scale: active === null ? "0.6" : "1" }}
        >
          {services.map((service, i) => (
            <Image
              key={service.name}
              src={service.image.src}
              alt=""
              fill
              sizes="17rem"
              className="object-cover transition-[opacity,transform] duration-700 ease-luxe"
              style={{ opacity: active === i ? 1 : 0, transform: active === i ? "scale(1)" : "scale(1.2)" }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
