/**
 * Virtual Try-On Route — Backend proxy to Hugging Face IDM-VTON
 *
 * Accepts user photo + garment image URLs, downloads them server-side,
 * and sends to IDM-VTON Gradio Space. Returns the generated result image.
 *
 * This avoids CORS issues and handles the long processing time reliably.
 */

import express from "express";
import multer from "multer";
import { Client } from "@gradio/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads (user photo)
const uploadsDir = path.join(__dirname, "../uploads/tryon");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueName = `tryon_${Date.now()}_${Math.random().toString(36).slice(2, 8)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

/**
 * Download an image from URL and return as a Blob
 */
async function downloadImageAsBlob(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to download image from ${url}: ${response.status}`);
  const buffer = await response.arrayBuffer();
  return new Blob([buffer], { type: response.headers.get("content-type") || "image/jpeg" });
}

/**
 * POST /api/virtual-tryon
 *
 * Body (multipart/form-data):
 *   - userPhoto: File (uploaded image) OR
 *   - userPhotoUrl: string (URL of user photo)
 *   - garmentUrl: string (URL of garment image)
 *   - garmentDescription: string (description of the garment)
 */
router.post("/", upload.any(), async (req, res) => {
  const startTime = Date.now();
  console.log("🎨 Virtual Try-On request received");
  console.log("📋 Body fields:", Object.keys(req.body || {}));
  console.log("📁 Files:", req.files?.length || 0);

  try {
    const garmentUrl = req.body?.garmentUrl;
    const garmentDescription = req.body?.garmentDescription;
    const userPhotoUrl = req.body?.userPhotoUrl;

    const userPhotoFile = req.files?.find(f => f.fieldname === "userPhoto");
    const garmentPhotoFile = req.files?.find(f => f.fieldname === "garmentPhoto");

    if (!garmentUrl && !garmentPhotoFile) {
      return res.status(400).json({ error: "Either garmentUrl or garmentPhoto file is required" });
    }

    // Step 1: Get user photo blob
    let userPhotoBlob;
    if (userPhotoFile) {
      // User uploaded a file
      const fileBuffer = fs.readFileSync(userPhotoFile.path);
      userPhotoBlob = new Blob([fileBuffer], { type: userPhotoFile.mimetype });
      console.log("📸 User photo from file upload:", userPhotoFile.originalname);
      // Clean up uploaded file after reading
      fs.unlinkSync(userPhotoFile.path);
    } else if (userPhotoUrl) {
      // User provided a URL
      console.log("📸 Downloading user photo from URL:", userPhotoUrl.substring(0, 80));
      userPhotoBlob = await downloadImageAsBlob(userPhotoUrl);
    } else {
      return res.status(400).json({ error: "Either userPhoto file or userPhotoUrl is required" });
    }

    // Step 2: Get garment image blob
    let garmentBlob;
    if (garmentPhotoFile) {
      const fileBuffer = fs.readFileSync(garmentPhotoFile.path);
      garmentBlob = new Blob([fileBuffer], { type: garmentPhotoFile.mimetype });
      console.log("👗 Garment photo from file upload:", garmentPhotoFile.originalname);
      fs.unlinkSync(garmentPhotoFile.path);
    } else {
      console.log("👗 Downloading garment image:", garmentUrl.substring(0, 80));
      garmentBlob = await downloadImageAsBlob(garmentUrl);
    }

    // Step 3: Connect to IDM-VTON
    console.log("🔗 Connecting to IDM-VTON Hugging Face Space...");
    let client;
    try {
      client = await Client.connect("yisol/IDM-VTON");
    } catch (connErr) {
      console.error("❌ Failed to connect to IDM-VTON:", connErr.message);
      return res.status(503).json({
        error: "AI Virtual Try-On server is currently unreachable. The Hugging Face Space may be sleeping. Please try again in 1-2 minutes.",
        details: connErr.message,
      });
    }

    // Step 4: Intelligent Prompting & Category-aware Crop settings for Sarees / Dresses
    const descLower = (garmentDescription || "").toLowerCase();
    const isSareeOrFullOutfit =
      descLower.includes("saree") ||
      descLower.includes("sari") ||
      descLower.includes("lehenga") ||
      descLower.includes("gown") ||
      descLower.includes("dress") ||
      descLower.includes("anarkali") ||
      descLower.includes("custom garment") ||
      garmentPhotoFile !== undefined;

    // For Sarees & full dresses, disable tight upper-body crop (is_checked_crop = false)
    // so the AI does not chop off the waist, pleats, and shoulder pallu.
    const autoCrop = req.body?.isCrop !== undefined
      ? (req.body.isCrop === "true" || req.body.isCrop === true)
      : !isSareeOrFullOutfit;

    let finalGarmentDes = garmentDescription || "A stylish garment";
    if (descLower.includes("saree") || descLower.includes("sari")) {
      finalGarmentDes = `A traditional Indian saree with fitted blouse, elegant waist pleats, and draped pallu across the shoulder: ${garmentDescription}`;
    } else if (descLower.includes("custom garment") || garmentPhotoFile) {
      finalGarmentDes = `A beautiful saree or ethnic dress outfit carefully draped on the person: ${garmentDescription || "Custom Garment"}`;
    }

    console.log(`🧠 Running AI try-on prediction (isCrop: ${autoCrop}, SareeMode: ${isSareeOrFullOutfit})...`);
    let result;
    try {
      result = await client.predict("/tryon", {
        dict: {
          background: userPhotoBlob,
          layers: [],
          composite: null,
        },
        garm_img: garmentBlob,
        garment_des: finalGarmentDes,
        is_checked: true,
        is_checked_crop: autoCrop,
        denoise_steps: 35,
        seed: Math.floor(Math.random() * 1000000), // Random seed to prevent exact same artifacts
      });
    } catch (predErr) {
      console.error("❌ IDM-VTON prediction failed:", predErr.message);
      return res.status(500).json({
        error: "AI model could not process the images. The server may be overloaded or the images might be unsupported.",
        details: predErr.message,
      });
    }

    // Step 5: Extract result
    const generatedImageUrl =
      result?.data?.[0]?.url ||
      (typeof result?.data?.[0] === "string" ? result.data[0] : null);

    if (!generatedImageUrl) {
      console.error("❌ Empty result from IDM-VTON:", JSON.stringify(result?.data));
      return res.status(500).json({
        error: "AI returned an empty result. Please try with a different photo.",
      });
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`✅ Virtual Try-On complete in ${elapsed}s`);

    return res.json({
      success: true,
      generatedImageUrl,
      processingTime: `${elapsed}s`,
      provider: "Hugging Face IDM-VTON (Diffusion Model)",
    });
  } catch (err) {
    console.error("❌ Virtual Try-On error:", err.message);
    return res.status(500).json({
      error: "Something went wrong processing your try-on request.",
      details: err.message,
    });
  }
});

/**
 * GET /api/virtual-tryon/status
 * Health check to see if the IDM-VTON space is reachable
 */
router.get("/status", async (req, res) => {
  try {
    const client = await Client.connect("yisol/IDM-VTON");
    res.json({ status: "online", message: "IDM-VTON space is reachable" });
  } catch (err) {
    res.json({ status: "offline", message: "IDM-VTON space is currently sleeping or unreachable", error: err.message });
  }
});

export default router;
