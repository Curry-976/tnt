"use client";

import { resetCookieConsent } from "@/lib/cookie-consent";

export function ManageCookiesButton() {
  return (
    <button type="button" onClick={resetCookieConsent} style={{ background: "none", border: "none", padding: 0, font: "inherit", color: "inherit", cursor: "pointer" }}>
      Gérer les cookies
    </button>
  );
}
