import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { orders, orderItems } from "@/lib/db/schema";
import { isAdminEmail } from "@/lib/admin";
import { orderStatusLabel } from "@/lib/order-status";
import { PrintButton } from "@/components/PrintButton";

export const metadata: Metadata = { title: "Récapitulatif de commande" };
export const dynamic = "force-dynamic";

export default async function RecuCommandePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/compte");

  const [order] = await db.select().from(orders).where(eq(orders.id, Number(id))).limit(1);
  // Same ownership rule as the tracking page (userId match, or email match
  // for guest checkouts), plus admins can pull up any order's recap.
  const owns =
    order &&
    (order.userId === Number(session.user.id) ||
      order.email === session.user.email ||
      isAdminEmail(session.user.email));
  if (!owns) notFound();

  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));

  return (
    <>
      <div className="page-head no-print">
        <div className="page-eyebrow">Compte</div>
        <h1 className="page-title">Récapitulatif — commande #{order.id}</h1>
      </div>

      <Link href="/compte/tableau-de-bord" className="ghost no-print" style={{ display: "inline-flex", marginBottom: 20 }}>
        <span>← Retour à mes commandes</span>
      </Link>

      <div className="panel receipt">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 20 }}>Torrow Nam Torrow</div>
            <div className="faint">Récapitulatif de commande</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontWeight: 700 }}>Commande #{order.id}</div>
            <div className="faint">{order.createdAt.toLocaleDateString("fr-FR")}</div>
            <div className="faint">{orderStatusLabel(order.status)}</div>
          </div>
        </div>

        <div style={{ marginTop: 24, borderTop: "1px solid var(--panel-border)", paddingTop: 20 }}>
          <div className="faint" style={{ marginBottom: 4 }}>Client</div>
          <div>{order.email}</div>
          {order.shippingAddress && (
            <>
              <div className="faint" style={{ marginTop: 12, marginBottom: 4 }}>Adresse de livraison</div>
              <div style={{ whiteSpace: "pre-line" }}>{order.shippingAddress}</div>
            </>
          )}
        </div>

        <div style={{ marginTop: 24, borderTop: "1px solid var(--panel-border)", paddingTop: 20 }}>
          <div className="cart-list">
            {items.map((item) => (
              <div key={item.id} className="panel cart-row" style={{ gridTemplateColumns: "1fr auto" }}>
                <div>
                  <div className="cart-meta-name">{item.productName}</div>
                  <div className="cart-meta-detail">
                    Taille {item.size}
                    {item.floque && item.nom ? ` · Flocage "${item.nom}" ${item.numero ?? ""}` : ""} · × {item.qty}
                  </div>
                </div>
                <div className="price">{((item.unitPriceCents * item.qty) / 100).toFixed(2)} €</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, fontWeight: 700, fontSize: 17 }}>
            <span>Total</span>
            <span>{(order.totalCents / 100).toFixed(2)} €</span>
          </div>
        </div>

        <div style={{ marginTop: 28 }}>
          <PrintButton />
        </div>
      </div>
    </>
  );
}
