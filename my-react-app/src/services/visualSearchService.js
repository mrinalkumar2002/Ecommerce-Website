/**
 * Visual Search Service – Groq Qwen Vision AI + Heuristic Fallback
 *
 * Model: qwen/qwen3.8-27b  (ONLY vision model on this Groq account)
 * - Supports image_url with both base64 and external URLs
 * - Does NOT support "thinking" property → send clean request
 * - Image files compressed to 512×512 JPEG for speed
 * - External URL images passed directly (no canvas = no CORS taint)
 */

import { clothesProducts } from "../data/clothesData.js";
import { electronicsProducts } from "../data/electronicsData.js";
import { shoesProducts } from "../data/shoesData.js";
import { sportsProducts } from "../data/sportsData.js";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const VISION_MODEL = "qwen/qwen3.8-27b"; // Only vision model available on this account

const ALL_CATALOG_PRODUCTS = [
  ...electronicsProducts,
  ...clothesProducts,
  ...shoesProducts,
  ...sportsProducts,
];

// ─── Image Preparation ────────────────────────────────────────────────────────

/**
 * Compress a File/Blob to max 512×512 JPEG base64.
 * For string URLs → return as-is (canvas would cause CORS taint on external images).
 */
function prepareImageForApi(file) {
  return new Promise((resolve, reject) => {
    // External URL – pass directly; Groq can fetch it server-side
    if (typeof file === "string") return resolve(file);

    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        try {
          const MAX = 512;
          const ratio = Math.min(MAX / img.width, MAX / img.height, 1);
          const canvas = document.createElement("canvas");
          canvas.width = Math.round(img.width * ratio);
          canvas.height = Math.round(img.height * ratio);
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", 0.75));
        } catch {
          // Canvas tainted – fall back to uncompressed base64
          console.warn("[VisualSearch] Canvas tainted, using uncompressed base64");
          resolve(reader.result);
        }
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

// ─── Groq Vision Classifier ───────────────────────────────────────────────────

const VISION_PROMPT = `Look at this image and classify the product or outfit shown.
Choose EXACTLY ONE category from the list below.

Categories:
- "women_dress"    → saree, kurti, lehenga, gown, dress, frock, maxi dress, midi dress
- "women_clothes"  → women's tops, jeans, skirts, blouses, female outfit
- "men_clothes"    → men's shirts, jeans, suits, blazers, polo, male outfit
- "shoes"          → any footwear: sneakers, boots, sandals, heels, loafers, slippers
- "laptop"         → laptops, notebooks, macbooks
- "phone"          → smartphones, iphones, mobile phones
- "headphone"      → headphones, earbuds, earphones, headsets
- "watch"          → smartwatches, wristwatches
- "camera"         → cameras, dslr, action cams
- "tv"             → televisions, monitors, displays
- "gaming"         → gaming consoles, controllers
- "speaker"        → bluetooth/portable speakers
- "sports"         → gym equipment, sports balls, fitness items

Reply with ONLY valid JSON, no other text:
{"category":"shoes","detectedName":"Nike Air Running Sneakers","confidence":0.95}`;

async function classifyWithGroqVision(imageUrl) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    console.log("[VisualSearch] Calling qwen/qwen3.8-27b with image...");

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: VISION_MODEL,
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: VISION_PROMPT },
              { type: "image_url", image_url: { url: imageUrl } },
            ],
          },
        ],
        temperature: 0.1,
        max_tokens: 150,
        // NOTE: Do NOT send "thinking" property – qwen3.8-27b on Groq rejects it
      }),
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errText = await response.text();
      console.error(`[VisualSearch] API error ${response.status}:`, errText);
      return null;
    }

    const data = await response.json();
    let raw = data?.choices?.[0]?.message?.content || "";
    console.log("[VisualSearch] Raw response:", raw);

    // Strip <think>...</think> tags that Qwen sometimes prefixes
    raw = raw.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

    let parsed = null;
    try {
      parsed = JSON.parse(raw);
    } catch {
      // Fallback: extract JSON object substring
      const m = raw.match(/\{[\s\S]+?\}/);
      if (m) try { parsed = JSON.parse(m[0]); } catch { /* ignore */ }
    }

    console.log("[VisualSearch] Parsed:", parsed);

    if (parsed?.category) {
      return {
        category: parsed.category.toLowerCase().trim(),
        detectedName: parsed.detectedName || parsed.category,
        confidence: parsed.confidence || 0.9,
      };
    }

    console.warn("[VisualSearch] No category in response, raw was:", raw);
    return null;
  } catch (err) {
    clearTimeout(timeout);
    if (err.name === "AbortError") {
      console.warn("[VisualSearch] Request timed out after 12s");
    } else {
      console.error("[VisualSearch] Fetch error:", err);
    }
    return null;
  }
}

