import { SplitReveal } from "@/components/motion/SplitReveal";

export default function Home() {
  return (
    <section className="grid min-h-dvh place-items-center px-gutter">
      <SplitReveal as="h1" type="chars" immediate className="font-display text-hero">
        Give your eyes <em className="italic-serif">the look</em> they deserve
      </SplitReveal>
    </section>
  );
}
