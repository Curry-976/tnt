import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { desc } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { isAdminEmail } from "@/lib/admin";
import { orderStatusLabel } from "@/lib/order-status";
import { OrderTrackingForm } from "@/components/OrderTrackingForm";
import { OrderStatusForm } from "@/components/OrderStatusForm";

export const metadata: Metadata = { title: "Commandes — administration" };
export const dynamic = "force-dynamic";

export default async function AdminCommandesPage() {
  const session = await auth();
  if (!isAdminEmail(session?.user?.email)) redirect("/");

  const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));

  return (
    <>
      <div className="page-head">
        <div className="page-eyebrow">Administration</div>
        <h1 className="page-title">Commandes</h1>
      </div>

      <div className="cart-list">
        {allOrders.map((order) => (
          <div key={order.id} className="panel">
            <div className="panel-head">
              <h2>Commande #{order.id}</h2>
              <span className="faint">
                {order.email} · {(order.totalCents / 100).toFixed(2)} € · {orderStatusLabel(order.status)}
              </span>
            </div>
            <div className="admin-order-section">
              <h3>Statut</h3>
              <OrderStatusForm orderId={order.id} status={order.status} />
            </div>

            <div className="admin-order-section">
              <h3>Livraison</h3>
              <OrderTrackingForm
                orderId={order.id}
                trackingNumber={order.trackingNumber ?? ""}
                trackingCarrierSlug={order.trackingCarrierSlug ?? ""}
              />
            </div>
          </div>
        ))}
        {allOrders.length === 0 && <p className="faint">Aucune commande pour l’instant.</p>}
      </div>
    </>
  );
}
