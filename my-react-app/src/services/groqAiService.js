const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL_NAME = "qwen/qwen3.8-27b";

/**
 * Summarizes product list for LLM context to stay within token limits
 */
function buildCatalogContext(products = []) {
  return products.slice(0, 80).map((p) => ({
    id: p._id || p.id,
    title: p.title,
    price: p.price,
    category: p.category,
    rating: p.rating,
  }));
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
  const catalog = buildCatalogContext(allProducts);

  const systemPrompt = `You are the expert, friendly AI Shopping Copilot for "ShoppyGlobe" E-commerce store.
Here is our store catalog:
${JSON.stringify(catalog)}

Your role:
1. Help users discover products, compare options, find gifts, stay within budget, and answer shopping questions.
2. If the user writes in Hindi or Hinglish, reply in warm, natural Hindi / Hinglish. If in English, reply in friendly English.
3. Recommend relevant products from the catalog by including their exact "id" in the productIds array.
4. If no product matches their criteria (or out of budget), politely inform them and suggest close alternatives.

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
          : JSON.stringify({ reply: msg.text, productIds: (msg.products || []).map((p) => p._id || p.id) }),
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
        temperature: 0.4,
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
      // Clean up markdown codeblocks if present
      const cleanJson = rawContent.replace(/```json\n?|\n?```/g, "").trim();
      parsed = JSON.parse(cleanJson);
    }

    const replyText = parsed.reply || "";
    const returnedIds = Array.isArray(parsed.productIds) ? parsed.productIds : [];

    // Map matched IDs back to full product objects
    const matchedProducts = returnedIds
      .map((id) => allProducts.find((p) => (p._id || p.id) === id))
      .filter(Boolean);

    return {
      text: replyText,
      products: matchedProducts,
      source: "groq",
    };
  } catch (error) {
    console.error("Groq AI query failed, falling back to local NLP:", error);
    return null; // Return null so caller falls back gracefully
  }
}
