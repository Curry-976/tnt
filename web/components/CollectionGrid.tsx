"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BASE_PRICE } from "@/lib/products";
import type { Product, ProductSeason } from "@/sanity/lib/queries";
import { FavoriteButton } from "./FavoriteButton";

const SEASONS: { value: ProductSeason; label: string }[] = [
  { value: "ete", label: "Été" },
  { value: "hiver", label: "Hiver" },
];

export function CollectionGrid({
  initialSeason,
  initialQuery,
  products,
}: {
  initialSeason: ProductSeason;
  initialQuery: string;
  products: Product[];
}) {
  const [season, setSeason] = useState<ProductSeason>(initialSeason);
  const [query, setQuery] = useState(initialQuery);

  const bySeason = products.filter((p) => p.season === season);
  const normalizedQuery = query.trim().toLowerCase();
  const visible = useMemo(
    () =>
      normalizedQuery
        ? bySeason.filter(
            (p) =>
              p.name.toLowerCase().includes(normalizedQuery) ||
              p.description.toLowerCase().includes(normalizedQuery)
          )
        : bySeason,
    [bySeason, normalizedQuery]
  );

  return (
    <>
      <div className="season-tabs" role="group" aria-label="Filtrer par saison">
        {SEASONS.map((s) => (
          <button
            key={s.value}
            type="button"
            className="season-tab"
            aria-pressed={season === s.value}
            onClick={() => setSeason(s.value)}
          >
            {s.label}
            {s.value === "hiver" && <span className="season-tab-soon">Bientôt disponible</span>}
          </button>
        ))}
      </div>

      {season === "hiver" ? (
        <div className="panel season-soon-panel">
          <p className="faint">
            La collection Hiver arrive bientôt. Reviens vite ou{" "}
            <Link href="/contact" style={{ textDecoration: "underline" }}>
              contacte-nous
            </Link>{" "}
            pour être prévenu·e.
          </p>
        </div>
      ) : (
        <>
          <div className="form-row" style={{ maxWidth: 320, marginBottom: 22 }}>
            <input
              type="search"
              className="form-input"
              placeholder="Rechercher un maillot…"
              aria-label="Rechercher un maillot"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {visible.length === 0 && (
            <p className="faint">
              {normalizedQuery ? (
                "Aucun maillot ne correspond à ta recherche."
              ) : (
                <>
                  Aucun maillot pour l’instant. Ajoute-en depuis{" "}
                  <Link href="/studio" style={{ textDecoration: "underline" }}>l&apos;espace produits</Link>.
                </>
              )}
            </p>
          )}

          <div className="product-grid">
            {visible.map((product) => (
              <Link key={product.slug} href={`/produit/${product.slug}`} className="card">
                <div className="card-media">
                  <Image src={product.image} alt={product.name} fill sizes="(max-width: 1080px) 50vw, 20vw" />
                  {product.badge && <span className="badge">{product.badge}</span>}
                  <FavoriteButton slug={product.slug} />
                </div>
                <div className="card-name">TORROW NAM – {product.name}</div>
                <div className="card-row">
                  <span className="price">{BASE_PRICE} €</span>
                  <span className="iconbtn" aria-hidden="true">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 5h2.2l2.3 10.6h10l1.9-7.6H6.4"></path>
                      <circle cx="9.5" cy="19.3" r="1.3"></circle>
                      <circle cx="17.5" cy="19.3" r="1.3"></circle>
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </>
  );
}
