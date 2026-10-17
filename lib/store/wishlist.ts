import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type WishlistState = {
  slugs: string[];
  toggle: (slug: string) => boolean;
  has: (slug: string) => boolean;
  clear: () => void;
};

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      slugs: [],
      toggle: (slug) => {
        const added = !get().slugs.includes(slug);
        set({ slugs: added ? [...get().slugs, slug] : get().slugs.filter((s) => s !== slug) });
        return added;
      },
      has: (slug) => get().slugs.includes(slug),
      clear: () => set({ slugs: [] }),
    }),
    {
      name: "neolash-wishlist",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);
