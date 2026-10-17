"use client";

import {
  createContext,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type MouseEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { gsap, ScrollTrigger } from "@/lib/motion/gsap";
import { scroll } from "@/lib/motion/scroll";
import { useExperience } from "@/lib/store/experience";
import { routeTitles } from "@/lib/site";
import { useReducedMotion } from "@/lib/hooks";

type TransitionContextValue = {
  navigate: (href: string, title?: string) => void;
};

const TransitionContext = createContext<TransitionContextValue>({
  navigate: () => {},
});

export const usePageTransition = () => useContext(TransitionContext);

function titleFor(pathname: string, fallback?: string) {
  if (fallback) return fallback;
  if (routeTitles[pathname]) return routeTitles[pathname];
  const base = "/" + (pathname.split("/")[1] ?? "");
  return routeTitles[base] ?? "Neo Lash®";
}

/**
 * Sage curtain page transition: the curtain wipes up, the destination title
 * rises through it, the route changes underneath, then the curtain lifts.
 * Layout-level chrome (WebGL canvas, cursor, header) never remounts.
 */
export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const curtain = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);
  const busy = useRef(false);
  const target = useRef<string | null>(null);
  const [title, setTitle] = useState("");
  const setPhase = useExperience((s) => s.setPhase);
  const completeNavigation = useExperience((s) => s.completeNavigation);
  const setMenuOpen = useExperience((s) => s.setMenuOpen);

  const navigate = useCallback(
    (href: string, nextTitle?: string) => {
      const url = new URL(href, window.location.href);
      if (url.pathname === window.location.pathname) {
        setMenuOpen(false);
        if (url.hash) scroll.to(url.hash, { offset: -96 });
        else if (url.search === window.location.search) scroll.to(0);
        else router.replace(url.pathname + url.search, { scroll: false });
        return;
      }
      if (busy.current) return;
      busy.current = true;
      target.current = url.pathname;
      setTitle(titleFor(url.pathname, nextTitle));
      setPhase("covering");
      scroll.stop();

      const destination = url.pathname + url.search + url.hash;
      const go = () => {
        startTransition(() => {
          router.push(destination, { scroll: false });
        });
        // If the soft navigation never commits, fall back to a full load.
        window.setTimeout(() => {
          if (target.current === url.pathname) window.location.assign(destination);
        }, 8000);
      };

      if (reduced || !curtain.current) {
        go();
        return;
      }
      const tl = gsap.timeline({ onComplete: go });
      tl.set(curtain.current, { visibility: "visible" })
        .fromTo(
          curtain.current,
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.85, ease: "silk" },
        )
        .fromTo(
          titleRef.current,
          { yPercent: 110 },
          { yPercent: 0, duration: 0.9, ease: "luxe" },
          0.35,
        );
    },
    [reduced, router, setMenuOpen, setPhase],
  );

  // Runs after the new route has committed.
  useEffect(() => {
    if (!busy.current || target.current !== pathname) {
      // Browser back/forward: no curtain, just re-measure.
      ScrollTrigger.refresh();
      return;
    }
    target.current = null;
    setMenuOpen(false);
    scroll.lenis?.resize();
    scroll.start();
    const anchor = window.location.hash ? document.querySelector<HTMLElement>(window.location.hash) : null;
    if (anchor) {
      scroll.to(anchor, { offset: -96, immediate: true });
    } else {
      window.scrollTo(0, 0);
      scroll.lenis?.scrollTo(0, { immediate: true, force: true });
    }

    const reveal = () => {
      ScrollTrigger.refresh();
      setPhase("revealing");
      completeNavigation();
      if (reduced || !curtain.current) {
        busy.current = false;
        setPhase("idle");
        return;
      }
      gsap
        .timeline({
          onComplete: () => {
            busy.current = false;
            setPhase("idle");
            gsap.set(curtain.current, { visibility: "hidden" });
          },
        })
        .to(titleRef.current, { yPercent: -110, duration: 0.7, ease: "silk" })
        .to(curtain.current, { clipPath: "inset(0% 0% 100% 0%)", duration: 1, ease: "silk" }, 0.15);
    };
    // Let the new page paint a frame before lifting the curtain.
    const id = requestAnimationFrame(() => requestAnimationFrame(reveal));
    return () => cancelAnimationFrame(id);
  }, [pathname, reduced, setMenuOpen, setPhase, completeNavigation]);

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      <div
        ref={curtain}
        aria-hidden="true"
        className="invisible fixed inset-0 z-[80] flex flex-col justify-between bg-sage px-gutter py-6 text-night"
        style={{ clipPath: "inset(100% 0% 0% 0%)" }}
      >
        <div className="flex items-center justify-between">
          <span className="font-display text-2xl">Neo Lash®</span>
          <span className="eyebrow">Lash &amp; Brow — Malta</span>
        </div>
        <div className="overflow-hidden pb-[0.08em]">
          <span ref={titleRef} className="block font-display text-mega italic">
            {title}
          </span>
        </div>
      </div>
    </TransitionContext.Provider>
  );
}

type TransitionLinkProps = ComponentProps<typeof Link> & {
  /** Overrides the title shown on the curtain. */
  transitionTitle?: string;
};

/** next/link that plays the curtain transition for internal navigations. */
export function TransitionLink({ href, onClick, transitionTitle, target, children, ...rest }: TransitionLinkProps) {
  const { navigate } = usePageTransition();
  const hrefString = typeof href === "string" ? href : (href.pathname ?? "/");

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      target === "_blank"
    )
      return;
    const url = new URL(hrefString, window.location.href);
    if (url.origin !== window.location.origin) return;
    e.preventDefault();
    navigate(url.pathname + url.search + url.hash, transitionTitle);
  };

  return (
    <Link href={href} target={target} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
