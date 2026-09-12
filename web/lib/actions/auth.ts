"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { signIn, signOut } from "@/auth";

export type AuthActionState = { error: string | null };

export async function registerAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!name) {
    return { error: "Le nom est obligatoire." };
  }
  if (!email || !email.includes("@")) {
    return { error: "Adresse email invalide." };
  }
  if (password.length < 8) {
    return { error: "Le mot de passe doit faire au moins 8 caractères." };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  try {
    await db.insert(users).values({ email, name, passwordHash });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.toLowerCase().includes("unique")) {
      return { error: "Un compte existe déjà avec cet email." };
    }
    return { error: "Impossible de créer le compte pour le moment." };
  }

  try {
    await signIn("credentials", { email, password, redirectTo: "/compte/tableau-de-bord" });
  } catch (err) {
    if (err instanceof AuthError) return { error: "Compte créé, mais la connexion a échoué. Réessaie." };
    throw err;
  }
  return { error: null };
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

export async function signInGoogleAction() {
  await signIn("google", { redirectTo: "/compte/tableau-de-bord" });
}

export async function signInAppleAction() {
  await signIn("apple", { redirectTo: "/compte/tableau-de-bord" });
}

export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/compte/tableau-de-bord",
    });
  } catch (err) {
    if (err instanceof AuthError) return { error: "Email ou mot de passe incorrect." };
    throw err;
  }
  return { error: null };
}
