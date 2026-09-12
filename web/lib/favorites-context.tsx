"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type FavoritesContextValue = {
  slugs: string[];
  count: number;
  isFavorite: (slug: string) => boolean;
  toggle: (slug: string) => void;
  hydrated: boolean;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

const STORAGE_KEY = "tnt-favorites";

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Same pattern as CartProvider: read localStorage only after mount so the
    // server-rendered (empty) state matches the client's first render.
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setSlugs(JSON.parse(raw));
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
    } catch {
      // storage unavailable (private mode, quota) — favorites just won't persist
    }
  }, [slugs, hydrated]);

  const toggle = useCallback((slug: string) => {
    setSlugs((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  }, []);

  const isFavorite = useCallback((slug: string) => slugs.includes(slug), [slugs]);

  const value = useMemo(
    () => ({ slugs, count: slugs.length, isFavorite, toggle, hydrated }),
    [slugs, isFavorite, toggle, hydrated]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within a FavoritesProvider");
  return ctx;
}
