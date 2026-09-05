import React, { useEffect, useState, useMemo } from "react";
import { BiCategoryAlt, BiFilterAlt, BiSliderAlt } from "react-icons/bi";
import { FaCartPlus, FaShoppingCart, FaStore, FaStar, FaBalanceScale } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, updateQuantity, removeFromCart } from "../redux/cartSlice";
import { addToWishlist, removeFromWishlist } from "../redux/wishlistSlice";
import { addToCompare, openCompareModal } from "../redux/compareSlice";
import QuickViewModal from "./QuickViewModal";
import ProductCard from "./ProductCard";
import { ProductGridSkeleton } from "./SkeletonLoader";
import api from "../api";
import "./ProductList.css";
import { clothesProducts } from "../data/clothesData";
import { electronicsProducts } from "../data/electronicsData";
import { shoesProducts } from "../data/shoesData";
import { sportsProducts } from "../data/sportsData";
import { getProductReviews } from "../data/productReviews";
import { useTranslation } from "react-i18next";
import ProductTransText from "./ProductTransText";

// Merged local fallback data (always available, even if backend is down)
const LOCAL_FALLBACK_PRODUCTS = [
  ...electronicsProducts,
  ...clothesProducts,
  ...shoesProducts,
  ...sportsProducts,
];

const ALLOWED_CATEGORIES = ["electronics", "clothes", "sports", "shoes"];

// Helper to determine product category
function getProductCategory(p) {
  if (p.category && ALLOWED_CATEGORIES.includes(p.category.toLowerCase())) {
    return p.category.toLowerCase();
  }
  const text = `${p.title || ""} ${p.description || ""}`.toLowerCase();
  if (text.includes("shoe") || text.includes("sneaker") || text.includes("boot") || text.includes("footwear")) return "shoes";
  if (text.includes("sport") || text.includes("ball") || text.includes("fitness") || text.includes("gym")) return "sports";
  if (text.includes("shirt") || text.includes("cloth") || text.includes("wear") || text.includes("dress") || text.includes("pant") || text.includes("jacket") || text.includes("powder") || text.includes("beauty") || text.includes("lipstick")) return "clothes";
  return "electronics";
}

// Compute deterministic badges from actual product metrics
function getProductBadge(product) {
  const stock = typeof product.stock === "number" ? product.stock : 25;
  const rating = product.rating || 4.5;
  const reviewCount = product.reviewCount || 120;

  if (stock > 0 && stock <= 12) {
    return { type: "limited", label: "badges.limitedStock" };
  }
  if (rating >= 4.8 && reviewCount > 800) {
    return { type: "bestseller", label: "badges.bestseller" };
  }
  if (rating >= 4.6) {
    return { type: "trending", label: "badges.trending" };
  }
  return null;
}

