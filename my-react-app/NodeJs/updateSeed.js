import fs from "fs";
import { electronicsProducts } from "../src/data/electronicsData.js";
import { clothesProducts } from "../src/data/clothesData.js";
import { shoesProducts } from "../src/data/shoesData.js";
import { sportsProducts } from "../src/data/sportsData.js";

const allProducts = [
  ...electronicsProducts,
  ...clothesProducts,
  ...shoesProducts,
  ...sportsProducts,
];

const seedContent = `import Product from "./Model/products.model.js";

const initialProducts = ${JSON.stringify(allProducts, null, 2)};

export async function seedProducts() {
  try {
    console.log("🌱 Re-seeding all ${allProducts.length} products into MongoDB collection...");
    await Product.deleteMany({});
    await Product.insertMany(initialProducts);
    console.log("✅ All ${allProducts.length} products successfully seeded into MongoDB!");
  } catch (err) {
    console.error("❌ Error seeding products to MongoDB:", err.message);
  }
}
`;

fs.writeFileSync("./seedData.js", seedContent);
console.log(`✅ seedData.js generated successfully with ${allProducts.length} total products!`);
