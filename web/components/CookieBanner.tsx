"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCookieConsent, setCookieConsent } from "@/lib/cookie-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!getCookieConsent()) setVisible(true);
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
        clair/sombre — rien de publicitaire. Détails sur notre{" "}
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
