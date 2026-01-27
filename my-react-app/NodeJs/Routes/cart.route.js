import express from "express";
import {
  getCart,
  addToCart,
  updateQuantity,
  removeItem,
} from "../Controller/cart.controller.js";
import authMiddleware from "../Middleware/auth.js";

const router = express.Router();

router.get("/", authMiddleware, getCart);
router.post("/add", authMiddleware, addToCart);
router.patch("/:productId", authMiddleware, updateQuantity);
router.delete("/:productId", authMiddleware, removeItem);

export default router;




