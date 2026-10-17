import { mediaManifest, type MediaKey } from "./media.generated";
import type { ImageRef } from "./types";

/** Resolves a self-hosted image (see scripts/media) into an ImageRef. */
export function img(key: MediaKey, alt: string): ImageRef {
  const entry = mediaManifest[key];
  return { src: entry.src, width: entry.width, height: entry.height, color: entry.color, alt };
}

/** Photography used across the site, named by what it shows. */
export const photos = {
  heroLashes: img("stock/lash-volume-macro", "Close-up of a brown eye with full volume lash extensions"),
  lashTexture: img("stock/lash-texture", "Macro of soft, curled natural lashes"),
  eyeAmber: img("stock/eye-amber", "Macro of an amber eye framed by long lashes"),
  eyeNatural: img("stock/eye-natural", "Natural lashes framing a green eye"),
  browBrush: img("stock/brow-brush", "A brow spoolie grooming a freshly shaped brow"),
  applicationClient: img("stock/application-client", "Lash artist applying extensions with tweezers"),
  applicationClose: img("stock/application-close", "Two tweezers isolating and placing a lash extension"),
  applicationVolume: img("site/202211-bella-volume-details-image-1024x1024", "Lash artist placing a volume fan with two tweezers"),
  tweezersHand: img("stock/tweezers-hand", "Hand holding professional lash tweezers"),
  lashStrip: img("stock/lash-strip", "Lash artist lifting a lash from a tray with tweezers"),
  toolsGlove: img("stock/tools-glove", "Gloved hand holding lash tweezers and a spoolie"),
  summitStage: img("stock/summit-stage", "Speaker on stage in front of a lit audience"),
  summitAudience: img("stock/summit-audience", "Audience watching a stage under coloured lights"),
  maltaAerial: img("stock/malta-aerial", "Aerial view of a Maltese harbour lined with yachts"),
  maltaWaterfront: img("stock/malta-valletta-waterfront", "Limestone bastions above the water in Malta"),

  // Neo Lash's own work and studio
  salon: img("site/202211-02", "The Neo Lash studio in St. Julian's with its 'Give your eyes the look they deserve' neon sign"),
  daniela: img("site/202210-dani", "Daniela, founder of Neo Lash, in a white blazer"),
  danielaPortrait: img("site/202211-dailella", "Portrait of Daniela smiling"),
  workNatural: img("site/202212-neolashpro-3", "Close-up of a natural lash set by Neo Lash on a hazel eye"),
  workVolume: img("site/202212-neolashpro-2", "Dark, full lash set by Neo Lash"),
  workBrow: img("site/202212-neolashpro", "Shaped brow and soft lash set by Neo Lash"),
  workHybrid: img("site/202212-neolashpro-1", "Textured lash set by Neo Lash"),
  workWispy: img("site/202212-neolashpro-4", "Wispy lash set by Neo Lash seen in profile"),
  workLift: img("site/202212-img-20221122-143644-640", "Lash set by Neo Lash framing the eye and brow"),
  workSoft: img("site/202212-img-20221122-143819-413", "Soft lash set and groomed brow by Neo Lash"),
  workDense: img("site/202212-img-20221122-143809-988", "Full volume lash set by Neo Lash on a hazel eye"),
  workInstagram: img("site/202212-screenshot-20221127-131540-instagram", "Neo Lash lash set shared on Instagram"),
} as const;
