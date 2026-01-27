import jwt from "jsonwebtoken";
import auth from "../Model/auth.model.js";

export default async function authMiddleware(req, res, next) {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 FETCH FULL USER
    const user = await auth.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // 🔥 THIS FIXES EVERYTHING
    req.user = user;

    next();
  } catch (err) {
    console.error("AUTH ERROR:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
}







