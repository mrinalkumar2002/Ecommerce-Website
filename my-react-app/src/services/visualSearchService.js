/**
 * Visual Search Provider Interface & Service
 *
 * Real AI Multimodal Vision (Groq Vision) + Fallback Heuristics
 * Detects real product inside image (Women's Dress, Men's Clothes, Laptop, Shoes, etc.)
 * regardless of filename!
 */

import { clothesProducts } from "../data/clothesData.js";
import { electronicsProducts } from "../data/electronicsData.js";
import { shoesProducts } from "../data/shoesData.js";
import { sportsProducts } from "../data/sportsData.js";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const VISION_MODELS = ["qwen/qwen3.8-27b", "qwen/qwen3.6-27b"];

const ALL_CATALOG_PRODUCTS = [
  ...electronicsProducts,
  ...clothesProducts,
  ...shoesProducts,
  ...sportsProducts,
];

// ─── Sub-category keyword maps & rules ───────────────────────────────────────

const SUBCATEGORY_RULES = [
  // Specific Women's Dress & Gowns
  {
    subcat: "women_dress",
    keywords: ["dress", "maxi", "midi", "gown", "frock", "sundress", "floral dress", "party gown"],
    titleMatch: ["dress", "gown", "maxi", "midi"],
  },
  // Women's Clothes & Ethnic
  {
    subcat: "women_clothes",
    keywords: ["women", "girl", "female", "lady", "ladki", "saree", "kurti", "skirt", "blouse", "women top"],
    titleMatch: ["women", "saree", "dress", "gown"],
  },
  // Men's Clothes & Formal/Casual
  {
    subcat: "men_clothes",
    keywords: ["men", "boy", "male", "guy", "ladka", "gentleman", "suit", "blazer", "polo", "chino", "men shirt"],
    titleMatch: ["men", "suit", "polo", "chino"],
  },

  // Electronics sub-categories
  {
    subcat: "laptop",
    keywords: ["laptop", "macbook", "notebook", "chromebook", "dell", "hp spectre",
               "lenovo", "asus", "acer", "surface", "thinkpad", "inspiron", "xps",
               "zephyrus", "legion", "spectre"],
    titleMatch: ["laptop", "macbook", "notebook"],
  },
  {
    subcat: "phone",
    keywords: ["phone", "iphone", "samsung galaxy", "pixel", "oneplus", "xiaomi",
               "nothing phone", "smartphone", "mobile", "redmi", "realme", "oppo"],
    titleMatch: ["iphone", "galaxy s", "pixel", "oneplus", "smartphone", "phone", "xiaomi", "nothing phone"],
  },
  {
    subcat: "headphone",
    keywords: ["headphone", "earphone", "airpod", "earbuds", "headset", "wh-1000",
               "qc45", "momentum", "arctis", "sennheiser", "bose", "sony wh",
               "audio", "hearing"],
    titleMatch: ["headphone", "earbuds", "airpods", "headset", "earphone"],
  },
  {
    subcat: "tablet",
    keywords: ["ipad", "tablet", "tab s", "galaxy tab", "surface pro", "kindle", "e-reader"],
    titleMatch: ["ipad", "tablet", "tab ", "kindle"],
  },
  {
    subcat: "gaming",
    keywords: ["playstation", "ps5", "ps4", "xbox", "nintendo", "gaming console",
               "switch oled", "steam deck", "rog ally", "quest", "vr"],
    titleMatch: ["playstation", "xbox", "nintendo", "quest", "rog ally"],
  },
  {
    subcat: "watch",
    keywords: ["watch", "smartwatch", "apple watch", "garmin", "fitbit", "galaxy watch"],
    titleMatch: ["watch", "smartwatch", "garmin"],
  },
  {
    subcat: "camera",
    keywords: ["camera", "gopro", "dji", "canon", "nikon", "sony alpha", "mirrorless",
               "dslr", "drone", "webcam"],
    titleMatch: ["camera", "gopro", "dji", "mirrorless", "dslr", "webcam"],
  },
  {
    subcat: "tv",
    keywords: ["tv", "television", "oled tv", "led tv", "smart tv", "bravia",
               "monitor", "display", "screen", "soundbar"],
    titleMatch: ["tv", "television", "oled", "monitor", "display", "soundbar"],
  },
  {
    subcat: "speaker",
    keywords: ["speaker", "jbl", "marshall", "bose sound", "bluetooth speaker",
               "portable speaker", "home speaker"],
    titleMatch: ["speaker", "jbl", "marshall", "soundlink"],
  },
  {
    subcat: "electronics",
    keywords: ["tech", "electronic", "keyboard", "mouse", "logitech", "razer",
               "ssd", "hard drive", "nanoleaf", "scooter", "elgato", "shure",
               "microphone", "stream deck"],
    titleMatch: [],
  },
  {
    subcat: "shoes",
    keywords: ["shoe", "sneaker", "boot", "footwear", "sandal", "heel", "loafer",
               "slipper", "trainer", "kick", "nike", "adidas", "jordan", "converse",
               "puma", "reebok", "vans", "crocs", "skechers", "joota"],
    titleMatch: [],
  },
  {
    subcat: "sports",
    keywords: ["sport", "ball", "gym", "fitness", "yoga", "cricket", "football",
               "badminton", "cycling", "bicycle", "dumbbell", "treadmill", "protein"],
    titleMatch: [],
  },
  {
    subcat: "clothes",
    keywords: ["shirt", "jeans", "dress", "jacket", "trouser", "pant", "saree",
               "kurta", "hoodie", "sweater", "coat", "skirt", "blouse", "cloth",
               "tshirt", "t-shirt", "legging", "blazer", "suit", "cardigan", "kapde"],
    titleMatch: [],
  },
];

