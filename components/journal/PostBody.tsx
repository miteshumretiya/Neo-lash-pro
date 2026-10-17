import type { PostBlock } from "@/data/types";
import { Reveal } from "@/components/motion/Reveal";

/** Renders journal article blocks with editorial typography. */
export function PostBody({ blocks }: { blocks: PostBlock[] }) {
  return (
    <div className="space-y-8 text-[1.12rem] leading-[1.75]">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "p":
            return (
              <Reveal key={i} y={20}>
                <p className={i === 0 ? "text-lead" : undefined}>{block.text}</p>
              </Reveal>
            );
          case "h2":
            return (
              <Reveal key={i} y={20}>
                <h2 className="pt-6 font-display text-[clamp(1.9rem,3vw,2.8rem)] leading-[1.05]">{block.text}</h2>
              </Reveal>
            );
          case "ol":
            return (
              <Reveal key={i} as="ol" stagger={0.05} y={16} className="space-y-4">
                {block.items.map((item, n) => (
                  <li key={item} className="grid grid-cols-[2.5rem_1fr] gap-2 border-t border-line pt-4">
                    <span className="font-display text-xl leading-[1.6] text-sage-ink tabular-nums">{String(n + 1).padStart(2, "0")}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </Reveal>
            );
          case "ul":
            return (
              <Reveal key={i} as="ul" stagger={0.05} y={16} className="space-y-3">
                {block.items.map((item) => (
                  <li key={item} className="flex gap-4">
                    <span aria-hidden="true" className="mt-[0.75em] size-1.5 shrink-0 rounded-full bg-sage-ink" />
                    <span>{item}</span>
                  </li>
                ))}
              </Reveal>
            );
          case "quote":
            return (
              <Reveal key={i} y={20}>
                <blockquote className="my-6 rounded-frame bg-sage px-[clamp(1.5rem,4vw,3rem)] py-[clamp(1.75rem,4vw,3rem)] font-display text-[clamp(1.6rem,2.6vw,2.4rem)] italic leading-[1.15] text-night">
                  {block.text}
                </blockquote>
              </Reveal>
            );
        }
      })}
    </div>
  );
}
