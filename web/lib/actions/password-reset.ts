"use server";

import { randomBytes, createHash } from "node:crypto";
import { headers } from "next/headers";
import bcrypt from "bcryptjs";
import { eq, and, gt } from "drizzle-orm";
import { db } from "@/lib/db";
import { users, passwordResetTokens } from "@/lib/db/schema";
import { sendPasswordResetEmail } from "@/lib/email";
import { SITE_URL } from "@/lib/site";
import { isRateLimited, ipFromForwardedFor } from "@/lib/rate-limit";

export type ActionState = { error: string | null; success?: boolean };

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function requestPasswordResetAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email || !email.includes("@")) {
    return { error: "Adresse email invalide." };
  }

  const ip = ipFromForwardedFor((await headers()).get("x-forwarded-for"));
  // Limits both a bot hammering many different emails from one IP, and
  // someone spamming a single victim's inbox with reset links.
  const ipLimited = isRateLimited(`password-reset-ip:${ip}`, { limit: 10, windowMs: 10 * 60 * 1000 });
  const emailLimited = isRateLimited(`password-reset-email:${email}`, { limit: 3, windowMs: 60 * 60 * 1000 });
  if (ipLimited || emailLimited) {
    // Same generic message as a real success — don't reveal that a limit
    // exists, which would itself leak whether the account is being targeted.
    return { error: null, success: true };
  }

  // Always return the same success message whether or not the account
  // exists, so this form can't be used to check which emails have accounts.
  const genericSuccess: ActionState = { error: null, success: true };

  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!user || !user.passwordHash) return genericSuccess;

  const token = randomBytes(32).toString("hex");
  await db.insert(passwordResetTokens).values({
    userId: user.id,
    tokenHash: hashToken(token),
    expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
  });

  const resetUrl = `${SITE_URL}/compte/reinitialiser?token=${token}`;
  try {
    await sendPasswordResetEmail(email, resetUrl);
  } catch (err) {
    console.error("[password-reset] Échec de l'envoi de l'email :", err);
    return { error: "Impossible d'envoyer l'email pour le moment. Réessaie plus tard." };
  }

  return genericSuccess;
}

export async function resetPasswordAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!token) return { error: "Lien invalide." };
  if (password.length < 8) {
    return { error: "Le mot de passe doit faire au moins 8 caractères." };
  }

  const tokenHash = hashToken(token);
  const [record] = await db
    .select()
    .from(passwordResetTokens)
    .where(and(eq(passwordResetTokens.tokenHash, tokenHash), gt(passwordResetTokens.expiresAt, new Date())))
    .limit(1);

  if (!record) {
    return { error: "Ce lien est invalide ou a expiré. Refais une demande." };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await db.update(users).set({ passwordHash }).where(eq(users.id, record.userId));
  await db.delete(passwordResetTokens).where(eq(passwordResetTokens.id, record.id));

  return { error: null, success: true };
}
