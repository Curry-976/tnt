"use client";

import { useActionState } from "react";
import { setOrderStatusAction, type ActionState } from "@/lib/actions/orders";

const initialState: ActionState = { error: null };

const STATUS_OPTIONS = [
  { value: "pending", label: "En attente de paiement" },
  { value: "paid", label: "Payée" },
  { value: "processing", label: "En préparation (attente fournisseur)" },
  { value: "shipped", label: "Expédiée" },
  { value: "cancelled", label: "Annulée" },
];

export function OrderStatusForm({ orderId, status }: { orderId: number; status: string }) {
  const [state, formAction, pending] = useActionState(setOrderStatusAction, initialState);

  return (
    <form action={formAction}>
      <input type="hidden" name="orderId" value={orderId} />
      <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
        <select name="status" className="form-select" defaultValue={status} style={{ padding: "10px 12px" }}>
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button type="submit" className="cta" disabled={pending}>
          <span>{pending ? "…" : "Mettre à jour"}</span>
        </button>
      </div>
      {state.error && <p className="form-error" style={{ marginTop: 10 }}>{state.error}</p>}
      {state.success && <p className="form-note" style={{ marginTop: 10 }}>Statut mis à jour.</p>}
    </form>
  );
}
