import type { Metadata } from "next";
import { FavoritesGrid } from "@/components/FavoritesGrid";
import { getAllProducts } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "Favoris",
  description: "Les maillots que tu as mis de côté.",
};

export default async function FavorisPage() {
  const products = await getAllProducts();

  return (
    <>
      <div className="page-head">
        <div className="page-eyebrow">Ma sélection</div>
        <h1 className="page-title">Favoris</h1>
        <p className="page-lede">Les maillots que tu as mis de côté.</p>
      </div>

      <FavoritesGrid products={products} />
    </>
  );
}
