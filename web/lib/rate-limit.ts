// In-memory sliding-window rate limiter, keyed by IP + action name.
//
// This only works because the app runs as a single long-lived Node process
// on the VPS (not multiple serverless instances) — the counters live in
// this module's memory and reset on redeploy, which is an acceptable
// trade-off for blocking basic spam bots without needing a database table
// or an external service.
const buckets = new Map<string, { count: number; windowStart: number }>();

export function isRateLimited(key: string, { limit, windowMs }: { limit: number; windowMs: number }): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now - bucket.windowStart > windowMs) {
    buckets.set(key, { count: 1, windowStart: now });
    return false;
  }

  bucket.count += 1;
  return bucket.count > limit;
}

// Request/header helpers are duplicated by each caller (route handlers and
// server actions read the IP differently), so this just extracts it from
// whatever x-forwarded-for value is available.
export function ipFromForwardedFor(value: string | null): string {
  if (!value) return "unknown";
  return value.split(",")[0]!.trim();
}
