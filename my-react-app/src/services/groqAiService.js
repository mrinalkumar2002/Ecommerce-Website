const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL_NAME = "qwen/qwen3.8-27b";

/**
 * Intelligently pre-filters products relevant to the query across the ENTIRE 400+ catalog
 * and includes cross-category samples so the LLM has complete context.
 */
function buildCatalogContext(products = [], query = "") {
  const q = (query || "").toLowerCase().trim();
  const keywords = q
    .split(/\s+/)
    .filter(
      (w) =>
        w.length > 2 &&
        !["the", "for", "and", "under", "below", "with", "show", "give", "best", "good", "want", "look", "need", "find"].includes(w)
    );

  const knownBrands = ["samsung", "apple", "nike", "adidas", "puma", "sony", "dell", "hp", "bose", "lg", "asics", "reebok", "nothing", "realme", "oneplus"];
  const queriedBrand = knownBrands.find((b) => q.includes(b));

  // Score all products in the entire catalog
  const scored = products.map((p) => {
    let score = 0;
    const title = (p.title || "").toLowerCase();
    const desc = (p.description || "").toLowerCase();
    const cat = (p.category || "").toLowerCase();
    const company = (p.company || "").toLowerCase();

    if (q && title.includes(q)) score += 50;

    if (queriedBrand) {
      const hasBrand = title.includes(queriedBrand) || desc.includes(queriedBrand) || company.includes(queriedBrand);
      if (hasBrand) score += 40;
    }

    let matchedKeywords = 0;
    keywords.forEach((k) => {
      if (title.includes(k)) {
        score += 20;
        matchedKeywords++;
      } else if (cat.includes(k)) {
        score += 10;
        matchedKeywords++;
      } else if (desc.includes(k)) {
        score += 5;
        matchedKeywords++;
      }
    });

    score += matchedKeywords * 25;

    return { product: p, score };
  });

  scored.sort((a, b) => b.score - a.score);

  // Grab top relevant products (up to 45 items)
  const relevantProds = scored.filter((s) => s.score > 0).slice(0, 45).map((s) => s.product);

  // Also include balanced samples from ALL categories so LLM knows store scope
  const categories = ["electronics", "clothes", "shoes", "sports"];
  const samples = [];
  categories.forEach((cat) => {
    const catProds = products.filter((p) => (p.category || "").toLowerCase() === cat);
    samples.push(...catProds.slice(0, 10));
  });

  const map = new Map();
  [...relevantProds, ...samples].forEach((p) => {
    const id = String(p._id || p.id);
    if (!map.has(id)) {
      map.set(id, {
        id,
        title: p.title,
        price: p.price,
        category: p.category,
        rating: p.rating,
      });
    }
  });

  return Array.from(map.values()).slice(0, 85);
}

/**
 * Ask Groq AI for intelligent product recommendations and shopping assistance
 */
export async function askGroqAiAssistant({
  query,
  conversationHistory = [],
  allProducts = [],
  isHindi = false,
}) {
  const catalog = buildCatalogContext(allProducts, query);

  const systemPrompt = `You are the expert, friendly AI Shopping Copilot for "ShoppyGlobe" E-commerce store.
ShoppyGlobe sells Electronics & Gadgets, Clothing, Footwear & Shoes (Nike, Adidas, Puma, etc.), and Sports Equipment.

Here is relevant context from our catalog for this request:
${JSON.stringify(catalog)}

Your role:
1. Help users discover products, compare options, find gifts, stay within budget, and answer shopping questions.
2. If the user writes in Hindi or Hinglish, reply in warm, natural Hindi / Hinglish. If in English, reply in friendly English.
3. Recommend matching products from the catalog by including their exact "id" string in the productIds array.
4. If no product matches their criteria, politely inform them and suggest close alternatives.

CRITICAL: You MUST respond ONLY with a valid json object matching this structure:
{
  "reply": "Your friendly, concise, natural reply to the user (2-3 sentences max).",
  "productIds": ["id1", "id2"]
}`;

  // Build chat history for Groq
  const messages = [
    { role: "system", content: systemPrompt },
    ...conversationHistory.slice(-4).map((msg) => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content:
        msg.sender === "user"
          ? msg.text
          : JSON.stringify({ reply: msg.text, productIds: (msg.products || []).map((p) => String(p._id || p.id)) }),
    })),
    { role: "user", content: query },
  ];

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages,
        temperature: 0.3,
        max_tokens: 500,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.warn("Groq API error:", response.status, errBody);
      throw new Error(`Groq API returned ${response.status}`);
    }

    const data = await response.json();
    const rawContent = data?.choices?.[0]?.message?.content;

    if (!rawContent) {
      throw new Error("Empty response from Groq");
    }

    let parsed;
    try {
      parsed = JSON.parse(rawContent);
    } catch {
      const cleanJson = rawContent.replace(/```json\n?|\n?```/g, "").trim();
      parsed = JSON.parse(cleanJson);
    }

    const replyText = parsed.reply || "";
    const returnedIds = Array.isArray(parsed.productIds) ? parsed.productIds : [];

    // Map matched IDs back to full product objects with fallback string comparison
    const matchedProducts = returnedIds
      .map((id) => allProducts.find((p) => String(p._id || p.id) === String(id)))
      .filter(Boolean);

    return {
      text: replyText,
      products: matchedProducts,
      source: "groq",
    };
  } catch (error) {
    console.error("Groq AI query failed, falling back to local NLP:", error);
    return null;
  }
}

