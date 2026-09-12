"use client";

import { useActionState } from "react";
import Link from "next/link";
import { resetPasswordAction, type ActionState } from "@/lib/actions/password-reset";

const initialState: ActionState = { error: null };

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState(resetPasswordAction, initialState);

  if (state.success) {
    return (
      <div className="panel auth-shell">
        <p>Ton mot de passe a été mis à jour.</p>
        <Link href="/compte" className="cta">
          <span>Se connecter</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="panel auth-shell">
      <form className="auth-form" action={formAction}>
        <input type="hidden" name="token" value={token} />
        <div className="form-row">
          <label className="form-label" htmlFor="password">Nouveau mot de passe</label>
          <input id="password" name="password" type="password" className="form-input" required minLength={8} />
          <span className="form-note">8 caractères minimum.</span>
        </div>
        {state.error && <p className="form-error">{state.error}</p>}
        <button type="submit" className="cta" disabled={pending}>
          <span>{pending ? "Enregistrement…" : "Enregistrer"}</span>
        </button>
      </form>
    </div>
  );
}
