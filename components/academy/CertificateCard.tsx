import { Tilt } from "@/components/motion/Tilt";
import { cn } from "@/lib/cn";

/** Illustrative Neo Lash® Academy certificate (not a real document). */
export function CertificateCard({ course, className }: { course: string; className?: string }) {
  return (
    <Tilt max={7} className={cn("mx-auto w-full max-w-[34rem]", className)}>
      <figure
        aria-label={`Illustration of the Neo Lash® Academy certificate for the ${course}`}
        className="relative aspect-[1.414/1] overflow-hidden rounded-[1.1rem] bg-surface p-[6%] shadow-[0_40px_80px_-40px_rgb(20_20_20/0.45)] ring-1 ring-line"
      >
        <div className="absolute inset-[3.5%] rounded-[0.7rem] border border-sage/60" aria-hidden="true" />
        <div className="relative flex h-full flex-col items-center justify-between text-center">
          <p className="eyebrow text-[0.62rem] text-muted">Neo Lash® Academy · Malta</p>
          <div>
            <p className="font-display text-[clamp(1.5rem,4vw,2.4rem)] italic leading-none">Certificate</p>
            <p className="mt-1 text-[0.7rem] uppercase tracking-[0.3em] text-muted">of completion</p>
          </div>
          <div className="w-full">
            <p className="font-display text-[clamp(1.1rem,2.6vw,1.6rem)]">Your name here</p>
            <span className="mx-auto mt-2 block h-px w-1/2 bg-line" aria-hidden="true" />
            <p className="mt-2 text-xs text-muted">has completed the {course}</p>
          </div>
          <div className="flex w-full items-end justify-between text-left text-[0.6rem] text-muted">
            <span>
              <span className="block font-display text-base italic text-sage-ink">Daniela</span>
              Founder &amp; educator
            </span>
            <span className="grid size-12 place-items-center rounded-full bg-sage text-[0.5rem] font-semibold uppercase leading-tight tracking-wider text-night">
              Neo
              <br />
              Lash®
            </span>
          </div>
        </div>
      </figure>
    </Tilt>
  );
}
