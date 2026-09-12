import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/ForgotPasswordForm";

export const metadata: Metadata = { title: "Mot de passe oublié" };

export default function MotDePasseOubliePage() {
  return (
    <>
      <div className="page-head">
        <div className="page-eyebrow">Compte</div>
        <h1 className="page-title">Mot de passe oublié</h1>
      </div>
      <ForgotPasswordForm />
    </>
  );
}
