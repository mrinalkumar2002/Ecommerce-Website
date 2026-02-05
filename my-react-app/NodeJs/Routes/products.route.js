import express from "express";
import {
  saveData,
  getProducts,
  getProductID
} from "../Controller/products.controller.js";

const router = express.Router();

// 🔴 THIS LINE IS MISSING IN YOUR DEPLOYED CODE
router.post("/save", saveData);

// existing routes
router.get("/", getProducts);
router.get("/:id", getProductID);

export default router;





