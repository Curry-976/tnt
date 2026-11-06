// In-memory sliding-window rate limiter, keyed by IP + action name.
//
// On Netlify the app runs in serverless functions, so the counters live in
// one function instance's memory: they reset when the instance is recycled
// and aren't shared between instances running in parallel. That still slows
// down a bot hammering the site from one IP (requests mostly land on a warm
// instance), and the forms keep their other protections (honeypot, timing
// check, Turnstile) — an acceptable trade-off versus adding a database table
// or an external service just for this.
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
