"use client";

import { useState } from "react";
import { itemUnitPrice, useCart } from "@/lib/cart-context";

const DOM_TOM_PREFIXES = ["97", "98"];

export function CheckoutForm({ defaultEmail }: { defaultEmail: string }) {
  const { items, subtotal } = useCart();
  const [email, setEmail] = useState(defaultEmail);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!/^\d{5}$/.test(postalCode)) {
      setError("Le code postal doit contenir 5 chiffres.");
      return;
    }
    if (DOM_TOM_PREFIXES.includes(postalCode.slice(0, 2))) {
      setError("Livraison non disponible en DOM-TOM pour l'instant.");
      return;
    }

    setLoading(true);
    const shippingAddress = [
      fullName,
      street,
      `${postalCode} ${city}`,
      phone ? `Tél : ${phone}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const res = await fetch("/api/checkout/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, email, shippingAddress }),
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
          <label className="form-label" htmlFor="checkout-name">Nom complet</label>
          <input
            id="checkout-name"
            type="text"
            className="form-input"
            required
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div className="form-row">
          <label className="form-label" htmlFor="checkout-email">Email</label>
          <input
            id="checkout-email"
            type="email"
            className="form-input"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-row">
          <label className="form-label" htmlFor="checkout-phone">Téléphone (optionnel)</label>
          <input
            id="checkout-phone"
            type="tel"
            className="form-input"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="form-row">
          <label className="form-label" htmlFor="checkout-street">Adresse</label>
          <input
            id="checkout-street"
            type="text"
            className="form-input"
            required
            autoComplete="address-line1"
            placeholder="Numéro et nom de rue"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
          />
        </div>
        <div className="form-row-split">
          <div className="form-row">
            <label className="form-label" htmlFor="checkout-postal">Code postal</label>
            <input
              id="checkout-postal"
              type="text"
              inputMode="numeric"
              pattern="\d{5}"
              maxLength={5}
              className="form-input"
              required
              autoComplete="postal-code"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, "").slice(0, 5))}
            />
          </div>
          <div className="form-row">
            <label className="form-label" htmlFor="checkout-city">Ville</label>
            <input
              id="checkout-city"
              type="text"
              className="form-input"
              required
              autoComplete="address-level2"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
        </div>
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="cta" disabled={loading}>
          <span>{loading ? "Redirection vers le paiement…" : `Payer ${subtotal} €`}</span>
        </button>
        <p className="form-note">
          Paiement sécurisé par Stripe. Tu seras redirigé pour entrer ta carte. Livraison France
          métropolitaine uniquement pour l&apos;instant.
        </p>
      </form>

      <div className="panel">
        <h2 style={{ margin: 0, fontSize: 20 }}>Récapitulatif</h2>
        <div className="cart-list" style={{ marginTop: 16 }}>
          {items.map((item) => (
            <div key={item.id} className="cart-summary-row" style={{ alignItems: "flex-start" }}>
              <span>
                {item.qty}× {item.name} ({item.size})
                {item.floque && item.nom ? ` · ${item.nom} ${item.numero}` : ""}
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
