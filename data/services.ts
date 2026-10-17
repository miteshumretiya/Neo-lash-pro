import { photos } from "./media";
import type { Service } from "./types";

/** Signature treatments. Book any of them on Fresha (site.booking). */
export const services: Service[] = [
  {
    name: "Classic Lash Extensions",
    category: "Lashes",
    description: "One extension on each natural lash for length and definition that still reads as your own.",
    image: photos.workNatural,
  },
  {
    name: "Hybrid Lashes",
    category: "Lashes",
    description: "Classic and volume blended for soft texture, depth and a lightly wispy finish.",
    image: photos.workHybrid,
  },
  {
    name: "Russian Volume",
    category: "Lashes",
    description: "Handmade 2–6D fans of ultra-fine lashes for fullness that stays light on the eye.",
    image: photos.workDense,
  },
  {
    name: "Wet & Wispy Sets",
    category: "Lashes",
    description: "Spiked, textured styles mapped to the shape of your eye for an editorial finish.",
    image: photos.workWispy,
  },
  {
    name: "Lash Lift & Tint",
    category: "Lashes",
    description: "Lifts and tints your natural lashes from the root — no extensions, no mascara.",
    image: photos.eyeNatural,
  },
  {
    name: "Brow Lamination",
    category: "Brows",
    description: "Brushed-up, fuller-looking brows set in place, shaped to balance your features.",
    image: photos.browBrush,
  },
  {
    name: "Brow Shaping & Tint",
    category: "Brows",
    description: "Precise mapping and shaping with a tint that frames the eye and lifts the face.",
    image: photos.workBrow,
  },
  {
    name: "Infills & Removal",
    category: "Lashes",
    description: "Keep your set full every 2–3 weeks, or remove extensions gently and safely.",
    image: photos.workSoft,
  },
];
