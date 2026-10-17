import { create } from "zustand";

type Phase = "loading" | "covering" | "revealing" | "idle";

type ExperienceState = {
  /** Preloader finished (or skipped for returning visitors). */
  loaded: boolean;
  /** Page transition phase; reveals wait for "idle" or "revealing". */
  phase: Phase;
  /** Increments on every completed client navigation. */
  navigation: number;
  menuOpen: boolean;
  quickViewSlug: string | null;
  cursorLabel: string | null;
  /** on: full WebGL; lite: no image planes (touch / low power); off: DOM only. */
  webgl: "pending" | "on" | "lite" | "off";
  setLoaded: () => void;
  setPhase: (phase: Phase) => void;
  completeNavigation: () => void;
  setMenuOpen: (open: boolean) => void;
  setQuickView: (slug: string | null) => void;
  setCursorLabel: (label: string | null) => void;
  setWebgl: (state: "on" | "lite" | "off") => void;
};

export const useExperience = create<ExperienceState>((set) => ({
  loaded: false,
  phase: "loading",
  navigation: 0,
  menuOpen: false,
  quickViewSlug: null,
  cursorLabel: null,
  webgl: "pending",
  setLoaded: () => set({ loaded: true, phase: "idle" }),
  setPhase: (phase) => set({ phase }),
  completeNavigation: () => set((s) => ({ navigation: s.navigation + 1 })),
  setMenuOpen: (menuOpen) => set({ menuOpen }),
  setQuickView: (quickViewSlug) => set({ quickViewSlug }),
  setCursorLabel: (cursorLabel) => set({ cursorLabel }),
  setWebgl: (webgl) => set({ webgl }),
}));

/** True once content may play its entrance animations. */
export const selectRevealReady = (s: ExperienceState) =>
  s.loaded && (s.phase === "idle" || s.phase === "revealing");
