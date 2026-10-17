import { Marquee } from "@/components/motion/Marquee";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { clientReviews } from "@/data/reviews";
import type { Review } from "@/data/types";
import { cn } from "@/lib/cn";

function ReviewCard({ review, tone }: { review: Review; tone: "light" | "sage" }) {
  return (
    <figure
      className={cn(
        "mr-[clamp(0.75rem,1.4vw,1.25rem)] flex w-[min(80vw,26rem)] shrink-0 flex-col justify-between rounded-frame p-[clamp(1.25rem,2vw,1.9rem)] whitespace-normal",
        tone === "sage" ? "bg-sage text-night" : "bg-surface",
      )}
    >
      <div>
        <span aria-hidden="true" className="block font-display text-6xl leading-[0.6] opacity-40">
          “
        </span>
        <blockquote className="mt-4 text-[1.02rem] leading-relaxed">{review.quote}</blockquote>
      </div>
      <figcaption className="mt-8 flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-full bg-ink text-sm font-medium text-canvas">
          {review.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)}
        </span>
        <span>
          <span className="block font-medium">{review.name}</span>
          <span className={cn("block text-xs", tone === "sage" ? "text-night/70" : "text-muted")}>Neo Lash® client</span>
        </span>
      </figcaption>
    </figure>
  );
}

/** Two rows of reviews drifting in opposite directions, faster as you scroll. */
export function Reviews() {
  const half = Math.ceil(clientReviews.length / 2);
  const rows = [clientReviews.slice(0, half), clientReviews.slice(half)];

  return (
    <section aria-labelledby="reviews-title" className="py-section">
      <div className="mb-14 px-gutter text-center">
        <p className="eyebrow mb-6 text-muted">(09) — Client love</p>
        <SplitReveal as="h2" id="reviews-title" className="text-display font-light tracking-[-0.04em]">
          Loved across <em className="italic-serif">Malta</em>
        </SplitReveal>
      </div>
      <div className="space-y-[clamp(0.75rem,1.4vw,1.25rem)]">
        <Marquee speed={38} direction={-1}>
          {rows[0].map((review, i) => (
            <ReviewCard key={review.name} review={review} tone={i % 3 === 1 ? "sage" : "light"} />
          ))}
        </Marquee>
        <Marquee speed={32} direction={1}>
          {rows[1].map((review, i) => (
            <ReviewCard key={review.name} review={review} tone={i % 3 === 2 ? "sage" : "light"} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
