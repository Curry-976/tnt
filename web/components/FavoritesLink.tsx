"use client";

import Link from "next/link";
import { useFavorites } from "@/lib/favorites-context";

export function FavoritesLink() {
  const { count } = useFavorites();
  return (
    <Link href="/favoris" className="nav-action nav-favorites" aria-label={`Favoris (${count})`} title="Favoris">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M12 20.5s-7.5-4.6-10-9.3C.6 8 2 4.5 5.3 3.6c2.1-.6 4.2.3 5.4 2 .3.4.9.4 1.2 0 1.2-1.7 3.3-2.6 5.4-2 3.3.9 4.7 4.4 3.3 7.6-2.5 4.7-10 9.3-10 9.3Z"></path>
      </svg>
    </Link>
  );
}
