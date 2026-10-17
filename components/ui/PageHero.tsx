import type { ReactNode } from "react";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal } from "@/components/motion/Reveal";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";
import { cn } from "@/lib/cn";

type PageHeroProps = {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  crumbs?: Crumb[];
  /** Actions shown under the intro. */
  children?: ReactNode;
  /** "display" suits long titles such as article headlines. */
  size?: "mega" | "display";
  className?: string;
};

/** Opening block of inner pages: eyebrow, giant split title, intro and actions. */
export function PageHero({ eyebrow, title, intro, crumbs, children, size = "mega", className }: PageHeroProps) {
  return (
    <div className={cn("px-gutter pb-[clamp(3rem,6vw,5.5rem)] pt-[calc(var(--header-h)+clamp(2.5rem,7vw,6.5rem))]", className)}>
      {crumbs && (
        <Reveal immediate y={12}>
          <Breadcrumbs items={crumbs} className="mb-10" />
        </Reveal>
      )}
      <Reveal immediate y={12}>
        <p className="eyebrow mb-6 text-muted">{eyebrow}</p>
      </Reveal>
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
        <SplitReveal
          as="h1"
          type={size === "mega" ? "chars" : "lines"}
          immediate
          className={cn("font-light lg:col-span-8", size === "mega" ? "text-mega" : "text-display tracking-[-0.035em]")}
        >
          {title}
        </SplitReveal>
        {(intro || children) && (
          <Reveal immediate delay={0.3} className="lg:col-span-4 lg:pb-2">
            {intro && <div className="max-w-md text-[1.08rem] leading-relaxed text-muted">{intro}</div>}
            {children && <div className="mt-7 flex flex-wrap gap-3">{children}</div>}
          </Reveal>
        )}
      </div>
    </div>
  );
}
