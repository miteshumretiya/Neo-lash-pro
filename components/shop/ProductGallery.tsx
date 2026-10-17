"use client";

import { useRef, useState, ViewTransition, type KeyboardEvent, type PointerEvent } from "react";
import Image from "next/image";
import type { Product } from "@/data/types";
import { useFinePointer } from "@/lib/hooks";
import { cn } from "@/lib/cn";

/**
 * Product images: thumbnails, hover zoom that follows the pointer (mouse),
 * swipe between shots (touch). The frame shares its view-transition name with
 * the product card, so the card image morphs into it on navigation.
 */
export function ProductGallery({ product }: { product: Product }) {
  const { images } = product;
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const frame = useRef<HTMLDivElement>(null);
  const swipeStart = useRef<number | null>(null);
  const thumbs = useRef<(HTMLButtonElement | null)[]>([]);
  const fine = useFinePointer();

  const go = (index: number, focus = false) => {
    const next = (index + images.length) % images.length;
    setActive(next);
    if (focus) thumbs.current[next]?.focus();
  };

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !frame.current) return;
    const r = frame.current.getBoundingClientRect();
    frame.current.style.setProperty("--zx", `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
    frame.current.style.setProperty("--zy", `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
  };

  const onThumbKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    if (!(e.key in keys)) return;
    e.preventDefault();
    go(active + keys[e.key], true);
  };

  return (
    <div className="flex flex-col-reverse gap-3 lg:flex-row lg:gap-4">
      {images.length > 1 && (
        <div
          role="tablist"
          aria-label="Product images"
          aria-orientation="vertical"
          onKeyDown={onThumbKey}
          className="no-scrollbar flex gap-2 overflow-x-auto lg:w-[4.5rem] lg:shrink-0 lg:flex-col lg:overflow-visible"
        >
          {images.map((image, i) => (
            <button
              key={image.src}
              ref={(el) => {
                thumbs.current[i] = el;
              }}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Image ${i + 1} of ${images.length}: ${image.alt}`}
              tabIndex={i === active ? 0 : -1}
              onClick={() => go(i)}
              className={cn(
                "relative aspect-[4/5] w-16 shrink-0 overflow-hidden rounded-xl bg-tile transition-opacity duration-500 lg:w-full",
                i === active ? "ring-1 ring-ink ring-offset-2 ring-offset-canvas" : "opacity-55 hover:opacity-100",
              )}
            >
              <Image src={image.src} alt="" fill sizes="5rem" className="blend-tile object-cover" />
            </button>
          ))}
        </div>
      )}

      <ViewTransition name={`product-${product.slug}`} share="morph" default="none">
        <div
          ref={frame}
          data-cursor={fine ? (zoom ? "Move" : "Zoom") : undefined}
          onPointerEnter={(e) => e.pointerType === "mouse" && setZoom(true)}
          onPointerLeave={() => setZoom(false)}
          onPointerMove={onMove}
          onPointerDown={(e) => {
            if (e.pointerType !== "mouse") swipeStart.current = e.clientX;
          }}
          onPointerUp={(e) => {
            if (swipeStart.current === null) return;
            const dx = e.clientX - swipeStart.current;
            swipeStart.current = null;
            if (Math.abs(dx) > 40) go(active + (dx < 0 ? 1 : -1));
          }}
          className="relative aspect-[4/5] flex-1 touch-pan-y overflow-hidden rounded-[22px] bg-tile lg:aspect-auto lg:h-[min(calc(100svh-var(--header-h)-2.5rem),58rem)]"
        >
          {images.map((image, i) => (
            <Image
              key={image.src}
              src={image.src}
              alt={i === active ? image.alt : ""}
              aria-hidden={i !== active}
              fill
              priority={i === 0}
              sizes="(max-width: 1024px) 100vw, 52vw"
              className={cn(
                "blend-tile object-cover transition-[opacity,transform] duration-700 ease-luxe",
                i === active ? "opacity-100" : "opacity-0",
                zoom && i === active ? "scale-[1.85]" : "scale-100",
              )}
              style={{ transformOrigin: "var(--zx, 50%) var(--zy, 50%)" }}
            />
          ))}
          {images.length > 1 && (
            <div aria-hidden="true" className="absolute inset-x-0 bottom-4 flex justify-center gap-1.5 lg:hidden">
              {images.map((image, i) => (
                <span
                  key={image.src}
                  className={cn("h-1.5 rounded-full bg-ink transition-all duration-500", i === active ? "w-5" : "w-1.5 opacity-30")}
                />
              ))}
            </div>
          )}
        </div>
      </ViewTransition>
    </div>
  );
}
