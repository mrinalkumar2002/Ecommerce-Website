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

//MongooDB connection
mongoose.connect(process.env.MONGO_URI)

const DB=mongoose.connection;
DB.on("open",()=>{
    console.log("Database is connected...") //show that the database is connected

})

DB.on("error",()=>{
    console.log("Error in connecting..") //handle error in connecting
})

//start server
app.listen("1900",()=>{
    console.log("Server is running on server 1900...")
})
