import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { studentReviews } from "@/data/courses";
import { cn } from "@/lib/cn";

/** Student testimonials from the Neo Lash® Academy. */
export function StudentReviews() {
  return (
    <section aria-labelledby="students-title" className="px-gutter pb-section">
      <div className="mb-12 max-w-3xl">
        <p className="eyebrow mb-6 text-muted">Students</p>
        <SplitReveal as="h2" id="students-title" className="text-display font-light tracking-[-0.04em]">
          Taught with <em className="italic-serif">patience</em>
        </SplitReveal>
      </div>
      <Reveal stagger={0.08} className="columns-1 gap-[clamp(0.75rem,1.4vw,1.25rem)] md:columns-2 xl:columns-3">
        {studentReviews.map((review, i) => (
          <figure
            key={review.name}
            className={cn(
              "mb-[clamp(0.75rem,1.4vw,1.25rem)] break-inside-avoid rounded-frame p-[clamp(1.4rem,2.4vw,2.2rem)]",
              i % 3 === 1 ? "bg-sage text-night" : "bg-surface",
            )}
          >
            <span aria-hidden="true" className="block font-display text-6xl leading-[0.6] opacity-40">
              “
            </span>
            <blockquote className="mt-4 text-[1.05rem] leading-relaxed">{review.quote}</blockquote>
            <figcaption className="mt-8 flex items-center justify-between gap-4 text-sm">
              <span className="font-medium">{review.name}</span>
              {review.context && <span className={cn(i % 3 === 1 ? "text-night/70" : "text-muted")}>{review.context}</span>}
            </figcaption>
          </figure>
        ))}
      </Reveal>
    </section>
  );
}
