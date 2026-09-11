import type { Metadata } from "next";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { ClearCartOnMount } from "@/components/ClearCartOnMount";

export const metadata: Metadata = { title: "Commande confirmée" };
export const dynamic = "force-dynamic";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  let paid = false;
  let orderId: number | null = null;

  if (session_id && isStripeConfigured()) {
    const stripeSession = await getStripe().checkout.sessions.retrieve(session_id);
    paid = stripeSession.payment_status === "paid";
    const metaOrderId = stripeSession.metadata?.orderId;
    if (paid && metaOrderId) {
      orderId = Number(metaOrderId);
      // Belt and suspenders: mark paid here too, in case the webhook hasn't
      // landed yet (e.g. Stripe CLI not forwarding events in local dev).
      await db.update(orders).set({ status: "paid" }).where(eq(orders.id, orderId));
    }
  }

  return (
    <>
      {paid && <ClearCartOnMount />}
      <div className="page-head">
        <div className="page-eyebrow">Checkout</div>
        <h1 className="page-title">{paid ? "Merci pour ta commande !" : "Paiement introuvable"}</h1>
      </div>
      <div className="panel" style={{ textAlign: "center", padding: 60 }}>
        {paid ? (
          <>
            <p className="faint">
              Commande {orderId ? `#${orderId} ` : ""}confirmée. Un email de confirmation arrive vite.
            </p>
            <Link href="/collection" className="cta" style={{ marginTop: 20, display: "inline-flex" }}>
              <span>Continuer mes achats</span>
            </Link>
          </>
        ) : (
          <>
            <p className="faint">Nous n’avons pas retrouvé cette commande.</p>
            <Link href="/panier" className="cta" style={{ marginTop: 20, display: "inline-flex" }}>
              <span>Retour au panier</span>
            </Link>
          </>
        )}
      </div>
    </>
  );
}
