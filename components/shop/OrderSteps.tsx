import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { WhatsApp } from "@/components/ui/Icons";
import { site } from "@/lib/site";
import { whatsappUrl } from "@/lib/whatsapp";

const steps = [
  { title: "Choose", text: "Pick your products, profile and quantity — or save favourites to your wishlist." },
  { title: "Send", text: "Tap “Buy on WhatsApp”. Your order arrives in our chat, already written for you." },
  { title: "Confirm", text: "We reply to confirm availability, delivery options and how you'd like to pay." },
];

/** Explains the WhatsApp-only ordering flow (there is no cart or checkout). */
export function OrderSteps() {
  return (
    <section aria-labelledby="order-steps-title" className="px-gutter pb-section">
      <div className="frame grid gap-12 bg-surface px-[clamp(1.25rem,4vw,4rem)] py-[clamp(3rem,7vw,6rem)] lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="eyebrow mb-6 text-muted">How ordering works</p>
          <SplitReveal as="h2" id="order-steps-title" className="text-title font-light">
            No cart. No card. <em className="italic-serif">Just WhatsApp.</em>
          </SplitReveal>
          <Reveal className="mt-8">
            <a href={whatsappUrl("Hi Neo Lash! I have a question about your products.")} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              <span className="inline-flex items-center gap-2">
                <WhatsApp size={17} /> {site.whatsapp.display}
              </span>
            </a>
          </Reveal>
        </div>
        <Reveal as="ol" stagger={0.12} className="grid gap-8 sm:grid-cols-3 lg:col-span-7 lg:col-start-6">
          {steps.map((step, i) => (
            <li key={step.title} className="border-t border-line pt-6">
              <span className="font-display text-5xl text-sage-ink">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-6 text-xl font-medium tracking-tight">{step.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{step.text}</p>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
