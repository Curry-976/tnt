"use client";

import { useFavorites } from "@/lib/favorites-context";

export function FavoriteButton({
  slug,
  variant = "card",
}: {
  slug: string;
  variant?: "card" | "inline";
}) {
  const { isFavorite, toggle } = useFavorites();
  const active = isFavorite(slug);

  return (
    <button
      type="button"
      className={variant === "inline" ? "favorite-btn favorite-btn-inline" : "favorite-btn"}
      aria-pressed={active}
      aria-label={active ? "Retirer des favoris" : "Ajouter aux favoris"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
    >
      <svg width="17" height="17" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
        <path d="M12 20.5s-7.5-4.6-10-9.3C.6 8 2 4.5 5.3 3.6c2.1-.6 4.2.3 5.4 2 .3.4.9.4 1.2 0 1.2-1.7 3.3-2.6 5.4-2 3.3.9 4.7 4.4 3.3 7.6-2.5 4.7-10 9.3-10 9.3Z"></path>
      </svg>
      {variant === "inline" && <span>{active ? "Dans tes favoris" : "Ajouter aux favoris"}</span>}
    </button>
  );
}
