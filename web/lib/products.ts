export type ProductCategory = "home" | "away" | "keeper";

export type Product = {
  slug: string;
  name: string;
  category: ProductCategory;
  categoryLabel: string;
  image: string;
  badge?: string;
  description: string;
};

// Base price and personalisation fee are fixed store-wide (see chats/chat1.md
// and TNT Collection.dc.html: "35 € pièce, nom et numéro pour 5 € de plus").
export const BASE_PRICE = 35;
export const FLOQUAGE_PRICE = 5;

export const SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;
export type Size = (typeof SIZES)[number];

export const PRODUCTS: Product[] = [
  {
    slug: "domicile-noir",
    name: "Domicile / Noir",
    category: "home",
    categoryLabel: "Domicile",
    image: "/assets/jersey-hanger.jpg",
    badge: "Nouveau",
    description:
      "Le maillot domicile, noir profond, floqué du blason Torrow Nam Torrow. La pièce de référence de la collection.",
  },
  {
    slug: "exterieur-blanc",
    name: "Extérieur / Blanc",
    category: "away",
    categoryLabel: "Extérieur",
    image: "/assets/jersey-details-green.webp",
    description:
      "Le maillot extérieur, blanc cassé, détails brodés inspirés du territoire. Léger et respirant.",
  },
  {
    slug: "gardien-gris",
    name: "Gardien / Gris",
    category: "keeper",
    categoryLabel: "Gardien",
    image: "/assets/jersey-details-pink.webp",
    description:
      "Le maillot gardien, coupe ample, gris anthracite. Pensé pour le jeu, taillé pour la rue.",
  },
  {
    slug: "domicile-or",
    name: "Domicile / Édition or",
    category: "home",
    categoryLabel: "Domicile",
    image: "/assets/hero-04.jpg",
    description: "Édition limitée domicile, liseré or. Tirage restreint.",
  },
  {
    slug: "exterieur-match",
    name: "Extérieur / Match",
    category: "away",
    categoryLabel: "Extérieur",
    image: "/assets/hero-06.jpg",
    description: "Le maillot extérieur en situation de match, coupe performance.",
  },
  {
    slug: "gardien-nuit",
    name: "Gardien / Nuit",
    category: "keeper",
    categoryLabel: "Gardien",
    image: "/assets/hero-07.jpg",
    description: "Le maillot gardien coloris nuit, pour les soirs de match.",
  },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
