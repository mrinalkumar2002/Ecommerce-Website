import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./Model/products.model.js";

dotenv.config();

async function updateVariedStocks() {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb+srv://nikhilkumar16008_db_user:nikhil321@cluster0.bovhrib.mongodb.net/productsdata?retryWrites=true&w=majority";
    console.log("Connecting to Mongo Atlas with Custom DNS...");
    
    await mongoose.connect(mongoUri, { dbName: "productsdata", serverSelectionTimeoutMS: 10000 });
    console.log("✅ Connected to MongoDB Atlas Cloud Database!");

    const products = await Product.find({});
    console.log(`Found ${products.length} products in database.`);

    const variedStocks = [3, 5, 8, 12, 15, 24, 45, 6, 2, 9, 32, 50, 75, 4, 18, 29, 65, 88, 7, 14];

    let count = 0;
    for (let i = 0; i < products.length; i++) {
      const newStock = variedStocks[i % variedStocks.length];
      await Product.updateOne({ _id: products[i]._id }, { $set: { stock: newStock } });
      count++;
    }

    console.log(`✅ Successfully updated varied stock for all ${count} products in MongoDB Atlas!`);
    process.exit(0);
  } catch (err) {
    console.error("Error updating stocks:", err.message);
    process.exit(1);
  }
}

updateVariedStocks();
