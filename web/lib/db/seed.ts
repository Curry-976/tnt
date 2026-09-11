// Run with: npm run db:seed (requires DATABASE_URL)
import { db } from "./index";
import { products } from "./schema";
import { PRODUCTS, BASE_PRICE } from "../products";

async function main() {
  for (const p of PRODUCTS) {
    await db
      .insert(products)
      .values({
        slug: p.slug,
        name: p.name,
        category: p.category,
        basePriceCents: BASE_PRICE * 100,
        image: p.image,
      })
      .onConflictDoNothing({ target: products.slug });
  }
  console.log(`Seeded ${PRODUCTS.length} products.`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
