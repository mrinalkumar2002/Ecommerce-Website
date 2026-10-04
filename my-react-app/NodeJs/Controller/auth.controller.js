import auth from "../Model/auth.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const USERS_FILE = path.join(__dirname, "../users_data.json");

// Helper: Read persistent users from JSON file
function loadPersistentUsers() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const raw = fs.readFileSync(USERS_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn("Could not load users_data.json:", err.message);
  }
  return [];
}

// Helper: Save/Update user in JSON file
function savePersistentUser(userData) {
  try {
    const list = loadPersistentUsers();
    const idx = list.findIndex(
      (u) => u.email.toLowerCase() === userData.email.toLowerCase()
    );
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...userData };
    } else {
      list.push(userData);
    }
    fs.writeFileSync(USERS_FILE, JSON.stringify(list, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not save to users_data.json:", err.message);
  }
}

// Restore saved users to MongoDB when database connects
export async function restoreUsers() {
  try {
    const saved = loadPersistentUsers();
    if (!saved || saved.length === 0) return;

    for (const u of saved) {
      if (mongoose.connection.readyState === 1) {
        const exist = await auth.findOne({ email: u.email.toLowerCase() });
        if (!exist) {
          const userDoc = new auth({
            _id: u._id || undefined,
            email: u.email.toLowerCase(),
            password: u.password,
            name: u.name || "",
            phone: u.phone || "",
            role: u.role || "user",
          });
          await userDoc.save();
        } else if (u.role === "admin" && exist.role !== "admin") {
          exist.role = "admin";
          await exist.save();
        }
      }
    }
    console.log(`✅ Loaded ${saved.length} registered user account(s) into database.`);
  } catch (err) {
    console.warn("Error restoring users:", err.message);
  }
}

// In-memory fallback database for offline MongoDB environment
export const memoryUsers = new Map();

