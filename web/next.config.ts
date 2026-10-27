import type { NextConfig } from "next";

// Every directive needed by what this site actually loads in the browser:
// self-hosted fonts (next/font), Google Analytics (gated behind cookie
// consent), Cloudflare Turnstile, and next/image's own optimizer. SumUp
// checkout is a full-page redirect to a SumUp-hosted URL, not an embedded
// script, so it needs no allowance here. Inline styles/scripts stay allowed
// (`unsafe-inline`) because the app uses plenty of inline `style={}` and a
// couple of small inline bootstrap scripts (theme init, GA init) — moving to
// a nonce-based CSP would be a much bigger change for marginal extra benefit
// here. /studio (Sanity Studio) is excluded below: it's a large third-party
// app that talks to several Sanity domains, and getting that allowlist wrong
// would break the admin's only way to edit products.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://cdn.sanity.io",
  "font-src 'self'",
  "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://challenges.cloudflare.com",
  "frame-src https://challenges.cloudflare.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

// Applied everywhere, including /studio — none of these restrict what
// Sanity Studio itself needs to do.
const COMMON_SECURITY_HEADERS = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(self)" },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  async headers() {
    return [
      {
        source: "/((?!studio).*)",
        headers: [
          ...COMMON_SECURITY_HEADERS,
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Content-Security-Policy", value: CSP },
        ],
      },
      {
        source: "/studio/:path*",
        headers: COMMON_SECURITY_HEADERS,
      },
    ];
  },
};

export default nextConfig;
