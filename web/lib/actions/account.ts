"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { auth } from "@/auth";

export type ActionState = { error: string | null; success?: boolean };

export async function updateProfileAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user) return { error: "Tu dois être connecté." };

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!name) return { error: "Le nom est obligatoire." };
  if (!email || !email.includes("@")) return { error: "Adresse email invalide." };

  try {
    await db.update(users).set({ name, email }).where(eq(users.id, Number(session.user.id)));
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.toLowerCase().includes("unique")) {
      return { error: "Un compte existe déjà avec cet email." };
    }
    return { error: "Impossible de mettre à jour le profil pour le moment." };
  }

  return { error: null, success: true };
}

export async function updatePasswordAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user) return { error: "Tu dois être connecté." };

  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  if (newPassword.length < 8) {
    return { error: "Le nouveau mot de passe doit faire au moins 8 caractères." };
  }

  const [user] = await db.select().from(users).where(eq(users.id, Number(session.user.id))).limit(1);
  if (!user) return { error: "Compte introuvable." };

  // Accounts created via Google/Apple have no password yet — let them set
  // one for the first time without asking for a "current" password that
  // doesn't exist.
  if (user.passwordHash) {
    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) return { error: "Mot de passe actuel incorrect." };
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await db.update(users).set({ passwordHash }).where(eq(users.id, user.id));

  return { error: null, success: true };
}
