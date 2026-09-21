import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCart, updateQuantity, removeFromCart, addToCart } from "../redux/cartSlice";
import { addToWishlist } from "../redux/wishlistSlice";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import "./Cart.css";
import { useTranslation } from "react-i18next";
import ProductTransText from "./ProductTransText";
import { getProductReviews } from "../data/productReviews";
import { CartSkeleton } from "./SkeletonLoader";

function StarRating({ rating }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const filled = i <= Math.floor(rating);
    const half   = !filled && i === Math.ceil(rating) && rating % 1 >= 0.4;
    stars.push(
      <span key={i} className={`cart-star ${filled ? "star-full" : half ? "star-half" : "star-empty"}`}>
        {filled ? "★" : half ? "⯨" : "☆"}
      </span>
    );
  }
  return <span className="cart-star-row">{stars}</span>;
}

const PHONE_IDS   = new Set(["elec-001","elec-002","elec-015","elec-029","elec-030","elec-045"]);
const LAPTOP_IDS  = new Set(["elec-003","elec-007","elec-012","elec-028","elec-034","elec-036"]);
const HEADPH_IDS  = new Set(["elec-004","elec-009","elec-023","elec-037","elec-047"]);
const TABLET_IDS  = new Set(["elec-006","elec-013","elec-022","elec-041"]);
const GAMING_IDS  = new Set(["elec-005","elec-026","elec-043","elec-044","elec-049"]);

