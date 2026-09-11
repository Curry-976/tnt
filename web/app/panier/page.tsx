"use client";

import Image from "next/image";
import Link from "next/link";
import { itemUnitPrice, useCart } from "@/lib/cart-context";

export default function PanierPage() {
  const { items, subtotal, setQty, removeItem, hydrated } = useCart();

  return (
    <>
      <div className="page-head">
        <div className="page-eyebrow">Panier</div>
        <h1 className="page-title">Ton panier</h1>
      </div>

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
                  <Image src={item.image} alt={item.name} fill sizes="84px" />
                </div>
                <div>
                  <div className="cart-meta-name">TORROW NAM – {item.name}</div>
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
    </>
  );
}
