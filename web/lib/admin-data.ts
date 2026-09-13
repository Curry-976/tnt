import { desc, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { contactMessages, orderItems, orders, users } from "@/lib/db/schema";
import { ORDER_STATUS_LABELS } from "@/lib/order-status";

export const PIPELINE_STATUSES = ["pending", "paid", "processing", "shipped", "cancelled"] as const;

export type PipelineStatus = (typeof PIPELINE_STATUSES)[number];

export type AdminOrder = Awaited<ReturnType<typeof getAllOrders>>[number];

export async function getAllOrders() {
  const rows = await db.select().from(orders).orderBy(desc(orders.createdAt));
  const items = await db.select().from(orderItems);
  const itemsByOrder = new Map<number, typeof items>();
  for (const item of items) {
    const list = itemsByOrder.get(item.orderId) ?? [];
    list.push(item);
    itemsByOrder.set(item.orderId, list);
  }
  return rows.map((order) => ({ ...order, items: itemsByOrder.get(order.id) ?? [] }));
}

export async function getAllMessages() {
  return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
}

export type AdminClient = {
  id: string;
  userId: number | null;
  name: string;
  email: string;
  orders: AdminOrder[];
  totalCents: number;
  createdAt: Date;
};

// Clients are everyone who has an account or has placed an order (guest
// checkouts have no user row) — grouped by email since a guest order and a
// later account under the same address should show up as one client.
export async function getClients(): Promise<AdminClient[]> {
  const [allUsers, allOrders] = await Promise.all([
    db.select().from(users).orderBy(desc(users.createdAt)),
    getAllOrders(),
  ]);

  const byEmail = new Map<string, AdminClient>();

  for (const user of allUsers) {
    byEmail.set(user.email.toLowerCase(), {
      id: user.email.toLowerCase(),
      userId: user.id,
      name: user.name ?? user.email.split("@")[0],
      email: user.email,
      orders: [],
      totalCents: 0,
      createdAt: user.createdAt,
    });
  }

  for (const order of allOrders) {
    const key = order.email.toLowerCase();
    let client = byEmail.get(key);
    if (!client) {
      client = {
        id: key,
        userId: order.userId,
        name: order.email.split("@")[0],
        email: order.email,
        orders: [],
        totalCents: 0,
        createdAt: order.createdAt,
      };
      byEmail.set(key, client);
    }
    client.orders.push(order);
    if (order.status !== "cancelled") client.totalCents += order.totalCents;
  }

  return Array.from(byEmail.values()).sort((a, b) => b.orders.length - a.orders.length);
}

export async function getDashboardStats() {
  const [allOrders, allMessages, clientCountRow] = await Promise.all([
    getAllOrders(),
    getAllMessages(),
    db.select({ count: sql<number>`count(*)` }).from(users),
  ]);

  const paidOrders = allOrders.filter((o) => o.status !== "cancelled" && o.status !== "pending");
  const revenueCents = paidOrders.reduce((sum, o) => sum + o.totalCents, 0);
  const unhandledMessages = allMessages.filter((m) => !m.handled).length;

  const days: { label: string; dateKey: string; totalCents: number }[] = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    days.push({
      label: d.toLocaleDateString("fr-FR", { weekday: "short" }).replace(".", ""),
      dateKey: d.toISOString().slice(0, 10),
      totalCents: 0,
    });
  }
  const dayIndex = new Map(days.map((d, i) => [d.dateKey, i]));
  for (const order of paidOrders) {
    const key = order.createdAt.toISOString().slice(0, 10);
    const idx = dayIndex.get(key);
    if (idx !== undefined) days[idx].totalCents += order.totalCents;
  }

  return {
    orderCount: allOrders.length,
    revenueCents,
    clientCount: Number(clientCountRow[0]?.count ?? 0),
    unhandledMessages,
    recentOrders: allOrders.slice(0, 6),
    chartDays: days,
  };
}

export function orderStatusMeta(status: string) {
  return { label: ORDER_STATUS_LABELS[status] ?? status };
}
