import { defineQuery } from "next-sanity";
import { getClient } from "./client";
import { isSanityConfigured } from "../env";
import type { ProductCategory } from "@/lib/products";

export type ProductSeason = "ete" | "hiver";

export type Product = {
  slug: string;
  name: string;
  category: ProductCategory;
  categoryLabel: string;
  season: ProductSeason;
  image: string;
  badge?: string;
  description: string;
};

const CATEGORY_LABELS: Record<ProductCategory, string> = {
  home: "Domicile",
  away: "Extérieur",
  keeper: "Gardien",
};

type RawProduct = {
  name: string;
  slug: string | null;
  category: ProductCategory;
  season: ProductSeason | null;
  image: string | null;
  badge: string | null;
  description: string | null;
};

function toProduct(raw: RawProduct): Product | null {
  if (!raw.slug || !raw.image) return null;
  return {
    slug: raw.slug,
    name: raw.name,
    category: raw.category,
    categoryLabel: CATEGORY_LABELS[raw.category] ?? raw.category,
    // Products published before the season field existed default to Été.
    season: raw.season ?? "ete",
    image: raw.image,
    badge: raw.badge ?? undefined,
    description: raw.description ?? "",
  };
}

const ALL_PRODUCTS_QUERY = defineQuery(`
  *[_type == "product"] | order(order asc, name asc) {
    name,
    "slug": slug.current,
    category,
    season,
    "image": image.asset->url,
    badge,
    description
  }
`);

const PRODUCT_BY_SLUG_QUERY = defineQuery(`
  *[_type == "product" && slug.current == $slug][0] {
    name,
    "slug": slug.current,
    category,
    season,
    "image": image.asset->url,
    badge,
    description
  }
`);

export async function getAllProducts(): Promise<Product[]> {
  if (!isSanityConfigured) return [];
  const raw = await getClient().fetch<RawProduct[]>(ALL_PRODUCTS_QUERY, {}, { next: { revalidate: 60 } });
  return raw.map(toProduct).filter((p): p is Product => p !== null);
}

export async function getProduct(slug: string): Promise<Product | null> {
  if (!isSanityConfigured) return null;
  const raw = await getClient().fetch<RawProduct | null>(
    PRODUCT_BY_SLUG_QUERY,
    { slug },
    { next: { revalidate: 60 } }
  );
  return raw ? toProduct(raw) : null;
}
