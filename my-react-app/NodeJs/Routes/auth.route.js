import express from "express";
import { register, login, logout, updateProfile, adminLogin } from "../Controller/auth.controller.js";
import authMiddleware from "../Middleware/auth.js";
import adminAuthMiddleware from "../Middleware/adminAuth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/admin-login", adminLogin);
router.post("/logout", logout);
router.put("/profile", authMiddleware, updateProfile);

router.get("/me", authMiddleware, (req, res) => {
  res.status(200).json({
    user: {
      id: req.user._id,
      email: req.user.email,
      name: req.user.name || "",
      phone: req.user.phone || "",
      role: req.user.role || "user",
    },
  });
});

router.get("/admin/me", adminAuthMiddleware, (req, res) => {
  res.status(200).json({
    user: {
      id: req.user._id,
      email: req.user.email,
      name: req.user.name || "",
      role: "admin",
    },
  });
});

export default router;
