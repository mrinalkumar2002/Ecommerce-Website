import auth from "../Model/auth.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* ===================== REGISTER ===================== */
export async function register(req, res) {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and Password are required",
      });
    }

    // 2. Check existing user
    const exist = await auth.findOne({ email: email.toLowerCase().trim() });
    if (exist) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create user
    const user = new auth({
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });

    await user.save();

    return res.status(201).json({
      message: "User registered successfully",
      userId: user._id,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({
      message: "Unable to register user",
    });
  }
}

/* ===================== LOGIN ===================== */
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and Password are required",
      });
    }

    // 2. Find user
    const user = await auth.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // 3. Compare password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // 4. Create JWT
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 5. Set httpOnly cookie
    const isProduction = process.env.NODE_ENV === "production";

res.cookie("token", token, {
  httpOnly: true,
  secure: isProduction,                 // 🔥 true on Render, false on localhost
  sameSite: isProduction ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});


    // 6. Success response
    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        token
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({
      message: "Problem in Login",
    });
  }
}

/* ===================== LOGOUT ===================== */
export function logout(req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  return res.status(200).json({
    message: "Logged out successfully",
  });
}




