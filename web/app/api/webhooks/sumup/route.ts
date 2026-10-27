import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { getCheckout, isSumUpConfigured } from "@/lib/sumup";
import { markOrderPaid } from "@/lib/order-fulfillment";

// SumUp POSTs { event_type: "CHECKOUT_STATUS_CHANGED", id: "<checkout id>" }
// to the return_url set on the checkout. The notification itself is unsigned,
// so it's only used as a hint: the real status is always re-fetched from the
// SumUp API with our secret key before an order is marked paid.
export async function POST(request: Request) {
  if (!isSumUpConfigured()) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  let checkoutId: string | undefined;
  try {
    const body = (await request.json()) as { event_type?: string; id?: string };
    checkoutId = body.id;
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  if (!checkoutId) {
    return NextResponse.json({ error: "Missing checkout id" }, { status: 400 });
  }

  const [order] = await db
    .select({ id: orders.id })
    .from(orders)
    .where(eq(orders.paymentCheckoutId, checkoutId))
    .limit(1);
  if (!order) {
    // Not one of ours (or already purged) — acknowledge so SumUp stops retrying.
    return new NextResponse(null, { status: 204 });
  }

  // A thrown error here returns a 5xx, which makes SumUp retry the delivery.
  const checkout = await getCheckout(checkoutId);
  if (checkout.status === "PAID") {
    await markOrderPaid(order.id);
  }

  return new NextResponse(null, { status: 204 });
}
