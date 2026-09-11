import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { orders, orderItems, products } from "@/lib/db/schema";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { BASE_PRICE, FLOQUAGE_PRICE } from "@/lib/products";
import type { CartItem } from "@/lib/cart-context";

type CheckoutBody = {
  items: CartItem[];
  email: string;
  shippingAddress: string;
};

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Le paiement n'est pas encore configuré sur ce site. Réessaie plus tard." },
      { status: 503 }
    );
  }

  const body = (await request.json()) as CheckoutBody;
  const { items, email, shippingAddress } = body;

  if (!items?.length) {
    return NextResponse.json({ error: "Le panier est vide." }, { status: 400 });
  }
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Email de livraison invalide." }, { status: 400 });
  }

  const session = await auth();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;

  const unitPrice = (item: CartItem) => BASE_PRICE + (item.floque ? FLOQUAGE_PRICE : 0);
  const totalCents = items.reduce((sum, i) => sum + unitPrice(i) * 100 * i.qty, 0);

  const [order] = await db
    .insert(orders)
    .values({
      userId: session?.user?.id ? Number(session.user.id) : null,
      email,
      status: "pending",
      totalCents,
      shippingAddress,
    })
    .returning();

  for (const item of items) {
    const [product] = await db.select().from(products).where(eq(products.slug, item.slug)).limit(1);
    if (!product) continue;
    await db.insert(orderItems).values({
      orderId: order.id,
      productId: product.id,
      size: item.size,
      floque: item.floque,
      nom: item.nom,
      numero: item.numero,
      qty: item.qty,
      unitPriceCents: unitPrice(item) * 100,
    });
  }

  const stripe = getStripe();
  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: email,
    line_items: items.map((item) => ({
      quantity: item.qty,
      price_data: {
        currency: "eur",
        unit_amount: unitPrice(item) * 100,
        product_data: {
          name: `TORROW NAM – ${item.name} (taille ${item.size}${item.floque ? `, flocage ${item.nom} ${item.numero}` : ""})`,
          images: [`${siteUrl}${item.image}`],
        },
      },
    })),
    metadata: { orderId: String(order.id) },
    success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/checkout/cancel`,
  });

  await db.update(orders).set({ stripeSessionId: checkoutSession.id }).where(eq(orders.id, order.id));

  return NextResponse.json({ url: checkoutSession.url });
}
