// Cloudflare Turnstile — optional, same "configured or skipped" pattern as
// Stripe/Sanity elsewhere in this codebase. Without the two env vars, forms
// simply don't render the widget and skip verification (relying on the
// honeypot + rate limit + timing check instead).
export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY ?? "";

export const isTurnstileConfigured = Boolean(TURNSTILE_SITE_KEY && TURNSTILE_SECRET_KEY);

export async function verifyTurnstileToken(token: string | null, ip: string): Promise<boolean> {
  if (!isTurnstileConfigured) return true; // not set up — nothing to enforce
  if (!token) return false;

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: TURNSTILE_SECRET_KEY, response: token, remoteip: ip }),
    });
    const data = (await res.json()) as { success: boolean };
    return data.success === true;
  } catch {
    // Cloudflare unreachable — fail closed would block real users during an
    // outage on their end, so let the submission through on our other checks.
    return true;
  }
}
