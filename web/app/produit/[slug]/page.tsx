import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { BASE_PRICE } from "@/lib/products";
import { getProduct } from "@/sanity/lib/queries";
import { ProductConfigurator } from "@/components/ProductConfigurator";
import { FavoriteButton } from "@/components/FavoriteButton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  return {
    title: `TORROW NAM – ${product.name}`,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  return (
    <div className="product-layout">
      <div className="product-gallery">
        <Image src={product.image} alt={product.name} fill sizes="(max-width: 1080px) 100vw, 55vw" priority />
      </div>
      <div className="product-info-panel">
        <div className="panel">
          <span className="badge" style={{ position: "static", display: "inline-flex" }}>
            {product.categoryLabel}
          </span>
          <h1 className="product-name" style={{ marginTop: 14 }}>
            TORROW NAM – {product.name}
          </h1>
          <div className="product-price-row">
            <span className="price" style={{ fontSize: 22 }}>{BASE_PRICE} €</span>
            <span className="faint">flocage nom + numéro en option</span>
          </div>
          <p className="product-desc">{product.description}</p>
          <FavoriteButton slug={product.slug} variant="inline" />
        </div>
        <ProductConfigurator product={product} />
      </div>
    </div>
  );
}
