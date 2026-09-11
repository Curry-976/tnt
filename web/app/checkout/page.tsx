import type { Metadata } from "next";
import { auth } from "@/auth";
import { CheckoutForm } from "@/components/CheckoutForm";

export const metadata: Metadata = { title: "Paiement" };
export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const session = await auth();
  return (
    <>
      <div className="page-head">
        <div className="page-eyebrow">Checkout</div>
        <h1 className="page-title">Finaliser la commande</h1>
      </div>
      <CheckoutForm defaultEmail={session?.user?.email ?? ""} />
    </>
  );
}
