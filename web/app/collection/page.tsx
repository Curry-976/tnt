import type { Metadata } from "next";
import { CollectionGrid } from "@/components/CollectionGrid";
import { FLOQUAGE_PRICE } from "@/lib/products";
import { getAllProducts, type ProductSeason } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "Maillots streetwear Mayotte : la collection",
  description:
    "Toute la collection de maillots streetwear Torrow Nam Torrow, personnalisables avec ton nom et ton numéro.",
};

const VALID_SEASONS = new Set(["ete", "hiver"]);

export default async function CollectionPage({
  searchParams,
}: {
  searchParams: Promise<{ saison?: string; q?: string }>;
}) {
  const { saison, q } = await searchParams;
  const initialSeason: ProductSeason = VALID_SEASONS.has(saison ?? "") ? (saison as ProductSeason) : "ete";
  const initialQuery = q ?? "";
  const products = await getAllProducts();

  return (
    <>
      <div className="page-head">
        <div className="page-eyebrow">Boutique</div>
        <h1 className="page-title">La collection</h1>
        <p className="page-lede">Une seule team. Nom et numéro pour {FLOQUAGE_PRICE} € de plus.</p>
      </div>

      <CollectionGrid initialSeason={initialSeason} initialQuery={initialQuery} products={products} />

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map((i) => (
            <div className="marquee-set" key={i}>
              <span>Livraison en France métropolitaine 15 à 20 jours</span>
              <span className="sep">/</span>
              <span>Livraison non disponible en DOM TOM</span>
              <span className="sep">/</span>
              <span>Flocage nom et numéro 5 €</span>
              <span className="sep">/</span>
              <span>Tissu recyclé 100%</span>
              <span className="sep">/</span>
              <span>Édition limitée</span>
              <span className="sep">/</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
