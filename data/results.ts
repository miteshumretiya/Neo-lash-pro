import { photos } from "./media";
import type { ImageRef } from "./types";

export type ResultPair = {
  id: string;
  title: string;
  left: { label: string; image: ImageRef };
  right: { label: string; image: ImageRef };
};

/**
 * Pairs shown in the drag-to-compare slider. They currently compare two real
 * Neo Lash sets in different styles; add true before/after photos of the same
 * client here (same framing) and the slider works unchanged.
 */
export const resultPairs: ResultPair[] = [
  {
    id: "natural-volume",
    title: "Natural or volume?",
    left: { label: "Natural", image: photos.workNatural },
    right: { label: "Volume", image: photos.workVolume },
  },
  {
    id: "textured-full",
    title: "Textured or full?",
    left: { label: "Textured", image: photos.workHybrid },
    right: { label: "Full volume", image: photos.workDense },
  },
  {
    id: "brow-lift",
    title: "Lash & brow",
    left: { label: "Shaped brow", image: photos.workBrow },
    right: { label: "Soft lift", image: photos.workSoft },
  },
];
