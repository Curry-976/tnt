"use client";

import { useMemo, useState } from "react";
import { orderStatusLabel } from "@/lib/order-status";
import { OrderStatusForm } from "@/components/OrderStatusForm";
import { OrderTrackingForm } from "@/components/OrderTrackingForm";

const PIPELINE_STATUSES = ["pending", "paid", "processing", "shipped", "cancelled"] as const;

type Order = {
  id: number;
  email: string;
  status: string;
  totalCents: number;
  createdAt: string;
  trackingNumber: string | null;
  trackingCarrierSlug: string | null;
  items: { productName: string; size: string; floque: boolean; nom: string | null; numero: string | null; qty: number }[];
};

export function OrdersPipeline({ orders }: { orders: Order[] }) {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const columns = useMemo(
    () =>
      PIPELINE_STATUSES.map((status) => ({
        status,
        orders: orders.filter((o) => o.status === status),
      })),
    [orders]
  );

  const selected = orders.find((o) => o.id === selectedId) ?? null;

  return (
    <div className="admin-two-col" style={{ flex: 1, gridTemplateColumns: selected ? "minmax(0,1fr) 380px" : "1fr" }}>
      <div className="admin-pipeline">
        {columns.map((col) => (
          <div className="admin-pipeline-col" key={col.status}>
            <div className="admin-pipeline-col-head">
              <span className={`status-badge status-${col.status}`}>{orderStatusLabel(col.status)}</span>
              <span className="admin-pipeline-col-count">{col.orders.length}</span>
            </div>
            {col.orders.map((order) => (
              <div
                key={order.id}
                className={`admin-pipeline-card${order.id === selectedId ? " is-selected" : ""}`}
                onClick={() => setSelectedId(order.id)}
              >
                <div className="admin-pipeline-card-id">#{order.id}</div>
                <div className="admin-pipeline-card-meta">{order.email}</div>
                <div className="admin-pipeline-card-meta">{new Date(order.createdAt).toLocaleDateString("fr-FR")}</div>
                <div className="admin-pipeline-card-total">{(order.totalCents / 100).toFixed(2)} €</div>
              </div>
            ))}
            {col.orders.length === 0 && <div className="admin-detail-empty" style={{ padding: "16px 0" }}>—</div>}
          </div>
        ))}
      </div>

      {selected && (
        <div className="admin-detail-panel">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>Commande #{selected.id}</div>
              <div style={{ fontSize: 13, color: "#6d7689", marginTop: 4 }}>
                {selected.email} · {new Date(selected.createdAt).toLocaleDateString("fr-FR")}
              </div>
            </div>
            <span className="admin-detail-close" onClick={() => setSelectedId(null)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </span>
          </div>

          <div style={{ fontSize: 12.5, fontWeight: 700, color: "#9aa1af", marginBottom: 8, textTransform: "uppercase" }}>
            Articles
          </div>
          {selected.items.map((item, i) => (
            <div key={i} style={{ fontSize: 13, marginBottom: 6 }}>
              {item.qty}× {item.productName} — {item.size}
              {item.floque && item.nom ? ` · ${item.nom} ${item.numero ?? ""}` : ""}
            </div>
          ))}
          <div style={{ fontWeight: 700, fontSize: 14, marginTop: 10 }}>Total : {(selected.totalCents / 100).toFixed(2)} €</div>

          <div className="admin-order-section" style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid rgba(22,32,60,0.08)" }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: "#9aa1af", marginBottom: 10, textTransform: "uppercase" }}>
              Statut
            </div>
            <OrderStatusForm orderId={selected.id} status={selected.status} />
          </div>

          <div className="admin-order-section" style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid rgba(22,32,60,0.08)" }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: "#9aa1af", marginBottom: 10, textTransform: "uppercase" }}>
              Livraison
            </div>
            <OrderTrackingForm
              orderId={selected.id}
              trackingNumber={selected.trackingNumber ?? ""}
              trackingCarrierSlug={selected.trackingCarrierSlug ?? ""}
            />
          </div>
        </div>
      )}
    </div>
  );
}
