import { NextResponse } from "next/server";
import { getAllProducts } from "@/sanity/lib/queries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim().toLowerCase();

  if (!q) return NextResponse.json({ results: [] });

  const products = await getAllProducts();
  const results = products
    .filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    )
    .slice(0, 5)
    .map((p) => ({ slug: p.slug, name: p.name, image: p.image, categoryLabel: p.categoryLabel }));

  return NextResponse.json({ results });
}
