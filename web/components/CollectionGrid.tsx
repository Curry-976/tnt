"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BASE_PRICE } from "@/lib/products";
import type { Product, ProductSeason } from "@/sanity/lib/queries";
import { FavoriteButton } from "./FavoriteButton";
import { ThemedProductImage } from "./ThemedProductImage";
import { badgeColorStyle } from "@/lib/badge-colors";
import { CartQuickAddButton } from "./CartQuickAddButton";

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
                <div className="card-media" style={product.outOfStock ? { opacity: 0.6 } : undefined}>
                  <ThemedProductImage
                    src={product.image}
                    srcDark={product.imageDark}
                    alt={`Maillot ${product.name}`}
                    sizes="(max-width: 1080px) 50vw, 20vw"
                  />
                  {product.outOfStock ? (
                    <span className="badge badge-outofstock">Rupture de stock</span>
                  ) : (
                    product.badge && (
                      <span className="badge" style={badgeColorStyle(product.badgeColor)}>
                        {product.badge}
                      </span>
                    )
                  )}
                  <FavoriteButton slug={product.slug} />
                </div>
                <div className="card-name">{product.name}</div>
                <div className="card-row">
                  <span className="price">{BASE_PRICE} €</span>
                  <CartQuickAddButton product={product} />
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </>
  );
}
