import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/site";
import { getProduct } from "@/sanity/lib/queries";
import { ProductConfigurator } from "@/components/ProductConfigurator";
import { FavoriteButton } from "@/components/FavoriteButton";
import { ThemedProductImage } from "@/components/ThemedProductImage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};

  // "Maillot" in the meta title helps search visibility without touching
  // the plain product name shown on cards and the page's own <h1>.
  const title = `Maillot ${product.name}`;
  const url = `${SITE_URL}/produit/${product.slug}`;

  return {
    title,
    description: product.description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title,
      description: product.description,
      url,
      images: [{ url: product.image }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: product.description,
      images: [product.image],
    },
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

  const productUrl = `${SITE_URL}/produit/${product.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: [product.image],
    sku: product.slug,
    brand: { "@type": "Brand", name: "Torrow Nam Torrow" },
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "EUR",
      price: product.price,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <div className="product-layout">
      {/* Product rich-result data for search engines — see schema.org/Product. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="product-gallery">
        <ThemedProductImage
          src={product.image}
          srcDark={product.imageDark}
          alt={`Maillot ${product.name}`}
          sizes="(max-width: 1080px) 100vw, 55vw"
          priority
        />
      </div>
      <div className="product-info-panel">
        <div className="panel">
          <span className="badge" style={{ position: "static", display: "inline-flex" }}>
            {product.season === "hiver" ? "Hiver" : "Été"}
          </span>
          <h1 className="product-name" style={{ marginTop: 14 }}>
            {product.name}
          </h1>
          <div className="product-price-row">
            <span className="price" style={{ fontSize: 22 }}>{product.price} €</span>
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
