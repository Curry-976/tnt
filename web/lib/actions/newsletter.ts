"use server";

import { addContactToBrevo } from "@/lib/brevo";

export type ActionState = { error: string | null; success?: boolean };

export async function subscribeToNewsletterAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email || !email.includes("@")) {
    return { error: "Adresse email invalide." };
  }

  try {
    await addContactToBrevo(email);
  } catch (err) {
    console.error("[newsletter] Échec de l'inscription Brevo :", err);
    return { error: "Impossible de t'inscrire pour le moment." };
  }

  return { error: null, success: true };
}
