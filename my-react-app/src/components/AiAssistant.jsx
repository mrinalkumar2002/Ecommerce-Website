import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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

  const underMatch =
    q.match(/(?:under|below|less than|within|ke andar|se kam|tak)\s*(?:rs\.?|inr|₹)?\s*(\d+)/i) ||
    q.match(/(?:rs\.?|inr|₹)?\s*(\d+)\s*(?:se kam|ke andar|tak)/i);
  if (underMatch) maxPrice = parseInt(underMatch[1], 10);

  const aboveMatch = q.match(/(?:above|over|more than|greater than|se zyada|se upar)\s*(?:rs\.?|inr|₹)?\s*(\d+)/i);
  if (aboveMatch) minPrice = parseInt(aboveMatch[1], 10);

  const betweenMatch = q.match(/(?:between|se)\s*(\d+)\s*(?:and|to|se)\s*(\d+)/i);
  if (betweenMatch) {
    minPrice = parseInt(betweenMatch[1], 10);
    maxPrice = parseInt(betweenMatch[2], 10);
  }

  // 2. Identify Brand & Subtype constraints
  const knownBrands = ["samsung", "apple", "nike", "adidas", "puma", "sony", "dell", "hp", "bose", "lg", "asics", "reebok", "nothing", "realme", "oneplus"];
  const queriedBrand = knownBrands.find((b) => q.includes(b));

  const isPhoneSearch = q.includes("phone") || q.includes("mobile") || q.includes("smartphone");
  const isShoeSearch = q.includes("shoe") || q.includes("sneaker") || q.includes("boot") || q.includes("footwear") || q.includes("joota") || q.includes("joote") || q.includes("jordan");
  const isLaptopSearch = q.includes("laptop") || q.includes("macbook") || q.includes("notebook");
  const isWatchSearch = q.includes("watch") || q.includes("smartwatch");
  const isTvSearch = q.includes("tv") || q.includes("television");
  const isClothesSearch = q.includes("cloth") || q.includes("shirt") || q.includes("jeans") || q.includes("dress") || q.includes("jacket") || q.includes("hoodie") || q.includes("pant") || q.includes("kapde") || q.includes("t-shirt");
  const isSportsSearch = q.includes("sport") || q.includes("gym") || q.includes("fitness") || q.includes("ball") || q.includes("dumbbell") || q.includes("khel");

  // Category Target
  let categoryTarget = null;
  if (isShoeSearch) categoryTarget = "shoes";
  else if (isClothesSearch) categoryTarget = "clothes";
  else if (isSportsSearch) categoryTarget = "sports";
  else if (isPhoneSearch || isLaptopSearch || isWatchSearch || isTvSearch) categoryTarget = "electronics";

  // Search keywords
  const keywords = q
    .split(/\s+/)
    .filter(
      (w) =>
        w.length > 2 &&
        !["the", "for", "and", "under", "below", "less", "than", "within", "with", "show", "give", "best", "good", "karo", "mujhe", "want", "look", "need", "find"].includes(w)
    );

  // 3. Score & Filter Catalog
  const scored = [];

  for (const p of prods) {
    const title = (p.title || "").toLowerCase();
    const desc = (p.description || "").toLowerCase();
    const cat = (p.category || "").toLowerCase();
    const company = (p.company || "").toLowerCase();
    const price = Number(p.price || 0);

    // Hard price filtering
    if (maxPrice && price > maxPrice) continue;
    if (minPrice && price < minPrice) continue;

    // Brand enforcement
    if (queriedBrand) {
      const hasBrand = title.includes(queriedBrand) || desc.includes(queriedBrand) || company.includes(queriedBrand);
      if (!hasBrand) continue;
    }

    let score = 0;

    if (q && title.includes(q)) score += 50;

    // Subtype matching & penalties
    if (isPhoneSearch) {
      const isPhone =
        title.includes("galaxy s") ||
        title.includes("iphone") ||
        title.includes("pixel") ||
        title.includes("oneplus") ||
        title.includes("mobile") ||
        title.includes("smartphone") ||
        /\bphone\b/i.test(title) ||
        desc.includes("smartphone") ||
        desc.includes("phone");
      if (isPhone) {
        score += 40;
      } else if (title.includes("ssd") || title.includes("tv") || title.includes("monitor") || title.includes("watch") || title.includes("headphone") || title.includes("earbuds") || title.includes("tab")) {
        score -= 100;
      }
    }

    if (isShoeSearch) {
      const isShoe = cat === "shoes" || title.includes("shoe") || title.includes("sneaker") || title.includes("jordan") || title.includes("boot") || title.includes("cleats") || title.includes("running");
      if (isShoe) score += 40;
      else score -= 100;
    }

    if (isLaptopSearch) {
      const isLaptop = title.includes("laptop") || title.includes("macbook") || title.includes("notebook") || title.includes("xps") || title.includes("thinkpad") || title.includes("zenbook");
      if (isLaptop) score += 40;
      else score -= 100;
    }

    if (isClothesSearch) {
      if (cat === "clothes" || title.includes("shirt") || title.includes("jacket") || title.includes("dress") || title.includes("hoodie") || title.includes("jeans") || title.includes("pant")) {
        score += 40;
      } else {
        score -= 80;
      }
    }

    // Keyword relevance
    let matchedKeywords = 0;
    keywords.forEach((k) => {
      const regex = new RegExp(`\\b${k}`, "i");
      if (regex.test(title)) {
        score += 25;
        matchedKeywords++;
      } else if (regex.test(cat)) {
        score += 15;
        matchedKeywords++;
      } else if (regex.test(desc)) {
        score += 8;
        matchedKeywords++;
      }
    });

    if (keywords.length > 0 && matchedKeywords === 0) continue;

    score += matchedKeywords * 30;

    if (score > 0) {
      scored.push({ product: p, score, rating: p.rating || 4.5 });
    }
  }

  // Sort by score descending (relevance first), then rating
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.rating - a.rating;
  });

  const matchedTotal = scored.length;
  const topProducts = scored.slice(0, 4).map((s) => s.product);

  // 4. Generate Response Text
  let messageText = "";

  if (topProducts.length > 0) {
    if (isHindi) {
      messageText = `मुझे आपके लिए ${matchedTotal} बेहतरीन उत्पाद मिले${maxPrice ? ` (₹${maxPrice.toLocaleString()} के बजट में)` : ""}: नीचे दिए गए विकल्प देखें और सीधे कार्ट में जोड़ें।`;
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


// ── Order Query Detection ──────────────────────────────────────
function isOrderQuery(q) {
  const lower = (q || "").toLowerCase();
  return (
    lower.includes("order") ||
    lower.includes("orders") ||
    lower.includes("mera order") ||
    lower.includes("mere order") ||
    lower.includes("order status") ||
    lower.includes("order track") ||
    lower.includes("kahan hai mera") ||
    lower.includes("delivery status") ||
    lower.includes("shipment") ||
    lower.includes("order history") ||
    lower.includes("past orders") ||
    lower.includes("my orders") ||
    lower.includes("order check") ||
    lower.includes("track order")
  );
}

// ── Status badge helper ─────────────────────────────────────────
function statusBadge(status) {
  const s = (status || "").toLowerCase();
  if (s === "delivered") return { emoji: "✅", color: "#10B981" };
  if (s === "shipped" || s === "dispatched") return { emoji: "🚚", color: "#3B82F6" };
  if (s === "cancelled") return { emoji: "❌", color: "#EF4444" };
  return { emoji: "🟡", color: "#F59E0B" }; // Confirmed / Processing
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
          ? "नमस्ते! मैं आपका MYCA AI शॉपिंग सहायक हूँ। मैं सही उत्पाद खोजने, विनिर्देशों की तुलना करने और बजट डील्स ढूंढने में आपकी मदद कर सकता हूँ। आप क्या ढूंढ रहे हैं?"
          : "Hello! I'm your MYCA AI Shopping Copilot. I can help you discover products, compare specs, find budget deals, and check delivery. What are you looking for today?",
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

    // ── ORDER STATUS QUERY ──────────────────────────────────────
    if (isOrderQuery(textToSend)) {
      try {
        // Check login first
        await api.get("/auth/me");
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: "ai_" + Date.now(),
            sender: "ai",
            text: isHindi
              ? "आपके orders देखने के लिए पहले login करें। 🔒"
              : "Please login first to check your orders. 🔒",
            products: [],
            orders: [],
          },
        ]);
        setIsTyping(false);
        return;
      }

      try {
        const res = await api.get("/orders");
        const fetchedOrders = res.data?.orders || [];

        if (fetchedOrders.length === 0) {
          setMessages((prev) => [
            ...prev,
            {
              id: "ai_" + Date.now(),
              sender: "ai",
              text: isHindi
                ? "आपने अभी तक कोई order नहीं किया है। 🛍️"
                : "You haven't placed any orders yet. 🛍️",
              products: [],
              orders: [],
            },
          ]);
        } else {
          // Show latest 3 orders
          const latest = fetchedOrders.slice(0, 3);
          setMessages((prev) => [
            ...prev,
            {
              id: "ai_" + Date.now(),
              sender: "ai",
              text: isHindi
                ? `आपके ${fetchedOrders.length} order(s) मिले। यहाँ आपके हाल के orders हैं:`
                : `You have ${fetchedOrders.length} order(s). Here are your recent orders:`,
              products: [],
              orders: latest,
            },
          ]);
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: "ai_" + Date.now(),
            sender: "ai",
            text: isHindi
              ? "Orders fetch करने में कोई समस्या आई। कृपया बाद में पुनः प्रयास करें।"
              : "Something went wrong fetching your orders. Please try again later.",
            products: [],
            orders: [],
          },
        ]);
      }

      setIsTyping(false);
      return;
    }
    // ── END ORDER STATUS QUERY ──────────────────────────────────

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
          orders: [],
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
        orders: [],
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 400);
  };

  const cartItems = useSelector((state) => state.cart.items || []);

  const handleAddToCart = async (product) => {
    try {
      await api.get("/auth/me");
      const currentQty = cartItems.find((i) => String(i.productId || i._id) === String(product._id))?.quantity || 0;
      dispatch(addToCart({ ...product, quantity: 1 }));
      try {
        await api.post("/cart/add", {
          productId: product._id,
          title: product.title,
          price: product.price,
          images: product.images,
          quantity: 1,
          newTotalQty: currentQty + 1,
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

                  {/* EMBEDDED ORDER STATUS CARDS */}
                  {m.orders && m.orders.length > 0 && (
                    <div className="ai-orders-list">
                      {m.orders.map((order) => {
                        const badge = statusBadge(order.status);
                        const dateStr = order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "";
                        return (
                          <div key={order._id || order.orderId} className="ai-order-card">
                            {/* Order Header */}
                            <div className="ai-order-header">
                              <span className="ai-order-id">📦 {order.orderId || ("#" + String(order._id).slice(-6).toUpperCase())}</span>
                              <span
                                className="ai-order-status-badge"
                                style={{ color: badge.color, borderColor: badge.color }}
                              >
                                {badge.emoji} {order.status}
                              </span>
                            </div>

                            {/* Ordered Items */}
                            <div className="ai-order-items">
                              {(order.items || []).map((item, idx) => (
                                <div key={idx} className="ai-order-item">
                                  <img
                                    src={
                                      item.image ||
                                      `https://picsum.photos/seed/${item.productId}/80/80`
                                    }
                                    alt={item.title}
                                    className="ai-order-item-img"
                                  />
                                  <div className="ai-order-item-info">
                                    <span className="ai-order-item-title">{item.title}</span>
                                    <span className="ai-order-item-meta">
                                      Qty: {item.quantity} &nbsp;·&nbsp; ₹{Number(item.price).toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Order Footer */}
                            <div className="ai-order-footer">
                              {dateStr && <span className="ai-order-date">🗓️ {dateStr}</span>}
                              <span className="ai-order-total">
                                Total: ₹{Number(order.totalAmount).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

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