// ─── Product Matching ─────────────────────────────────────────────────────────

const ELECTRONIC_SUBCATS = new Set(["laptop", "phone", "headphone", "tablet", "gaming", "watch", "camera", "tv", "speaker"]);

const ELECTRONICS_KW = {
  laptop:    ["laptop", "macbook", "notebook", "thinkpad", "zenbook", "spectre", "inspiron"],
  phone:     ["iphone", "galaxy s", "pixel", "oneplus", "xiaomi", "redmi", "realme", "oppo", "nothing"],
  headphone: ["headphone", "earbuds", "airpods", "headset", "earphone"],
  watch:     ["watch", "smartwatch", "garmin", "fitbit"],
  camera:    ["camera", "gopro", "dji", "mirrorless", "dslr", "webcam"],
  tv:        ["tv", "television", "oled", "monitor", "display"],
  gaming:    ["playstation", "xbox", "nintendo", "steam deck", "rog ally", "quest"],
  speaker:   ["speaker", "jbl", "marshall", "soundlink"],
  tablet:    ["ipad", "tablet", "tab ", "kindle"],
};

function getMatchesBySubcat(subcat) {
  if (subcat === "shoes" || subcat === "footwear" || subcat === "sneakers" || subcat === "sandals" || subcat === "boots") {
    return shoesProducts.length > 0 ? shoesProducts.slice(0, 6) : [];
  }

  if (subcat === "sports" || subcat === "fitness" || subcat === "gym") {
    return sportsProducts.length > 0 ? sportsProducts.slice(0, 6) : [];
  }

  if (subcat === "women_dress" || subcat === "dress") {
    const dresses = clothesProducts.filter((p) => {
      const t = (p.title || "").toLowerCase();
      return (
        t.includes("dress") || t.includes("gown") || t.includes("maxi") ||
        t.includes("midi") || t.includes("saree") || t.includes("kurti") ||
        t.includes("lehenga") || t.includes("frock")
      ) && !t.startsWith("men's") && !t.startsWith("men ");
    });
    return dresses.length > 0 ? dresses.slice(0, 6)
      : clothesProducts.filter((p) => !(p.title || "").toLowerCase().startsWith("men")).slice(0, 6);
  }

  if (subcat === "women_clothes" || subcat === "women") {
    const women = clothesProducts.filter((p) => {
      const t = (p.title || "").toLowerCase();
      return (
        t.includes("women") || t.includes("dress") || t.includes("saree") ||
        t.includes("gown") || t.includes("skirt") || t.includes("blouse") || t.includes("kurti")
      ) && !t.includes("men's") && !t.startsWith("men ");
    });
    return women.length > 0 ? women.slice(0, 6) : clothesProducts.slice(0, 6);
  }

  if (subcat === "men_clothes" || subcat === "men") {
    const men = clothesProducts.filter((p) => {
      const t = (p.title || "").toLowerCase();
      return (t.includes("men") || t.includes("polo") || t.includes("chino") || t.includes("suit") || t.includes("cargo")) &&
             !t.includes("women");
    });
    return men.length > 0 ? men.slice(0, 6) : clothesProducts.slice(0, 6);
  }

  if (ELECTRONIC_SUBCATS.has(subcat)) {
    const kws = ELECTRONICS_KW[subcat] || [];
    const filtered = electronicsProducts.filter((p) =>
      kws.some((kw) => p.title.toLowerCase().includes(kw))
    );
    return filtered.length > 0 ? filtered.slice(0, 6) : electronicsProducts.slice(0, 6);
  }

  if (subcat === "clothes") return clothesProducts.slice(0, 6);
  if (subcat === "electronics") return electronicsProducts.slice(0, 6);

  return ALL_CATALOG_PRODUCTS.slice(0, 6);
}

