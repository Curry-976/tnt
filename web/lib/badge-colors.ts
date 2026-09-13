// Editors pick an arbitrary color per product in Sanity (gradient color
// picker via @sanity/color-input) so "Nouveau" / "Édition limitée" can match
// that jersey's own palette. Text color is derived automatically for
// contrast — nobody has to also pick a readable text color by hand.
const DEFAULT_BADGE = { background: "#f2c03c", color: "#191f1a" };

function textColorFor(hex: string): string {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  // Perceived brightness (ITU-R BT.601) — dark text above the midpoint,
  // white text below it, so it stays readable whatever hue is picked.
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 155 ? "#191f1a" : "#ffffff";
}

export function badgeColorStyle(hex: string | undefined) {
  if (!hex || !/^#[0-9a-fA-F]{6}$/.test(hex)) {
    return { background: DEFAULT_BADGE.background, borderColor: "transparent", color: DEFAULT_BADGE.color };
  }
  return { background: hex, borderColor: "transparent", color: textColorFor(hex) };
}
