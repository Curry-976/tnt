import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { orders, orderItems } from "@/lib/db/schema";
import { createHostedCheckout, isSumUpConfigured } from "@/lib/sumup";
import { BASE_PRICE, FLOQUAGE_PRICE } from "@/lib/products";
import { getProduct, type Product } from "@/sanity/lib/queries";
import type { CartItem } from "@/lib/cart-context";

type CheckoutBody = {
  items: CartItem[];
  email: string;
  shippingAddress: string;
};

export async function POST(request: Request) {
  if (!isSumUpConfigured()) {
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

  // Re-validate every line against the catalog (source of truth: Sanity) so a
  // tampered slug/name in the client-submitted cart can't reach SumUp or the
  // order record. Price itself is always computed server-side above, never
  // trusted from the client.
  const validated = (
    await Promise.all(
      items.map(async (item) => {
        const product = await getProduct(item.slug);
        return product ? { item, product } : null;
      })
    )
  ).filter((v): v is { item: CartItem; product: Product } => v !== null);

  if (validated.length === 0) {
    return NextResponse.json({ error: "Ces articles ne sont plus disponibles." }, { status: 400 });
  }

  const totalCents = validated.reduce((sum, { item }) => sum + unitPrice(item) * 100 * item.qty, 0);

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

  for (const { item, product } of validated) {
    await db.insert(orderItems).values({
      orderId: order.id,
      productSlug: product.slug,
      productName: product.name,
      size: item.size,
      floque: item.floque,
      nom: item.nom,
      numero: item.numero,
      qty: item.qty,
      unitPriceCents: unitPrice(item) * 100,
    });
  }

  // SumUp's hosted page shows a single amount + description, not line items,
  // so the detail lives in the description (and in the order record above).
  const description = validated
    .map(
      ({ item, product }) =>
        `${item.qty}× ${product.name} (${item.size}${item.floque ? `, ${item.nom} ${item.numero}` : ""})`
    )
    .join(", ");

  let checkout;
  try {
    checkout = await createHostedCheckout({
      // Must be unique per checkout on the SumUp side; order ids already are.
      reference: `torrow-order-${order.id}`,
      amountCents: totalCents,
      description: `TORROW NAM – commande #${order.id} : ${description}`.slice(0, 255),
      webhookUrl: `${siteUrl}/api/webhooks/sumup`,
      redirectUrl: `${siteUrl}/checkout/success?order=${order.id}`,
    });
    if (!checkout.hosted_checkout_url) {
      throw new Error(`No hosted_checkout_url returned for checkout ${checkout.id}`);
    }
  } catch (err) {
    console.error("[checkout] Échec de création du paiement SumUp :", err);
    await db.update(orders).set({ status: "cancelled" }).where(eq(orders.id, order.id));
    return NextResponse.json(
      { error: "Le paiement n'a pas pu être initialisé. Réessaie dans un instant." },
      { status: 502 }
    );
  }

  await db.update(orders).set({ paymentCheckoutId: checkout.id }).where(eq(orders.id, order.id));

  return NextResponse.json({ url: checkout.hosted_checkout_url });
}
