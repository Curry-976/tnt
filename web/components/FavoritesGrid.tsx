"use client";

import Image from "next/image";
import Link from "next/link";
import { BASE_PRICE } from "@/lib/products";
import type { Product } from "@/sanity/lib/queries";
import { useFavorites } from "@/lib/favorites-context";
import { FavoriteButton } from "./FavoriteButton";

export function FavoritesGrid({ products }: { products: Product[] }) {
  const { slugs, hydrated } = useFavorites();
  const favorites = products.filter((p) => slugs.includes(p.slug));

  if (!hydrated) return null;

  if (favorites.length === 0) {
    return (
      <p className="faint">
        Aucun favori pour l’instant. Clique sur le cœur d’un maillot depuis{" "}
        <Link href="/collection" style={{ textDecoration: "underline" }}>
          la collection
        </Link>{" "}
        pour le retrouver ici.
      </p>
    );
  }

  return (
    <div className="product-grid">
      {favorites.map((product) => (
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
  );
}
