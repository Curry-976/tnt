export type CookieConsent = "accepted" | "rejected";

const STORAGE_KEY = "tnt-cookie-consent";

export function getCookieConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(STORAGE_KEY);
  return value === "accepted" || value === "rejected" ? value : null;
}

export function setCookieConsent(value: CookieConsent) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, value);
}
