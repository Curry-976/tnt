import type { Metadata } from "next";
import { getDashboardStats } from "@/lib/admin-data";
import { orderStatusLabel } from "@/lib/order-status";

export const metadata: Metadata = { title: "Tableau de bord" };

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();
  const maxCents = Math.max(1, ...stats.chartDays.map((d) => d.totalCents));

  return (
    <>
      <div className="admin-topbar">
        <h1>Tableau de bord</h1>
      </div>
      <div className="admin-content">
        <div className="admin-stat-grid">
          <div className="admin-stat-tile">
            <div className="admin-stat-label">Commandes</div>
            <div className="admin-stat-value">{stats.orderCount}</div>
          </div>
          <div className="admin-stat-tile">
            <div className="admin-stat-label">Chiffre d’affaires</div>
            <div className="admin-stat-value">{(stats.revenueCents / 100).toFixed(2)} €</div>
          </div>
          <div className="admin-stat-tile">
            <div className="admin-stat-label">Clients</div>
            <div className="admin-stat-value">{stats.clientCount}</div>
          </div>
          <div className="admin-stat-tile">
            <div className="admin-stat-label">Messages non traités</div>
            <div className="admin-stat-value">{stats.unhandledMessages}</div>
          </div>
        </div>

        <div className="admin-panel">
          <h2>Chiffre d’affaires — 7 derniers jours</h2>
          <div className="admin-chart">
            {stats.chartDays.map((day) => (
              <div className="admin-chart-col" key={day.dateKey}>
                <div className="admin-chart-value">{day.totalCents > 0 ? `${(day.totalCents / 100).toFixed(0)}€` : ""}</div>
                <div
                  className="admin-chart-bar"
                  style={{ height: `${Math.max(3, (day.totalCents / maxCents) * 130)}px` }}
                />
                <div className="admin-chart-label">{day.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-panel">
          <h2>Commandes récentes</h2>
          {stats.recentOrders.length === 0 && <p className="admin-detail-empty">Aucune commande pour l’instant.</p>}
          {stats.recentOrders.map((order) => (
            <div className="admin-list-row" key={order.id}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13.5 }}>#{order.id} · {order.email}</div>
                <div style={{ fontSize: 12, color: "#9aa1af", marginTop: 2 }}>
                  {order.createdAt.toLocaleDateString("fr-FR")}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ fontWeight: 700, fontSize: 13.5 }}>{(order.totalCents / 100).toFixed(2)} €</span>
                <span className={`status-badge status-${order.status}`}>{orderStatusLabel(order.status)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
