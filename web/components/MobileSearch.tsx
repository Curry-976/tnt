"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function MobileSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = value.trim();
    setOpen(false);
    router.push(q ? `/collection?q=${encodeURIComponent(q)}` : "/collection");
  }

  return (
    <div className="mobile-search">
      <button
        type="button"
        className="nav-action nav-search-icon"
        aria-label={open ? "Fermer la recherche" : "Rechercher"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
            <path d="M6 6l12 12M18 6 6 18"></path>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
            <circle cx="10.5" cy="10.5" r="6.5"></circle>
            <path d="M15.5 15.5 21 21"></path>
          </svg>
        )}
      </button>

      {open && (
        <form className="mobile-search-panel" onSubmit={handleSubmit} role="search">
          <input
            type="search"
            className="mobile-search-input"
            placeholder="Rechercher un maillot"
            aria-label="Rechercher un maillot"
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button type="submit" className="mobile-search-submit" aria-label="Lancer la recherche">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
              <circle cx="10.5" cy="10.5" r="6.5"></circle>
              <path d="M15.5 15.5 21 21"></path>
            </svg>
          </button>
        </form>
      )}
    </div>
  );
}
