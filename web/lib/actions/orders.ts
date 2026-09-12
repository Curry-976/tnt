"use server";

import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { auth } from "@/auth";
import { isAdminEmail } from "@/lib/admin";
import { registerTracking } from "@/lib/aftership";

export type ActionState = { error: string | null; success?: boolean };

export async function setOrderTrackingAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await auth();
  if (!isAdminEmail(session?.user?.email)) {
    return { error: "Non autorisé." };
  }

  const orderId = Number(formData.get("orderId"));
  const trackingNumber = String(formData.get("trackingNumber") ?? "").trim();
  const trackingCarrierSlug = String(formData.get("trackingCarrierSlug") ?? "").trim();
  if (!orderId || !trackingNumber) {
    return { error: "Numéro de suivi manquant." };
  }

  try {
    await registerTracking(trackingNumber, trackingCarrierSlug || undefined);
  } catch (err) {
    console.error("[orders] Échec de l'enregistrement AfterShip :", err);
    return { error: "Impossible d'enregistrer ce numéro de suivi auprès d'AfterShip." };
  }

  await db
    .update(orders)
    .set({ trackingNumber, trackingCarrierSlug: trackingCarrierSlug || null })
    .where(eq(orders.id, orderId));

  return { error: null, success: true };
}
