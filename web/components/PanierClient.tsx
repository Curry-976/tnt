"use client";

import Image from "next/image";
import Link from "next/link";
import { itemUnitPrice, useCart } from "@/lib/cart-context";
import type { Product } from "@/sanity/lib/queries";
import { badgeColorStyle } from "@/lib/badge-colors";
import { CartQuickAddButton } from "./CartQuickAddButton";

export function PanierClient({ products }: { products: Product[] }) {
  const { items, subtotal, setQty, removeItem, hydrated } = useCart();

  const cartSlugs = new Set(items.map((i) => i.slug));
  const suggestions = products.filter((p) => !cartSlugs.has(p.slug));

  return (
    <>
      {!hydrated ? null : items.length === 0 ? (
        <div className="panel cart-empty">
          <p className="faint">Ton panier est vide pour l’instant.</p>
          <Link href="/collection" className="cta" style={{ marginTop: 18, display: "inline-flex" }}>
            <span>Découvrir la collection</span>
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-list">
            {items.map((item) => (
              <div key={item.id} className="panel cart-row">
                <div className="cart-thumb">
                  <Image src={item.image} alt={`Maillot ${item.name}`} fill sizes="84px" />
                </div>
                <div>
                  <div className="cart-meta-name">{item.name}</div>
                  <div className="cart-meta-detail">
                    Taille {item.size}
                    {item.floque && item.nom && item.numero ? ` · Flocage ${item.nom} ${item.numero}` : ""}
                  </div>
                  <button type="button" className="cart-remove" onClick={() => removeItem(item.id)}>
                    Retirer
                  </button>
                </div>
                <div className="qty-stepper">
                  <button type="button" aria-label="Diminuer" onClick={() => setQty(item.id, item.qty - 1)}>
                    −
                  </button>
                  <span>{item.qty}</span>
                  <button type="button" aria-label="Augmenter" onClick={() => setQty(item.id, Math.min(9, item.qty + 1))}>
                    +
                  </button>
                </div>
                <div className="price">{itemUnitPrice(item) * item.qty} €</div>
              </div>
            ))}
          </div>

          <div className="panel">
            <h2 style={{ margin: 0, fontSize: 20 }}>Récapitulatif</h2>
            <div className="cart-summary-row">
              <span className="faint">Sous-total</span>
              <span>{subtotal} €</span>
            </div>
            <div className="cart-summary-row">
              <span className="faint">Livraison</span>
              <span className="faint">Calculée au checkout</span>
            </div>
            <div className="cart-summary-total">
              <span>Total</span>
              <span>{subtotal} €</span>
            </div>
            <Link href="/checkout" className="cta" style={{ width: "100%", marginTop: 18 }}>
              <span>Passer au paiement</span>
            </Link>
            <p className="form-note" style={{ marginTop: 12 }}>
              Livraison France métropolitaine 15 à 20 jours. Non disponible en DOM-TOM pour l’instant.
            </p>
          </div>
        </div>
      )}

      {hydrated && suggestions.length > 0 && (
        <div className="panel" style={{ marginTop: 32 }}>
          <div className="panel-head">
            <h2>Complète ta commande</h2>
          </div>
          <div className="product-grid">
            {suggestions.map((product) => (
              <div key={product.slug} className="card">
                <Link
                  href={`/produit/${product.slug}`}
                  className="card-media"
                  style={{ display: "block", opacity: product.outOfStock ? 0.6 : undefined }}
                >
                  <Image src={product.image} alt={`Maillot ${product.name}`} fill sizes="(max-width: 1080px) 50vw, 20vw" />
                  {product.outOfStock ? (
                    <span className="badge badge-outofstock">Rupture de stock</span>
                  ) : (
                    product.badge && (
                      <span className="badge" style={badgeColorStyle(product.badgeColor)}>
                        {product.badge}
                      </span>
                    )
                  )}
                </Link>
                <div className="card-name">{product.name}</div>
                <div className="card-row">
                  <span className="price">{product.price} €</span>
                  <CartQuickAddButton product={product} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
