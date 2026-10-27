export type CookieConsent = "accepted" | "rejected";

const STORAGE_KEY = "tnt-cookie-consent";
export const COOKIE_CONSENT_EVENT = "tnt:cookie-consent";

export function getCookieConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(STORAGE_KEY);
  return value === "accepted" || value === "rejected" ? value : null;
}

export function setCookieConsent(value: CookieConsent) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, value);
  window.dispatchEvent(new CustomEvent<CookieConsent>(COOKIE_CONSENT_EVENT, { detail: value }));
}

// Clears the stored choice and re-shows the banner (used by a "manage
// cookies" link) — components listening for COOKIE_CONSENT_EVENT get a
// null detail to distinguish this from an actual accept/reject.
export function resetCookieConsent() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent<null>(COOKIE_CONSENT_EVENT, { detail: null }));
}
