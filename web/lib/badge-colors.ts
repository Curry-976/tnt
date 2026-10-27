// Editors pick an arbitrary color per product in Sanity (gradient color
// picker via @sanity/color-input) so "Nouveau" / "Édition limitée" can match
// that jersey's own palette. The badge itself renders as a soft diagonal
// gradient (lightened tint -> the chosen color) rather than a flat fill, to
// match the glossy pill look used across the brand's jersey mockups.
//
// Text color and how far the gradient lightens are both derived
// automatically, using real WCAG contrast math (not a brightness guess) —
// checked against BOTH gradient stops, since text sits across the whole
// badge and a color that reads fine on the saturated end can still wash out
// on the lightened end (e.g. white text on a dark navy badge stays sharp on
// the navy itself but nearly disappears on the lightened corner).
const DEFAULT_HEX = "#f2c03c";
const DARK_TEXT = "#191f1a"; // the brand's near-black, used everywhere else
const PURE_BLACK = "#000000"; // last-resort fallback for extreme hues
const LIGHT_TEXT = "#ffffff";
const MIN_CONTRAST = 4.5; // WCAG AA for normal-size text
const MAX_LIGHTEN = 0.45;
const LIGHTEN_STEP = 0.05;

function parseHex(hex: string) {
  const clean = hex.replace("#", "");
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

function relativeLuminance(hex: string): number {
  const { r, g, b } = parseHex(hex);
  const [rs, gs, bs] = [r, g, b].map((channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(hexA: string, hexB: string): number {
  const [lighter, darker] = [relativeLuminance(hexA), relativeLuminance(hexB)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
}

// Mixes the color toward white by `ratio` (0 = unchanged, 1 = white).
function lighten(hex: string, ratio: number): { r: number; g: number; b: number } {
  const { r, g, b } = parseHex(hex);
  const mix = (channel: number) => Math.round(channel + (255 - channel) * ratio);
  return { r: mix(r), g: mix(g), b: mix(b) };
}

function rgbToHex({ r, g, b }: { r: number; g: number; b: number }): string {
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

function pickTextColor(base: string): string {
  const candidates = [DARK_TEXT, LIGHT_TEXT];
  let best = candidates[0];
  let bestContrast = contrastRatio(candidates[0], base);
  for (const candidate of candidates.slice(1)) {
    const contrast = contrastRatio(candidate, base);
    if (contrast > bestContrast) {
      best = candidate;
      bestContrast = contrast;
    }
  }
  // Neither brand color clears AA (only happens on a few extreme saturated
  // hues, e.g. pure red) — true black squeezes out a bit more contrast than
  // the brand's off-black, so use it as a last resort rather than ship text
  // that's still under 4.5:1.
  if (bestContrast < MIN_CONTRAST) {
    const pureBlackContrast = contrastRatio(PURE_BLACK, base);
    if (pureBlackContrast > bestContrast) return PURE_BLACK;
  }
  return best;
}

// Finds the most-lightened gradient stop (up to MAX_LIGHTEN) that still
// keeps the chosen text readable at that end too.
function pickLightenRatio(base: string, text: string): number {
  for (let ratio = MAX_LIGHTEN; ratio > 0; ratio -= LIGHTEN_STEP) {
    if (contrastRatio(text, rgbToHex(lighten(base, ratio))) >= MIN_CONTRAST) return ratio;
  }
  return 0;
}

export function badgeColorStyle(hex: string | undefined) {
  const base = hex && /^#[0-9a-fA-F]{6}$/.test(hex) ? hex : DEFAULT_HEX;
  const text = pickTextColor(base);
  const ratio = pickLightenRatio(base, text);
  const { r, g, b } = lighten(base, ratio);

  return {
    background: `linear-gradient(135deg, rgb(${r}, ${g}, ${b}) 0%, ${base} 100%)`,
    borderColor: "transparent",
    color: text,
  };
}
