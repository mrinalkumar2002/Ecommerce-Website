import express from "express";
import {
  getPublicBanners,
  getPublicCategories,
  getPublicCoupons,
  validateCoupon,
  getProductReviews,
  submitReview,
  createSupportTicket,
  getUserTickets,
  getPublicSettings,
} from "../Controller/public.controller.js";

const router = express.Router();

// Banners & Categories
router.get("/banners", getPublicBanners);
router.get("/categories", getPublicCategories);

// Coupons
router.get("/coupons", getPublicCoupons);
router.post("/coupons/validate", validateCoupon);

// Reviews
router.get("/reviews/:productId", getProductReviews);
router.post("/reviews", submitReview);

// Support Tickets
router.post("/tickets", createSupportTicket);
router.get("/tickets/user", getUserTickets);

// Store Settings
router.get("/settings", getPublicSettings);

export default router;
