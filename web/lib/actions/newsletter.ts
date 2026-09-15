"use server";

import { headers } from "next/headers";
import { addContactToBrevo } from "@/lib/brevo";
import { isRateLimited, ipFromForwardedFor } from "@/lib/rate-limit";
import { verifyTurnstileToken } from "@/lib/turnstile";

export type ActionState = { error: string | null; success?: boolean };

export async function subscribeToNewsletterAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const website = String(formData.get("website") ?? ""); // honeypot
  const renderedAt = Number(formData.get("renderedAt") ?? 0);
  const turnstileToken = String(formData.get("turnstileToken") ?? "");

  const ip = ipFromForwardedFor((await headers()).get("x-forwarded-for"));
  if (isRateLimited(`newsletter:${ip}`, { limit: 5, windowMs: 10 * 60 * 1000 })) {
    return { error: "Trop de tentatives, réessaie un peu plus tard." };
  }

  // Honeypot filled or submitted too fast to be human -> silently "succeed"
  // so a bot doesn't learn its submission was rejected.
  if (website || (renderedAt && Date.now() - renderedAt < 2000)) {
    return { error: null, success: true };
  }

  if (!email || !email.includes("@")) {
    return { error: "Adresse email invalide." };
  }

  const turnstileOk = await verifyTurnstileToken(turnstileToken || null, ip);
  if (!turnstileOk) {
    return { error: "Vérification anti-robot échouée, réessaie." };
  }

  try {
    await addContactToBrevo(email);
  } catch (err) {
    console.error("[newsletter] Échec de l'inscription Brevo :", err);
    return { error: "Impossible de t'inscrire pour le moment." };
  }

  return { error: null, success: true };
}
