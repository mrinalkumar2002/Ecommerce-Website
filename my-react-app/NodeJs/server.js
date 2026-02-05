import express from "express"
import mongoose from 'mongoose'
import cors from "cors";
import dotenv from "dotenv";
import cartRoutes from "./Routes/cart.route.js";
import productRoutes from "./Routes/products.route.js";
import authRoutes from "./Routes/auth.route.js";
import cookieParser from "cookie-parser";



dotenv.config();

const app= express();
app.use(express.json())
app.use(cookieParser());

app.use(cors({
origin: [
      "http://localhost:5173", // local dev
      "https://ecommerce-website-8vod.vercel.app" // Vercel frontend
    ],
  
  credentials: true
}));

;
app.use("/api/cart", cartRoutes);
app.use("/api/auth", authRoutes);


app.use("/api/products", productRoutes);

app.get("/api/debug/routes", (req, res) => {
  const routes = [];

  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      routes.push({
        path: middleware.route.path,
        methods: middleware.route.methods,
      });
    } else if (middleware.name === "router") {
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


//MongooDB connection
mongoose.connect(process.env.MONGO_URI, {
  dbName: "productsdata"
});


mongoose.connection.once("open", async () => {
  console.log("✅ Database connected");
  console.log("👉 DB Name:", mongoose.connection.name);

  const collections = await mongoose.connection.db
    .listCollections()
    .toArray();

  console.log(
    "👉 Collections:",
    collections.map(c => c.name)
  );
});

mongoose.connection.on("error", () => {
  console.log("❌ Error in connecting...");
});

//start server
const PORT = process.env.PORT || 1900;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

