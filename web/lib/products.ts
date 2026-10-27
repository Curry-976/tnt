// Each jersey's price is set per product in Sanity (Studio field « Prix »).
// BASE_PRICE is only the fallback for products whose price was left empty
// (e.g. those published before the field existed). The personalisation fee
// stays fixed store-wide. Catalog lives in Sanity — see sanity/lib/queries.ts.
export const BASE_PRICE = 35;
export const FLOQUAGE_PRICE = 5;

export const SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;
export type Size = (typeof SIZES)[number];
