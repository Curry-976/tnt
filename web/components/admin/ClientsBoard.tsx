"use client";

import { useMemo, useState } from "react";
import { orderStatusLabel } from "@/lib/order-status";

type ClientOrder = { id: number; status: string; totalCents: number; createdAt: string };
type Client = {
  id: string;
  name: string;
  email: string;
  orderCount: number;
  totalCents: number;
  orders: ClientOrder[];
};

export function ClientsBoard({ clients }: { clients: Client[] }) {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
  }, [clients, search]);

  const selected = clients.find((c) => c.id === selectedId) ?? null;

  return (
    <div className="admin-two-col" style={{ flex: 1 }}>
      <div>
        <div className="admin-search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="search"
            placeholder="Rechercher un client…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="admin-panel" style={{ padding: 0, overflow: "hidden" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Commandes</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((client) => (
                <tr
                  key={client.id}
                  data-clickable
                  className={client.id === selectedId ? "is-selected" : ""}
                  onClick={() => setSelectedId(client.id)}
                >
                  <td>
                    <div style={{ fontWeight: 700 }}>{client.name}</div>
                    <div style={{ color: "#9aa1af", fontSize: 12 }}>{client.email}</div>
                  </td>
                  <td>{client.orderCount}</td>
                  <td>{(client.totalCents / 100).toFixed(2)} €</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="admin-detail-empty">Aucun client ne correspond à cette recherche.</p>}
        </div>
      </div>

      <div className="admin-detail-panel">
        {!selected && <div className="admin-detail-empty">Sélectionne un client pour voir son historique.</div>}
        {selected && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{selected.name}</div>
                <div style={{ fontSize: 13, color: "#6d7689", marginTop: 4 }}>{selected.email}</div>
              </div>
              <span className="admin-detail-close" onClick={() => setSelectedId(null)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </span>
            </div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: "#9aa1af", marginBottom: 10, textTransform: "uppercase" }}>
              Historique des commandes
            </div>
            {selected.orders.length === 0 && <p className="admin-detail-empty">Aucune commande.</p>}
            {selected.orders.map((order) => (
              <div className="admin-list-row" key={order.id}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>#{order.id}</div>
                  <div style={{ fontSize: 12, color: "#9aa1af" }}>
                    {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontWeight: 700, fontSize: 13 }}>{(order.totalCents / 100).toFixed(2)} €</span>
                  <span className={`status-badge status-${order.status}`}>{orderStatusLabel(order.status)}</span>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
