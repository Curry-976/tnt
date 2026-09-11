"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { BASE_PRICE, FLOQUAGE_PRICE, SIZES, type Product, type Size } from "@/lib/products";

export function ProductConfigurator({ product }: { product: Product }) {
  const { addItem } = useCart();
  const router = useRouter();
  const [size, setSize] = useState<Size>("M");
  const [floque, setFloque] = useState(false);
  const [nom, setNom] = useState("");
  const [numero, setNumero] = useState("");
  const [qty, setQty] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [justAdded, setJustAdded] = useState(false);

  const unitPrice = BASE_PRICE + (floque ? FLOQUAGE_PRICE : 0);
  const total = useMemo(() => unitPrice * qty, [unitPrice, qty]);

  function handleAdd() {
    if (floque && !nom.trim()) {
      setError("Ajoute un nom à floquer, ou décoche le flocage.");
      return;
    }
    if (floque && !numero.trim()) {
      setError("Ajoute un numéro à floquer, ou décoche le flocage.");
      return;
    }
    setError(null);
    addItem({
      slug: product.slug,
      name: product.name,
      image: product.image,
      size,
      floque,
      nom: floque ? nom.trim() : undefined,
      numero: floque ? numero.trim() : undefined,
      qty,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2200);
  }

  return (
    <div className="panel configurator">
      <div className="form-row">
        <span className="form-label">Taille</span>
        <div className="size-grid" role="group" aria-label="Choisir une taille">
          {SIZES.map((s) => (
            <button
              key={s}
              type="button"
              className="size-btn"
              aria-pressed={size === s}
              onClick={() => setSize(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <label className="checkbox-row" style={{ marginTop: 22 }}>
        <input type="checkbox" checked={floque} onChange={(e) => setFloque(e.target.checked)} />
        Flocage nom et numéro (+{FLOQUAGE_PRICE} €)
      </label>

      {floque && (
        <div className="configurator-floquage">
          <div className="form-row">
            <label className="form-label" htmlFor="nom">Nom</label>
            <input
              id="nom"
              className="form-input"
              value={nom}
              maxLength={14}
              placeholder="ex. TORROW"
              onChange={(e) => setNom(e.target.value.toUpperCase())}
            />
          </div>
          <div className="form-row">
            <label className="form-label" htmlFor="numero">Numéro</label>
            <input
              id="numero"
              className="form-input"
              value={numero}
              maxLength={2}
              inputMode="numeric"
              placeholder="ex. 10"
              onChange={(e) => setNumero(e.target.value.replace(/[^0-9]/g, ""))}
            />
          </div>
        </div>
      )}

      {error && <p className="form-error" style={{ marginTop: 14 }}>{error}</p>}

      <div className="configurator-qty">
        <span className="form-label">Quantité</span>
        <div className="qty-stepper">
          <button type="button" aria-label="Diminuer la quantité" onClick={() => setQty((q) => Math.max(1, q - 1))}>
            −
          </button>
          <span>{qty}</span>
          <button type="button" aria-label="Augmenter la quantité" onClick={() => setQty((q) => Math.min(9, q + 1))}>
            +
          </button>
        </div>
      </div>

      <div className="configurator-total">
        <span className="faint">Total</span>
        <span className="price" style={{ fontSize: 22 }}>{total} €</span>
      </div>

      <button type="button" className="cta" style={{ width: "100%", marginTop: 18 }} onClick={handleAdd}>
        <span>{justAdded ? "Ajouté au panier ✓" : "Ajouter au panier"}</span>
      </button>
      {justAdded && (
        <button
          type="button"
          className="ghost"
          style={{ width: "100%", marginTop: 10 }}
          onClick={() => router.push("/panier")}
        >
          Voir le panier
        </button>
      )}
    </div>
  );
}
