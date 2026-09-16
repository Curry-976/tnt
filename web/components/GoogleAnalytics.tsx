"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { GA_MEASUREMENT_ID, isGoogleAnalyticsConfigured } from "@/lib/analytics";
import { COOKIE_CONSENT_EVENT, getCookieConsent, type CookieConsent } from "@/lib/cookie-consent";

// Only loads gtag.js once the visitor has actually clicked "Accepter" on the
// cookie banner — never on page load, and never after "Refuser". Reacts
// live to that choice (including a later "gérer les cookies" reset) without
// needing a page reload.
export function GoogleAnalytics() {
  const [consent, setConsent] = useState<CookieConsent | null>(null);

  useEffect(() => {
    setConsent(getCookieConsent());
    function handle(event: Event) {
      setConsent((event as CustomEvent<CookieConsent | null>).detail);
    }
    window.addEventListener(COOKIE_CONSENT_EVENT, handle);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, handle);
  }, []);

  if (!isGoogleAnalyticsConfigured || consent !== "accepted") return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
