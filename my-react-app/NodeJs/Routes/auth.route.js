import express from "express";
import { register, login, logout } from "../Controller/auth.controller.js";
import authMiddleware from "../Middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// 🔥 ADD THIS ROUTE
router.get("/me", authMiddleware, (req, res) => {
  res.status(200).json({
    user: {
      id: req.user._id,
      email: req.user.email,
    },
  });
});

export default router;
