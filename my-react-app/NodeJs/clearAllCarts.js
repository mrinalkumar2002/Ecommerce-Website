import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const cartItemSchema = new mongoose.Schema({
  productId: { type: String },
  title: { type: String },
  price: { type: Number },
  images: [{ type: String }],
  quantity: { type: Number },
});

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.Mixed, unique: true },
  items: [cartItemSchema],
}, { timestamps: true });

const Cart = mongoose.model("Cart", cartSchema);

async function clearAllCarts() {
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB");

  const result = await Cart.updateMany({}, { $set: { items: [] } });
  console.log(`🗑️  Cleared carts for ${result.modifiedCount} user(s)`);

  await mongoose.disconnect();
  console.log("✅ Done. All carts have been cleared.");
  process.exit(0);
}

clearAllCarts().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
