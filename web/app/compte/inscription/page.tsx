import type { Metadata } from "next";
import { AuthTabs } from "@/components/AuthTabs";

export const metadata: Metadata = { title: "Créer un compte" };

export default function InscriptionPage() {
  return (
    <>
      <div className="page-head">
        <div className="page-eyebrow">Compte</div>
        <h1 className="page-title">Créer un compte</h1>
      </div>
      <AuthTabs defaultTab="register" />
    </>
  );
}
