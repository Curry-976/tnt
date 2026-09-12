"use client";

import { useActionState } from "react";
import { updateProfileAction, updatePasswordAction, type ActionState } from "@/lib/actions/account";

const initialState: ActionState = { error: null };

export function AccountSettingsForms({
  name,
  email,
  hasPassword,
}: {
  name: string;
  email: string;
  hasPassword: boolean;
}) {
  const [profileState, profileFormAction, profilePending] = useActionState(updateProfileAction, initialState);
  const [passwordState, passwordFormAction, passwordPending] = useActionState(updatePasswordAction, initialState);

  return (
    <div className="cart-list">
      <div className="panel">
        <div className="panel-head">
          <h2>Profil</h2>
        </div>
        <form className="auth-form settings-form" action={profileFormAction}>
          <div className="form-row">
            <label className="form-label" htmlFor="name">Nom</label>
            <input id="name" name="name" type="text" className="form-input" defaultValue={name} required />
          </div>
          <div className="form-row">
            <label className="form-label" htmlFor="email">Email</label>
            <input id="email" name="email" type="email" className="form-input" defaultValue={email} required />
          </div>
          {profileState.error && <p className="form-error">{profileState.error}</p>}
          {profileState.success && <p className="form-note">Profil mis à jour.</p>}
          <button type="submit" className="cta" disabled={profilePending}>
            <span>{profilePending ? "Enregistrement…" : "Enregistrer"}</span>
          </button>
        </form>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h2>{hasPassword ? "Changer le mot de passe" : "Définir un mot de passe"}</h2>
        </div>
        <form className="auth-form settings-form" action={passwordFormAction}>
          {hasPassword && (
            <div className="form-row">
              <label className="form-label" htmlFor="currentPassword">Mot de passe actuel</label>
              <input id="currentPassword" name="currentPassword" type="password" className="form-input" required />
            </div>
          )}
          <div className="form-row">
            <label className="form-label" htmlFor="newPassword">Nouveau mot de passe</label>
            <input id="newPassword" name="newPassword" type="password" className="form-input" required minLength={8} />
            <span className="form-note">8 caractères minimum.</span>
          </div>
          {passwordState.error && <p className="form-error">{passwordState.error}</p>}
          {passwordState.success && <p className="form-note">Mot de passe mis à jour.</p>}
          <button type="submit" className="cta" disabled={passwordPending}>
            <span>{passwordPending ? "Enregistrement…" : "Enregistrer"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
