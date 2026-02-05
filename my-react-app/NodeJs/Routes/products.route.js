import express from "express";
import {
  saveData,
  getProducts,
  getProductID
} from "../Controller/products.controller.js";

const router = express.Router();

// 🔥 ADD THIS ROUTE (THIS IS MISSING)
router.post("/save", saveData);

// existing routes
router.get("/", getProducts);
router.get("/:id", getProductID);

export default router;






