// SumUp Online Payments (Hosted Checkout) — thin wrapper over the two REST
// calls the site needs. Uses fetch directly rather than @sumup/sdk, which is
// still pre-1.0 and may ship breaking changes.
// API reference: https://developer.sumup.com/api/checkouts

const SUMUP_API = "https://api.sumup.com/v0.1";

export type SumUpCheckoutStatus = "PENDING" | "FAILED" | "PAID" | "EXPIRED";

export type SumUpCheckout = {
  id: string;
  checkout_reference: string;
  status: SumUpCheckoutStatus;
  hosted_checkout_url?: string;
};

export function isSumUpConfigured(): boolean {
  return Boolean(process.env.SUMUP_API_KEY && process.env.SUMUP_MERCHANT_CODE);
}

// Read lazily (not at module load) so pages importing this module don't
// break before the keys are set — same pattern as lib/db.
function apiKey(): string {
  const key = process.env.SUMUP_API_KEY;
  if (!key) {
    throw new Error(
      "SUMUP_API_KEY is not set. Add it to .env.local (see .env.example) before checking out."
    );
  }
  return key;
}

async function sumupFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${SUMUP_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey()}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`SumUp API ${res.status} on ${path}: ${await res.text()}`);
  }
  return (await res.json()) as T;
}

export function createHostedCheckout(params: {
  reference: string;
  amountCents: number;
  description: string;
  // Backend URL SumUp POSTs status-change notifications to.
  webhookUrl: string;
  // Where the payer is sent back to after paying on the hosted page.
  redirectUrl: string;
}): Promise<SumUpCheckout> {
  return sumupFetch<SumUpCheckout>("/checkouts", {
    method: "POST",
    body: JSON.stringify({
      checkout_reference: params.reference,
      // SumUp expects major units (euros), not cents.
      amount: params.amountCents / 100,
      currency: "EUR",
      merchant_code: process.env.SUMUP_MERCHANT_CODE,
      description: params.description,
      return_url: params.webhookUrl,
      redirect_url: params.redirectUrl,
      hosted_checkout: { enabled: true },
    }),
  });
}

export function getCheckout(checkoutId: string): Promise<SumUpCheckout> {
  return sumupFetch<SumUpCheckout>(`/checkouts/${encodeURIComponent(checkoutId)}`);
}
