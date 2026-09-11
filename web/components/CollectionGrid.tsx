"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BASE_PRICE, PRODUCTS, type ProductCategory } from "@/lib/products";

type Filter = "all" | ProductCategory;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "Tous" },
  { value: "home", label: "Domicile" },
  { value: "away", label: "Extérieur" },
  { value: "keeper", label: "Gardien" },
];

export function CollectionGrid({ initialFilter }: { initialFilter: Filter }) {
  const [filter, setFilter] = useState<Filter>(initialFilter);
  const visible = filter === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter);

  return (
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
  );
}
