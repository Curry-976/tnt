import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders, orderItems } from "@/lib/db/schema";
import { sendOrderConfirmationEmail, sendAdminOrderNotificationEmail } from "@/lib/email";
import { getAdminEmails } from "@/lib/admin";

// Called from both the Stripe webhook and the checkout success page (belt
// and suspenders, in case the webhook hasn't landed yet). Stripe also
// retries webhook deliveries, so this only acts — and only emails — once,
// on the pending -> paid transition, never on an order already marked paid.
export async function markOrderPaid(orderId: number) {
  const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  if (!order || order.status === "paid") return;

  await db.update(orders).set({ status: "paid" }).where(eq(orders.id, orderId));

  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));

  try {
    await sendOrderConfirmationEmail(order, items);
  } catch (err) {
    console.error("[orders] Échec de l'email de confirmation de commande :", err);
  }
  try {
    await sendAdminOrderNotificationEmail(order, items, getAdminEmails());
  } catch (err) {
    console.error("[orders] Échec de la notification admin de nouvelle commande :", err);
  }
}
