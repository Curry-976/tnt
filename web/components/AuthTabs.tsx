"use client";

import { useActionState, useState } from "react";
import { loginAction, registerAction, type AuthActionState } from "@/lib/actions/auth";

const initialState: AuthActionState = { error: null };

export function AuthTabs({ defaultTab = "login" }: { defaultTab?: "login" | "register" }) {
  const [tab, setTab] = useState<"login" | "register">(defaultTab);
  const [loginState, loginFormAction, loginPending] = useActionState(loginAction, initialState);
  const [registerState, registerFormAction, registerPending] = useActionState(registerAction, initialState);

  return (
    <div className="panel auth-shell">
      <div className="auth-tabs">
        <button type="button" className={`auth-tab ${tab === "login" ? "active" : ""}`} onClick={() => setTab("login")}>
          Connexion
        </button>
        <button type="button" className={`auth-tab ${tab === "register" ? "active" : ""}`} onClick={() => setTab("register")}>
          Créer un compte
        </button>
      </div>

      {tab === "login" ? (
        <form className="auth-form" action={loginFormAction}>
          <div className="form-row">
            <label className="form-label" htmlFor="login-email">Email</label>
            <input id="login-email" name="email" type="email" className="form-input" required />
          </div>
          <div className="form-row">
            <label className="form-label" htmlFor="login-password">Mot de passe</label>
            <input id="login-password" name="password" type="password" className="form-input" required />
          </div>
          {loginState.error && <p className="form-error">{loginState.error}</p>}
          <button type="submit" className="cta" disabled={loginPending}>
            <span>{loginPending ? "Connexion…" : "Se connecter"}</span>
          </button>
        </form>
      ) : (
        <form className="auth-form" action={registerFormAction}>
          <div className="form-row">
            <label className="form-label" htmlFor="register-email">Email</label>
            <input id="register-email" name="email" type="email" className="form-input" required />
          </div>
          <div className="form-row">
            <label className="form-label" htmlFor="register-password">Mot de passe</label>
            <input id="register-password" name="password" type="password" className="form-input" required minLength={8} />
            <span className="form-note">8 caractères minimum.</span>
          </div>
          {registerState.error && <p className="form-error">{registerState.error}</p>}
          <button type="submit" className="cta" disabled={registerPending}>
            <span>{registerPending ? "Création…" : "Créer mon compte"}</span>
          </button>
        </form>
      )}
    </div>
  );
}
