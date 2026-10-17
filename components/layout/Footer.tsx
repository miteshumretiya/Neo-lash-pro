"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { useReducedMotion } from "@/lib/hooks";
import { footerNav, site } from "@/lib/site";
import { whatsappUrl } from "@/lib/whatsapp";
import { TransitionLink } from "@/components/motion/Transition";
import { Magnetic } from "@/components/motion/Magnetic";
import { ArrowUpRight, Instagram, MapPin, WhatsApp } from "@/components/ui/Icons";
import { Newsletter } from "./Newsletter";
import { CurrentYear } from "./CurrentYear";

const WORDMARK = "NEO LASH®";

export function Footer() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  // Letter-by-letter wordmark reveal as the footer enters.
  useGSAP(
    () => {
      if (reduced) return;
      gsap.from("[data-letter]", {
        yPercent: 105,
        rotate: 6,
        duration: 1.4,
        stagger: 0.06,
        ease: "luxe",
        scrollTrigger: { trigger: "[data-wordmark]", start: "top 98%", once: true },
      });
      gsap.from("[data-footer-fade]", {
        autoAlpha: 0,
        y: 30,
        duration: 1.1,
        stagger: 0.08,
        ease: "luxe",
        scrollTrigger: { trigger: root.current, start: "top 85%", once: true },
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <footer ref={root} className="px-gutter pb-[var(--gutter)] pt-24">
      <div className="frame bg-night px-[clamp(1.25rem,3vw,3rem)] pt-[clamp(3rem,6vw,6rem)] text-cream">
        <div className="grid gap-12 lg:grid-cols-12">
          <div data-footer-fade className="lg:col-span-6">
            <p className="eyebrow mb-6 text-cream/50">It&apos;s never too late to begin</p>
            <h2 className="font-display text-display">
              Give your eyes <em className="italic-serif text-sage">the look</em> they deserve.
            </h2>
            <div className="mt-10 flex flex-wrap gap-3">
              <Magnetic>
                <a href={site.booking} target="_blank" rel="noopener noreferrer" className="btn btn-light" data-cursor="Book">
                  <span data-magnetic-label className="inline-flex items-center gap-2">
                    Book on Fresha <ArrowUpRight size={16} />
                  </span>
                </a>
              </Magnetic>
              <a
                href={whatsappUrl("Hi Neo Lash! I have a question.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost text-cream"
              >
                <span className="inline-flex items-center gap-2">
                  <WhatsApp size={16} /> WhatsApp us
                </span>
              </a>
            </div>
          </div>

          <div data-footer-fade className="lg:col-span-5 lg:col-start-8">
            <Newsletter />
          </div>
        </div>

        <div className="mt-20 grid grid-cols-2 gap-10 border-t border-white/10 pt-10 text-sm md:grid-cols-4">
          <FooterColumn title="Explore" links={footerNav.explore} />
          <FooterColumn title="Studio" links={footerNav.studio} />
          <FooterColumn title="Policies" links={footerNav.legal} />
          <div data-footer-fade>
            <p className="eyebrow mb-4 text-cream/50">Visit</p>
            <a href={site.mapUrl} target="_blank" rel="noopener noreferrer" className="group inline-flex gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0" />
              <span className="link-u">
                {site.address.street}
                <br />
                {site.address.locality} {site.address.postalCode}
                <br />
                {site.address.country}
              </span>
            </a>
            <div className="mt-5 flex gap-2">
              <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="icon-btn size-10 border-white/20">
                <Instagram size={16} />
              </a>
              <a href={whatsappUrl("Hi Neo Lash!")} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="icon-btn size-10 border-white/20">
                <WhatsApp size={16} />
              </a>
            </div>
          </div>
        </div>

        <div data-wordmark className="mt-16 overflow-hidden" aria-hidden="true">
          <p
            className="whitespace-nowrap font-display leading-[0.8] tracking-[-0.04em] text-cream"
            // Fills the card: "NEO LASH®" is ~3.98em wide in Instrument Serif.
            style={{ fontSize: "calc((100vw - 2 * var(--gutter) - 2 * clamp(1.25rem, 3vw, 3rem)) / 4.08)" }}
          >
            {Array.from(WORDMARK).map((letter, i) => (
              <span key={i} data-letter className="inline-block pb-[0.06em]">
                {letter === " " ? " " : letter}
              </span>
            ))}
          </p>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 py-6 text-xs text-cream/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <CurrentYear /> {site.fullName}. Lash &amp; brow experts in Malta.
          </p>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="inline-flex items-center gap-1.5">
              <WhatsApp size={13} /> Products ordered on WhatsApp
            </span>
            <span>Treatments booked on Fresha</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

type FooterLink = { label: string; href: string; external?: boolean };

function FooterColumn({ title, links }: { title: string; links: readonly FooterLink[] }) {
  return (
    <div data-footer-fade>
      <p className="eyebrow mb-4 text-cream/50">{title}</p>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            {link.external ? (
              <a href={link.href} target="_blank" rel="noopener noreferrer" className="link-u">
                {link.label}
              </a>
            ) : (
              <TransitionLink href={link.href} className="link-u">
                {link.label}
              </TransitionLink>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
