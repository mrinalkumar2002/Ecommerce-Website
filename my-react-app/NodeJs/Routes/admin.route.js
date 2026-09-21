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

import {
  getCategories, addCategory, updateCategory, deleteCategory,
  getCoupons, addCoupon, updateCoupon, deleteCoupon,
  getReviews, updateReview, deleteReview,
  getBanners, addBanner, updateBanner, deleteBanner,
  getSettings, updateSetting,
  getTickets, updateTicket, deleteTicket
} from "../Controller/admin.features.controller.js";

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

// Categories
router.get("/categories", getCategories);
router.post("/categories", addCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

// Coupons
router.get("/coupons", getCoupons);
router.post("/coupons", addCoupon);
router.put("/coupons/:id", updateCoupon);
router.delete("/coupons/:id", deleteCoupon);

// Reviews
router.get("/reviews", getReviews);
router.put("/reviews/:id", updateReview);
router.delete("/reviews/:id", deleteReview);

// Banners
router.get("/banners", getBanners);
router.post("/banners", addBanner);
router.put("/banners/:id", updateBanner);
router.delete("/banners/:id", deleteBanner);

// Settings
router.get("/settings", getSettings);
router.put("/settings", updateSetting);

// Tickets
router.get("/tickets", getTickets);
router.put("/tickets/:id", updateTicket);
router.delete("/tickets/:id", deleteTicket);

export default router;
