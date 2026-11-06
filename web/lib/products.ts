// Each jersey's price is set per product in Sanity (Studio field « Prix »).
// Same for the flocage fee (field « Prix du flocage »). BASE_PRICE and
// FLOQUAGE_PRICE are only the fallbacks for products where those fields were
// left empty (e.g. published before the fields existed). Catalog lives in
// Sanity — see sanity/lib/queries.ts.
export const BASE_PRICE = 35;
export const FLOQUAGE_PRICE = 5;

export const SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;
export type Size = (typeof SIZES)[number];
