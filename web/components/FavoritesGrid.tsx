"use client";

import Link from "next/link";
import { BASE_PRICE } from "@/lib/products";
import type { Product } from "@/sanity/lib/queries";
import { useFavorites } from "@/lib/favorites-context";
import { FavoriteButton } from "./FavoriteButton";
import { ThemedProductImage } from "./ThemedProductImage";
import { badgeColorStyle } from "@/lib/badge-colors";
import { CartQuickAddButton } from "./CartQuickAddButton";

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
          <div className="card-media" style={product.outOfStock ? { opacity: 0.6 } : undefined}>
            <ThemedProductImage
              src={product.image}
              srcDark={product.imageDark}
              alt={product.name}
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
  );
}
