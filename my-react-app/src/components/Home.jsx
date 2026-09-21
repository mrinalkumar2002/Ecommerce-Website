import React, { useEffect, useState, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import {
  FaShieldAlt,
  FaShippingFast,
  FaUndoAlt,
  FaStar,
  FaArrowRight,
  FaArrowLeft,
  FaTag,
  FaCheckCircle,
  FaAward,
  FaFire,
  FaBolt,
  FaCheck,
  FaChevronRight,
  FaRegEye,
  FaCamera,
  FaTshirt,
  FaRobot,
  FaMapMarkerAlt,
} from "react-icons/fa";
import ProductCard from "./ProductCard";
import ProductTransText from "./ProductTransText";
import QuickViewModal from "./QuickViewModal";
import VisualSearchModal from "./VisualSearchModal";
import VirtualTryOnModal from "./VirtualTryOnModal";
import { ProductGridSkeleton } from "./SkeletonLoader";
import { getProductReviews } from "../data/productReviews";
import api from "../api";
import { clothesProducts } from "../data/clothesData";
import { electronicsProducts } from "../data/electronicsData";
import { shoesProducts } from "../data/shoesData";
import { sportsProducts } from "../data/sportsData";
import "./Home.css";

const LOCAL_FALLBACK_PRODUCTS = [
  ...electronicsProducts,
  ...clothesProducts,
  ...shoesProducts,
  ...sportsProducts,
];

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [showVisualSearch, setShowVisualSearch] = useState(false);
  const [showTryOn, setShowTryOn] = useState(false);
  const [tryOnInitialProduct, setTryOnInitialProduct] = useState(null);
  const [toast, setToast] = useState({ show: false, title: "", img: "", type: "cart" });

  // Hero Slider State & Touch/Swipe Handling
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef(0);
  const touchEndXRef = useRef(0);
  const sliderTimerRef = useRef(null);

  // Delivery Checker State
  const [pincode, setPincode] = useState("");
  const [deliveryResult, setDeliveryResult] = useState(null);

  // Dynamic Admin Banners State
  const [adminBanners, setAdminBanners] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        setLoading(true);
        const res = await api.get("/products", { timeout: 8000 });
        if (Array.isArray(res.data) && res.data.length > 0) {
          setProducts(res.data);
        } else {
          setProducts(LOCAL_FALLBACK_PRODUCTS);
        }
      } catch {
        setProducts(LOCAL_FALLBACK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };

    const fetchBanners = async () => {
      try {
        const res = await api.get("/public/banners");
        if (Array.isArray(res.data) && res.data.length > 0) {
          setAdminBanners(res.data);
        }
      } catch {}
    };

    fetchCatalog();
    fetchBanners();

    // Load recently viewed
    try {
      const rawRecent = localStorage.getItem("pvx_recently_viewed");
      if (rawRecent) {
        setRecentlyViewed(JSON.parse(rawRecent));
      }
    } catch {}
  }, []);

  // 1. Hero Showcase Products (4 diverse real flagship items)
  const heroSliderProducts = useMemo(() => {
    if (!products.length) return [];
    const p1 = products.find((p) => p._id === "elec-001") || products[0]; // Apple iPhone 15 Pro Max
    const p2 = products.find((p) => p._id === "elec-004") || products[3]; // Sony WH-1000XM5 Headphones
    const p3 = products.find((p) => p._id === "shoe-001") || products[104]; // Nike Air Zoom Pegasus
    const p4 = products.find((p) => p._id === "clot-001") || products[52]; // Levi's Trucker Jacket
    return [p1, p2, p3, p4].filter(Boolean);
  }, [products]);

  // Autoplay Hero Slider
  useEffect(() => {
    if (isPaused || heroSliderProducts.length <= 1) return;
    sliderTimerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSliderProducts.length);
    }, 4800);
    return () => clearInterval(sliderTimerRef.current);
  }, [isPaused, heroSliderProducts.length]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? heroSliderProducts.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSliderProducts.length);
  };

  const handleTouchStart = (e) => {
    touchStartXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartXRef.current - touchEndXRef.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) handleNextSlide();
      else handlePrevSlide();
    }
  };

  // 2. Trending / Featured Picks
  const trendingPicks = useMemo(() => {
    if (!products.length) return [];
    return products.slice(0, 4);
  }, [products]);

  // 3. Top Rated Picks (Rating >= 4.7)
  const topRatedPicks = useMemo(() => {
    if (!products.length) return [];
    const highRated = products.filter((p) => (p.rating || 4.5) >= 4.7);
    return highRated.length >= 4 ? highRated.slice(0, 4) : products.slice(4, 8);
  }, [products]);

  // 4. Value Deals (Budget friendly under Rs. 3000)
  const valueDeals = useMemo(() => {
    if (!products.length) return [];
    const budget = products.filter((p) => Number(p.price || 0) <= 2999);
    return budget.length >= 4 ? budget.slice(0, 4) : products.slice(8, 12);
  }, [products]);

  // 5. Featured Deals Products
  const dealsFeaturedProducts = useMemo(() => {
    if (!products.length) return [];
    const d1 = products.find((p) => p._id === "elec-002") || products[1]; // Galaxy S24 Ultra
    const d2 = products.find((p) => p._id === "shoe-002") || products[105]; // Adidas Ultraboost
    return [d1, d2].filter(Boolean);
  }, [products]);

  // 6. Complete the Look Smart Bundle (Jacket + Pants + Sneakers)
  const completeLookItems = useMemo(() => {
    if (!products.length) return [];
    const top = products.find((p) => p._id === "clot-001") || products[52];
    const bottom = products.find((p) => p._id === "clot-003") || products[54];
    const shoes = products.find((p) => p._id === "shoe-001") || products[104];
    return [top, bottom, shoes].filter(Boolean);
  }, [products]);

  const bundleTotalPrice = useMemo(() => {
    return completeLookItems.reduce((sum, item) => sum + Number(item.price || 0), 0);
  }, [completeLookItems]);

  const handleAddBundleToCart = () => {
    completeLookItems.forEach((item) => {
      dispatch(addToCart(item));
    });
    setToast({
      show: true,
      title: t("home.bundleTitle"),
      img: completeLookItems[0]?.images?.[0] || "",
      type: "cart",
    });
  };

  // 7. Editorial Showcase Product
  const editorialProduct = useMemo(() => {
    return products.find((p) => p._id === "elec-004") || products[3] || null;
  }, [products]);

  // 8. Personalized Recommendations ("For You")
  const forYouPicks = useMemo(() => {
    if (!products.length) return [];
    if (recentlyViewed.length > 0) {
      const cat = recentlyViewed[0].category || "electronics";
      const related = products.filter((p) => (p.category || "").toLowerCase() === cat.toLowerCase());
      return related.length >= 4 ? related.slice(0, 4) : products.slice(12, 16);
    }
    return products.slice(12, 16);
  }, [products, recentlyViewed]);

  const activeSlideProduct = heroSliderProducts[currentSlide] || null;
  const activeSlideReviews = activeSlideProduct
    ? getProductReviews(activeSlideProduct._id)
    : { rating: 4.8, reviewCount: 4 };

  // Delivery checker handler
  const handleCheckPincode = (e) => {
    e.preventDefault();
    const cleanPin = pincode.trim();
    if (/^\d{6}$/.test(cleanPin)) {
      setDeliveryResult({
        success: true,
        message: t("home.deliveryAvailable"),
        pincode: cleanPin,
      });
    } else {
      setDeliveryResult({
        success: false,
        message: t("home.deliveryInvalid"),
        pincode: cleanPin,
      });
    }
  };

  // AI Prompt Trigger
  const handleTriggerAiPrompt = (promptText) => {
    const aiDrawerBtn = document.querySelector(".ai-float-btn");
    if (aiDrawerBtn) {
      aiDrawerBtn.click();
      setTimeout(() => {
        const inputField = document.querySelector(".ai-input-field");
        if (inputField) {
          inputField.value = promptText;
          inputField.dispatchEvent(new Event("input", { bubbles: true }));
        }
      }, 350);
    }
  };

  return (
    <div className="shoppy-home-wrapper">
      {/* 🟢 TOAST NOTIFICATION BANNER */}
      {toast.show && (
        <div className="toast-popup-banner">
          <div className="toast-left">
            <span className="toast-check">
              {toast.type === "wishlist-remove"
                ? "💔"
                : toast.type === "wishlist"
                ? "💚"
                : "✅"}
            </span>
            {toast.img && <img src={toast.img} alt="" className="toast-img" />}
            <div className="toast-info">
              <strong>
                {toast.type === "wishlist-remove"
                  ? t("productList.removedFromWishlist")
                  : toast.type === "wishlist"
                  ? t("productList.addedToWishlist")
                  : t("productList.itemAddedToCart")}
              </strong>
              <span className="toast-prod-title">{toast.title}</span>
            </div>
          </div>
          <button
            type="button"
            className="toast-view-cart-btn"
            onClick={() => navigate(toast.type?.startsWith("wishlist") ? "/wishlist" : "/cart")}
          >
            {toast.type?.startsWith("wishlist") ? t("productList.viewWishlist") : t("productList.viewCart")}
          </button>
        </div>
      )}

      {/* 🖼️ ADMIN PROMOTIONAL BANNERS STRIP */}
      {adminBanners.length > 0 && (
        <div className="admin-banners-strip">
          {adminBanners.map((banner) => (
            <div
              key={banner._id}
              className="admin-banner-card"
              onClick={() => banner.link && (window.location.href = banner.link)}
            >
              <img src={banner.imageUrl} alt={banner.title} className="admin-banner-img" />
              <div className="admin-banner-overlay">
                <h3>{banner.title}</h3>
                {banner.link && <span className="admin-banner-cta">Explore Now &rarr;</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ============================================================
          1. HERO SECTION — EDITORIAL TWO-COLUMN + PRODUCT SHOWCASE SLIDER
          ============================================================ */}
      <section className="shoppy-hero-section">
        <div className="shoppy-hero-container">
          {/* LEFT: EDITORIAL COPY & CTAS */}
          <div className="shoppy-hero-left">
            <div className="hero-eyebrow-pill">
              <FaBolt className="eyebrow-icon" />
              <span>{t("home.heroEyebrow")}</span>
            </div>

            <h1 className="hero-main-title">
              {t("home.heroHeadingLine1")}{" "}
              <span className="hero-blue-accent">{t("home.heroHeadingLine2")}</span>
              <br />
              {t("home.heroHeadingLine3")}
            </h1>

            <p className="hero-supporting-copy">
              {t("home.heroSupporting")}
            </p>

            <div className="hero-cta-actions">
              <button
                type="button"
                className="hero-btn-primary"
                onClick={() => navigate("/productlist")}
              >
                {t("home.heroCtaPrimary")} <FaArrowRight className="btn-arrow-icon" />
              </button>
              <button
                type="button"
                className="hero-btn-secondary"
                onClick={() => navigate("/productlist?banner=true")}
              >
                <FaTag className="btn-tag-icon" /> {t("home.heroCtaSecondary")}
              </button>
            </div>

            {/* TRUST INDICATORS */}
            <div className="hero-trust-row">
              <div className="hero-trust-badge">
                <FaCheckCircle className="trust-check-blue" />
                <span>408+ {t("home.productsCount")}</span>
              </div>
              <div className="hero-trust-badge">
                <FaShippingFast className="trust-check-blue" />
                <span>{t("home.fastDispatch")}</span>
              </div>
              <div className="hero-trust-badge">
                <FaAward className="trust-check-gold" />
                <span>{t("home.verifiedShoppers")}</span>
              </div>
            </div>
          </div>

          {/* RIGHT: DYNAMIC HERO PRODUCT SHOWCASE SLIDER */}
          <div
            className="shoppy-hero-right"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocus={() => setIsPaused(true)}
            onBlur={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {activeSlideProduct && (
              <div
                className="hero-showcase-card"
                onClick={() => navigate(`/productdetail/${activeSlideProduct._id}`)}
              >
                {/* Floating Badges */}
                <div className="hero-showcase-header">
                  <span className="showcase-status-badge">
                    {currentSlide === 0
                      ? `⚡ ${t("home.heroFeatured")}`
                      : currentSlide === 1
                      ? `🎧 ${t("home.heroTrending")}`
                      : currentSlide === 2
                      ? `👟 ${t("home.heroBestSeller")}`
                      : `👕 ${t("home.heroFeatured")}`}
                  </span>
                  <span className="showcase-discount-badge">20% OFF</span>
                </div>

                {/* Large Dedicated Image Canvas */}
                <div className="hero-showcase-canvas">
                  <img
                    src={activeSlideProduct.images?.[0]}
                    alt={activeSlideProduct.title}
                    className="hero-showcase-image"
                  />
                </div>

                {/* Product Metadata Details */}
                <div className="hero-showcase-footer">
                  <div className="showcase-meta-top">
                    <span className="showcase-cat-label">
                      <ProductTransText text={activeSlideProduct.category || "ELECTRONICS"} />
                    </span>
                    <span className="showcase-rating-pill">
                      ★ {activeSlideReviews.rating.toFixed(1)} ({activeSlideReviews.reviewCount})
                    </span>
                  </div>

                  <h3 className="showcase-title"><ProductTransText text={activeSlideProduct.title} /></h3>

                  <div className="showcase-price-row">
                    <div className="showcase-prices">
                      <strong className="showcase-current-price">
                        ₹{Number(activeSlideProduct.price).toLocaleString()}
                      </strong>
                      <span className="showcase-mrp-price">
                        ₹{Math.round(activeSlideProduct.price * 1.25).toLocaleString()}
                      </span>
                    </div>

                    <span className="showcase-action-cta">
                      {t("home.heroViewProduct")}
                    </span>
                  </div>
                </div>

                {/* Slider Nav Arrows */}
                <button
                  type="button"
                  className="hero-slider-arrow prev"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevSlide();
                  }}
                  aria-label={t("home.heroPrevSlide")}
                  title={t("home.heroPrevSlide")}
                >
                  <FaArrowLeft />
                </button>

                <button
                  type="button"
                  className="hero-slider-arrow next"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextSlide();
                  }}
                  aria-label={t("home.heroNextSlide")}
                  title={t("home.heroNextSlide")}
                >
                  <FaArrowRight />
                </button>

                {/* Slider Pagination Dots */}
                <div
                  className="hero-slider-dots"
                  onClick={(e) => e.stopPropagation()}
                >
                  {heroSliderProducts.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`hero-dot ${idx === currentSlide ? "active" : ""}`}
                      onClick={() => setCurrentSlide(idx)}
                      aria-label={`${t("home.heroSlideDot")} ${idx + 1}`}
                      title={`${t("home.heroSlideDot")} ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ============================================================
          2. SHOP BY INTENT ("WHAT ARE YOU SHOPPING FOR?")
          ============================================================ */}
      <section className="shoppy-intent-section">
        <div className="shoppy-section-container">
          <div className="shoppy-section-header">
            <div>
              <span className="section-pill-tag blue">✨ {t("home.intentTitle")}</span>
              <h2 className="section-main-heading">{t("home.intentTitle")}</h2>
              <p className="section-sub-copy">{t("home.intentSubtitle")}</p>
            </div>
            <Link to="/productlist" className="section-view-all-link">
              {t("home.viewAll")}
            </Link>
          </div>

          <div className="shoppy-intent-grid">
            {[
              {
                title: t("home.intentTech"),
                sub: "Flagship phones, audio & laptops",
                icon: "💻",
                link: "/productlist?category=electronics",
                badge: "Top Tech",
              },
              {
                title: t("home.intentWardrobe"),
                sub: "Denim, tees & seasonal edits",
                icon: "👕",
                link: "/productlist?category=clothes",
                badge: "Fashion",
              },
              {
                title: t("home.intentSneakers"),
                sub: "Road running & lifestyle kicks",
                icon: "👟",
                link: "/productlist?category=shoes",
                badge: "Footwear",
              },
              {
                title: t("home.intentActive"),
                sub: "Gym gear, balls & training kits",
                icon: "⚽",
                link: "/productlist?category=sports",
                badge: "Sports",
              },
              {
                title: t("home.intentDeals"),
                sub: "Authentic catalog offers up to 60%",
                icon: "🔥",
                link: "/productlist?banner=true",
                badge: "Offers",
              },
              {
                title: t("home.intentEssentials"),
                sub: "Curated bestsellers for daily life",
                icon: "✨",
                link: "/productlist",
                badge: "All Items",
              },
            ].map((intent, idx) => (
              <div
                key={idx}
                className="intent-card"
                onClick={() => navigate(intent.link)}
              >
                <div className="intent-card-top">
                  <span className="intent-icon">{intent.icon}</span>
                  <span className="intent-badge">{intent.badge}</span>
                </div>
                <h3 className="intent-title">{intent.title}</h3>
                <p className="intent-sub">{intent.sub}</p>
                <span className="intent-link">Explore Now →</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          3. SHOP BY CATEGORY — MODERN ROUNDED TILES
          ============================================================ */}
      <section className="shoppy-category-section">
        <div className="shoppy-section-container">
          <div className="shoppy-section-header">
            <div>
              <span className="section-pill-tag blue">{t("home.browseCategoryTitle")}</span>
              <h2 className="section-main-heading">{t("home.browseCategoryTitle")}</h2>
              <p className="section-sub-copy">{t("home.browseCategorySub")}</p>
            </div>
            <Link to="/productlist" className="section-view-all-link">
              {t("home.viewAll")}
            </Link>
          </div>

          <div className="shoppy-category-grid">
            {[
              {
                id: "electronics",
                label: t("header.electronics"),
                icon: "💻",
                img: "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=300&q=80",
                link: "/productlist?category=electronics",
                count: "52+ Products",
              },
              {
                id: "clothes",
                label: t("header.clothes"),
                icon: "👕",
                img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=300&q=80",
                link: "/productlist?category=clothes",
                count: "52+ Products",
              },
              {
                id: "shoes",
                label: t("header.shoes"),
                icon: "👟",
                img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80",
                link: "/productlist?category=shoes",
                count: "52+ Products",
              },
              {
                id: "sports",
                label: t("header.sports"),
                icon: "⚽",
                img: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=300&q=80",
                link: "/productlist?category=sports",
                count: "52+ Products",
              },
              {
                id: "deals",
                label: t("home.shopDeals"),
                icon: "🔥",
                img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=300&q=80",
                link: "/productlist?banner=true",
                count: "Up to 60% Off",
              },
              {
                id: "all",
                label: t("header.allCategories"),
                icon: "🪟",
                img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=300&q=80",
                link: "/productlist",
                count: "408+ Total Items",
              },
            ].map((cat) => (
              <div
                key={cat.id}
                className="category-tile-card"
                onClick={() => navigate(cat.link)}
              >
                <div className="category-tile-image-box">
                  <img src={cat.img} alt={cat.label} loading="lazy" />
                  <span className="category-tile-badge">{cat.icon}</span>
                </div>
                <div className="category-tile-details">
                  <h3 className="category-tile-name">{cat.label}</h3>
                  <span className="category-tile-count">{cat.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          4. TRENDING PRODUCTS SHELF
          ============================================================ */}
      <section className="shoppy-shelf-section">
        <div className="shoppy-section-container">
          <div className="shoppy-section-header">
            <div>
              <span className="section-pill-tag blue">🔥 {t("home.trendingTitle")}</span>
              <h2 className="section-main-heading">{t("home.trendingTitle")}</h2>
              <p className="section-sub-copy">{t("home.trendingSub")}</p>
            </div>
            <Link to="/productlist" className="section-view-all-link">
              {t("home.viewAllProducts")}
            </Link>
          </div>

          {loading ? (
            <ProductGridSkeleton />
          ) : (
            <div className="shoppy-shelf-grid">
              {trendingPicks.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onQuickView={setQuickViewProduct}
                  onToast={setToast}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============================================================
          5. PROMOTIONAL / DEALS MERCHANDISING BANNER
          ============================================================ */}
      <section className="shoppy-deals-section">
        <div className="shoppy-section-container">
          <div className="deals-banner-card">
            {/* Left: Copy and CTA */}
            <div className="deals-banner-left">
              <span className="deals-eyebrow-pill">⚡ {t("home.dealsEyebrow")}</span>
              <h2 className="deals-banner-title">{t("home.dealsHeading")}</h2>
              <p className="deals-banner-desc">{t("home.dealsSubtitle")}</p>

              <div className="deals-action-wrap">
                <button
                  type="button"
                  className="deals-cta-btn"
                  onClick={() => navigate("/productlist?banner=true")}
                >
                  {t("home.dealsCta")} <FaChevronRight className="deals-chevron" />
                </button>
                <span className="deals-guarantee-note">✓ 100% Genuine Catalog Discounts</span>
              </div>
            </div>

            {/* Right: 2 Real Discounted Catalog Products */}
            <div className="deals-banner-right">
              {dealsFeaturedProducts.map((p) => (
                <div
                  key={p._id}
                  className="deals-mini-card"
                  onClick={() => navigate(`/productdetail/${p._id}`)}
                >
                  <div className="deals-mini-canvas">
                    <img src={p.images?.[0]} alt={p.title} loading="lazy" />
                    <span className="deals-mini-pill">20% OFF</span>
                  </div>
                  <div className="deals-mini-info">
                    <span className="deals-mini-cat"><ProductTransText text={p.category} /></span>
                    <h4 className="deals-mini-title"><ProductTransText text={p.title} /></h4>
                    <div className="deals-mini-price-row">
                      <strong className="deals-mini-price">₹{Number(p.price).toLocaleString()}</strong>
                      <span className="deals-mini-mrp">₹{Math.round(p.price * 1.25).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          6. AI SHOPPING ASSISTANT INTERACTIVE EMBEDDED HUB
          ============================================================ */}
      <section className="shoppy-ai-hub-section">
        <div className="shoppy-section-container">
          <div className="ai-hub-card">
            <div className="ai-hub-header">
              <div className="ai-hub-title-box">
                <div className="ai-hub-icon"><FaRobot /></div>
                <div>
                  <h2 className="ai-hub-heading">{t("home.aiHubTitle")}</h2>
                  <p className="ai-hub-sub">{t("home.aiHubSubtitle")}</p>
                </div>
              </div>
              <button
                type="button"
                className="ai-hub-open-btn"
                onClick={() => handleTriggerAiPrompt("Hello! Show me the best tech and deals.")}
              >
                Chat with Assistant →
              </button>
            </div>

            {/* Interactive Prompt Pills */}
            <div className="ai-hub-prompts-row">
              <button
                type="button"
                className="ai-prompt-pill"
                onClick={() => handleTriggerAiPrompt(t("home.aiPrompt1"))}
              >
                🎧 "{t("home.aiPrompt1")}"
              </button>
              <button
                type="button"
                className="ai-prompt-pill"
                onClick={() => handleTriggerAiPrompt(t("home.aiPrompt2"))}
              >
                👟 "{t("home.aiPrompt2")}"
              </button>
              <button
                type="button"
                className="ai-prompt-pill"
                onClick={() => handleTriggerAiPrompt(t("home.aiPrompt3"))}
              >
                📱 "{t("home.aiPrompt3")}"
              </button>
              <button
                type="button"
                className="ai-prompt-pill"
                onClick={() => handleTriggerAiPrompt(t("home.aiPrompt4"))}
              >
                ✨ "{t("home.aiPrompt4")}"
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          7. COMPLETE THE LOOK (SMART FASHION BUNDLE)
          ============================================================ */}
      {completeLookItems.length >= 3 && (
        <section className="shoppy-bundle-section">
          <div className="shoppy-section-container">
            <div className="bundle-card-container">
              <div className="bundle-header">
                <div>
                  <span className="section-pill-tag blue">✨ {t("home.bundleTitle")}</span>
                  <h2 className="bundle-main-title">{t("home.bundleTitle")}</h2>
                  <p className="bundle-sub-copy">{t("home.bundleSubtitle")}</p>
                </div>

                <div className="bundle-cta-box">
                  <div className="bundle-total-prices">
                    <span className="bundle-label">Ensemble Total:</span>
                    <strong className="bundle-price">₹{bundleTotalPrice.toLocaleString()}</strong>
                  </div>
                  <button
                    type="button"
                    className="bundle-add-all-btn"
                    onClick={handleAddBundleToCart}
                  >
                    🛒 {t("home.bundleAddAll")}
                  </button>
                </div>
              </div>

              {/* 3 Bundle Product Cards */}
              <div className="bundle-items-grid">
                {completeLookItems.map((item, idx) => (
                  <div
                    key={item._id}
                    className="bundle-item-card"
                    onClick={() => navigate(`/productdetail/${item._id}`)}
                  >
                    <div className="bundle-item-canvas">
                      <img src={item.images?.[0]} alt={item.title} />
                      <span className="bundle-step-badge">
                        {idx === 0 ? "01 Top" : idx === 1 ? "02 Bottom" : "03 Footwear"}
                      </span>
                    </div>
                    <div className="bundle-item-meta">
                      <h4><ProductTransText text={item.title} /></h4>
                      <strong>₹{Number(item.price).toLocaleString()}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============================================================
          8. SMART FEATURES: VIRTUAL TRY-ON & VISUAL SEARCH LAUNCHPAD
          ============================================================ */}
      <section className="shoppy-smart-features-section">
        <div className="shoppy-section-container">
          <div className="smart-features-grid">
            {/* Try-On Launchpad Card */}
            <div className="smart-feature-promo vto-promo">
              <div className="smart-promo-content">
                <span className="smart-promo-badge">👗 FASHION INTELLIGENCE</span>
                <h3 className="smart-promo-title">{t("home.tryOnPromoTitle")}</h3>
                <p className="smart-promo-desc">{t("home.tryOnPromoDesc")}</p>
                <button
                  type="button"
                  className="smart-promo-btn"
                  onClick={() => setShowTryOn(true)}
                >
                  <FaTshirt /> {t("home.tryOnPromoBtn")}
                </button>
              </div>
              <div className="smart-promo-graphic">
                <img
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=350&auto=format&fit=crop"
                  alt="Virtual Try-On"
                />
              </div>
            </div>

            {/* Visual Search Launchpad Card */}
            <div className="smart-feature-promo vs-promo">
              <div className="smart-promo-content">
                <span className="smart-promo-badge">📸 COMPUTER VISION</span>
                <h3 className="smart-promo-title">{t("home.visualSearchPromoTitle")}</h3>
                <p className="smart-promo-desc">{t("home.visualSearchPromoDesc")}</p>
                <button
                  type="button"
                  className="smart-promo-btn"
                  onClick={() => setShowVisualSearch(true)}
                >
                  <FaCamera /> {t("home.visualSearchPromoBtn")}
                </button>
              </div>
              <div className="smart-promo-graphic">
                <img
                  src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=350&auto=format&fit=crop"
                  alt="Visual Search"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          9. SHOP BY DEPARTMENT — ASYMMETRIC EDITORIAL GRID
          ============================================================ */}
      <section className="shoppy-dept-section">
        <div className="shoppy-section-container">
          <div className="shoppy-section-header">
            <div>
              <span className="section-pill-tag blue">{t("home.deptSubTag")}</span>
              <h2 className="section-main-heading">{t("home.deptSectionTitle")}</h2>
              <p className="section-sub-copy">{t("home.deptSectionSub")}</p>
            </div>
            <Link to="/productlist" className="section-view-all-link">
              {t("home.viewAll")}
            </Link>
          </div>

          <div className="shoppy-dept-grid">
            {/* ELECTRONICS */}
            <div
              className="dept-grid-card dept-card-large"
              onClick={() => navigate("/productlist?category=electronics")}
            >
              <img
                src="https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=700&q=80"
                alt="Electronics"
                className="dept-bg-image"
                loading="lazy"
              />
              <div className="dept-card-overlay">
                <span className="dept-tag-number">01 • TECH</span>
                <h3 className="dept-card-heading">{t("home.electronics")}</h3>
                <p className="dept-card-sub">{t("home.electronicsDesc")}</p>
                <span className="dept-explore-action">{t("home.explore")}</span>
              </div>
            </div>

            {/* FASHION */}
            <div
              className="dept-grid-card dept-card-large"
              onClick={() => navigate("/productlist?category=clothes")}
            >
              <img
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=80"
                alt="Fashion"
                className="dept-bg-image"
                loading="lazy"
              />
              <div className="dept-card-overlay">
                <span className="dept-tag-number">02 • STYLE</span>
                <h3 className="dept-card-heading">{t("home.fashion")}</h3>
                <p className="dept-card-sub">{t("home.fashionDesc")}</p>
                <span className="dept-explore-action">{t("home.explore")}</span>
              </div>
            </div>

            {/* FOOTWEAR */}
            <div
              className="dept-grid-card dept-card-split"
              onClick={() => navigate("/productlist?category=shoes")}
            >
              <img
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80"
                alt="Footwear"
                className="dept-bg-image"
                loading="lazy"
              />
              <div className="dept-card-overlay">
                <span className="dept-tag-number">03 • FOOTWEAR</span>
                <h3 className="dept-card-heading">{t("home.footwear")}</h3>
                <p className="dept-card-sub">{t("home.footwearDesc")}</p>
                <span className="dept-explore-action">{t("home.explore")}</span>
              </div>
            </div>

            {/* SPORTS & FITNESS */}
            <div
              className="dept-grid-card dept-card-split"
              onClick={() => navigate("/productlist?category=sports")}
            >
              <img
                src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80"
                alt="Sports"
                className="dept-bg-image"
                loading="lazy"
              />
              <div className="dept-card-overlay">
                <span className="dept-tag-number">04 • ACTIVE</span>
                <h3 className="dept-card-heading">{t("home.sports")}</h3>
                <p className="dept-card-sub">{t("home.sportsDesc")}</p>
                <span className="dept-explore-action">{t("home.explore")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          10. TOP RATED PRODUCTS SHELF
          ============================================================ */}
      <section className="shoppy-shelf-section shoppy-shelf-alt">
        <div className="shoppy-section-container">
          <div className="shoppy-section-header">
            <div>
              <span className="section-pill-tag gold">⭐ {t("home.topRatedTitle")}</span>
              <h2 className="section-main-heading">{t("home.topRatedTitle")}</h2>
              <p className="section-sub-copy">{t("home.topRatedSub")}</p>
            </div>
            <Link to="/productlist" className="section-view-all-link">
              {t("home.viewAllProducts")}
            </Link>
          </div>

          {loading ? (
            <ProductGridSkeleton />
          ) : (
            <div className="shoppy-shelf-grid">
              {topRatedPicks.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onQuickView={setQuickViewProduct}
                  onToast={setToast}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============================================================
          11. RECOMMENDED FOR YOU / CONTINUE SHOPPING
          ============================================================ */}
      <section className="shoppy-shelf-section">
        <div className="shoppy-section-container">
          <div className="shoppy-section-header">
            <div>
              <span className="section-pill-tag blue">✨ {t("home.forYouTitle")}</span>
              <h2 className="section-main-heading">{t("home.forYouTitle")}</h2>
              <p className="section-sub-copy">{t("home.forYouSubtitle")}</p>
            </div>
            <Link to="/productlist" className="section-view-all-link">
              {t("home.viewAllProducts")}
            </Link>
          </div>

          {loading ? (
            <ProductGridSkeleton />
          ) : (
            <div className="shoppy-shelf-grid">
              {forYouPicks.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onQuickView={setQuickViewProduct}
                  onToast={setToast}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============================================================
          12. EDITORIAL PRODUCT SHOWCASE (LIFESTYLE / CAMPAIGN)
          ============================================================ */}
      {editorialProduct && (
        <section className="shoppy-editorial-section">
          <div className="shoppy-section-container">
            <div className="editorial-card-container">
              {/* Left: Large Visual Showcase */}
              <div
                className="editorial-left-canvas"
                onClick={() => navigate(`/productdetail/${editorialProduct._id}`)}
              >
                <img
                  src={editorialProduct.images?.[0]}
                  alt={editorialProduct.title}
                  className="editorial-featured-img"
                  loading="lazy"
                />
                <div className="editorial-floating-chip">
                  <FaStar className="editorial-star" />
                  <div>
                    <strong>4.8 ★ Rating</strong>
                    <span>Industry-Leading Audio</span>
                  </div>
                </div>
              </div>

              {/* Right: Editorial Narrative */}
              <div className="editorial-right-content">
                <span className="editorial-eyebrow-tag">⚡ {t("home.editorialEyebrow")}</span>
                <h2 className="editorial-heading">{t("home.editorialTitle")}</h2>
                <p className="editorial-description">{t("home.editorialDesc")}</p>

                {/* Supported Feature Highlights */}
                <div className="editorial-features-list">
                  <div className="editorial-feature-item">
                    <span className="feature-check-icon"><FaCheck /></span>
                    <span>{t("home.editorialFeature1")}</span>
                  </div>
                  <div className="editorial-feature-item">
                    <span className="feature-check-icon"><FaCheck /></span>
                    <span>{t("home.editorialFeature2")}</span>
                  </div>
                  <div className="editorial-feature-item">
                    <span className="feature-check-icon"><FaCheck /></span>
                    <span>{t("home.editorialFeature3")}</span>
                  </div>
                </div>

                <div className="editorial-action-row">
                  <button
                    type="button"
                    className="editorial-primary-btn"
                    onClick={() => navigate(`/productdetail/${editorialProduct._id}`)}
                  >
                    {t("home.editorialCta")} <FaArrowRight />
                  </button>

                  <div className="editorial-pricing">
                    <span className="editorial-price">₹{Number(editorialProduct.price).toLocaleString()}</span>
                    <span className="editorial-mrp">₹{Math.round(editorialProduct.price * 1.25).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============================================================
          13. VALUE DEALS PRODUCT SHELF
          ============================================================ */}
      <section className="shoppy-shelf-section shoppy-shelf-alt">
        <div className="shoppy-section-container">
          <div className="shoppy-section-header">
            <div>
              <span className="section-pill-tag green">💎 {t("home.valueTitle")}</span>
              <h2 className="section-main-heading">{t("home.valueTitle")}</h2>
              <p className="section-sub-copy">{t("home.valueSub")}</p>
            </div>
            <Link to="/productlist" className="section-view-all-link">
              {t("home.viewAllProducts")}
            </Link>
          </div>

          {loading ? (
            <ProductGridSkeleton />
          ) : (
            <div className="shoppy-shelf-grid">
              {valueDeals.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onQuickView={setQuickViewProduct}
                  onToast={setToast}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============================================================
          14. DELIVERY PINCODE CHECKER
          ============================================================ */}
      <section className="shoppy-delivery-section">
        <div className="shoppy-section-container">
          <div className="delivery-checker-card">
            <div className="delivery-text-side">
              <div className="delivery-icon-badge"><FaMapMarkerAlt /></div>
              <div>
                <h3 className="delivery-title">{t("home.deliveryCheckerTitle")}</h3>
                <p className="delivery-sub">{t("home.deliveryCheckerSub")}</p>
              </div>
            </div>

            <form onSubmit={handleCheckPincode} className="delivery-form-side">
              <div className="delivery-input-group">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="e.g. 110001 / 831001"
                  value={pincode}
                  onChange={(e) => {
                    setPincode(e.target.value);
                    setDeliveryResult(null);
                  }}
                  className="delivery-pin-input"
                  aria-label="Postal Pincode"
                />
                <button type="submit" className="delivery-submit-btn">
                  {t("home.deliveryCheckBtn")}
                </button>
              </div>
              {deliveryResult && (
                <span className={`delivery-feedback ${deliveryResult.success ? "success" : "error"}`}>
                  {deliveryResult.message}
                </span>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* ============================================================
          15. TRUST STRIP
          ============================================================ */}
      <section className="shoppy-trust-section">
        <div className="shoppy-section-container">
          <div className="shoppy-trust-grid">
            <div className="trust-strip-card">
              <div className="trust-strip-icon-box"><FaShippingFast /></div>
              <div className="trust-strip-text">
                <h3>{t("home.fastDelivery")}</h3>
                <p>{t("home.fastDeliveryDesc")}</p>
              </div>
            </div>

            <div className="trust-strip-card">
              <div className="trust-strip-icon-box"><FaShieldAlt /></div>
              <div className="trust-strip-text">
                <h3>{t("home.securePayments")}</h3>
                <p>{t("home.securePaymentsDesc")}</p>
              </div>
            </div>

            <div className="trust-strip-card">
              <div className="trust-strip-icon-box"><FaUndoAlt /></div>
              <div className="trust-strip-text">
                <h3>{t("home.hassleFreeReturns")}</h3>
                <p>{t("home.hassleFreeReturnsDesc")}</p>
              </div>
            </div>

            <div className="trust-strip-card">
              <div className="trust-strip-icon-box"><FaStar /></div>
              <div className="trust-strip-text">
                <h3>{t("home.verifiedReviews")}</h3>
                <p>{t("home.verifiedReviewsDesc")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🔍 MODALS */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onToast={setToast}
        />
      )}

      {showVisualSearch && (
        <VisualSearchModal
          isOpen={showVisualSearch}
          onClose={() => setShowVisualSearch(false)}
          onToast={setToast}
        />
      )}

      {showTryOn && (
        <VirtualTryOnModal
          isOpen={showTryOn}
          onClose={() => setShowTryOn(false)}
          initialProduct={tryOnInitialProduct}
          onToast={setToast}
        />
      )}
    </div>
  );
}
