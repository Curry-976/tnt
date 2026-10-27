import type { Metadata } from "next";
import { getClients } from "@/lib/admin-data";
import { ClientsBoard } from "@/components/admin/ClientsBoard";

export const metadata: Metadata = { title: "Clients" };

export default async function AdminClientsPage() {
  const clients = await getClients();

  return (
    <>
      <div className="admin-topbar">
        <h1>Clients</h1>
      </div>
      <div className="admin-content" style={{ display: "flex", flexDirection: "column" }}>
        <ClientsBoard
          clients={clients.map((c) => ({
            id: c.id,
            name: c.name,
            email: c.email,
            orderCount: c.orders.length,
            totalCents: c.totalCents,
            orders: c.orders.map((o) => ({
              id: o.id,
              status: o.status,
              totalCents: o.totalCents,
              createdAt: o.createdAt.toISOString(),
            })),
          }))}
        />
      </div>
    </>
  );
}
