"use client";

import { useId, useState, type ReactNode } from "react";
import { ScrollTrigger } from "@/lib/motion/gsap";
import { Plus } from "@/components/ui/Icons";
import { cn } from "@/lib/cn";

export type AccordionItem = {
  title: ReactNode;
  content: ReactNode;
  /** Small text on the right of the header, e.g. "4 topics". */
  meta?: ReactNode;
};

type AccordionProps = {
  items: AccordionItem[];
  /** Index open on first render (-1 for none). */
  defaultOpen?: number;
  numbered?: boolean;
  /** Heading level for the item titles, to keep the page outline in order. */
  headingLevel?: 2 | 3;
  className?: string;
};

/**
 * Disclosure list. Panels animate with a grid-rows transition, closed panels
 * are inert, and ScrollTrigger re-measures once the height has settled.
 */
export function Accordion({ items, defaultOpen = -1, numbered = false, headingLevel = 3, className }: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <ul className={cn("border-t border-line", className)}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <li key={i} className="border-b border-line">
            <Heading>
              <button
                type="button"
                id={`${id}-h${i}`}
                aria-expanded={isOpen}
                aria-controls={`${id}-p${i}`}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="group flex w-full items-center gap-4 py-5 text-left md:gap-6 md:py-6"
              >
                {numbered && <span className="w-7 shrink-0 text-sm tabular-nums text-muted">{String(i + 1).padStart(2, "0")}</span>}
                <span className="flex-1 text-[clamp(1.08rem,1.5vw,1.4rem)] leading-snug tracking-[-0.015em]">{item.title}</span>
                {item.meta && <span className="hidden shrink-0 text-sm text-muted sm:block">{item.meta}</span>}
                <span
                  aria-hidden="true"
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-full border transition-[transform,background-color,color,border-color] duration-500 ease-luxe group-hover:border-ink",
                    isOpen ? "rotate-45 border-ink bg-ink text-canvas" : "border-line",
                  )}
                >
                  <Plus size={15} />
                </span>
              </button>
            </Heading>
            <div
              id={`${id}-p${i}`}
              role="region"
              aria-labelledby={`${id}-h${i}`}
              inert={!isOpen}
              onTransitionEnd={(e) => {
                if (e.target === e.currentTarget) ScrollTrigger.refresh();
              }}
              className={cn(
                "grid transition-[grid-template-rows] duration-700 ease-luxe",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <div className={cn("pb-7 leading-relaxed text-muted", numbered && "md:pl-[3.25rem]", "pr-12")}>{item.content}</div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
