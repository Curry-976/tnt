import Stripe from "stripe";

// Constructing Stripe eagerly with an empty key throws, which would break
// every page that imports this module before STRIPE_SECRET_KEY is set — so
// the client is built lazily, only when a route actually calls getStripe().
let cached: Stripe | null = null;

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. Add it to .env.local (see .env.example) before checking out."
    );
  }
  if (!cached) {
    cached = new Stripe(key, { apiVersion: "2026-08-26.dahlia" });
  }
  return cached;
}

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
}
