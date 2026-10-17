"use client";

import { startTransition, type ComponentProps, type MouseEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

/**
 * Link to a product page that morphs the card image into the product hero
 * (React <ViewTransition>) instead of playing the curtain. In WebGL mode the
 * DOM image is revealed first so the browser snapshot isn't empty.
 */
export function ProductLink({ href, onClick, children, ...rest }: ComponentProps<typeof Link> & { href: string }) {
  const router = useRouter();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    const card = e.currentTarget.closest("[data-product-card]") ?? e.currentTarget;
    card.querySelectorAll<HTMLElement>("[data-gl]").forEach((el) => (el.dataset.forceDom = "true"));
    requestAnimationFrame(() => {
      startTransition(() => {
        router.push(href, { scroll: true });
      });
    });
  };

  return (
    <Link href={href} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
