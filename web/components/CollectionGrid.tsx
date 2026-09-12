"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BASE_PRICE, type ProductCategory } from "@/lib/products";
import type { Product, ProductSeason } from "@/sanity/lib/queries";

type Filter = "all" | ProductCategory;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "Tous" },
  { value: "home", label: "Domicile" },
  { value: "away", label: "Extérieur" },
  { value: "keeper", label: "Gardien" },
];

const SEASONS: { value: ProductSeason; label: string }[] = [
  { value: "ete", label: "Été" },
  { value: "hiver", label: "Hiver" },
];

export function CollectionGrid({
  initialFilter,
  initialSeason,
  products,
}: {
  initialFilter: Filter;
  initialSeason: ProductSeason;
  products: Product[];
}) {
  const [season, setSeason] = useState<ProductSeason>(initialSeason);
  const [filter, setFilter] = useState<Filter>(initialFilter);

  const bySeason = products.filter((p) => p.season === season);
  const visible = filter === "all" ? bySeason : bySeason.filter((p) => p.category === filter);

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
          <div className="filters" role="group" aria-label="Filtrer par catégorie">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                className="filter-btn"
                aria-pressed={filter === f.value}
                onClick={() => setFilter(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>

          {visible.length === 0 && (
            <p className="faint">
              Aucun maillot pour l’instant. Ajoute-en depuis <Link href="/studio" style={{ textDecoration: "underline" }}>l&apos;espace produits</Link>.
            </p>
          )}

          <div className="product-grid">
            {visible.map((product) => (
              <Link key={product.slug} href={`/produit/${product.slug}`} className="card">
                <div className="card-media">
                  <Image src={product.image} alt={product.name} fill sizes="(max-width: 1080px) 50vw, 20vw" />
                  {product.badge && <span className="badge">{product.badge}</span>}
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
