// Editors pick an arbitrary color per product in Sanity (gradient color
// picker via @sanity/color-input) so "Nouveau" / "Édition limitée" can match
// that jersey's own palette. The badge itself renders as a soft diagonal
// gradient (lightened tint -> the chosen color) rather than a flat fill, to
// match the glossy pill look used across the brand's jersey mockups. Text
// color is derived automatically for contrast — nobody has to also pick a
// readable text color by hand.
const DEFAULT_HEX = "#f2c03c";

function parseHex(hex: string) {
  const clean = hex.replace("#", "");
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

function textColorFor(hex: string): string {
  const { r, g, b } = parseHex(hex);
  // Perceived brightness (ITU-R BT.601) — dark text above the midpoint,
  // white text below it, so it stays readable whatever hue is picked.
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 155 ? "#191f1a" : "#ffffff";
}

// Mixes the color toward white by `ratio` (0 = unchanged, 1 = white) to get
// a lighter tint for the gradient's starting stop.
function lighten(hex: string, ratio: number): string {
  const { r, g, b } = parseHex(hex);
  const mix = (channel: number) => Math.round(channel + (255 - channel) * ratio);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}

export function badgeColorStyle(hex: string | undefined) {
  const base = hex && /^#[0-9a-fA-F]{6}$/.test(hex) ? hex : DEFAULT_HEX;
  return {
    background: `linear-gradient(135deg, ${lighten(base, 0.45)} 0%, ${base} 100%)`,
    borderColor: "transparent",
    color: textColorFor(base),
  };
}
