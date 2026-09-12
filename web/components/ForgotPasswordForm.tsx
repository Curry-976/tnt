"use client";

import { useActionState } from "react";
import { requestPasswordResetAction, type ActionState } from "@/lib/actions/password-reset";

const initialState: ActionState = { error: null };

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(requestPasswordResetAction, initialState);

  if (state.success) {
    return (
      <div className="panel auth-shell">
        <p>
          Si un compte existe avec cet email, tu vas recevoir un lien pour réinitialiser ton mot
          de passe d&apos;ici quelques minutes.
        </p>
      </div>
    );
  }

  return (
    <div className="panel auth-shell">
      <form className="auth-form" action={formAction}>
        <div className="form-row">
          <label className="form-label" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" className="form-input" required />
        </div>
        {state.error && <p className="form-error">{state.error}</p>}
        <button type="submit" className="cta" disabled={pending}>
          <span>{pending ? "Envoi…" : "Envoyer le lien"}</span>
        </button>
      </form>
    </div>
  );
}