function detectCartCategory(item) {
  const title = (item.title || "").toLowerCase();
  const id    = String(item.productId || "");

  if (title.includes("iphone") || title.includes("galaxy s") || PHONE_IDS.has(id)) return "phone";
  if (title.includes("laptop") || title.includes("macbook") || LAPTOP_IDS.has(id)) return "laptop";
  if (title.includes("headphone") || title.includes("earbuds") || HEADPH_IDS.has(id)) return "headphone";
  if (title.includes("tablet") || title.includes("ipad") || TABLET_IDS.has(id)) return "tablet";
  if (title.includes("playstation") || title.includes("xbox") || GAMING_IDS.has(id)) return "gaming";
  if (title.includes("shoe") || title.includes("sneaker") || id.startsWith("shoe")) return "shoe";
  if (title.includes("shirt") || title.includes("dress") || id.startsWith("clot")) return "cloth";
  if (title.includes("sport") || title.includes("gym") || id.startsWith("spor")) return "sport";
  return null;
}

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const { t } = useTranslation();

  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, title: "", type: "cart" });

  // 🏷️ Dynamic Coupon State
  const [couponInput, setCouponInput] = useState("");
  const [publicCoupons, setPublicCoupons] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      const saved = sessionStorage.getItem("pvx_applied_coupon");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [couponMsg, setCouponMsg] = useState({ text: "", type: "" });

  useEffect(() => {
    api.get("/public/coupons")
      .then((res) => setPublicCoupons(res.data || []))
      .catch(() => {});

    const cartPromise = api.get("/cart")
      .then((res) => {
        if (res.data?.cart?.items?.length) {
          dispatch(setCart(res.data.cart.items));
        }
      })
      .catch(() => {});

    const productsPromise = api.get("/products")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setAllProducts(res.data);
        }
      })
      .catch(() => {});

    Promise.allSettled([cartPromise, productsPromise]).finally(() => {
      setLoading(false);
    });
  }, [dispatch]);

  const increase = async (item) => {
    const newQty = item.quantity + 1;
    dispatch(updateQuantity({ productId: item.productId, quantity: newQty }));
    try {
      await api.patch(`/cart/${item.productId}`, { quantity: newQty });
    } catch {}
  };

  const decrease = async (item) => {
    const newQty = item.quantity - 1;
    if (newQty <= 0) {
      dispatch(removeFromCart(item.productId));
      try {
        await api.delete(`/cart/${item.productId}`);
      } catch {}
      return;
    }
    dispatch(updateQuantity({ productId: item.productId, quantity: newQty }));
    try {
      await api.patch(`/cart/${item.productId}`, { quantity: newQty });
    } catch {}
  };

  const remove = async (item) => {
    dispatch(removeFromCart(item.productId));
    try {
      await api.delete(`/cart/${item.productId}`);
    } catch {}
  };

  const handleMoveToWishlist = async (item) => {
    try {
      await api.get("/auth/me");
      dispatch(addToWishlist({
        _id: item.productId,
        title: item.title,
        price: item.price,
        images: item.images,
      }));
      dispatch(removeFromCart(item.productId));
      try {
        await api.delete(`/cart/${item.productId}`);
      } catch {}

      setToast({
        show: true,
        title: item.title,
        type: "wishlist",
      });
      setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
    } catch {
      navigate("/login");
    }
  };

  const quickAdd = async (e, product) => {
    e.stopPropagation();
    try {
      await api.get("/auth/me");
      dispatch(addToCart({ ...product, quantity: 1 }));
      try {
        await api.post("/cart/add", { productId: product._id, quantity: 1 });
      } catch {}

      setToast({
        show: true,
        title: product.title,
        type: "cart",
      });
      setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
    } catch {
      navigate("/login");
    }
  };

  // Calculations
  const rawSubtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
    0
  );
  const totalMRP = Math.round(rawSubtotal * 1.25);
  const catalogDiscount = totalMRP - rawSubtotal;

  // Coupon Calculation
  let couponDiscountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountAmount !== undefined) {
      couponDiscountAmount = appliedCoupon.discountAmount;
    } else if (appliedCoupon.discountType === "percentage") {
      couponDiscountAmount = Math.round((rawSubtotal * appliedCoupon.discountValue) / 100);
    } else if (appliedCoupon.discountType === "fixed") {
      couponDiscountAmount = appliedCoupon.discountValue;
    } else if (appliedCoupon.code === "SAVE10") {
      couponDiscountAmount = Math.round(rawSubtotal * 0.1);
    } else if (appliedCoupon.code === "SHOPPY20" && rawSubtotal >= 1000) {
      couponDiscountAmount = Math.round(rawSubtotal * 0.2);
    }
  }

  const finalTotal = Math.max(0, rawSubtotal - couponDiscountAmount);
  const totalSavings = catalogDiscount + couponDiscountAmount;

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    const cleanCode = couponInput.trim().toUpperCase();
    if (!cleanCode) return;

    try {
      const res = await api.post("/public/coupons/validate", { code: cleanCode, cartTotal: rawSubtotal });
      if (res.data && res.data.success) {
        const couponObj = res.data.coupon;
        setAppliedCoupon(couponObj);
        sessionStorage.setItem("pvx_applied_coupon", JSON.stringify(couponObj));
        setCouponMsg({ text: res.data.message || `Coupon ${cleanCode} applied!`, type: "success" });
        return;
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message;
      if (errorMsg) {
        setCouponMsg({ text: errorMsg, type: "error" });
        return;
      }
    }

    // Local Fallback if API offline or hardcoded codes
    if (cleanCode === "SAVE10") {
      const couponObj = { code: "SAVE10", discountPercent: 10, discountAmount: Math.round(rawSubtotal * 0.1) };
      setAppliedCoupon(couponObj);
      sessionStorage.setItem("pvx_applied_coupon", JSON.stringify(couponObj));
      setCouponMsg({ text: t("coupons.validSave10"), type: "success" });
    } else if (cleanCode === "SHOPPY20") {
      if (rawSubtotal < 1000) {
        setCouponMsg({ text: "SHOPPY20 requires a minimum cart total of ₹1,000", type: "error" });
        return;
      }
      const couponObj = { code: "SHOPPY20", discountPercent: 20, discountAmount: Math.round(rawSubtotal * 0.2) };
      setAppliedCoupon(couponObj);
      sessionStorage.setItem("pvx_applied_coupon", JSON.stringify(couponObj));
      setCouponMsg({ text: t("coupons.validShoppy20"), type: "success" });
    } else {
      setCouponMsg({ text: t("coupons.invalid") || "Invalid or expired coupon code", type: "error" });
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    sessionStorage.removeItem("pvx_applied_coupon");
    setCouponInput("");
    setCouponMsg({ text: "", type: "" });
  };

  // Collect Recommended Similar Products
  const cartProductIds = new Set(cartItems.map((i) => String(i.productId)));
  const presentCategories = new Set();
  for (const item of cartItems) {
    const cat = detectCartCategory(item);
    if (cat) presentCategories.add(cat);
  }

  let combinedExploreProducts = [];
  if (presentCategories.size > 0) {
    presentCategories.forEach((cat) => {
      const catProducts = allProducts.filter(
        (p) => detectCartCategory({ title: p.title, productId: p._id }) === cat
      );
      combinedExploreProducts.push(...catProducts);
    });
  } else {
    combinedExploreProducts = allProducts.filter(
      (p) => (p.category || "").toLowerCase() === "electronics"
    );
  }

  const uniqueExploreMap = new Map();
  combinedExploreProducts.forEach((p) => {
    if (!cartProductIds.has(String(p._id))) {
      uniqueExploreMap.set(String(p._id), p);
    }
  });
  const exploreProducts = Array.from(uniqueExploreMap.values()).slice(0, 4);

  if (loading) return <CartSkeleton />;

  return (
    <section className="cart-page">
      {/* TOAST POPUP */}
      {toast.show && (
        <div className="toast-popup-banner">
          <div className="toast-left">
            <span className="toast-check">{toast.type === "wishlist" ? "💙" : "✅"}</span>
            <div className="toast-info">
              <strong>
                {toast.type === "wishlist" ? t("productList.addedToWishlist") : t("productList.itemAddedToCart")}
              </strong>
              <span className="toast-prod-title"><ProductTransText text={toast.title} /></span>
            </div>
          </div>
          <button
            className="toast-view-cart-btn"
            onClick={() => navigate(toast.type === "wishlist" ? "/wishlist" : "/cart")}
          >
            {toast.type === "wishlist" ? t("productList.viewWishlist") : t("productList.viewCart")}
          </button>
        </div>
      )}

      <Link to="/productlist" className="cart-back">
        {t("cart.continueShopping")}
      </Link>

      <h1 className="cart-title">{t("cart.shoppingCart")}</h1>

      {/* 📊 CART STAT CARDS BAR */}
      {cartItems.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "24px" }}>
          <div style={{ background: "#ffffff", border: "1px solid #E5DED6", borderRadius: "14px", padding: "16px 20px", display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "#EFF6FF", color: "#3B82F6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
              💳
            </div>
            <div>
              <span style={{ fontSize: "12px", color: "#66615C", fontWeight: "700", display: "block" }}>Cart Subtotal</span>
              <strong style={{ fontSize: "20px", color: "#1F1F1F" }}>₹{rawSubtotal.toLocaleString()}</strong>
            </div>
          </div>

          <div style={{ background: "#ffffff", border: "1px solid #E5DED6", borderRadius: "14px", padding: "16px 20px", display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "#F5F3FF", color: "#8B5CF6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
              🏷️
            </div>
            <div>
              <span style={{ fontSize: "12px", color: "#66615C", fontWeight: "700", display: "block" }}>Applied Coupon Savings</span>
              <strong style={{ fontSize: "20px", color: couponDiscountAmount > 0 ? "#10B981" : "#1F1F1F" }}>
                {couponDiscountAmount > 0 ? `- ₹${couponDiscountAmount.toLocaleString()}` : "₹0"}
              </strong>
            </div>
          </div>

          <div style={{ background: "#ffffff", border: "1px solid #E5DED6", borderRadius: "14px", padding: "16px 20px", display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "#ECFDF5", color: "#10B981", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
              🚚
            </div>
            <div>
              <span style={{ fontSize: "12px", color: "#66615C", fontWeight: "700", display: "block" }}>Free Shipping</span>
              <strong style={{ fontSize: "15px", color: "#10B981" }}>You're eligible!</strong>
            </div>
          </div>
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="cart-empty-wrap">
          <p className="cart-empty">{t("cart.cartEmpty")}</p>
          <Link to="/productlist" className="cart-shop-btn">
            {t("cart.discoverProducts")}
          </Link>
        </div>
      ) : (
        <div className="cart-grid">
          {/* LEFT: CART ITEMS LIST */}
          <div className="cart-list">
            {/* 🌟 SAVINGS BANNER */}
            {totalSavings > 0 && (
              <div className="cart-savings-banner">
                <span>🎉</span>
                <div>
                  <strong>You are saving ₹{totalSavings.toLocaleString()} on this order!</strong>
                  <small>Includes special catalogue discounts and applied coupons.</small>
                </div>
              </div>
            )}

            {cartItems.map((item) => {
              const itemTotal = (item.price * item.quantity).toFixed(2);
              const { rating, reviewCount } = getProductReviews(item.productId);
              return (
                <div
                  className="cart-card cart-card-clickable"
                  key={item.productId}
                  onClick={() =>
                    item.productId &&
                    item.productId !== "undefined" &&
                    navigate(`/productdetail/${item.productId}`)
                  }
                  title={t("cart.clickToView")}
                >
                  <img
                    src={item.images?.[0] || `https://picsum.photos/seed/${item.productId}/200/200`}
                    alt={item.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://picsum.photos/seed/${item.productId}/200/200`;
                    }}
                  />

                  <div className="cart-info">
                    <h3 className="cart-item-title">
                      <ProductTransText text={item.title} />
                    </h3>

                    <div className="cart-item-rating">
                      <StarRating rating={rating} />
                      <span className="cart-rating-score">{rating}</span>
                      <span className="cart-rating-count">
                        ({reviewCount ? reviewCount.toLocaleString() : "1,200"} {t("cart.ratings")})
                      </span>
                    </div>

                    <div className="cart-price-details">
                      <span className="unit-price">
                        ₹{Number(item.price).toLocaleString()} {t("cart.each")}
                      </span>
                      <span className="item-subtotal">
                        {t("cart.itemTotal")}: ₹{Number(itemTotal).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="cart-actions-right">
                    <div className="cart-actions-row">
                      <div className="qty" onClick={(e) => e.stopPropagation()}>
                        <button onClick={(e) => { e.stopPropagation(); decrease(item); }}>−</button>
                        <span>{item.quantity}</span>
                        <button onClick={(e) => { e.stopPropagation(); increase(item); }}>+</button>
                      </div>

                      <button
                        className="cart-wishlist-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveToWishlist(item);
                        }}
                        title="Move to Wishlist"
                      >
                        💙 Move to Wishlist
                      </button>

                      <button
                        className="remove"
                        onClick={(e) => {
                          e.stopPropagation();
                          remove(item);
                        }}
                      >
                        {t("cart.remove")}
                      </button>
                    </div>

                    <button
                      className="buy-this-now-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/checkout", {
                          state: { singleItem: item, appliedCoupon },
                        });
                      }}
                    >
                      {t("cart.buyThisNow")}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT: PRICE DETAILS & COUPON BOX */}
          <aside className="summary">
            <h2>{t("cart.priceDetails")}</h2>

            {/* 🎟️ COUPON CODE INPUT */}
            <div className="cart-coupon-box">
              <label>{t("coupons.title")}</label>
              {!appliedCoupon ? (
                <form onSubmit={handleApplyCoupon} className="coupon-form">
                  <input
                    type="text"
                    placeholder={t("coupons.placeholder")}
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="coupon-input"
                  />
                  <button type="submit" className="coupon-apply-btn">
                    {t("coupons.apply")}
                  </button>
                </form>
              ) : (
                <div className="coupon-applied-pill">
                  <div className="coupon-applied-left">
                    <span className="coupon-tag-icon">🏷️</span>
                    <div>
                      <strong>{appliedCoupon.code}</strong>
                      <small>{t("coupons.applied")}</small>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="coupon-remove-btn"
                    onClick={handleRemoveCoupon}
                  >
                    {t("coupons.remove")}
                  </button>
                </div>
              )}

              {couponMsg.text && (
                <span className={`coupon-msg ${couponMsg.type}`}>
                  {couponMsg.text}
                </span>
              )}

              {/* Available Store Offers */}
              {!appliedCoupon && publicCoupons.length > 0 && (
                <div style={{ marginTop: "12px" }}>
                  <span style={{ fontSize: "11px", fontWeight: "700", color: "#8B5E3C", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: "6px" }}>
                    🎁 Available Store Coupons:
                  </span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {publicCoupons.map((cp) => (
                      <button
                        key={cp.code}
                        type="button"
                        onClick={() => {
                          setCouponInput(cp.code);
                          // Auto trigger apply
                          api.post("/public/coupons/validate", { code: cp.code, cartTotal: rawSubtotal })
                            .then((res) => {
                              if (res.data.success) {
                                setAppliedCoupon(res.data.coupon);
                                sessionStorage.setItem("pvx_applied_coupon", JSON.stringify(res.data.coupon));
                                setCouponMsg({ text: `Coupon ${cp.code} applied successfully!`, type: "success" });
                              }
                            })
                            .catch((err) => {
                              setCouponMsg({ text: err.response?.data?.message || "Cannot apply coupon", type: "error" });
                            });
                        }}
                        style={{
                          background: "#FAF8F5",
                          border: "1px dashed #8B5E3C",
                          color: "#8B5E3C",
                          borderRadius: "8px",
                          padding: "4px 8px",
                          fontSize: "11.5px",
                          fontWeight: "800",
                          cursor: "pointer",
                          transition: "all 0.15s ease"
                        }}
                      >
                        🏷️ {cp.code} ({cp.discountType === "percentage" ? `${cp.discountValue}% OFF` : `₹${cp.discountValue} OFF`})
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="row">
              <span className="row-label">
                Total MRP ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} {t("cart.items")})
                <small className="tax-subtext">{t("cart.inclTaxes")}</small>
              </span>
              <span className="amount">₹{totalMRP.toLocaleString()}</span>
            </div>

            <div className="row discount-row">
              <span className="discount-label">Catalogue Discount</span>
              <span className="discount-amount">− ₹{catalogDiscount.toLocaleString()}</span>
            </div>

            {couponDiscountAmount > 0 && (
              <div className="row discount-row coupon-row">
                <span className="discount-label">🏷️ {t("coupons.discountLabel")} ({appliedCoupon.code})</span>
                <span className="discount-amount">− ₹{couponDiscountAmount.toLocaleString()}</span>
              </div>
            )}

            <div className="row">
              <span className="row-label">Delivery Charges</span>
              <span className="amount free-text">FREE</span>
            </div>

            <div className="divider" />

            <div className="total">
              <span className="total-label">{t("cart.totalAmount")}</span>
              <strong className="total-val">₹{finalTotal.toLocaleString()}</strong>
            </div>

            <button
              className="checkout"
              onClick={() => navigate("/checkout", { state: { appliedCoupon } })}
            >
              {t("cart.proceedToPayment")}
            </button>
          </aside>
        </div>
      )}

      {/* ===== RECOMMENDED SIMILAR PRODUCTS ===== */}
      {cartItems.length > 0 && exploreProducts.length > 0 && (
        <div className="explore-container">
          <div className="explore-section">
            <div className="explore-header">
              <h2>✨ {t("cart.viewSimilar")}</h2>
              <p>{t("cart.similarSubtext")}</p>
            </div>

            <div className="explore-grid">
              {exploreProducts.map((p) => (
                <div
                  className="explore-card"
                  key={p._id}
                  onClick={() => navigate(`/productdetail/${p._id}`)}
                >
                  <div className="explore-media">
                    <img
                      src={p.images?.[0] || `https://picsum.photos/seed/${p._id}/400/300`}
                      alt={p.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://picsum.photos/seed/${p._id}/400/300`;
                      }}
                    />
                  </div>
                  <div className="explore-body">
                    <h4>
                      <ProductTransText text={p.title} />
                    </h4>
                    <span className="explore-price">₹{Number(p.price).toLocaleString()}</span>
                  </div>
                  <button className="explore-add-btn" onClick={(e) => quickAdd(e, p)}>
                    {t("cart.addToCart")}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Cart;
