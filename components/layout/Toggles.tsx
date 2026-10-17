"use client";

import { useEffect, useRef, useState } from "react";
import { Moon, SoundBars, Sun } from "@/components/ui/Icons";
import { sound } from "@/lib/sound";
import { cn } from "@/lib/cn";

export const THEME_KEY = "neolash:theme";

/** Light/dark toggle with a circular View Transition reveal from the button. */
export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    const read = () => setTheme(html.dataset.theme === "dark" ? "dark" : "light");
    read();
    const mo = new MutationObserver(read);
    mo.observe(html, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, []);

  const toggle = () => {
    const html = document.documentElement;
    const next = theme === "dark" ? "light" : "dark";
    const apply = () => {
      html.dataset.theme = next;
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch {}
    };
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduced || !ref.current) {
      apply();
      return;
    }
    const rect = ref.current.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    html.classList.add("theme-switching");
    const transition = document.startViewTransition(apply);
    transition.ready
      .then(() => {
        html.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 900, easing: "cubic-bezier(0.77, 0, 0.175, 1)", pseudoElement: "::view-transition-new(root)" },
        );
      })
      .catch(() => {});
    transition.finished.finally(() => html.classList.remove("theme-switching"));
  };

  return (
    <button
      ref={ref}
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={theme === "dark"}
      className={cn("icon-btn size-10", className)}
    >
      {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}

/** Ambient sound + UI sounds, off by default. */
export function SoundToggle({ className }: { className?: string }) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (!on) return;
    const over = (e: PointerEvent) => {
      const el = (e.target as HTMLElement | null)?.closest("a, button");
      const from = (e.relatedTarget as HTMLElement | null)?.closest?.("a, button");
      if (el && el !== from) sound.hover();
    };
    const click = (e: MouseEvent) => {
      if ((e.target as HTMLElement | null)?.closest("a, button")) sound.click();
    };
    document.addEventListener("pointerover", over);
    document.addEventListener("click", click);
    return () => {
      document.removeEventListener("pointerover", over);
      document.removeEventListener("click", click);
    };
  }, [on]);

  const toggle = async () => {
    if (on) {
      sound.disable();
      setOn(false);
    } else {
      await sound.enable();
      setOn(true);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={on ? "Turn sound off" : "Turn sound on"}
      aria-pressed={on}
      className={cn("icon-btn size-10", className)}
    >
      <SoundBars size={17} active={on} />
    </button>
  );
}
