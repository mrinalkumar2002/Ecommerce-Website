import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { useTranslation } from "react-i18next";
import ProductTransText from "./ProductTransText";
import { getProductReviews } from "../data/productReviews";
import { clothesProducts } from "../data/clothesData";
import { electronicsProducts } from "../data/electronicsData";
import { shoesProducts } from "../data/shoesData";
import { sportsProducts } from "../data/sportsData";
import api from "../api";
import { askGroqAiAssistant } from "../services/groqAiService";
import "./AiAssistant.css";

const ALL_LOCAL_PRODUCTS = [
  ...electronicsProducts,
  ...clothesProducts,
  ...shoesProducts,
  ...sportsProducts,
];

// High-precision Natural Language Catalog Analyzer
function processLocalAiQuery(query, allProducts, isHindi = false) {
  const q = (query || "").toLowerCase().trim();
  const prods = allProducts && allProducts.length > 0 ? allProducts : ALL_LOCAL_PRODUCTS;

  // 1. Extract Price Constraints
  let maxPrice = null;
  let minPrice = null;

  const underMatch = q.match(/(?:under|below|less than|within|ke andar|se kam|tak)\s*(?:rs\.?|inr|₹)?\s*(\d+)/i) ||
                     q.match(/(?:rs\.?|inr|₹)?\s*(\d+)\s*(?:se kam|ke andar|tak)/i);
  if (underMatch) maxPrice = parseInt(underMatch[1], 10);

  const aboveMatch = q.match(/(?:above|over|more than|greater than|se zyada|se upar)\s*(?:rs\.?|inr|₹)?\s*(\d+)/i);
  if (aboveMatch) minPrice = parseInt(aboveMatch[1], 10);

  const betweenMatch = q.match(/(?:between|se)\s*(\d+)\s*(?:and|to|se)\s*(\d+)/i);
  if (betweenMatch) {
    minPrice = parseInt(betweenMatch[1], 10);
    maxPrice = parseInt(betweenMatch[2], 10);
  }

  // 2. Identify Category Hints
  let categoryTarget = null;
  if (q.includes("shoe") || q.includes("sneaker") || q.includes("boot") || q.includes("footwear") || q.includes("joota") || q.includes("joote")) {
    categoryTarget = "shoes";
  } else if (q.includes("cloth") || q.includes("shirt") || q.includes("jeans") || q.includes("dress") || q.includes("jacket") || q.includes("hoodie") || q.includes("pant") || q.includes("kapde")) {
    categoryTarget = "clothes";
  } else if (q.includes("sport") || q.includes("gym") || q.includes("fitness") || q.includes("ball") || q.includes("dumbbell") || q.includes("khel")) {
    categoryTarget = "sports";
  } else if (q.includes("phone") || q.includes("mobile") || q.includes("laptop") || q.includes("headphone") || q.includes("earbuds") || q.includes("tv") || q.includes("camera") || q.includes("watch") || q.includes("tech") || q.includes("electronic")) {
    categoryTarget = "electronics";
  }

  // 3. Sub-attribute filters (laptop, phone, headphone, etc.)
  const keywords = q.split(/\s+/).filter((w) => w.length > 2 && !["the", "for", "and", "under", "with", "show", "give", "best", "good", "karo", "mujhe"].includes(w));

  // 4. Filter Catalog
  let matched = prods.filter((p) => {
    const title = (p.title || "").toLowerCase();
    const desc = (p.description || "").toLowerCase();
    const cat = (p.category || "").toLowerCase();
    const price = Number(p.price || 0);

    // Price check
    if (maxPrice && price > maxPrice) return false;
    if (minPrice && price < minPrice) return false;

    // Category check
    if (categoryTarget && !cat.includes(categoryTarget) && !title.includes(categoryTarget)) {
      // allow if title matches specific subtype
      const isSubMatch = (categoryTarget === "shoes" && (title.includes("shoe") || title.includes("sneaker"))) ||
                         (categoryTarget === "electronics" && (title.includes("phone") || title.includes("laptop") || title.includes("headphone") || title.includes("tv"))) ||
                         (categoryTarget === "clothes" && (title.includes("shirt") || title.includes("jacket") || title.includes("dress"))) ||
                         (categoryTarget === "sports" && (title.includes("sport") || title.includes("fitness")));
      if (!isSubMatch) return false;
    }

    // Keyword match
    if (keywords.length > 0) {
      const matchCount = keywords.filter((k) => title.includes(k) || desc.includes(k) || cat.includes(k)).length;
      return matchCount > 0;
    }

    return true;
  });

  // Sort by rating & popularity
  matched.sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5));
  const topProducts = matched.slice(0, 4);

  // 5. Generate Intelligent Response Text
  let messageText = "";

  if (topProducts.length > 0) {
    if (isHindi) {
      messageText = `मुझे आपके लिए ${matched.length} बेहतरीन उत्पाद मिले${maxPrice ? ` (₹${maxPrice} के बजट में)` : ""}: नीचे दिए गए विकल्प देखें और सीधे कार्ट में जोड़ें।`;
    } else {
      messageText = `Here are the top ${topProducts.length} curated options from our catalog${maxPrice ? ` under ₹${maxPrice.toLocaleString()}` : ""}${categoryTarget ? ` in ${categoryTarget}` : ""}:`;
    }
  } else {
    // Fallback recommendations if no direct match
    const featured = prods.slice(0, 3);
    if (isHindi) {
      messageText = `आपके सटीक मापदंड के अनुसार कोई उत्पाद नहीं मिला, लेकिन यहाँ हमारे शीर्ष-रेटेड उत्पाद हैं जो आपको पसंद आ सकते हैं:`;
    } else {
      messageText = `I couldn't find exact matches for "${query}". Here are some of our best-selling featured products you might like:`;
    }
    return { text: messageText, products: featured };
  }

  return { text: messageText, products: topProducts };
}

