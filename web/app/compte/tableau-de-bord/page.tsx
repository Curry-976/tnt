import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { signOutAction } from "@/lib/actions/auth";

export const metadata: Metadata = { title: "Mon compte" };
export const dynamic = "force-dynamic";

export default async function TableauDeBordPage() {
  const session = await auth();
  if (!session?.user) redirect("/compte");

  const myOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, Number(session.user.id)))
    .orderBy(desc(orders.createdAt));

  return (
    <>
      <div className="page-head">
        <div className="page-eyebrow">Compte</div>
        <h1 className="page-title">Bonjour {session.user.email}</h1>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h2>Mes commandes</h2>
          <form action={signOutAction}>
            <button type="submit" className="ghost">Se déconnecter</button>
          </form>
        </div>

        {myOrders.length === 0 ? (
          <p className="faint">Aucune commande pour l’instant.</p>
        ) : (
          <div className="cart-list">
            {myOrders.map((order) => (
              <div key={order.id} className="panel cart-row" style={{ gridTemplateColumns: "1fr auto auto" }}>
                <div>
                  <div className="cart-meta-name">Commande #{order.id}</div>
                  <div className="cart-meta-detail">
                    {order.createdAt.toLocaleDateString("fr-FR")} ·{" "}
                    {order.status === "paid" ? "Payée" : order.status === "cancelled" ? "Annulée" : "En attente"}
                  </div>
                </div>
                <div className="price">{(order.totalCents / 100).toFixed(2)} €</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