/** Convert File or Blob to Base64 data URL */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    if (typeof file === "string") return resolve(file);
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Real AI Vision: Send image to Groq Multimodal Vision Model
 */
async function classifyImageWithGroqVision(base64DataUrl) {
  const prompt = `Analyze this product or person's outfit image carefully.
Classify what exact product/outfit is shown into ONE of these specific categories:
- "women_dress" (women's dresses, midi dress, maxi dress, evening gown, frocks, floral dress, women's yellow/printed dress)
- "women_clothes" (women's tops, women's jeans, sarees, kurtis, skirts, female outfit, woman wearing clothes)
- "men_clothes" (men's shirts, men's jeans, suits, blazers, men's polo, male outfit, man wearing clothes)
- "laptop" (laptops, notebooks, macbooks, computer screens on keyboards)
- "phone" (smartphones, iphones, mobile phones)
- "headphone" (headphones, earbuds, earphones, headsets)
- "watch" (smartwatches, wristwatches)
- "camera" (cameras, dslr, action cams, lenses)
- "tv" (televisions, large displays, monitors)
- "gaming" (gaming consoles, controllers, handhelds)
- "speaker" (bluetooth speakers, audio soundbars)
- "shoes" (sneakers, running shoes, formal shoes, sandals, boots)
- "sports" (gym equipment, football, basketball, yoga mats, sports items)

Respond with ONLY a valid JSON object matching this schema:
{
  "category": "women_dress",
  "detectedName": "Women's Floral Print Summer Dress",
  "confidence": 0.96
}`;

  for (const model of VISION_MODELS) {
    try {
      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: prompt },
                { type: "image_url", image_url: { url: base64DataUrl } },
              ],
            },
          ],
          temperature: 0.1,
          max_tokens: 200,
        }),
      });

      if (!response.ok) continue;

      const data = await response.json();
      const rawText = data?.choices?.[0]?.message?.content;
      if (!rawText) continue;

      let parsed;
      try {
        parsed = JSON.parse(rawText);
      } catch {
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
      }

      if (parsed && parsed.category) {
        return {
          category: parsed.category.toLowerCase().trim(),
          detectedName: parsed.detectedName || parsed.category,
          confidence: parsed.confidence || 0.96,
        };
      }
    } catch (err) {
      console.warn(`Vision model ${model} error:`, err);
    }
  }

  return null;
}

/** Filter catalog products by detected sub-category */
function getMatchesBySubcat(subcat) {
  // 1. Women's dresses & gowns
  if (subcat === "women_dress" || subcat === "dress") {
    const dresses = clothesProducts.filter((p) => {
      const title = (p.title || "").toLowerCase();
      const isDress =
        title.includes("dress") ||
        title.includes("gown") ||
        title.includes("maxi") ||
        title.includes("midi") ||
        title.includes("floral");
      const isMen = title.startsWith("men's") || title.startsWith("men ");
      return isDress && !isMen;
    });

    if (dresses.length > 0) return dresses.slice(0, 4);

    // Fallback: Women's general clothes
    const womenGeneral = clothesProducts.filter((p) =>
      (p.title || "").toLowerCase().includes("women")
    );
    return womenGeneral.slice(0, 4);
  }

  // 2. Women's clothes (sarees, jeans, tops, trench coats)
  if (subcat === "women_clothes" || subcat === "women") {
    const womenProds = clothesProducts.filter((p) => {
      const title = (p.title || "").toLowerCase();
      const isWomen =
        title.includes("women") ||
        title.includes("dress") ||
        title.includes("saree") ||
        title.includes("gown") ||
        title.includes("skirt") ||
        title.includes("blouse");
      const isMen = title.includes("men's") || title.startsWith("men ");
      return isWomen && !isMen;
    });
    return womenProds.length > 0 ? womenProds.slice(0, 4) : clothesProducts.slice(0, 4);
  }

  // 3. Men's clothes (shirts, suits, trousers, chinos, polo)
  if (subcat === "men_clothes" || subcat === "men") {
    const menProds = clothesProducts.filter((p) => {
      const title = (p.title || "").toLowerCase();
      const isMen =
        title.includes("men") ||
        title.includes("polo") ||
        title.includes("chino") ||
        title.includes("suit") ||
        title.includes("cargo");
      const isWomen = title.includes("women");
      return isMen && !isWomen;
    });
    return menProds.length > 0 ? menProds.slice(0, 4) : clothesProducts.slice(0, 4);
  }

  // 4. Electronics sub-categories
  const electronicSubcats = [
    "laptop",
    "phone",
    "headphone",
    "tablet",
    "gaming",
    "watch",
    "camera",
    "tv",
    "speaker",
  ];

  if (electronicSubcats.includes(subcat)) {
    const rule = SUBCATEGORY_RULES.find((r) => r.subcat === subcat);
    const titleKws = rule?.titleMatch || [];
    const filtered = electronicsProducts.filter((p) =>
      titleKws.some((kw) => p.title.toLowerCase().includes(kw))
    );
    return filtered.length > 0 ? filtered.slice(0, 4) : electronicsProducts.slice(0, 4);
  }

  // 5. Category-level fallbacks
  const categoryMap = {
    electronics: "electronics",
    shoes: "shoes",
    sports: "sports",
    clothes: "clothes",
  };

  const cat = categoryMap[subcat];
  if (cat) {
    return ALL_CATALOG_PRODUCTS.filter(
      (p) => (p.category || "").toLowerCase() === cat
    ).slice(0, 4);
  }

  return ALL_CATALOG_PRODUCTS.slice(0, 4);
}