export default function AiAssistant({ onShowToast }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const messagesEndRef = useRef(null);

  const isHindi = i18n.language === "hi";

  useEffect(() => {
    api.get("/products")
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setAllProducts(res.data);
        } else {
          setAllProducts(ALL_LOCAL_PRODUCTS);
        }
      })
      .catch(() => setAllProducts(ALL_LOCAL_PRODUCTS));
  }, []);

  // Initial welcome message
  useEffect(() => {
    setMessages([
      {
        id: "welcome",
        sender: "ai",
        text: isHindi
          ? "नमस्ते! मैं आपका ShoppyGlobe AI शॉपिंग सहायक हूँ। मैं सही उत्पाद खोजने, विनिर्देशों की तुलना करने और बजट डील्स ढूंढने में आपकी मदद कर सकता हूँ। आप क्या ढूंढ रहे हैं?"
          : "Hello! I'm your ShoppyGlobe AI Shopping Copilot. I can help you discover products, compare specs, find budget deals, and check delivery. What are you looking for today?",
        products: [],
      },
    ]);
  }, [isHindi]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = async (userQuery) => {
    const textToSend = userQuery || input;
    if (!textToSend.trim()) return;

    const userMsg = {
      id: "user_" + Date.now(),
      sender: "user",
      text: textToSend.trim(),
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    if (!userQuery) setInput("");
    setIsTyping(true);

    try {
      // 1. Try real-time Groq LLM API
      const groqResult = await askGroqAiAssistant({
        query: textToSend.trim(),
        conversationHistory: nextMessages,
        allProducts,
        isHindi,
      });

      if (groqResult && groqResult.text) {
        const aiMsg = {
          id: "ai_" + Date.now(),
          sender: "ai",
          text: groqResult.text,
          products: groqResult.products || [],
        };
        setMessages((prev) => [...prev, aiMsg]);
        setIsTyping(false);
        return;
      }
    } catch (err) {
      console.warn("Groq request failed, using local NLP fallback:", err);
    }

    // 2. Fallback to high-precision local NLP catalog analyzer
    setTimeout(() => {
      const result = processLocalAiQuery(textToSend, allProducts, isHindi);

      const aiMsg = {
        id: "ai_" + Date.now(),
        sender: "ai",
        text: result.text,
        products: result.products,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 400);
  };

  const handleAddToCart = async (product) => {
    try {
      await api.get("/auth/me");
      dispatch(addToCart({ ...product, quantity: 1 }));
      try {
        await api.post("/cart/add", {
          productId: product._id,
          title: product.title,
          price: product.price,
          images: product.images,
          quantity: 1,
        });
      } catch {}
      if (onShowToast) {
        onShowToast({
          show: true,
          title: product.title,
          img: product.images?.[0] || "",
          type: "cart",
        });
      }
    } catch {
      navigate("/login");
    }
  };

  const handleProductClick = (productId) => {
    setIsOpen(false);
    navigate(`/productdetail/${productId}`);
  };

  const PROMPT_SUGGESTIONS = [
    t("aiAssistant.prompt1"),
    t("aiAssistant.prompt2"),
    t("aiAssistant.prompt3"),
    t("aiAssistant.prompt4"),
  ];

  return (
    <>
      {/* 🔮 FLOATING AI COPILOT BUTTON */}
      {!isOpen && (
        <button
          type="button"
          className="ai-float-btn"
          onClick={() => setIsOpen(true)}
          title={t("aiAssistant.title")}
          aria-label={t("aiAssistant.title")}
        >
          <div className="ai-btn-glow"></div>
          <span className="ai-btn-icon">✨</span>
          <span className="ai-btn-label">AI Assistant</span>
          <span className="ai-pulse-dot"></span>
        </button>
      )}

      {/* 💬 CHAT DRAWER / WINDOW */}
      {isOpen && (
        <div className="ai-chat-drawer" role="dialog" aria-modal="true">
          {/* HEADER */}
          <div className="ai-drawer-header">
            <div className="ai-header-left">
              <div className="ai-avatar">✨</div>
              <div>
                <h3>{t("aiAssistant.title")}</h3>
                <span className="ai-online-tag">● {t("aiAssistant.badge")}</span>
              </div>
            </div>
            <div className="ai-header-actions">
              <button
                className="ai-header-btn"
                onClick={() =>
                  setMessages([
                    {
                      id: "welcome_reset",
                      sender: "ai",
                      text: t("aiAssistant.fallbackGreeting"),
                      products: [],
                    },
                  ])
                }
                title={t("aiAssistant.clearChat")}
              >
                🔄
              </button>
              <button
                className="ai-header-btn"
                onClick={() => setIsOpen(false)}
                title="Close"
              >
                ✕
              </button>
            </div>
          </div>

          {/* PROMPT SUGGESTIONS CHIPS */}
          <div className="ai-suggestions-row">
            {PROMPT_SUGGESTIONS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                className="ai-chip"
                onClick={() => handleSend(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* MESSAGES LIST */}
          <div className="ai-messages-list">
            {messages.map((m) => (
              <div key={m.id} className={`ai-message-wrap ${m.sender}`}>
                {m.sender === "ai" && <div className="ai-msg-avatar">✨</div>}
                <div className="ai-msg-bubble">
                  <p className="ai-msg-text">{m.text}</p>

                  {/* EMBEDDED PRODUCT CARDS */}
                  {m.products && m.products.length > 0 && (
                    <div className="ai-products-grid">
                      {m.products.map((prod) => {
                        const { rating, reviewCount } = getProductReviews(prod._id);
                        return (
                          <div
                            key={prod._id}
                            className="ai-prod-card"
                            onClick={() => handleProductClick(prod._id)}
                          >
                            <img
                              src={
                                prod.images?.[0] ||
                                `https://picsum.photos/seed/${prod._id}/150/150`
                              }
                              alt={prod.title}
                            />
                            <div className="ai-prod-info">
                              <h4>
                                <ProductTransText text={prod.title} />
                              </h4>
                              <div className="ai-prod-meta">
                                <span className="ai-prod-price">
                                  ₹{Number(prod.price).toLocaleString()}
                                </span>
                                <span className="ai-prod-rating">★ {rating.toFixed(1)}</span>
                              </div>
                              <div className="ai-prod-actions">
                                <button
                                  type="button"
                                  className="ai-prod-add-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddToCart(prod);
                                  }}
                                >
                                  + {t("aiAssistant.quickAdd")}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="ai-message-wrap ai">
                <div className="ai-msg-avatar">✨</div>
                <div className="ai-msg-bubble ai-typing-bubble">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT FORM */}
          <form
            className="ai-input-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              type="text"
              placeholder={t("aiAssistant.placeholder")}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="ai-input-field"
            />
            <button
              type="submit"
              className="ai-send-btn"
              disabled={!input.trim()}
              title={t("aiAssistant.send")}
            >
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  );
}
