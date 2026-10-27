"use client";

import { useCart } from "@/lib/cart-context";
import { flyToCartFromElement } from "@/lib/fly-to-cart";
import type { Product } from "@/sanity/lib/queries";

const CART_ICON = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 5h2.2l2.3 10.6h10l1.9-7.6H6.4"></path>
    <circle cx="9.5" cy="19.3" r="1.3"></circle>
    <circle cx="17.5" cy="19.3" r="1.3"></circle>
  </svg>
);

// Sits inside a <Link> card (same nested-interactive-element pattern as
// FavoriteButton) — stopPropagation keeps the click from also navigating.
export function CartQuickAddButton({ product }: { product: Product }) {
  const { addItem } = useCart();

  if (product.outOfStock) {
    return (
      <span className="iconbtn" aria-hidden="true" style={{ opacity: 0.4, cursor: "not-allowed" }}>
        {CART_ICON}
      </span>
    );
  }

  return (
    <button
      type="button"
      className="iconbtn"
      aria-label={`Ajouter ${product.name} au panier`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const card = e.currentTarget.closest(".card");
        flyToCartFromElement(card?.querySelector("img") ?? null, product.image);
        addItem({ slug: product.slug, name: product.name, image: product.image, price: product.price, size: "M", floque: false, qty: 1 });
      }}
    >
      {CART_ICON}
    </button>
  );
}
