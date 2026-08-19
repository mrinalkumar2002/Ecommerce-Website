import React, { useEffect, useState, useMemo } from "react";
import { GoSearch } from "react-icons/go";
import { BiCategoryAlt, BiFilterAlt } from "react-icons/bi";
import { FaCartPlus, FaShoppingCart, FaStore, FaStar } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setCart, addToCart, updateQuantity, removeFromCart } from "../redux/cartSlice";
import { addToWishlist, removeFromWishlist } from "../redux/wishlistSlice";
import api from "../api";
import "./ProductList.css";
import { clothesProducts } from "../data/clothesData";
import { electronicsProducts } from "../data/electronicsData";
import { shoesProducts } from "../data/shoesData";
import { sportsProducts } from "../data/sportsData";

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

function ProductList() {
  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist?.items || []);
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const initialQuery = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "all";

  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [addingId, setAddingId] = useState(null);
  const [toast, setToast] = useState({ show: false, title: "", img: "", type: "cart" });

  async function handleToggleWishlist(e, product) {
    e.stopPropagation();
    try {
      await api.get("/auth/me");
      const isWishlisted = wishlistItems.some((i) => String(i.productId || i._id) === String(product._id));
      if (isWishlisted) {
        dispatch(removeFromWishlist(product._id));
        setToast({
          show: true,
          title: product.title,
          img: product.images?.[0] || "",
          type: "wishlist-remove"
        });
      } else {
        dispatch(addToWishlist(product));
        setToast({
          show: true,
          title: product.title,
          img: product.images?.[0] || "",
          type: "wishlist"
        });
      }
      setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 3500);
    } catch {
      navigate("/login");
    }
  }

  async function handleAddToCart(e, product) {
    e.stopPropagation(); // Card click navigation prevent
    if (addingId) return;
    try {
      setAddingId(product._id);
      
      // 🔒 1. Check if user is logged in
      await api.get("/auth/me");

      // 2. If logged in, add to cart
      dispatch(addToCart({ ...product, quantity: 1 }));
      try {
        await api.post("/cart/add", {
          productId: product._id,
          title: product.title,
          price: product.price,
          images: product.images,
          quantity: 1,
        });
      } catch {
        // API fallback
      }

      // ✨ Show Pop-up notification instead of navigating
      setToast({
        show: true,
        title: product.title,
        img: product.images?.[0] || "",
        type: "cart"
      });

      setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 3500);

    } catch (err) {
      // 🔒 Not logged in -> redirect to login page
      navigate("/login");
    } finally {
      setAddingId(null);
    }
  }

  async function handleIncreaseQty(e, product, currentQty) {
    e.stopPropagation();
    const newQty = currentQty + 1;
    dispatch(updateQuantity({ productId: product._id, quantity: newQty }));
    try {
      await api.patch(`/cart/${product._id}`, { quantity: newQty });
    } catch {}
  }

  async function handleDecreaseQty(e, product, currentQty) {
    e.stopPropagation();
    if (currentQty <= 1) {
      // Remove from cart when decreased from 1
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
  }

  function handleDetail(id) {
    navigate(`/productdetail/${id}`);
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products", { timeout: 8000 });
        if (Array.isArray(res.data) && res.data.length > 0) {
          setData(res.data);
        } else {
          // Backend returned empty — use local fallback
          console.warn("Backend returned no products, using local data.");
          setData(LOCAL_FALLBACK_PRODUCTS);
        }
      } catch (err) {
        // API failed or timed out — use local fallback so products always show
        console.warn("Backend unavailable, loading local products.", err.message);
        setData(LOCAL_FALLBACK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Preset requested categories
  const availableCategories = useMemo(() => {
    return ["all", ...ALLOWED_CATEGORIES];
  }, []);

  // Sync state with URL params
  useEffect(() => {
    const q = searchParams.get("search") || "";
    const cat = searchParams.get("category") || "all";
    setSearchTerm(q);
    setSelectedCategory(cat);
  }, [searchParams]);

  // Sync category pill based on search input keystrokes dynamically
  useEffect(() => {
    const CATEGORY_MAPPING = {
      "shoe": "shoes",
      "shoes": "shoes",
      "footwear": "shoes",
      "sneaker": "shoes",
      "sneakers": "shoes",
      "electronic": "electronics",
      "electronics": "electronics",
      "tech": "electronics",
      "cloth": "clothes",
      "clothes": "clothes",
      "clothing": "clothes",
      "sport": "sports",
      "sports": "sports",
      "gym": "sports",
      "fitness": "sports",
    };

    const cleanTerm = searchTerm.toLowerCase().trim();
    if (CATEGORY_MAPPING[cleanTerm]) {
      setSelectedCategory(CATEGORY_MAPPING[cleanTerm]);
    } else if (cleanTerm === "" || cleanTerm === "all") {
      const urlCat = searchParams.get("category") || "all";
      setSelectedCategory(urlCat);
    }
  }, [searchTerm, searchParams]);

  // Combined search & category filtering
  useEffect(() => {
    const q = searchTerm.toLowerCase().trim();
    const cat = selectedCategory.toLowerCase();

    setFiltered(
      data.filter((p) => {
        const pCat = getProductCategory(p);
        const matchesCategory = cat === "all" || pCat === cat;
        const matchesSearch =
          !q ||
          p.title?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          pCat.includes(q) ||
          q.includes(pCat);
        return matchesCategory && matchesSearch;
      })
    );
  }, [data, searchTerm, selectedCategory]);

  function updateQueryParams(newSearch, newCategory) {
    const params = {};
    if (newSearch && newSearch.trim()) params.search = newSearch.trim();
    if (newCategory && newCategory !== "all") params.category = newCategory;
    const bannerVal = searchParams.get("banner");
    if (bannerVal) params.banner = bannerVal;
    setSearchParams(params);
  }

  function handleSearchInputChange(e) {
    const val = e.target.value;
    setSearchTerm(val);
    // URL only updates on submit — not on every keystroke
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    updateQueryParams(searchTerm, selectedCategory);
  }

  function handleCategoryClick(categoryName) {
    setSelectedCategory(categoryName);
    updateQueryParams(searchTerm, categoryName);
  }

  if (loading) {
    return (
      <div className="lux-loader-screen">
        <div className="lux-spinner" />
        <span>Loading products...</span>
      </div>
    );
  }

  const showBanner = searchParams.get("banner") === "true";

  return (
    <>
      {/* SHOP HERO BANNER */}
      {showBanner && (
        <div className="shop-hero-banner">
          <div className="shop-hero-orb shop-hero-orb-1"></div>
          <div className="shop-hero-orb shop-hero-orb-2"></div>

          {/* Animated wave lines */}
          <svg className="shop-wave-svg" viewBox="0 0 1440 480" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path className="wave-path wave-path-1" d="M-100,240 C200,160 400,320 700,240 S1100,160 1540,240" />
            <path className="wave-path wave-path-2" d="M-100,280 C200,200 400,360 700,280 S1100,200 1540,280" />
            <path className="wave-path wave-path-3" d="M-100,200 C200,120 400,280 700,200 S1100,120 1540,200" />
            <path className="wave-path wave-path-4" d="M-100,320 C200,240 400,400 700,320 S1100,240 1540,320" />
            <path className="wave-path wave-path-5" d="M-100,160 C200,80  400,240 700,160 S1100,80  1540,160" />
            <path className="wave-path wave-path-6" d="M-100,360 C200,280 400,440 700,360 S1100,280 1540,360" />
            <path className="wave-path wave-path-7" d="M-100,120 C200,40  400,200 700,120 S1100,40  1540,120" />
            <path className="wave-path wave-path-8" d="M-100,400 C200,320 400,460 700,400 S1100,320 1540,400" />
          </svg>

          <div className="shop-hero-inner">
            <div className="shop-hero-left">
              <span className="shop-hero-eyebrow">SHOPPYGLOBE ECOMMERCE</span>
              <h1 className="shop-hero-title">
                Unlock <span className="shop-hero-accent">boundless</span><br />
                shopping with<br />
                premium products
              </h1>
              <p className="shop-hero-desc">
                ShoppyGlobe is a powerful solution for building and managing product stores, and customers care that.
              </p>
              <div className="shop-hero-btns">
                <button className="shop-hero-btn-primary" onClick={() => navigate('/productlist?banner=true')}>Shop Now</button>
                <button className="shop-hero-btn-ghost" onClick={() => document.getElementById('discover-products')?.scrollIntoView({ behavior: 'smooth' })}>
                  Explore products →
                </button>
              </div>
              <div className="shop-hero-stats">
                <div className="shop-stat">
                  <strong>10K+</strong>
                  <span>Users</span>
                </div>
                <div className="shop-stat-divider"></div>
                <div className="shop-stat">
                  <strong>5K+</strong>
                  <span>Products</span>
                </div>
                <div className="shop-stat-divider"></div>
                <div className="shop-stat">
                  <strong>99.9%</strong>
                  <span>Uptime</span>
                </div>
              </div>
            </div>
            <div className="shop-hero-right">
              <div className="shop-hero-card-wrap">
                <div className="shop-feature-card">
                  <span className="sfc-icon">🛒</span>
                  <span className="sfc-label">SHOP</span>
                </div>
                <div className="shop-feature-card">
                  <span className="sfc-icon">🏪</span>
                  <span className="sfc-label">STORE</span>
                </div>
                <div className="shop-feature-card">
                  <span className="sfc-icon">⭐</span>
                  <span className="sfc-label">FEATURES</span>
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
                    ? "Removed from Wishlist"
                    : toast.type === "wishlist"
                    ? "Added to Wishlist!"
                    : "Item Added to Cart!"}
                </strong>
                <span className="toast-prod-title">{toast.title}</span>
              </div>
            </div>
            <button 
              className="toast-view-cart-btn" 
              onClick={() => navigate(toast.type?.startsWith("wishlist") ? "/wishlist" : "/cart")}
            >
              {toast.type?.startsWith("wishlist") ? "❤️ View Wishlist" : "🛒 View Cart"}
            </button>
          </div>
        )}

        <div id="discover-products">
          {/* CATEGORY BUTTONS / PILLS */}
          <div className="lux-category-section">
            <div className="lux-category-header">
              <BiCategoryAlt className="lux-cat-icon" />
              <span>Select Category:</span>
            </div>

            <div className="lux-category-pills">
              {availableCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`lux-cat-pill ${
                    selectedCategory.toLowerCase() === cat.toLowerCase()
                      ? "active"
                      : ""
                  }`}
                  onClick={() => handleCategoryClick(cat)}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="lux-empty-wrap">
            <BiFilterAlt className="lux-empty-icon" />
            <p className="lux-empty">No products match your criteria</p>
          </div>
        ) : (
          <div className="lux-grid">
            {filtered.map((product) => {
              const isWishlisted = wishlistItems.some((i) => String(i.productId || i._id) === String(product._id));
              return (
                <article
                  key={product._id}
                  className="lux-card"
                  onClick={() => handleDetail(product._id)}
                >
                  <div 
                    className="lux-media"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDetail(product._id);
                    }}
                    title="Click to view product details"
                  >
                    <button
                      type="button"
                      className={`lux-card-heart-btn ${isWishlisted ? "active" : ""}`}
                      onClick={(e) => handleToggleWishlist(e, product)}
                      title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                    >
                      {isWishlisted ? "❤️" : "🤍"}
                    </button>

                    <span className="lux-badge">{getProductCategory(product)}</span>
                  <img
                    src={
                      product.images?.length
                        ? product.images[0]
                        : `https://picsum.photos/seed/${product._id}/600/400`
                    }
                    alt={product.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://picsum.photos/seed/${product._id}/600/400`;
                    }}
                  />
                </div>

                <div className="lux-body">
                  <h3>{product.title}</h3>
                  <p>
                    {product.description?.length > 90
                      ? product.description.slice(0, 90) + "…"
                      : product.description}
                  </p>
                </div>

                <footer className="lux-footer">
                  <span className="lux-price">₹{product.price}</span>
                  <div className="lux-footer-actions">
                    {(() => {
                      const cartItem = cartItems.find((i) => String(i.productId || i._id) === String(product._id));
                      if (cartItem) {
                        return (
                          <div className="lux-qty-control" onClick={(e) => e.stopPropagation()}>
                            <button
                              className="lux-qty-btn"
                              onClick={(e) => handleDecreaseQty(e, product, cartItem.quantity)}
                              title={cartItem.quantity === 1 ? "Remove from cart" : "Decrease quantity"}
                            >
                              −
                            </button>
                            <span className="lux-qty-val">{cartItem.quantity}</span>
                            <button
                              className="lux-qty-btn"
                              onClick={(e) => handleIncreaseQty(e, product, cartItem.quantity)}
                              title="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                        );
                      }
                      return (
                        <button
                          className="lux-cart-btn"
                          onClick={(e) => handleAddToCart(e, product)}
                          disabled={addingId === product._id}
                        >
                          <FaCartPlus />
                          {addingId === product._id ? "Adding…" : "Add to Cart"}
                        </button>
                      );
                    })()}
                    <span className="lux-link">Explore →</span>
                  </div>
                </footer>
              </article>
            );
          })}
          </div>
        )}
      </section>
    </>
  );
}

export default ProductList;

