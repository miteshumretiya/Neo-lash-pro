"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { scroll } from "@/lib/motion/scroll";
import { useExperience } from "@/lib/store/experience";
import { primaryNav, site } from "@/lib/site";
import { TransitionLink } from "@/components/motion/Transition";
import { Scramble } from "@/components/motion/Scramble";
import { ArrowUpRight, Instagram, WhatsApp } from "@/components/ui/Icons";
import { useFinePointer } from "@/lib/hooks";
import { pad } from "@/lib/format";
import { whatsappUrl } from "@/lib/whatsapp";

/**
 * Fullscreen menu: staggered giant links, a preview image that follows the
 * cursor with inertia, focus trap, Escape to close and Lenis paused.
 */
export function MenuOverlay() {
  const open = useExperience((s) => s.menuOpen);
  const setOpen = useExperience((s) => s.setMenuOpen);
  const root = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const [active, setActive] = useState<number | null>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      gsap.set(el, { clipPath: "inset(0% 0% 100% 0%)", visibility: "hidden" });
      tl.current = gsap
        .timeline({ paused: true })
        .set(el, { visibility: "visible" })
        .to(el, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.95, ease: "silk" })
        .from("[data-menu-link]", { yPercent: 110, duration: 1.1, stagger: 0.06, ease: "luxe" }, 0.3)
        .from("[data-menu-fade]", { autoAlpha: 0, y: 16, duration: 0.8, stagger: 0.05, ease: "luxe" }, 0.5);
    },
    { scope: root },
  );

  useEffect(() => {
    const el = root.current;
    if (!el || !tl.current) return;
    if (open) {
      scroll.stop();
      tl.current.timeScale(1).play();
      const first = el.querySelector<HTMLElement>("a, button");
      window.setTimeout(() => first?.focus({ preventScroll: true }), 350);
    } else {
      scroll.start();
      tl.current.timeScale(1.6).reverse();
    }
  }, [open]);

  // Escape closes; Tab stays inside the dialog.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        document.querySelector<HTMLElement>('[aria-controls="site-menu"]')?.focus();
        return;
      }
      if (e.key !== "Tab" || !root.current) return;
      const focusables = Array.from(
        root.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
      );
      const menuButton = document.querySelector<HTMLElement>('[aria-controls="site-menu"]');
      if (menuButton) focusables.push(menuButton);
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  // Preview image trails the cursor with inertia.
  useGSAP(
    () => {
      if (!fine || !preview.current) return;
      const xTo = gsap.quickTo(preview.current, "x", { duration: 0.9, ease: "power3.out" });
      const yTo = gsap.quickTo(preview.current, "y", { duration: 0.9, ease: "power3.out" });
      const move = (e: PointerEvent) => {
        xTo(e.clientX);
        yTo(e.clientY);
      };
      window.addEventListener("pointermove", move);
      return () => window.removeEventListener("pointermove", move);
    },
    { dependencies: [fine] },
  );

  return (
    <div
      ref={root}
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      aria-hidden={!open}
      inert={!open}
      className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-night text-cream"
      data-lenis-prevent
    >
      {fine && (
        <div
          ref={preview}
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-0 aspect-[4/5] w-[15rem] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[999px_999px_1.25rem_1.25rem] transition-opacity duration-500"
          style={{ opacity: active === null ? 0 : 1 }}
        >
          {primaryNav.map((item, i) => (
            <Image
              key={item.href}
              src={item.image.src}
              alt=""
              fill
              sizes="15rem"
              className="object-cover transition-[opacity,transform] duration-700 ease-luxe"
              style={{ opacity: active === i ? 1 : 0, transform: active === i ? "scale(1)" : "scale(1.15)" }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 flex min-h-full flex-1 flex-col justify-between px-gutter pb-8 pt-[calc(var(--header-h)+2rem)]">
        <nav aria-label="Menu">
          <ul className="flex flex-col" onPointerLeave={() => setActive(null)}>
            {primaryNav.map((item, i) => (
              <li key={item.href} className="overflow-hidden border-b border-white/10">
                <TransitionLink
                  href={item.href}
                  onClick={() => setOpen(false)}
                  onPointerEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  data-menu-link
                  data-scramble-host
                  className="group flex items-baseline gap-4 py-3 md:gap-8 md:py-4"
                >
                  <span className="eyebrow w-8 shrink-0 text-cream/50">{pad(i + 1)}</span>
                  <span className="font-display text-[clamp(2.6rem,8.5vw,7.5rem)] leading-[0.95] transition-[transform,font-style] duration-700 ease-luxe group-hover:translate-x-4 group-hover:italic">
                    {item.label}
                  </span>
                  <Scramble
                    text={item.caption}
                    className="ml-auto hidden text-sm text-cream/60 md:block"
                  />
                </TransitionLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-12 grid gap-8 text-sm md:grid-cols-3" >
          <div data-menu-fade>
            <p className="eyebrow mb-3 text-cream/50">Visit</p>
            <p>
              {site.address.street}
              <br />
              {site.address.locality} {site.address.postalCode}, {site.address.country}
            </p>
          </div>
          <div data-menu-fade>
            <p className="eyebrow mb-3 text-cream/50">Talk to us</p>
            <a href={whatsappUrl("Hi Neo Lash!")} target="_blank" rel="noopener noreferrer" className="link-u inline-flex items-center gap-2">
              <WhatsApp size={16} /> {site.whatsapp.display}
            </a>
            <br />
            <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" className="link-u mt-1 inline-flex items-center gap-2">
              <Instagram size={16} /> {site.instagram.handle}
            </a>
          </div>
          <div data-menu-fade className="md:text-right">
            <a href={site.booking} target="_blank" rel="noopener noreferrer" className="btn btn-light">
              Book your appointment <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
