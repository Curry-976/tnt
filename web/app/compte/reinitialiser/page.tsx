import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/ResetPasswordForm";

export const metadata: Metadata = { title: "Réinitialiser le mot de passe" };

export default async function ReinitialiserPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <>
      <div className="page-head">
        <div className="page-eyebrow">Compte</div>
        <h1 className="page-title">Choisir un nouveau mot de passe</h1>
      </div>
      {token ? <ResetPasswordForm token={token} /> : <p className="panel">Lien invalide.</p>}
    </>
  );
}