/* ===================== REGISTER ===================== */
export async function register(req, res) {
  try {
    const { email, password, name, phone } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and Password are required",
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      // 2. Check existing user
      const exist = await auth.findOne({ email: cleanEmail });
      if (exist) {
        return res.status(400).json({
          message: "Email already exists",
        });
      }

      // 3. Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // 4. Create user
      const user = new auth({
        email: cleanEmail,
        password: hashedPassword,
        name: name || "",
        phone: phone || "",
      });

      await user.save();

      // Persist to local disk backup
      savePersistentUser({
        _id: String(user._id),
        email: cleanEmail,
        password: hashedPassword,
        name: name || "",
        phone: phone || "",
        role: "user",
        createdAt: new Date().toISOString(),
      });

      return res.status(201).json({
        message: "User registered successfully",
        userId: user._id,
      });
    } else {
      // In-memory fallback mode
      if (memoryUsers.has(cleanEmail)) {
        return res.status(400).json({
          message: "Email already exists",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = "user_" + Date.now();
      const user = {
        _id: userId,
        email: cleanEmail,
        password: hashedPassword,
        name: name || "",
        phone: phone || "",
      };

      memoryUsers.set(cleanEmail, user);
      memoryUsers.set(userId, user);

      // Persist to local disk backup
      savePersistentUser({
        _id: userId,
        email: cleanEmail,
        password: hashedPassword,
        name: name || "",
        phone: phone || "",
        role: "user",
        createdAt: new Date().toISOString(),
      });

      return res.status(201).json({
        message: "User registered successfully",
        userId: userId,
      });
    }
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({
      message: "Unable to register user",
    });
  }
}

// In-memory rate limiter for authentication endpoints
const loginAttempts = new Map();
const MAX_ATTEMPTS = 15;
const LOCKOUT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(key) {
  const now = Date.now();
  const record = loginAttempts.get(key);
  if (!record) return { allowed: true };
  if (now - record.lastAttempt > LOCKOUT_WINDOW_MS) {
    loginAttempts.delete(key);
    return { allowed: true };
  }
  if (record.count >= MAX_ATTEMPTS) {
    const remainingMins = Math.ceil((LOCKOUT_WINDOW_MS - (now - record.lastAttempt)) / 60000);
    return { allowed: false, remainingMins };
  }
  return { allowed: true };
}

function recordFailedAttempt(key) {
  const now = Date.now();
  const record = loginAttempts.get(key) || { count: 0, lastAttempt: now };
  record.count += 1;
  record.lastAttempt = now;
  loginAttempts.set(key, record);
}

function resetAttempts(key) {
  loginAttempts.delete(key);
}

/* ===================== LOGIN ===================== */
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    console.log(`[LOGIN ATTEMPT] email: "${email}", password: "${password}"`);

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and Password are required",
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const rateLimitKey = `${req.ip || "unknown"}_${cleanEmail}`;

    // Rate limit check
    const rateCheck = checkRateLimit(rateLimitKey);
    if (!rateCheck.allowed) {
      return res.status(429).json({
        message: `Too many failed attempts. Please try again in ${rateCheck.remainingMins} minute(s).`,
      });
    }

    const jwtSecret = process.env.JWT_SECRET || "shoppyglobe_jwt_secret_key_2026";
    const isProduction = process.env.NODE_ENV === "production";

    let user = null;

    if (mongoose.connection.readyState === 1) {
      user = await auth.findOne({ email: cleanEmail });

      // Fallback: check persistent backup if MongoDB re-seeded/restarted
      if (!user) {
        const savedList = loadPersistentUsers();
        const found = savedList.find((u) => u.email.toLowerCase() === cleanEmail);
        if (found) {
          user = new auth({
            _id: found._id && found._id.length === 24 ? found._id : undefined,
            email: found.email.toLowerCase(),
            password: found.password,
            name: found.name || "",
            phone: found.phone || "",
          });
          await user.save();
        }
      }
    } else {
      user = memoryUsers.get(cleanEmail);
      if (!user) {
        const savedList = loadPersistentUsers();
        const found = savedList.find((u) => u.email.toLowerCase() === cleanEmail);
        if (found) {
          user = found;
          memoryUsers.set(cleanEmail, user);
        }
      }
    }

    // Reject non-existent user
    if (!user) {
      recordFailedAttempt(rateLimitKey);
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Compare password hash
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      recordFailedAttempt(rateLimitKey);
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Reset failed attempts on success
    resetAttempts(rateLimitKey);

    // 4. Create JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role || "user" },
      jwtSecret,
      { expiresIn: "7d" }
    );

    // 5. Set session cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });

    // 6. Success response
    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        name: user.name || "",
        role: user.role || "user",
        token,
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

/* ===================== ADMIN LOGIN ===================== */
export async function adminLogin(req, res) {
  try {
    const { email, password } = req.body;
    console.log(`[ADMIN LOGIN ATTEMPT] email: "${email}"`);

    if (!email || !password) {
      return res.status(400).json({ message: "Email and Password are required" });
    }

    const cleanEmail = email.toLowerCase().trim();
    const rateLimitKey = `admin_${req.ip || "unknown"}_${cleanEmail}`;

    const rateCheck = checkRateLimit(rateLimitKey);
    if (!rateCheck.allowed) {
      return res.status(429).json({
        message: `Too many failed attempts. Please try again in ${rateCheck.remainingMins} minute(s).`,
      });
    }

    const jwtSecret = process.env.JWT_SECRET || "shoppyglobe_jwt_secret_key_2026";
    const isProduction = process.env.NODE_ENV === "production";

    let user = null;

    if (mongoose.connection.readyState === 1) {
      user = await auth.findOne({ email: cleanEmail });
    } else {
      user = memoryUsers.get(cleanEmail);
    }

    if (!user) {
      recordFailedAttempt(rateLimitKey);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check admin role
    if ((user.role || "user") !== "admin") {
      recordFailedAttempt(rateLimitKey);
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      recordFailedAttempt(rateLimitKey);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    resetAttempts(rateLimitKey);

    const token = jwt.sign(
      { id: user._id, email: user.email, role: "admin" },
      jwtSecret,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });

    return res.status(200).json({
      message: "Admin login successful",
      user: {
        id: user._id,
        email: user.email,
        name: user.name || "",
        role: "admin",
        token,
      },
    });
  } catch (error) {
    console.error("ADMIN LOGIN ERROR:", error);
    return res.status(500).json({ message: "Problem in Admin Login" });
  }
}

/* ===================== UPDATE PROFILE ===================== */
export async function updateProfile(req, res) {
  try {
    const { name, phone } = req.body;
    const userId = req.user?._id || req.user?.id;
    const userEmail = req.user?.email;

    if (mongoose.connection.readyState === 1) {
      let updatedUser = null;

      if (userEmail) {
        updatedUser = await auth.findOneAndUpdate(
          { email: userEmail.toLowerCase().trim() },
          { name, phone },
          { new: true }
        ).select("-password");
      }

      if (!updatedUser && userId) {
        try {
          updatedUser = await auth.findByIdAndUpdate(
            userId,
            { name, phone },
            { new: true }
          ).select("-password");
        } catch (err) {}
      }

      if (userEmail) {
        savePersistentUser({
          email: userEmail.toLowerCase().trim(),
          name,
          phone,
        });
      }

      return res.status(200).json({
        message: "Profile updated successfully",
        user: updatedUser || { id: userId, email: userEmail, name, phone },
      });
    } else {
      let user = memoryUsers.get(userEmail) || memoryUsers.get(String(userId));
      if (user) {
        user.name = name;
        user.phone = phone;
        memoryUsers.set(userEmail, user);
        memoryUsers.set(String(userId), user);

        savePersistentUser({
          email: userEmail,
          name,
          phone,
        });
      }
      return res.status(200).json({
        message: "Profile updated successfully",
        user: { id: userId, email: userEmail, name, phone },
      });
    }
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    return res.status(500).json({ message: "Error updating profile" });
  }
}
