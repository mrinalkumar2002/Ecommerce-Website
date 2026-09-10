import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import mongoose from "mongoose";
import dotenv from "dotenv";
import { seedProducts } from "./seedData.js";
dotenv.config();

const defaultUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/productsdata";

async function fixProduct() {
  try {
    const connOptions = {
      dbName: "productsdata",
      serverSelectionTimeoutMS: 10000,
    };
    if (defaultUri.includes("mongodb.net")) {
      connOptions.tls = true;
    }
    await mongoose.connect(defaultUri, connOptions);
    console.log("✅ Connected to MongoDB");
    
    // Seed new logic
    await seedProducts();
    
  } catch (err) {
    console.error("❌ Connection error:", err.message);
  }

  await mongoose.disconnect();
  process.exit(0);
}

fixProduct().catch((err) => { console.error(err); process.exit(1); });
