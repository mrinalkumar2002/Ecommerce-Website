import express from "express";
import adminAuthMiddleware from "../Middleware/adminAuth.js";
import {
  getDashboardStats,
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../Controller/admin.controller.js";

const router = express.Router();

// All routes require admin authentication
router.use(adminAuthMiddleware);

// Dashboard
router.get("/stats", getDashboardStats);

// Orders
router.get("/orders", getAllOrders);
router.put("/orders/:id", updateOrderStatus);

// Users
router.get("/users", getAllUsers);

// Products CRUD
router.post("/products", addProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

export default router;
