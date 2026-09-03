import express from "express"
import mongoose from 'mongoose'
import cors from "cors";
import dotenv from "dotenv";
import cartRoutes from "./Routes/cart.route.js";
import productRoutes from "./Routes/products.route.js";
import authRoutes from "./Routes/auth.route.js";
import paymentRoutes from "./Routes/payment.route.js";
import orderRoutes from "./Routes/order.route.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app= express();
app.use(express.json())
app.use(cookieParser());

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((s) => s.trim())
  : [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:3000",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:5174",
    ];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }
      return callback(new Error("CORS policy violation: origin not allowed"), false);
    },
    credentials: true,
  })
);

app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/orders", orderRoutes);


app.get("/api/debug/routes", (req, res) => {
  const routes = [];

  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      routes.push({
        path: middleware.route.path,
        methods: middleware.route.methods,
      });
    } else if (middleware.name === "router" && middleware.handle && middleware.handle.stack) {
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          routes.push({
            path: handler.route.path,
            methods: handler.route.methods,
          });
        }
      });
    }
  });

  res.json(routes);
});


import { seedProducts } from "./seedData.js";
import Product from "./Model/products.model.js";

// MongoDB connection
async function connectDB() {
  const defaultUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/productsdata";
  const isAtlas = defaultUri.includes("mongodb.net");
  try {
    const connOptions = {
      dbName: "productsdata",
      serverSelectionTimeoutMS: 10000,
    };
    if (isAtlas) {
      connOptions.tls = true;
      if (process.env.MONGO_INSECURE_TLS === "true") {
        connOptions.tlsAllowInvalidCertificates = true;
      }
    }
    await mongoose.connect(defaultUri, connOptions);
    if (isAtlas) {
      console.log("✅ MongoDB Connected to ATLAS (Online Cloud Database)");
    } else {
      console.log("✅ MongoDB Connected to Local Server");
    }
  } catch (err) {
    console.error("❌ Atlas Connection Error:", err.message);
    console.log("⚠️ Local MongoDB not running. Starting Embedded MongoDB Server...");
    try {
      const { MongoMemoryServer } = await import("mongodb-memory-server");
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri, { dbName: "productsdata" });
      console.log("✅ Embedded MongoDB Server Online at:", mongoUri);
      console.log("⚠️ WARNING: Data is saved in TEMPORARY memory, NOT in Atlas!");
    } catch (e) {
      console.error("❌ Error starting embedded MongoDB:", e.message);
    }
  }
}

connectDB();

mongoose.connection.once("open", async () => {
  console.log("✅ Database Connected & Ready. DB Name:", mongoose.connection.name);
  try {
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log("📦 Seeding initial products data...");
      await seedProducts();
    } else {
      console.log(`📦 Database already seeded with ${productCount} products.`);
    }
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("👉 MongoDB Collections:", collections.map(c => c.name));
  } catch (err) {
    console.warn("Seeding check error:", err.message);
  }
});

mongoose.connection.on("error", () => {
  console.log("❌ Error in connecting...");
});

//start server
const PORT = process.env.PORT || 1900;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
