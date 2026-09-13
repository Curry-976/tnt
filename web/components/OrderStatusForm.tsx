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
    <form
      action={formAction}
      style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap", marginBottom: 16 }}
    >
      <input type="hidden" name="orderId" value={orderId} />
      <select name="status" className="form-select" defaultValue={status} style={{ padding: "10px 12px" }}>
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <button type="submit" className="ghost" disabled={pending}>
        <span>{pending ? "…" : "Mettre à jour le statut"}</span>
      </button>
      {state.error && <p className="form-error">{state.error}</p>}
      {state.success && <p className="form-note">Statut mis à jour.</p>}
    </form>
  );
}
