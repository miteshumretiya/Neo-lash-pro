import type { Object3D } from "three";

/**
 * Places a unit plane over a DOM element. The canvas uses an orthographic
 * camera where one world unit equals one CSS pixel, centred on the viewport.
 */
export function syncToElement(object: Object3D, el: HTMLElement, viewport: { width: number; height: number }, margin = 200) {
  const rect = el.getBoundingClientRect();
  const visible =
    rect.width > 0 &&
    rect.height > 0 &&
    rect.bottom > -margin &&
    rect.top < viewport.height + margin &&
    rect.right > -margin &&
    rect.left < viewport.width + margin;
  object.visible = visible;
  if (visible) {
    object.position.x = rect.left + rect.width / 2 - viewport.width / 2;
    object.position.y = viewport.height / 2 - (rect.top + rect.height / 2);
    object.scale.set(rect.width, rect.height, 1);
  }
  return { rect, visible };
}

/** Reads a CSS colour token (e.g. --sage) from the root element. */
export function cssColor(name: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}
