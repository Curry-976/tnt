// Named badge colors editors can pick per product in Sanity, so "Nouveau" /
// "Édition limitée" can each carry a color that matches that jersey's own
// palette instead of one fixed color for every product.
export const BADGE_COLORS = {
  or: { background: "#f2c03c", color: "#191f1a" },
  rose: { background: "#fce0e8", color: "#b23a63" },
  vert: { background: "#dceedf", color: "#2f7a4d" },
  violet: { background: "#e6e0f8", color: "#5b4b9e" },
  corail: { background: "#fbe2de", color: "#b3423b" },
  bleu: { background: "#dce8fb", color: "#2f5aa8" },
} as const;

export type BadgeColor = keyof typeof BADGE_COLORS;

export function badgeColorStyle(color: string | undefined) {
  const match = color && color in BADGE_COLORS ? BADGE_COLORS[color as BadgeColor] : undefined;
  if (!match) return undefined;
  return { background: match.background, borderColor: "transparent", color: match.color };
}
