// DOM-TOM postal codes start with these two digits — delivery isn't
// available there yet (see the marquee/footer copy across the site).
export const DOM_TOM_PREFIXES = ["97", "98"];

export function isDomTomPostalCode(postalCode: string): boolean {
  return DOM_TOM_PREFIXES.includes(postalCode.slice(0, 2));
}
