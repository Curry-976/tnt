import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AuthTabs } from "@/components/AuthTabs";

export const metadata: Metadata = { title: "Connexion" };
export const dynamic = "force-dynamic";

export default async function ComptePage() {
  const session = await auth();
  if (session?.user) redirect("/compte/tableau-de-bord");

  return (
    <>
      <div className="page-head">
        <div className="page-eyebrow">Compte</div>
        <h1 className="page-title">Connexion</h1>
      </div>
      <AuthTabs defaultTab="login" />
    </>
  );
}
