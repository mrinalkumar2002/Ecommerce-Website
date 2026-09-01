import fs from "fs";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { electronicsProducts } from "../src/data/electronicsData.js";
import { clothesProducts } from "../src/data/clothesData.js";
import { shoesProducts } from "../src/data/shoesData.js";
import { sportsProducts } from "../src/data/sportsData.js";
import Product from "./Model/products.model.js";

dotenv.config();

const sportsFixes = {
  "sport-009": ["https://images.unsplash.com/photo-1576678927484-cc907957088c?w=600&auto=format&fit=crop"],
  "sport-013": ["https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&auto=format&fit=crop"],
  "sport-015": ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop"],
  "sport-017": ["https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600&auto=format&fit=crop"],
  "sport-018": ["https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&auto=format&fit=crop"],
  "sport-019": ["https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=600&auto=format&fit=crop"],
  "sport-020": ["https://images.unsplash.com/photo-1511067007398-7e4b90cfa4bc?w=600&auto=format&fit=crop"],
  "sport-022": ["https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&auto=format&fit=crop"],
  "sport-023": ["https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=600&auto=format&fit=crop"],
  "sport-024": ["https://images.unsplash.com/photo-1563299796-17596ed6b017?w=600&auto=format&fit=crop"],
  "sport-025": ["https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&auto=format&fit=crop"],
  "sport-026": ["https://images.unsplash.com/photo-1519861531473-9200262188bf?w=600&auto=format&fit=crop"],
  "sport-030": ["https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600&auto=format&fit=crop"],
  "sport-031": ["https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=600&auto=format&fit=crop"],
  "sport-034": ["https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop"],
  "sport-035": ["https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop"],
  "sport-037": ["https://images.unsplash.com/photo-1613918108466-292b78a8ef95?w=600&auto=format&fit=crop"],
  "sport-038": ["https://images.unsplash.com/photo-1560090995-01632a28895b?w=600&auto=format&fit=crop"],
  "sport-040": ["https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=600&auto=format&fit=crop"],
  "sport-042": ["https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&auto=format&fit=crop"],
  "sport-043": ["https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=600&auto=format&fit=crop"],
  "sport-044": ["https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&auto=format&fit=crop"],
  "sport-045": ["https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop"],
  "sport-046": ["https://images.unsplash.com/photo-1558611848-73f7eb4001a1?w=600&auto=format&fit=crop"],
  "sport-047": ["https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&auto=format&fit=crop"],
  "sport-048": ["https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&auto=format&fit=crop"],
  "sport-050": ["https://images.unsplash.com/photo-1517438322307-e67111335449?w=600&auto=format&fit=crop"],
  "sport-052": ["https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=600&auto=format&fit=crop"],
  "sport-062": ["https://images.unsplash.com/photo-1511067007398-7e4b90cfa4bc?w=600&auto=format&fit=crop"],
  "sport-063": ["https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=600&auto=format&fit=crop"],
  "sport-064": ["https://images.unsplash.com/photo-1511067007398-7e4b90cfa4bc?w=600&auto=format&fit=crop"],
  "sport-065": ["https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&auto=format&fit=crop"],
  "sport-066": ["https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&auto=format&fit=crop"],
  "sport-067": ["https://images.unsplash.com/photo-1560090995-01632a28895b?w=600&auto=format&fit=crop"],
  "sport-075": ["https://images.unsplash.com/photo-1590556409324-aa1d726e5c3c?w=600&auto=format&fit=crop"],
  "sport-082": ["https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600&auto=format&fit=crop"],
  "sport-083": ["https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600&auto=format&fit=crop"],
  "sport-096": ["https://images.unsplash.com/photo-1613918108466-292b78a8ef95?w=600&auto=format&fit=crop"],
  "sport-102": ["https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop"]
};

const elecFixes = {
  "elec-101": ["https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600&auto=format&fit=crop"]
};

const clothFixes = {
  "cloth-084": ["https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=600&auto=format&fit=crop"]
};

const updatedSports = sportsProducts.map((p) => sportsFixes[p._id] ? { ...p, images: sportsFixes[p._id] } : p);
const updatedElec = electronicsProducts.map((p) => elecFixes[p._id] ? { ...p, images: elecFixes[p._id] } : p);
const updatedCloth = clothesProducts.map((p) => clothFixes[p._id] ? { ...p, images: clothFixes[p._id] } : p);

fs.writeFileSync("../src/data/sportsData.js", `export const sportsProducts = ${JSON.stringify(updatedSports, null, 2)};\n`);
fs.writeFileSync("../src/data/electronicsData.js", `export const electronicsProducts = ${JSON.stringify(updatedElec, null, 2)};\n`);
fs.writeFileSync("../src/data/clothesData.js", `export const clothesProducts = ${JSON.stringify(updatedCloth, null, 2)};\n`);

console.log("✅ Updated frontend data files (sportsData.js, electronicsData.js, clothesData.js)!");

// Aggregate all 408 products
const allProducts = [
  ...updatedElec,
  ...updatedCloth,
  ...shoesProducts,
  ...updatedSports,
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
console.log("✅ Updated seedData.js with all " + allProducts.length + " products!");

async function updateDb() {
  const defaultUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/productsdata";
  try {
    await mongoose.connect(defaultUri, {
      dbName: "productsdata",
      serverSelectionTimeoutMS: 5000,
      tls: true,
      tlsAllowInvalidCertificates: true
    });
    console.log("Connected to MongoDB, updating products in DB...");
    await Product.deleteMany({});
    await Product.insertMany(allProducts);
    console.log("✅ Database re-seeded with updated images!");
    await mongoose.disconnect();
  } catch (e) {
    console.log("Direct MongoDB connect skipped (backend server will seed on restart):", e.message);
  }
}

updateDb();
