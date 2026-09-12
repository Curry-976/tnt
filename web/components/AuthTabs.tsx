"use client";

import { useActionState, useState } from "react";
import { loginAction, registerAction, signInGoogleAction, type AuthActionState } from "@/lib/actions/auth";

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

      <form action={signInGoogleAction}>
        <button type="submit" className="ghost auth-google-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.82Z" />
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.07 7.94-2.91l-3.88-3c-1.08.72-2.45 1.15-4.06 1.15-3.13 0-5.78-2.11-6.73-4.96H1.26v3.11A12 12 0 0 0 12 24Z" />
            <path fill="#FBBC05" d="M5.27 14.28A7.2 7.2 0 0 1 4.89 12c0-.79.14-1.56.38-2.28V6.61H1.26A12 12 0 0 0 0 12c0 1.94.46 3.77 1.26 5.39l4.01-3.11Z" />
            <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.6 4.58 1.79l3.44-3.44C17.94 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.26 6.61l4.01 3.11C6.22 6.87 8.87 4.77 12 4.77Z" />
          </svg>
          <span>Continuer avec Google</span>
        </button>
      </form>

      <div className="auth-divider"><span>ou</span></div>

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
            <label className="form-label" htmlFor="register-name">Nom</label>
            <input id="register-name" name="name" type="text" className="form-input" required />
          </div>
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
