import express from "express";
import { saveData, getProducts, getProductID } from "../Controller/products.controller.js";

const router = express.Router();

// Fetch data from external API and save to MongoDB
router.get("/fetchdata", saveData);

// Get all products from MongoDB
router.get("/", getProducts);

router.get("/:id", getProductID) //get product by id

export default router;





