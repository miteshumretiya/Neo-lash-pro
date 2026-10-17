export type GlMode = "on" | "lite" | "off";

/**
 * Picks the WebGL tier for this device without loading three.js:
 * on — full effects; lite — no image planes (touch or modest hardware);
 * off — DOM only (no WebGL, reduced motion, data saver or very low-end).
 */
export function detectGlMode(): GlMode {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  if (reduced || nav.connection?.saveData) return "off";
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    if (!gl) return "off";
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    return "off";
  }
  const cores = nav.hardwareConcurrency ?? 8;
  const memory = nav.deviceMemory ?? 8;
  if (cores <= 2 || memory <= 2) return "off";
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  return coarse || cores <= 4 || memory <= 4 ? "lite" : "on";
}
