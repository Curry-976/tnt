"use client";

import { useState } from "react";
import { itemUnitPrice, useCart } from "@/lib/cart-context";

export function CheckoutForm({ defaultEmail }: { defaultEmail: string }) {
  const { items, subtotal } = useCart();
  const [email, setEmail] = useState(defaultEmail);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/checkout/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, email, shippingAddress: address }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Une erreur est survenue.");
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Impossible de joindre le serveur de paiement.");
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return <p className="faint">Ton panier est vide.</p>;
  }

  return (
    <div className="cart-layout">
      <form className="panel auth-form" onSubmit={handleSubmit}>
        <h2 style={{ margin: 0, fontSize: 20 }}>Livraison</h2>
        <div className="form-row">
          <label className="form-label" htmlFor="checkout-email">Email</label>
          <input
            id="checkout-email"
            type="email"
            className="form-input"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-row">
          <label className="form-label" htmlFor="checkout-address">Adresse de livraison</label>
          <textarea
            id="checkout-address"
            className="form-input"
            required
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Numéro, rue, code postal, ville"
          />
        </div>
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="cta" disabled={loading}>
          <span>{loading ? "Redirection vers le paiement…" : `Payer ${subtotal} €`}</span>
        </button>
        <p className="form-note">Paiement sécurisé par Stripe. Tu seras redirigé pour entrer ta carte.</p>
      </form>

      <div className="panel">
        <h2 style={{ margin: 0, fontSize: 20 }}>Récapitulatif</h2>
        <div className="cart-list" style={{ marginTop: 16 }}>
          {items.map((item) => (
            <div key={item.id} className="cart-summary-row" style={{ alignItems: "flex-start" }}>
              <span>
                {item.qty}× {item.name} ({item.size})
                {item.floque && item.nom ? ` — ${item.nom} ${item.numero}` : ""}
              </span>
              <span>{itemUnitPrice(item) * item.qty} €</span>
            </div>
          ))}
        </div>
        <div className="cart-summary-total">
          <span>Total</span>
          <span>{subtotal} €</span>
        </div>
      </div>
    </div>
  );
}
