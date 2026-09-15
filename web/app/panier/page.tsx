import type { Metadata } from "next";
import { getAllProducts } from "@/sanity/lib/queries";
import { PanierClient } from "@/components/PanierClient";

export const metadata: Metadata = { title: "Panier" };

export default async function PanierPage() {
  const products = await getAllProducts();

  return (
    <>
      <div className="page-head">
        <div className="page-eyebrow">Panier</div>
        <h1 className="page-title">Ton panier</h1>
      </div>

      <PanierClient products={products} />
    </>
  );
}
