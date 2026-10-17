"use client";

import { useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { useGlEntry } from "@/lib/gl/useGlEntry";
import { useRevealReady } from "@/lib/motion/useRevealReady";
import { useReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/cn";
import type { ImageRef } from "@/data/types";

type GlImageProps = {
  image: ImageRef;
  sizes: string;
  className?: string;
  imageClassName?: string;
  /** CSS radius in px, mirrored by the shader. */
  radius?: number;
  /** Product shots on white: blend the white into this tile colour. */
  tile?: string;
  priority?: boolean;
  cursor?: string;
  reveal?: boolean;
  children?: ReactNode;
  viewTransitionName?: string;
};

/**
 * An image the WebGL layer can take over: ripple distortion on hover and a
 * velocity bend on scroll. Without WebGL it falls back to CSS zoom + clip-path.
 */
export function GlImage({
  image,
  sizes,
  className,
  imageClassName,
  radius = 0,
  tile,
  priority,
  cursor,
  reveal = true,
  children,
  viewTransitionName,
}: GlImageProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);
  const [active, setActive] = useState(false);
  const ready = useRevealReady();
  const reduced = useReducedMotion();
  const gl = useGlEntry("image", wrap, {
    img,
    radius,
    tint: tile,
    initialReveal: reveal ? 0 : 1,
    onReady: () => setActive(true),
  });

  useGSAP(
    (_, contextSafe) => {
      const el = wrap.current;
      if (!el || !ready || !contextSafe) return;
      if (reveal && !reduced) {
        gsap
          .timeline({ scrollTrigger: { trigger: el, start: "top 90%", once: true } })
          .fromTo(el, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "silk" })
          .fromTo(img.current, { scale: 1.2 }, { scale: 1, duration: 1.8, ease: "luxe" }, 0)
          .add(() => {
            if (gl.current) gl.current.reveal = 1;
          }, 0);
      } else if (gl.current) {
        gl.current.reveal = 1;
      }

      const move = contextSafe((e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        if (gl.current) {
          gl.current.mouse = [(e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height];
        }
      });
      const enter = contextSafe(() => {
        if (gl.current) gl.current.hover = 1;
      });
      const leave = contextSafe(() => {
        if (gl.current) gl.current.hover = 0;
      });
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerenter", enter);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerenter", enter);
        el.removeEventListener("pointerleave", leave);
      };
    },
    { dependencies: [ready, reduced, reveal], scope: wrap, revertOnUpdate: true },
  );

  return (
    <div
      ref={wrap}
      data-cursor={cursor}
      data-gl={active ? "on" : "off"}
      className={cn(
        "group/gl relative isolate overflow-hidden",
        tile && !active && "bg-tile",
        className,
      )}
      style={{ borderRadius: radius, viewTransitionName }}
    >
      <Image
        ref={img}
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn(
          "object-cover transition-[opacity,transform] duration-700 ease-luxe",
          tile && "blend-tile",
          active ? "opacity-0" : "opacity-100 group-hover/gl:scale-[1.04]",
          imageClassName,
        )}
        style={{ backgroundColor: tile ? undefined : image.color }}
      />
      {children}
    </div>
  );
}
