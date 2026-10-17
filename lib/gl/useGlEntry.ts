"use client";

import { useEffect, useLayoutEffect, useRef, type MutableRefObject, type RefObject } from "react";
import { createGlState, glRegistry, type GlKind, type GlState } from "./registry";
import { useExperience } from "@/lib/store/experience";

type Options = {
  img?: RefObject<HTMLImageElement | null>;
  /** Corner radius in px; defaults to the element's computed border radius. */
  radius?: number;
  tint?: string;
  initialReveal?: number;
  onReady?: () => void;
  /** Mirrors the GL state into a ref owned by the caller's parent. */
  stateRef?: MutableRefObject<GlState | null>;
};

/**
 * Registers a DOM element with the WebGL canvas and tracks its visibility.
 * Returns the mutable state the canvas reads (null while WebGL is off).
 */
export function useGlEntry(kind: GlKind, ref: RefObject<HTMLElement | null>, options: Options = {}) {
  const webgl = useExperience((s) => s.webgl);
  const state = useRef<GlState | null>(null);
  const onReady = useRef(options.onReady);
  useLayoutEffect(() => {
    onReady.current = options.onReady;
  });
  const { img, radius, tint, initialReveal = 0, stateRef } = options;

  useEffect(() => {
    const el = ref.current;
    const allowed = webgl === "on" || (webgl === "lite" && kind !== "image");
    if (!el || !allowed) return;
    const glState = createGlState(initialReveal);
    state.current = glState;
    if (stateRef) stateRef.current = glState;
    const id = glRegistry.add({
      kind,
      el,
      img: img?.current,
      state: glState,
      radius: radius ?? (parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0),
      tint,
      onReady: () => onReady.current?.(),
    });
    const io = new IntersectionObserver(
      ([entry]) => {
        glState.visible = entry.isIntersecting;
      },
      { rootMargin: "20% 0px 20% 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      glRegistry.remove(id);
      state.current = null;
      if (stateRef) stateRef.current = null;
    };
  }, [webgl, kind, ref, img, radius, tint, initialReveal, stateRef]);

  return state;
}
