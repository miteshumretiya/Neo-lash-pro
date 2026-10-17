"use client";

import { useRef, useState, type MutableRefObject, type ReactNode } from "react";
import { useGlEntry } from "@/lib/gl/useGlEntry";
import type { GlState } from "@/lib/gl/registry";
import { cn } from "@/lib/cn";

type LayerProps = {
  className?: string;
  radius?: number;
  /** Receives the mutable GL state so sections can drive progress/reveal. */
  stateRef?: MutableRefObject<GlState | null>;
  children?: ReactNode;
};

/**
 * Hero silk surface. Shows an animated CSS gradient until the WebGL silk has
 * rendered its first frame (and permanently when WebGL is unavailable).
 */
export function GlSilk({ className, radius = 0, stateRef }: LayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  useGlEntry("silk", ref, { radius, stateRef, onReady: () => setActive(true) });

  return (
    <div ref={ref} aria-hidden="true" className={cn("absolute inset-0", className)} style={{ borderRadius: radius }}>
      <div
        className="absolute inset-0 transition-opacity duration-1000 ease-glide"
        style={{
          borderRadius: radius,
          opacity: active ? 0 : 1,
          backgroundImage:
            "radial-gradient(60% 70% at 18% 30%, color-mix(in oklab, var(--sage) 70%, transparent), transparent 70%), radial-gradient(55% 60% at 82% 70%, color-mix(in oklab, var(--blush) 75%, transparent), transparent 70%), radial-gradient(70% 60% at 60% 10%, var(--sand), transparent 70%), linear-gradient(120deg, var(--canvas), var(--sand))",
          backgroundSize: "160% 160%",
          animation: "silk-fallback 18s ease-in-out infinite",
        }}
      />
    </div>
  );
}

/** Area the lash-line particles are drawn into. */
export function GlParticles({ className, stateRef }: LayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  useGlEntry("particles", ref, { stateRef });
  return <div ref={ref} aria-hidden="true" className={cn("pointer-events-none absolute", className)} />;
}

/** Stage for the 3D tweezers; children are the DOM fallback. */
export function GlStage({ className, children, stateRef }: LayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  useGlEntry("stage", ref, { stateRef, onReady: () => setActive(true) });
  return (
    <div ref={ref} className={cn("relative", className)}>
      <div className="absolute inset-0 transition-opacity duration-700" style={{ opacity: active ? 0 : 1 }}>
        {children}
      </div>
    </div>
  );
}
