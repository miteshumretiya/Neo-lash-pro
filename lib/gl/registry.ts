/**
 * Bridge between DOM components and the shared WebGL canvas. DOM components
 * register an element; the canvas renders a matching object synced to that
 * element's rect every frame. Mutable `state` is written by the DOM side
 * (hover, reveal, visibility) and read by shaders without React renders.
 */
export type GlKind = "silk" | "particles" | "image" | "stage";

export type GlState = {
  visible: boolean;
  hover: number;
  /** Pointer position inside the element, 0–1. */
  mouse: [number, number];
  /** 0 → hidden, 1 → fully revealed. */
  reveal: number;
  /** Section scroll progress (silk morph, stage rotation). */
  progress: number;
};

export type GlEntry = {
  id: number;
  kind: GlKind;
  el: HTMLElement;
  img?: HTMLImageElement | null;
  state: GlState;
  radius: number;
  /** Multiplies the texture (product shots on white blend into a tile colour). */
  tint?: string;
  onReady?: () => void;
};

type Listener = () => void;

let nextId = 1;
const entries = new Map<number, GlEntry>();
const listeners = new Set<Listener>();
let snapshot: GlEntry[] = [];

const emit = () => {
  snapshot = Array.from(entries.values());
  listeners.forEach((l) => l());
};

export const createGlState = (reveal = 0): GlState => ({
  visible: false,
  hover: 0,
  mouse: [0.5, 0.5],
  reveal,
  progress: 0,
});

export const glRegistry = {
  add(entry: Omit<GlEntry, "id">) {
    const id = nextId++;
    entries.set(id, { ...entry, id });
    emit();
    return id;
  },
  remove(id: number) {
    if (entries.delete(id)) emit();
  },
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  snapshot: () => snapshot,
  anyVisible() {
    for (const e of entries.values()) if (e.state.visible) return true;
    return false;
  },
};

/** Global pointer in client pixels, shared by the silk and particles. */
export const pointer = { x: -9999, y: -9999, active: false };
