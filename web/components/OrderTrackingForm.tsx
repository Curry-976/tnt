"use client";

import { useActionState } from "react";
import { setOrderTrackingAction, type ActionState } from "@/lib/actions/orders";

const initialState: ActionState = { error: null };

export function OrderTrackingForm({
  orderId,
  trackingNumber,
  trackingCarrierSlug,
}: {
  orderId: number;
  trackingNumber: string;
  trackingCarrierSlug: string;
}) {
  const [state, formAction, pending] = useActionState(setOrderTrackingAction, initialState);

  return (
    <form className="form-row-split" action={formAction}>
      <input type="hidden" name="orderId" value={orderId} />
      <div className="form-row">
        <label className="form-label" htmlFor={`tracking-${orderId}`}>Numéro de suivi</label>
        <input
          id={`tracking-${orderId}`}
          name="trackingNumber"
          type="text"
          className="form-input"
          defaultValue={trackingNumber}
        />
      </div>
      <div className="form-row">
        <label className="form-label" htmlFor={`carrier-${orderId}`}>Transporteur (optionnel)</label>
        <input
          id={`carrier-${orderId}`}
          name="trackingCarrierSlug"
          type="text"
          className="form-input"
          placeholder="ex: colissimo, chronopost…"
          defaultValue={trackingCarrierSlug}
        />
      </div>
      <div style={{ display: "flex", alignItems: "flex-end" }}>
        <button type="submit" className="cta" disabled={pending}>
          <span>{pending ? "Enregistrement…" : "Enregistrer"}</span>
        </button>
      </div>
      {state.error && <p className="form-error">{state.error}</p>}
      {state.success && <p className="form-note">Suivi enregistré.</p>}
    </form>
  );
}
