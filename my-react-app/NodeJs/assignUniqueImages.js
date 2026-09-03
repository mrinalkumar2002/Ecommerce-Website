import fs from "fs";
import { electronicsProducts } from "../src/data/electronicsData.js";
import { clothesProducts } from "../src/data/clothesData.js";
import { shoesProducts } from "../src/data/shoesData.js";
import { sportsProducts } from "../src/data/sportsData.js";

const shoesFixes = {
  "shoe-002": ["https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&auto=format&fit=crop"],
  "shoe-027": ["https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&auto=format&fit=crop"],
  "shoe-029": ["https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&auto=format&fit=crop"],
  "shoe-040": ["https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop"],
  "shoe-049": ["https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&auto=format&fit=crop"],
  "shoe-052": ["https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&auto=format&fit=crop"],
  "shoe-031": ["https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600&auto=format&fit=crop"],
  "shoe-046": ["https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop"],
  "shoe-035": ["https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&auto=format&fit=crop"],
  "shoe-020": ["https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&auto=format&fit=crop"],
  "shoe-034": ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop"],
  "shoe-026": ["https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop"],
  "shoe-037": ["https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop"],
  "shoe-032": ["https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop"],
  "shoe-041": ["https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop"],
  "shoe-047": ["https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&auto=format&fit=crop"],
  "shoe-030": ["https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&auto=format&fit=crop"],
  "shoe-044": ["https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&auto=format&fit=crop"],
  "shoe-023": ["https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=600&auto=format&fit=crop"],
  "shoe-043": ["https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=600&auto=format&fit=crop"],
  "shoe-025": ["https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=600&auto=format&fit=crop"],
  "shoe-036": ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop"]
};

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

const updatedShoes = shoesProducts.map((p) => shoesFixes[p._id] ? { ...p, images: shoesFixes[p._id] } : p);
const updatedSports = sportsProducts.map((p) => sportsFixes[p._id] ? { ...p, images: sportsFixes[p._id] } : p);
const updatedElec = electronicsProducts.map((p) => elecFixes[p._id] ? { ...p, images: elecFixes[p._id] } : p);
const updatedCloth = clothesProducts.map((p) => clothFixes[p._id] ? { ...p, images: clothFixes[p._id] } : p);

fs.writeFileSync("../src/data/shoesData.js", `export const shoesProducts = ${JSON.stringify(updatedShoes, null, 2)};\n`);
fs.writeFileSync("../src/data/sportsData.js", `export const sportsProducts = ${JSON.stringify(updatedSports, null, 2)};\n`);
fs.writeFileSync("../src/data/electronicsData.js", `export const electronicsProducts = ${JSON.stringify(updatedElec, null, 2)};\n`);
fs.writeFileSync("../src/data/clothesData.js", `export const clothesProducts = ${JSON.stringify(updatedCloth, null, 2)};\n`);

console.log("✅ All dataset files updated!");

// Aggregate all 408 products
const allProducts = [
  ...updatedElec,
  ...updatedCloth,
  ...updatedShoes,
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
console.log("✅ seedData.js written with all " + allProducts.length + " products!");
