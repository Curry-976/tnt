// Base price and personalisation fee are fixed store-wide (see chats/chat1.md
// and TNT Collection.dc.html: "35 € pièce, nom et numéro pour 5 € de plus").
// The product catalog itself (names, images, descriptions) lives in Sanity —
// see sanity/lib/queries.ts.
export const BASE_PRICE = 35;
export const FLOQUAGE_PRICE = 5;

export const SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;
export type Size = (typeof SIZES)[number];