function ProductList() {
  const { t } = useTranslation();
  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist?.items || []);
  const compareItems = useSelector((state) => state.compare?.items || []);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const initialQuery = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "all";

  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  // Advanced Smart Filters
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [discountFilter, setDiscountFilter] = useState("all");
  const [sortBy, setSortBy] = useState("relevance");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Modals & Popups
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [toast, setToast] = useState({ show: false, title: "", img: "", type: "cart" });
  const [addingId, setAddingId] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Natural Language Search Parser: Extracts price and category intents directly
  const parsedSearchIntent = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return { queryText: "", priceCap: null, priceMin: null };

    let priceCap = null;
    let priceMin = null;

    const underMatch = q.match(/(?:under|below|less than|within)\s*(?:rs\.?|inr|₹)?\s*(\d+)/i);
    if (underMatch) priceCap = parseInt(underMatch[1], 10);

    const aboveMatch = q.match(/(?:above|over|more than)\s*(?:rs\.?|inr|₹)?\s*(\d+)/i);
    if (aboveMatch) priceMin = parseInt(aboveMatch[1], 10);

    // Clean search text without price phrases for keyword matching
    let cleanText = q
      .replace(/(?:under|below|less than|within|above|over|more than)\s*(?:rs\.?|inr|₹)?\s*\d+/gi, "")
      .trim();

    return { queryText: cleanText, priceCap, priceMin };
  }, [searchTerm]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products", { timeout: 8000 });
        if (Array.isArray(res.data) && res.data.length > 0) {
          setData(res.data);
        } else {
          setData(LOCAL_FALLBACK_PRODUCTS);
        }
      } catch (err) {
        setData(LOCAL_FALLBACK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Sync state with URL params
  useEffect(() => {
    const q = searchParams.get("search") || "";
    const cat = searchParams.get("category") || "all";
    setSearchTerm(q);
    setSelectedCategory(cat);
  }, [searchParams]);

  // Escape key closes mobile filter drawer
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setShowMobileFilters(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Combined Multi-Filter & Sort Pipeline
  const filteredProducts = useMemo(() => {
    let result = [...data];
    const cat = selectedCategory.toLowerCase();
    const { queryText, priceCap, priceMin } = parsedSearchIntent;

    // 1. Category Filter
    if (cat !== "all") {
      result = result.filter((p) => getProductCategory(p) === cat);
    }

    // 2. Search query filter
    if (queryText) {
      const tokens = queryText.split(/\s+/).filter(Boolean);
      result = result.filter((p) => {
        const pCat = getProductCategory(p);
        const title = (p.title || "").toLowerCase();
        const desc = (p.description || "").toLowerCase();
        return tokens.every((token) => title.includes(token) || desc.includes(token) || pCat.includes(token));
      });
    }

    // 3. Natural Language & Input Price filters
    const effectiveMaxPrice = maxPrice ? Number(maxPrice) : priceCap;
    const effectiveMinPrice = minPrice ? Number(minPrice) : priceMin;

    if (effectiveMaxPrice !== null && effectiveMaxPrice > 0) {
      result = result.filter((p) => Number(p.price) <= effectiveMaxPrice);
    }
    if (effectiveMinPrice !== null && effectiveMinPrice > 0) {
      result = result.filter((p) => Number(p.price) >= effectiveMinPrice);
    }

    // 4. Rating filter
    if (minRating !== "all") {
      const targetRating = Number(minRating);
      result = result.filter((p) => (p.rating || 4.0) >= targetRating);
    }

    // 5. Availability filter
    if (inStockOnly) {
      result = result.filter((p) => (typeof p.stock === "number" ? p.stock > 0 : true));
    }

    // 6. Discount filter (standard MRP is ~25% higher)
    if (discountFilter === "20") {
      result = result.filter((p) => true); // All products have 20%+ discount
    }

    // 7. Sorting
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "price-high":
        result.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "rating":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "newest":
        result.sort((a, b) => String(b._id).localeCompare(String(a._id)));
        break;
      default:
        // Relevance / Default order
        break;
    }

    return result;
  }, [data, selectedCategory, parsedSearchIntent, minPrice, maxPrice, minRating, inStockOnly, discountFilter, sortBy]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== "all") count++;
    if (minPrice || maxPrice || parsedSearchIntent.priceCap) count++;
    if (minRating !== "all") count++;
    if (inStockOnly) count++;
    if (discountFilter !== "all") count++;
    if (sortBy !== "relevance") count++;
    return count;
  }, [selectedCategory, minPrice, maxPrice, parsedSearchIntent, minRating, inStockOnly, discountFilter, sortBy]);

  const clearAllFilters = () => {
    setSelectedCategory("all");
    setSearchTerm("");
    setMinPrice("");
    setMaxPrice("");
    setMinRating("all");
    setInStockOnly(false);
    setDiscountFilter("all");
    setSortBy("relevance");
    setSearchParams({});
  };

  const handleToggleWishlist = async (e, product) => {
    e.stopPropagation();
    try {
      await api.get("/auth/me");
      const isWishlisted = wishlistItems.some((i) => String(i.productId || i._id) === String(product._id));
      if (isWishlisted) {
        dispatch(removeFromWishlist(product._id));
        window.dispatchEvent(
          new CustomEvent("pvx_show_toast", {
            detail: {
              title: "Removed from Wishlist",
              text: product.title,
              img: product.images?.[0] || "",
              type: "wishlist-remove",
            },
          })
        );
      } else {
        dispatch(addToWishlist(product));
        window.dispatchEvent(
          new CustomEvent("pvx_show_toast", {
            detail: {
              title: "Added to Wishlist ❤️",
              text: product.title,
              img: product.images?.[0] || "",
              type: "wishlist",
            },
          })
        );
      }
    } catch {
      navigate("/login");
    }
  };

  const handleToggleCompare = (e, product) => {
    e.stopPropagation();
    const isCompared = compareItems.some((i) => String(i._id) === String(product._id));
    if (!isCompared && compareItems.length >= 4) {
      dispatch(openCompareModal());
      return;
    }
    dispatch(addToCompare(product));
  };

  const handleAddToCart = async (e, product) => {
    e.stopPropagation();
    if (addingId) return;
    try {
      setAddingId(product._id);
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

      setToast({
        show: true,
        title: product.title,
        img: product.images?.[0] || "",
        type: "cart",
      });
      setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3500);
    } catch {
      navigate("/login");
    } finally {
      setAddingId(null);
    }
  };

  const handleIncreaseQty = async (e, product, currentQty) => {
    e.stopPropagation();
    const newQty = currentQty + 1;
    dispatch(updateQuantity({ productId: product._id, quantity: newQty }));
    try {
      await api.patch(`/cart/${product._id}`, { quantity: newQty });
    } catch {}
  };

  const handleDecreaseQty = async (e, product, currentQty) => {
    e.stopPropagation();
    if (currentQty <= 1) {
      dispatch(removeFromCart(product._id));
      try {
        await api.delete(`/cart/${product._id}`);
      } catch {}
      return;
    }
    const newQty = currentQty - 1;
    dispatch(updateQuantity({ productId: product._id, quantity: newQty }));
    try {
      await api.patch(`/cart/${product._id}`, { quantity: newQty });
    } catch {}
  };

  const availableCategories = useMemo(() => ["all", ...ALLOWED_CATEGORIES], []);

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set("search", searchTerm.trim());
    if (categoryName !== "all") params.set("category", categoryName);
    setSearchParams(params);
  };

  const showBanner = searchParams.get("banner") === "true";

  return (
    <>
      {/* SHOP HERO BANNER */}
      {showBanner && (
        <div className="shop-hero-banner">
          <div className="shop-hero-orb shop-hero-orb-1"></div>
          <div className="shop-hero-orb shop-hero-orb-2"></div>
          <svg className="shop-wave-svg" viewBox="0 0 1440 480" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path className="wave-path wave-path-1" d="M-100,240 C200,160 400,320 700,240 S1100,160 1540,240" />
            <path className="wave-path wave-path-2" d="M-100,280 C200,200 400,360 700,280 S1100,200 1540,280" />
            <path className="wave-path wave-path-3" d="M-100,200 C200,120 400,280 700,200 S1100,120 1540,200" />
            <path className="wave-path wave-path-4" d="M-100,320 C200,240 400,400 700,320 S1100,240 1540,320" />
          </svg>

          <div className="shop-hero-inner">
            <div className="shop-hero-left">
              <span className="shop-hero-eyebrow">{t("productList.bannerEyebrow")}</span>
              <h1 className="shop-hero-title">
                {t("productList.bannerTitle1")} <span className="shop-hero-accent">{t("productList.bannerTitle2")}</span><br />
                {t("productList.bannerTitle3")}<br />
                {t("productList.bannerTitle4")}
              </h1>
              <p className="shop-hero-desc">{t("productList.bannerDesc")}</p>
              <div className="shop-hero-btns">
                <button
                  className="shop-hero-btn-primary"
                  onClick={() => document.getElementById("discover-products")?.scrollIntoView({ behavior: "smooth" })}
                >
                  {t("productList.shopNow")}
                </button>
              </div>
            </div>
            <div className="shop-hero-right">
              <div className="shop-hero-card-wrap">
                <div className="shop-feature-card">
                  <span className="sfc-icon"><FaShoppingCart /></span>
                  <span className="sfc-label">{t("productList.shopLabel")}</span>
                </div>
                <div className="shop-feature-card">
                  <span className="sfc-icon"><FaStore /></span>
                  <span className="sfc-label">{t("productList.storeLabel")}</span>
                </div>
                <div className="shop-feature-card">
                  <span className="sfc-icon"><FaStar /></span>
                  <span className="sfc-label">{t("productList.featuresLabel")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="lux-page">
        {/* 🟢 TOAST NOTIFICATION POPUP */}
        {toast.show && (
          <div className="toast-popup-banner">
            <div className="toast-left">
              <span className="toast-check">
                {toast.type === "wishlist-remove" ? "💔" : toast.type === "wishlist" ? "❤️" : "✅"}
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
                <span className="toast-prod-title"><ProductTransText text={toast.title} /></span>
              </div>
            </div>
            <button
              className="toast-view-cart-btn"
              onClick={() => navigate(toast.type?.startsWith("wishlist") ? "/wishlist" : "/cart")}
            >
              {toast.type?.startsWith("wishlist") ? t("productList.viewWishlist") : t("productList.viewCart")}
            </button>
          </div>
        )}

        {/* 🪟 CATEGORY PILLS BAR */}
        <div id="discover-products" className="lux-category-section">
          <div className="lux-category-header">
            <BiCategoryAlt className="lux-cat-icon" />
            <span>{t("productList.selectCategory")}</span>
          </div>

          <div className="lux-category-pills">
            {availableCategories.map((cat) => {
              const catKey = cat.toLowerCase();
              const catLabel =
                catKey === "all"
                  ? t("header.allCategories")
                  : catKey === "electronics"
                  ? t("header.electronics")
                  : catKey === "clothes"
                  ? t("header.clothes")
                  : catKey === "sports"
                  ? t("header.sports")
                  : catKey === "shoes"
                  ? t("header.shoes")
                  : cat.charAt(0).toUpperCase() + cat.slice(1);

              return (
                <button
                  key={cat}
                  type="button"
                  className={`lux-cat-pill ${selectedCategory.toLowerCase() === catKey ? "active" : ""}`}
                  onClick={() => handleCategoryClick(cat)}
                >
                  {catLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* 🎛️ CONTROLS & ACTIVE FILTERS BAR */}
        <div className="lux-toolbar">
          <div className="lux-toolbar-left">
            <button
              type="button"
              className={`lux-mobile-filter-trigger ${activeFilterCount > 0 ? "has-filters" : ""}`}
              onClick={() => setShowMobileFilters((prev) => !prev)}
            >
              <BiSliderAlt />
              <span>{t("smartFilters.openFilters")} {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
            </button>

            <span className="lux-results-count">
              {t("smartFilters.showing")} <strong>{filteredProducts.length}</strong> {t("smartFilters.of")}{" "}
              <strong>{data.length}</strong> {t("smartFilters.products")}
            </span>
          </div>

          {/* SORT DROPDOWN */}
          <div className="lux-sort-box">
            <label htmlFor="lux-sort-select">{t("smartFilters.sortBy")}:</label>
            <select
              id="lux-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="lux-sort-select"
            >
              <option value="relevance">{t("smartFilters.relevance")}</option>
              <option value="price-low">{t("smartFilters.priceLowToHigh")}</option>
              <option value="price-high">{t("smartFilters.priceHighToLow")}</option>
              <option value="rating">{t("smartFilters.ratingHighToLow")}</option>
              <option value="newest">{t("smartFilters.newest")}</option>
            </select>
          </div>
        </div>

        {/* ACTIVE FILTER CHIPS */}
        {activeFilterCount > 0 && (
          <div className="lux-active-chips-row">
            {selectedCategory !== "all" && (
              <span className="lux-filter-chip">
                <span>{selectedCategory}</span>
                <button onClick={() => setSelectedCategory("all")}>✕</button>
              </span>
            )}
            {(minPrice || maxPrice || parsedSearchIntent.priceCap) && (
              <span className="lux-filter-chip">
                <span>
                  Price: ₹{minPrice || 0} - ₹{maxPrice || parsedSearchIntent.priceCap || "Max"}
                </span>
                <button
                  onClick={() => {
                    setMinPrice("");
                    setMaxPrice("");
                  }}
                >
                  ✕
                </button>
              </span>
            )}
            {minRating !== "all" && (
              <span className="lux-filter-chip">
                <span>{minRating}★ & above</span>
                <button onClick={() => setMinRating("all")}>✕</button>
              </span>
            )}
            {inStockOnly && (
              <span className="lux-filter-chip">
                <span>In Stock</span>
                <button onClick={() => setInStockOnly(false)}>✕</button>
              </span>
            )}
            <button className="lux-clear-all-chip" onClick={clearAllFilters}>
              {t("smartFilters.clearAll")}
            </button>
          </div>
        )}

        {/* 🏬 MAIN CONTENT: SIDEBAR + PRODUCT GRID */}
        <div className="lux-main-layout">
          {showMobileFilters && (
            <div
              className="lux-drawer-backdrop"
              onClick={() => setShowMobileFilters(false)}
              aria-hidden="true"
            />
          )}

          {/* FILTER SIDEBAR (Desktop & Mobile Drawer) */}
          <aside className={`lux-filter-sidebar ${showMobileFilters ? "drawer-open" : ""}`}>
            <div className="filter-sidebar-header">
              <h3>{t("smartFilters.filterTitle")}</h3>
              {showMobileFilters && (
                <button
                  className="filter-drawer-close-btn"
                  onClick={() => setShowMobileFilters(false)}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Price Range */}
            <div className="filter-group">
              <h4>{t("smartFilters.price")} (₹)</h4>
              <div className="price-inputs-row">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="filter-input-price"
                />
                <span>—</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="filter-input-price"
                />
              </div>
            </div>

            {/* Customer Rating */}
            <div className="filter-group">
              <h4>{t("smartFilters.customerRating")}</h4>
              <div className="rating-filter-options">
                {[
                  { val: "all", label: t("common.all") },
                  { val: "4", label: "4★ & above" },
                  { val: "3", label: "3★ & above" },
                ].map((opt) => (
                  <label key={opt.val} className="filter-radio-label">
                    <input
                      type="radio"
                      name="minRating"
                      checked={minRating === opt.val}
                      onChange={() => setMinRating(opt.val)}
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="filter-group">
              <h4>{t("smartFilters.availability")}</h4>
              <label className="filter-checkbox-label">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                />
                <span>{t("smartFilters.inStockOnly")}</span>
              </label>
            </div>

            {activeFilterCount > 0 && (
              <button className="sidebar-reset-btn" onClick={clearAllFilters}>
                {t("smartFilters.clearAll")}
              </button>
            )}

            {showMobileFilters && (
              <button
                className="sidebar-apply-btn"
                onClick={() => setShowMobileFilters(false)}
              >
                {t("smartFilters.closeFilters")}
              </button>
            )}
          </aside>

          {/* PRODUCT CARDS CONTAINER */}
          <div className="lux-products-container">
            {loading ? (
              <ProductGridSkeleton count={8} />
            ) : filteredProducts.length === 0 ? (
              <div className="lux-empty-wrap">
                <BiFilterAlt className="lux-empty-icon" />
                <p className="lux-empty">{t("smartSearch.noResultsTitle")}</p>
                <p className="lux-empty-sub">
                  {t("smartSearch.noResultsDesc", { query: searchTerm || selectedCategory })}
                </p>
                <button className="lux-reset-btn" onClick={clearAllFilters}>
                  {t("smartFilters.clearAll")}
                </button>
              </div>
            ) : (
              <div className="lux-grid">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onQuickView={setQuickViewProduct}
                    onToast={(tObj) => {
                      setToast(tObj);
                      setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3500);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* QUICK VIEW POPUP MODAL */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onShowToast={(tObj) => {
            setToast(tObj);
            setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3500);
          }}
        />
      )}
    </>
  );
}

export default ProductList;
