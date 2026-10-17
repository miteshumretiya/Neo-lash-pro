import type Lenis from "lenis";

/**
 * Module-level handle on the Lenis instance so non-React code (page
 * transitions, overlays, anchor links) can stop, start and drive scrolling.
 */
let instance: Lenis | null = null;
let velocity = 0;

export const scroll = {
  set(lenis: Lenis | null) {
    instance = lenis;
  },
  get lenis() {
    return instance;
  },
  /** Smoothed scroll velocity in px/frame, shared with WebGL and marquees. */
  get velocity() {
    return velocity;
  },
  setVelocity(v: number) {
    velocity = v;
  },
  stop() {
    instance?.stop();
    document.documentElement.dataset.scrollLocked = "true";
  },
  start() {
    instance?.start();
    delete document.documentElement.dataset.scrollLocked;
  },
  to(target: number | string | HTMLElement, options?: { offset?: number; immediate?: boolean; duration?: number }) {
    if (instance) {
      instance.scrollTo(target, {
        offset: options?.offset ?? 0,
        immediate: options?.immediate,
        force: true,
        duration: options?.duration ?? 1.6,
        easing: (t: number) => 1 - Math.pow(1 - t, 4),
      });
      return;
    }
    const el =
      typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
    const top =
      typeof el === "number"
        ? el
        : el
          ? el.getBoundingClientRect().top + window.scrollY + (options?.offset ?? 0)
          : 0;
    window.scrollTo({ top, behavior: options?.immediate ? "instant" : "smooth" });
  },
};
