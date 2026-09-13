import type { Metadata } from "next";
import { getAllOrders } from "@/lib/admin-data";
import { OrdersPipeline } from "@/components/admin/OrdersPipeline";

export const metadata: Metadata = { title: "Commandes" };
export const dynamic = "force-dynamic";

export default async function AdminCommandesPage() {
  const orders = await getAllOrders();

  return (
    <>
      <div className="admin-topbar">
        <h1>Commandes</h1>
      </div>
      <div className="admin-content" style={{ display: "flex", flexDirection: "column" }}>
        <OrdersPipeline
          orders={orders.map((o) => ({
            id: o.id,
            email: o.email,
            status: o.status,
            totalCents: o.totalCents,
            createdAt: o.createdAt.toISOString(),
            trackingNumber: o.trackingNumber,
            trackingCarrierSlug: o.trackingCarrierSlug,
            items: o.items.map((item) => ({
              productName: item.productName,
              size: item.size,
              floque: item.floque,
              nom: item.nom,
              numero: item.numero,
              qty: item.qty,
            })),
          }))}
        />
      </div>
    </>
  );
}