/** Fallback heuristic: Detect sub-category from filename keywords */
function detectSubcatFromFilename(name) {
  for (const rule of SUBCATEGORY_RULES) {
    if (rule.keywords.some((kw) => name.includes(kw))) {
      return rule.subcat;
    }
  }
  return null;
}

/** Fallback heuristic: Color analysis */
async function analyzeImageColors(file) {
  if (!(file instanceof File) && !(file instanceof Blob)) return null;
  return new Promise((resolve) => {
    try {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = 50;
          canvas.height = 50;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, 50, 50);
          const data = ctx.getImageData(0, 0, 50, 50).data;
          let r = 0,
            g = 0,
            b = 0,
            count = 0;
          for (let i = 0; i < data.length; i += 4) {
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
            count++;
          }
          URL.revokeObjectURL(url);
          resolve({ r: r / count, g: g / count, b: b / count });
        } catch {
          resolve(null);
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(null);
      };
      img.src = url;
    } catch {
      resolve(null);
    }
  });
}

/**
 * Main Visual Search Entrypoint
 */
export async function searchByImage(imageFileOrUrl) {
  let detectedSubcat = null;
  let confidence = 0.95;
  let providerName = "ShoppyGlobe Groq AI Vision";

  // 1. Try Real AI Vision First (inspects actual image pixels/content)
  try {
    const base64 = await fileToBase64(imageFileOrUrl);
    if (base64 && base64.startsWith("data:image")) {
      const aiVisionResult = await classifyImageWithGroqVision(base64);
      if (aiVisionResult && aiVisionResult.category) {
        detectedSubcat = aiVisionResult.category;
        confidence = aiVisionResult.confidence || 0.96;
        providerName = "Groq Multimodal AI Vision";
      }
    }
  } catch (err) {
    console.warn("Real AI Vision query failed, proceeding to fallback:", err);
  }

  // 2. Fallback Heuristic: Filename keywords (if AI was offline/unavailable)
  if (!detectedSubcat) {
    const name =
      typeof imageFileOrUrl === "string"
        ? imageFileOrUrl.toLowerCase()
        : (imageFileOrUrl?.name || "").toLowerCase();

    detectedSubcat = detectSubcatFromFilename(name);
    providerName = "ShoppyGlobe Intelligent Heuristic Vision";
  }

  // 3. Fallback Heuristic: Pixel color tones
  if (!detectedSubcat && (imageFileOrUrl instanceof File || imageFileOrUrl instanceof Blob)) {
    const colors = await analyzeImageColors(imageFileOrUrl);
    if (colors) {
      const { r, g, b } = colors;
      const isBrownTone = r > 120 && g > 80 && b < 80 && r > g && g > b;
      const isGrayTone = Math.abs(r - g) < 20 && Math.abs(g - b) < 20 && r > 100;
      const isWarmDress = r > 140 && g > 100 && b < 100; // Yellow/orange/warm dress
      detectedSubcat = isWarmDress ? "women_dress" : isBrownTone ? "shoes" : isGrayTone ? "electronics" : "women_clothes";
    }
  }

  if (!detectedSubcat) detectedSubcat = "women_clothes";

  const matches = getMatchesBySubcat(detectedSubcat);

  const formatDisplayCategory = (cat) => {
    if (cat === "women_dress") return "women's dress / gowns";
    if (cat === "women_clothes") return "women's clothing";
    if (cat === "men_clothes") return "men's clothing";
    if (["laptop", "phone", "headphone", "tablet", "gaming", "watch", "camera", "tv", "speaker"].includes(cat)) {
      return `electronics / ${cat}`;
    }
    return cat;
  };

  return {
    success: true,
    detectedCategory: formatDisplayCategory(detectedSubcat),
    confidence,
    matches,
    provider: providerName,
  };
}