// ─── Filename Heuristic (fallback only) ──────────────────────────────────────

const FILENAME_RULES = [
  { subcat: "shoes",         keywords: ["shoe", "sneaker", "boot", "sandal", "heel", "loafer", "nike", "adidas", "jordan", "joota", "footwear", "slipper", "trainer"] },
  { subcat: "women_dress",   keywords: ["dress", "maxi", "midi", "gown", "frock", "saree", "kurti", "lehenga"] },
  { subcat: "women_clothes", keywords: ["women", "girl", "female", "lady", "skirt", "blouse"] },
  { subcat: "men_clothes",   keywords: ["men", "suit", "blazer", "polo", "chino"] },
  { subcat: "laptop",        keywords: ["laptop", "macbook", "notebook"] },
  { subcat: "phone",         keywords: ["phone", "iphone", "mobile", "smartphone"] },
  { subcat: "headphone",     keywords: ["headphone", "earphone", "earbuds", "headset"] },
  { subcat: "watch",         keywords: ["watch", "smartwatch"] },
  { subcat: "camera",        keywords: ["camera", "dslr", "gopro"] },
  { subcat: "tv",            keywords: ["tv", "monitor", "display"] },
  { subcat: "gaming",        keywords: ["ps5", "xbox", "nintendo", "gaming"] },
  { subcat: "speaker",       keywords: ["speaker", "jbl", "marshall"] },
  { subcat: "sports",        keywords: ["sport", "gym", "yoga", "cricket", "football", "dumbbell"] },
];

function detectSubcatFromFilename(name) {
  const lower = (name || "").toLowerCase();
  for (const rule of FILENAME_RULES) {
    if (rule.keywords.some((kw) => lower.includes(kw))) return rule.subcat;
  }
  return null;
}

// ─── Category Label Formatter ─────────────────────────────────────────────────

function formatCategory(cat) {
  const labels = {
    women_dress: "Women's Dress / Sarees",
    women_clothes: "Women's Clothing",
    men_clothes: "Men's Clothing",
    shoes: "Shoes & Footwear",
    sports: "Sports & Fitness",
    clothes: "Clothing",
    electronics: "Electronics",
  };
  if (labels[cat]) return labels[cat];
  if (ELECTRONIC_SUBCATS.has(cat)) return `Electronics / ${cat.charAt(0).toUpperCase() + cat.slice(1)}`;
  return cat;
}

// ─── Main Entrypoint ──────────────────────────────────────────────────────────

export async function searchByImage(imageFileOrUrl) {
  let detectedSubcat = null;
  let confidence = 0.9;
  let providerName = "Heuristic";

  // Step 1: Groq Vision AI
  try {
    const imageForApi = await prepareImageForApi(imageFileOrUrl);
    if (imageForApi) {
      const aiResult = await classifyWithGroqVision(imageForApi);
      if (aiResult?.category) {
        detectedSubcat = aiResult.category;
        confidence = aiResult.confidence;
        providerName = "Groq Qwen Vision AI";
        console.log("[VisualSearch] AI detected:", detectedSubcat, "(", confidence, ")");
      }
    }
  } catch (err) {
    console.warn("[VisualSearch] AI step failed:", err);
  }

  // Step 2: Filename keyword fallback (only if AI failed)
  if (!detectedSubcat) {
    const name = typeof imageFileOrUrl === "string"
      ? imageFileOrUrl
      : imageFileOrUrl?.name || "";
    detectedSubcat = detectSubcatFromFilename(name);
    if (detectedSubcat) {
      providerName = "Heuristic (filename)";
      console.log("[VisualSearch] Filename detected:", detectedSubcat);
    }
  }

  // Step 3: Safe default
  if (!detectedSubcat) {
    detectedSubcat = "women_clothes";
    providerName = "Default";
  }

  console.log("[VisualSearch] Final →", detectedSubcat, "| Provider:", providerName);

  return {
    success: true,
    detectedCategory: formatCategory(detectedSubcat),
    confidence,
    matches: getMatchesBySubcat(detectedSubcat),
    provider: providerName,
  };
}
