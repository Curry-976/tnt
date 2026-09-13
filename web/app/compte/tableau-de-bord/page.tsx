import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { eq, or, desc } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { signOutAction } from "@/lib/actions/auth";
import { isAdminEmail } from "@/lib/admin";
import { orderStatusLabel } from "@/lib/order-status";

export const metadata: Metadata = { title: "Mon compte" };
export const dynamic = "force-dynamic";

export default async function TableauDeBordPage() {
  const session = await auth();
  if (!session?.user) redirect("/compte");

  const myOrders = await db
    .select()
    .from(orders)
    // Also match by email so guest checkouts (no session at the time, so
    // userId is null) still show up once someone logs into an account with
    // that same email.
    .where(or(eq(orders.userId, Number(session.user.id)), eq(orders.email, session.user.email ?? "")))
    .orderBy(desc(orders.createdAt));

  return (
    <>
      <div className="page-head">
        <div className="page-eyebrow">Compte</div>
        <h1 className="page-title">Bonjour {session.user.name || session.user.email?.split("@")[0]}</h1>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h2>Mes commandes</h2>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {isAdminEmail(session.user.email) && (
              <Link href="/admin/commandes" className="ghost">Commandes (admin)</Link>
            )}
            <Link href="/compte/parametres" className="ghost">Modifier mes infos</Link>
            <form action={signOutAction}>
              <button type="submit" className="ghost">Se déconnecter</button>
            </form>
          </div>
        </div>

        {myOrders.length === 0 ? (
          <p className="faint">Aucune commande pour l’instant.</p>
        ) : (
          <div className="cart-list">
            {myOrders.map((order) => (
              <div key={order.id} className="panel cart-row order-row">
                <div>
                  <div className="cart-meta-name">Commande #{order.id}</div>
                  <div className="cart-meta-detail">
                    {order.createdAt.toLocaleDateString("fr-FR")} · {orderStatusLabel(order.status)}
                  </div>
                </div>
                <div className="price">{(order.totalCents / 100).toFixed(2)} €</div>
                {order.trackingNumber ? (
                  <Link href={`/compte/commandes/${order.id}`} className="ghost">Suivre mon colis</Link>
                ) : (
                  <span />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
