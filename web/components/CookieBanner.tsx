"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { COOKIE_CONSENT_EVENT, getCookieConsent, setCookieConsent, type CookieConsent } from "@/lib/cookie-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!getCookieConsent()) setVisible(true);

    // Reopens when consent is reset (the footer's "Gérer les cookies" link).
    function handle(event: Event) {
      const value = (event as CustomEvent<CookieConsent | null>).detail;
      if (value === null) setVisible(true);
    }
    window.addEventListener(COOKIE_CONSENT_EVENT, handle);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, handle);
  }, []);

  function choose(value: "accepted" | "rejected") {
    setCookieConsent(value);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-label="Préférences cookies">
      <p className="cookie-banner-text">
        On utilise le stockage de ton navigateur pour ton panier, tes favoris et le thème
        clair/sombre, et — si tu acceptes — Google Analytics pour mesurer la fréquentation du
        site (pas de publicité ciblée). Détails sur notre{" "}
        <Link href="/a-propos#rgpd" style={{ textDecoration: "underline" }}>
          politique de confidentialité
        </Link>
        .
      </p>
      <div className="cookie-banner-actions">
        <button type="button" className="ghost" onClick={() => choose("rejected")}>
          Refuser
        </button>
        <button type="button" className="cta" onClick={() => choose("accepted")}>
          <span>Accepter</span>
        </button>
      </div>
    </div>
  );
}
