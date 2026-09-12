"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BASE_PRICE } from "@/lib/products";

type SearchResult = { slug: string; name: string; image: string; categoryLabel: string };

export function MobileSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = value.trim();
    if (!q) return;
    // Debounced network request in response to typing, not a state sync —
    // the loading flag here reflects a fetch this same effect kicks off.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    const timeout = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(q)}`)
        .then((res) => res.json())
        .then((data) => setResults(data.results ?? []))
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(timeout);
  }, [value]);

  function handleValueChange(next: string) {
    setValue(next);
    if (!next.trim()) {
      setResults([]);
      setLoading(false);
    }
  }

  function close() {
    setOpen(false);
    setValue("");
    setResults([]);
  }

  function goToResults() {
    const q = value.trim();
    close();
    router.push(q ? `/collection?q=${encodeURIComponent(q)}` : "/collection");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    goToResults();
  }

  return (
    <div className="mobile-search">
      <button
        type="button"
        className="nav-action nav-search-icon"
        aria-label="Rechercher"
        onClick={() => setOpen(true)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
          <circle cx="10.5" cy="10.5" r="6.5"></circle>
          <path d="M15.5 15.5 21 21"></path>
        </svg>
      </button>

      {open && (
        <div className="mobile-search-overlay">
          <form className="mobile-search-header" onSubmit={handleSubmit} role="search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
              <circle cx="10.5" cy="10.5" r="6.5"></circle>
              <path d="M15.5 15.5 21 21"></path>
            </svg>
            <input
              type="search"
              className="mobile-search-input"
              placeholder="Rechercher un maillot"
              aria-label="Rechercher un maillot"
              autoFocus
              value={value}
              onChange={(e) => handleValueChange(e.target.value)}
            />
            <button type="button" className="mobile-search-cancel" onClick={close}>
              Annuler
            </button>
          </form>

          <div className="mobile-search-body">
            {loading && <p className="faint">Recherche…</p>}

            {!loading && value.trim() && results.length === 0 && (
              <p className="faint">Aucun maillot ne correspond à ta recherche.</p>
            )}

            {results.length > 0 && (
              <>
                <div className="mobile-search-results">
                  {results.map((product) => (
                    <Link key={product.slug} href={`/produit/${product.slug}`} className="mobile-search-result" onClick={close}>
                      <div className="mobile-search-result-media">
                        <Image src={product.image} alt={product.name} fill sizes="64px" />
                      </div>
                      <div>
                        <div className="mobile-search-result-name">TORROW NAM – {product.name}</div>
                        <div className="faint">{product.categoryLabel} · {BASE_PRICE} €</div>
                      </div>
                    </Link>
                  ))}
                </div>
                <button type="button" className="ghost" onClick={goToResults}>
                  Voir tous les résultats
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
