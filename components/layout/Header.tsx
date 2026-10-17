"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/motion/gsap";
import { useExperience } from "@/lib/store/experience";
import { useWishlist } from "@/lib/store/wishlist";
import { primaryNav, site } from "@/lib/site";
import { TransitionLink } from "@/components/motion/Transition";
import { TextRoll } from "@/components/motion/TextRoll";
import { Magnetic } from "@/components/motion/Magnetic";
import { Heart } from "@/components/ui/Icons";
import { SoundToggle, ThemeToggle } from "./Toggles";
import { cn } from "@/lib/cn";

export function Header() {
  const ref = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const menuOpen = useExperience((s) => s.menuOpen);
  const setMenuOpen = useExperience((s) => s.setMenuOpen);
  const wishlistCount = useWishlist((s) => s.slugs.length);

  // Hide on scroll down, reveal on scroll up; glass background after the hero.
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const isHome = pathname === "/";
      const show = gsap.quickTo(el, "yPercent", { duration: 0.6, ease: "luxe" });
      const st = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate(self) {
          const y = self.scroll();
          const threshold = isHome ? window.innerHeight * 0.75 : 40;
          el.dataset.scrolled = y > threshold ? "true" : "false";
          if (useExperience.getState().menuOpen) return show(0);
          show(self.direction === 1 && y > 240 ? -110 : 0);
        },
      });
      el.dataset.scrolled = "false";
      show(0);
      return () => st.kill();
    },
    { dependencies: [pathname], scope: ref },
  );

  return (
    <header
      ref={ref}
      data-scrolled="false"
      data-menu={menuOpen ? "open" : "closed"}
      className={cn(
        "group/header fixed inset-x-0 top-0 z-50 transition-colors duration-500 will-change-transform",
        menuOpen && "text-cream [&_.icon-btn]:border-white/20",
      )}
      style={{ viewTransitionName: "site-header" }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 border-b border-transparent opacity-0 transition-[opacity,border-color] duration-700 ease-luxe group-data-[scrolled=true]/header:border-line group-data-[scrolled=true]/header:opacity-100 group-data-[menu=open]/header:!opacity-0"
        style={{
          background: "color-mix(in oklab, var(--canvas) 72%, transparent)",
          backdropFilter: "blur(18px) saturate(1.2)",
          WebkitBackdropFilter: "blur(18px) saturate(1.2)",
        }}
      />
      <div className="relative flex h-[var(--header-h)] items-center justify-between gap-4 px-gutter">
        <TransitionLink
          href="/"
          aria-label="Neo Lash® — home"
          className="roll-host font-display text-[1.65rem] leading-none tracking-tight"
          data-cursor="Home"
        >
          <TextRoll text="Neo Lash®" />
        </TransitionLink>

        <nav aria-label="Primary" className="absolute left-1/2 hidden -translate-x-1/2 lg:block">
          <ul className="flex items-center gap-7 text-[0.9rem]">
            {primaryNav.slice(0, 5).map((item) => {
              const active = item.href !== "/#services" && pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <TransitionLink
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn("roll-host relative py-2", active && "text-sage-ink")}
                  >
                    <TextRoll text={item.label} />
                    {active && <span className="absolute -bottom-0.5 left-0 h-px w-full bg-current" />}
                  </TransitionLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <ThemeToggle className="hidden md:inline-grid" />
          <SoundToggle className="hidden md:inline-grid" />
          <TransitionLink
            href="/wishlist"
            className="icon-btn relative size-10"
            aria-label={`Wishlist${wishlistCount ? `, ${wishlistCount} items` : ""}`}
          >
            <Heart size={17} />
            <span
              data-wishlist-badge
              className={cn(
                "absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-sage text-[0.65rem] font-semibold text-night transition-transform duration-500 ease-luxe",
                wishlistCount ? "scale-100" : "scale-0",
              )}
              aria-hidden="true"
            >
              {wishlistCount}
            </span>
          </TransitionLink>
          <Magnetic className="hidden sm:inline-flex">
            <a
              href={site.booking}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-solid btn-sm roll-host"
              data-cursor="Book"
            >
              <span data-magnetic-label className="inline-flex items-center gap-2">
                <span className="size-1.5 animate-pulse-dot rounded-full bg-sage" aria-hidden="true" />
                <TextRoll text="Book now" />
              </span>
            </a>
          </Magnetic>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            className="roll-host group/menu flex h-10 items-center gap-3 rounded-full pl-3 pr-1 text-[0.9rem]"
          >
            <span className="hidden xs:inline">
              <TextRoll text={menuOpen ? "Close" : "Menu"} />
            </span>
            <span
              className={cn(
                "relative grid size-10 place-items-center rounded-full transition-colors duration-500",
                menuOpen ? "bg-sage text-night" : "bg-ink text-canvas",
              )}
            >
              <span
                className={cn(
                  "absolute h-px w-4 bg-current transition-transform duration-500 ease-luxe",
                  menuOpen ? "rotate-45" : "-translate-y-[3px]",
                )}
              />
              <span
                className={cn(
                  "absolute h-px w-4 bg-current transition-transform duration-500 ease-luxe",
                  menuOpen ? "-rotate-45" : "translate-y-[3px]",
                )}
              />
              <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
