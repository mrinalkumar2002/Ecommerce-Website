import jwt from "jsonwebtoken";
import auth from "../Model/auth.model.js";
import mongoose from "mongoose";
import { memoryUsers } from "../Controller/auth.controller.js";

export default async function adminAuthMiddleware(req, res, next) {
  try {
    const token =
      req.cookies?.token ||
      req.headers?.authorization?.replace("Bearer ", "") ||
      req.headers?.["x-auth-token"];

    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const jwtSecret = process.env.JWT_SECRET || "myca_jwt_secret_key_2026";
    const decoded = jwt.verify(token, jwtSecret);

    // Check role in token first
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    let user = null;

    if (mongoose.connection.readyState === 1) {
      if (decoded.email) {
        user = await auth.findOne({ email: decoded.email }).select("-password").lean();
      } else {
        try {
          user = await auth.findOne({ _id: decoded.id }).select("-password").lean();
        } catch (castErr) {
          user = null;
        }
      }
    } else {
      user = memoryUsers.get(decoded.id) || memoryUsers.get(decoded.email);
    }

    if (!user) {
      return res.status(401).json({ message: "Admin user not found" });
    }

    // Double-check role from database
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("ADMIN AUTH ERROR:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
}
