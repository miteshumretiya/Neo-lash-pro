import type { ReactNode } from "react";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal } from "@/components/motion/Reveal";
import { DrawLash } from "@/components/motion/DrawLash";
import { cn } from "@/lib/cn";

type CtaBandProps = {
  eyebrow: string;
  title: ReactNode;
  text?: ReactNode;
  children: ReactNode;
  tone?: "sage" | "night";
  className?: string;
};

/** Rounded closing call-to-action used at the end of inner pages. */
export function CtaBand({ eyebrow, title, text, children, tone = "sage", className }: CtaBandProps) {
  return (
    <section className={cn("px-gutter pb-section", className)}>
      <div
        className={cn(
          "relative overflow-hidden rounded-frame px-[clamp(1.5rem,5vw,5rem)] py-[clamp(3.5rem,8vw,7rem)]",
          tone === "sage" ? "bg-sage text-night" : "bg-night text-cream",
        )}
      >
        <DrawLash className="pointer-events-none absolute -right-10 -top-6 w-[min(28rem,70vw)] opacity-30" />
        <div className="relative grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className={cn("eyebrow mb-6", tone === "sage" ? "text-night/70" : "text-cream/60")}>{eyebrow}</p>
            <SplitReveal as="h2" className="text-display font-light tracking-[-0.04em]">
              {title}
            </SplitReveal>
          </div>
          <Reveal className="lg:col-span-4">
            {text && <p className={cn("mb-7 max-w-md leading-relaxed", tone === "sage" ? "text-night/75" : "text-cream/70")}>{text}</p>}
            <div className="flex flex-wrap gap-3">{children}</div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
