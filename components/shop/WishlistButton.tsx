"use client";

import { useRef } from "react";
import { gsap } from "@/lib/motion/gsap";
import { useWishlist } from "@/lib/store/wishlist";
import { Heart } from "@/components/ui/Icons";
import { useMounted } from "@/lib/hooks";
import { cn } from "@/lib/cn";

/** Heart toggle with a particle burst and a bounce on the header badge. */
export function WishlistButton({ slug, name, className }: { slug: string; name: string; className?: string }) {
  const ref = useRef<HTMLButtonElement>(null);
  const mounted = useMounted();
  const saved = useWishlist((s) => s.slugs.includes(slug));
  const toggle = useWishlist((s) => s.toggle);
  const active = mounted && saved;

  const onClick = () => {
    const added = toggle(slug);
    const btn = ref.current;
    if (!btn || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(btn.querySelector("svg"), { scale: 0.6 }, { scale: 1, duration: 0.7, ease: "elastic.out(1.1, 0.4)" });
    const badge = document.querySelector("[data-wishlist-badge]");
    if (badge) gsap.fromTo(badge, { scale: 1.6 }, { scale: 1, duration: 0.8, ease: "elastic.out(1, 0.35)" });
    if (!added) return;
    const rect = btn.getBoundingClientRect();
    for (let i = 0; i < 12; i++) {
      const dot = document.createElement("span");
      const angle = (i / 12) * Math.PI * 2 + Math.random() * 0.4;
      const dist = 26 + Math.random() * 22;
      dot.style.cssText = `position:fixed;left:${rect.left + rect.width / 2}px;top:${rect.top + rect.height / 2}px;width:${4 + Math.random() * 4}px;height:${4 + Math.random() * 4}px;border-radius:999px;pointer-events:none;z-index:96;background:${i % 3 ? "var(--blush)" : "var(--sage)"};transform:translate(-50%,-50%)`;
      document.body.appendChild(dot);
      gsap.to(dot, {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        scale: 0,
        duration: 0.9 + Math.random() * 0.3,
        ease: "power3.out",
        onComplete: () => dot.remove(),
      });
    }
  };

  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={active ? `Remove ${name} from wishlist` : `Save ${name} to wishlist`}
      className={cn(
        "grid size-10 place-items-center rounded-full bg-surface/85 text-ink backdrop-blur transition-colors duration-500 hover:bg-surface",
        active && "text-[#b45d4c]",
        className,
      )}
    >
      <Heart size={17} filled={active} />
    </button>
  );
}
