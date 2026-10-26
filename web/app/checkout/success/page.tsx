import type { Metadata } from "next";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { getCheckout, isSumUpConfigured, type SumUpCheckoutStatus } from "@/lib/sumup";
import { markOrderPaid } from "@/lib/order-fulfillment";
import { ClearCartOnMount } from "@/components/ClearCartOnMount";

export const metadata: Metadata = { title: "Commande confirmée" };
export const dynamic = "force-dynamic";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: orderParam } = await searchParams;
  const orderId = Number(orderParam);
  let status: SumUpCheckoutStatus | null = null;

  if (Number.isInteger(orderId) && orderId > 0 && isSumUpConfigured()) {
    const [order] = await db
      .select({ id: orders.id, paymentCheckoutId: orders.paymentCheckoutId })
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);
    if (order?.paymentCheckoutId) {
      // The order id in the URL is only a lookup key — the payment status
      // always comes from SumUp itself, so editing the URL can't mark an
      // order paid.
      try {
        status = (await getCheckout(order.paymentCheckoutId)).status;
      } catch (err) {
        console.error("[checkout] Échec de la vérification du paiement SumUp :", err);
      }
      if (status === "PAID") {
        // Belt and suspenders: mark paid here too, in case the webhook hasn't
        // landed yet (e.g. localhost isn't reachable by SumUp in local dev).
        // markOrderPaid is idempotent (checks current status first), so this
        // never double-sends the confirmation/notification emails if the
        // webhook also fires for the same order.
        await markOrderPaid(order.id);
      }
    }
  }

  const paid = status === "PAID";
  const pending = status === "PENDING";

  return (
    <>
      {paid && <ClearCartOnMount />}
      <div className="page-head">
        <div className="page-eyebrow">Checkout</div>
        <h1 className="page-title">
          {paid
            ? "Merci pour ta commande !"
            : pending
              ? "Paiement en cours"
              : status
                ? "Paiement non abouti"
                : "Paiement introuvable"}
        </h1>
      </div>
      <div className="panel" style={{ textAlign: "center", padding: 60 }}>
        {paid ? (
          <>
            <p className="faint">Commande #{orderId} confirmée. Un email de confirmation arrive vite.</p>
            <Link href="/collection" className="cta" style={{ marginTop: 20, display: "inline-flex" }}>
              <span>Continuer mes achats</span>
            </Link>
          </>
        ) : (
          <>
            <p className="faint">
              {pending
                ? "Ton paiement n’est pas encore confirmé. Si tu l’as validé, tu recevras un email de confirmation d’ici quelques minutes."
                : status
                  ? "Le paiement a échoué ou a expiré. Ton panier est toujours là, rien n’a été débité."
                  : "Nous n’avons pas retrouvé cette commande."}
            </p>
            <Link href="/panier" className="cta" style={{ marginTop: 20, display: "inline-flex" }}>
              <span>Retour au panier</span>
            </Link>
          </>
        )}
      </div>
    </>
  );
}
