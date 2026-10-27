import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { orders, orderItems } from "@/lib/db/schema";
import { createHostedCheckout, isSumUpConfigured } from "@/lib/sumup";
import { FLOQUAGE_PRICE, SIZES } from "@/lib/products";
import { getProduct, type Product } from "@/sanity/lib/queries";
import type { CartItem } from "@/lib/cart-context";
import { isRateLimited, ipFromForwardedFor } from "@/lib/rate-limit";
import { isDomTomPostalCode } from "@/lib/shipping";

const MAX_QTY = 9; // matches the qty stepper's own cap in ProductConfigurator/PanierClient

type CheckoutBody = {
  items: CartItem[];
  email: string;
  shippingAddress: string;
  postalCode: string;
};

export async function POST(request: Request) {
  if (!isSumUpConfigured()) {
    return NextResponse.json(
      { error: "Le paiement n'est pas encore configuré sur ce site. Réessaie plus tard." },
      { status: 503 }
    );
  }

  const ip = ipFromForwardedFor(request.headers.get("x-forwarded-for"));
  if (isRateLimited(`checkout:${ip}`, { limit: 10, windowMs: 10 * 60 * 1000 })) {
    return NextResponse.json({ error: "Trop de tentatives, réessaie un peu plus tard." }, { status: 429 });
  }

  const body = (await request.json()) as CheckoutBody;
  const { items, email, shippingAddress, postalCode } = body;

  if (!items?.length) {
    return NextResponse.json({ error: "Le panier est vide." }, { status: 400 });
  }
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Email de livraison invalide." }, { status: 400 });
  }
  // The UI already blocks DOM-TOM postal codes — re-checked here so a direct
  // request to this endpoint can't place an order that can't be fulfilled.
  if (!postalCode || !/^\d{5}$/.test(postalCode)) {
    return NextResponse.json({ error: "Code postal invalide." }, { status: 400 });
  }
  if (isDomTomPostalCode(postalCode)) {
    return NextResponse.json({ error: "Livraison non disponible en DOM-TOM pour l'instant." }, { status: 400 });
  }

  // Size and quantity come from the client cart — clamp/validate them here
  // too rather than trusting them as-is (the UI already restricts both, but
  // a direct request to this endpoint wouldn't go through the UI).
  const sanitizedItems = items
    .filter((item) => (SIZES as readonly string[]).includes(item.size))
    .map((item) => ({ ...item, qty: Math.min(Math.max(Math.trunc(item.qty), 1), MAX_QTY) }));

  if (sanitizedItems.length === 0) {
    return NextResponse.json({ error: "Le panier est vide." }, { status: 400 });
  }

  const session = await auth();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;

  // Re-validate every line against the catalog (source of truth: Sanity) so a
  // tampered slug/name in the client-submitted cart can't reach SumUp or the
  // order record. Price itself always comes from the Sanity product, never
  // from the client cart.
  const validated = (
    await Promise.all(
      sanitizedItems.map(async (item) => {
        const product = await getProduct(item.slug);
        return product ? { item, product } : null;
      })
    )
  ).filter((v): v is { item: CartItem; product: Product } => v !== null);

  if (validated.length === 0) {
    return NextResponse.json({ error: "Ces articles ne sont plus disponibles." }, { status: 400 });
  }

  const unitPrice = (item: CartItem, product: Product) => product.price + (item.floque ? FLOQUAGE_PRICE : 0);
  const totalCents = validated.reduce((sum, { item, product }) => sum + unitPrice(item, product) * 100 * item.qty, 0);

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
      unitPriceCents: unitPrice(item, product) * 100,
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
      description: `Commande #${order.id} : ${description}`.slice(0, 255),
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
