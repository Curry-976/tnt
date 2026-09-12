"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BASE_PRICE } from "@/lib/products";

type SearchResult = { slug: string; name: string; image: string };

export function MobileSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
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
    setClosing(true);
  }

  function handleCloseAnimationEnd() {
    if (!closing) return;
    setOpen(false);
    setClosing(false);
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
        onClick={() => {
          setClosing(false);
          setOpen(true);
        }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <div
          className={`mobile-search-overlay${closing ? " mobile-search-overlay--closing" : ""}`}
          onAnimationEnd={handleCloseAnimationEnd}
        >
          <form className="mobile-search-header" onSubmit={handleSubmit} role="search">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
                clipRule="evenodd"
              />
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
                        <div className="faint">{BASE_PRICE} €</div>
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
