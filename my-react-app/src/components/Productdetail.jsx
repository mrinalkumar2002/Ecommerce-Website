import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setCart, addToCart, updateQuantity, removeFromCart } from "../redux/cartSlice";
import { addToWishlist, removeFromWishlist } from "../redux/wishlistSlice";
import "./Productdetail.css";
import api from "../api";
import { getProductReviews } from "../data/productReviews";
import { useTranslation } from "react-i18next";
import ProductTransText from "./ProductTransText";

// Electronics sub-category ID sets for related products
const PHONE_IDS   = new Set(["elec-001","elec-002","elec-015","elec-029","elec-030","elec-045"]);
const LAPTOP_IDS  = new Set(["elec-003","elec-007","elec-012","elec-028","elec-034","elec-036"]);
const HEADPH_IDS  = new Set(["elec-004","elec-009","elec-023","elec-037","elec-047"]);
const TABLET_IDS  = new Set(["elec-006","elec-013","elec-022","elec-041"]);
const GAMING_IDS  = new Set(["elec-005","elec-026","elec-043","elec-044","elec-049"]);
const WATCH_IDS   = new Set(["elec-008","elec-035"]);
const CAMERA_IDS  = new Set(["elec-011","elec-018","elec-019","elec-031"]);
const TV_IDS      = new Set(["elec-010","elec-020","elec-025","elec-033","elec-051"]);
const SPEAKER_IDS = new Set(["elec-014","elec-024","elec-032","elec-042","elec-048"]);

const ELEC_SUBCATS = [
  { ids: PHONE_IDS,   label: "Phones" },
  { ids: LAPTOP_IDS,  label: "Laptops" },
  { ids: HEADPH_IDS,  label: "Headphones" },
  { ids: TABLET_IDS,  label: "Tablets" },
  { ids: GAMING_IDS,  label: "Gaming" },
  { ids: WATCH_IDS,   label: "Watches" },
  { ids: CAMERA_IDS,  label: "Cameras" },
  { ids: TV_IDS,      label: "TVs" },
  { ids: SPEAKER_IDS, label: "Speakers" },
];

// Helper function to extract related products from a dynamically provided full list
function getRelatedProductsFromList(currentProduct, allProducts) {
  if (!currentProduct || !allProducts || allProducts.length === 0) return [];
  const id = String(currentProduct._id);
  const cat = (currentProduct.category || "").toLowerCase();

  // Shoes / Clothes / Sports
  if (cat.includes("shoe") || id.startsWith("shoe")) {
    return allProducts.filter((p) => (p.category || "").toLowerCase().includes("shoe") && String(p._id) !== id).slice(0, 8);
  }
  if (cat.includes("cloth") || id.startsWith("clot")) {
    return allProducts.filter((p) => (p.category || "").toLowerCase().includes("cloth") && String(p._id) !== id).slice(0, 8);
  }
  if (cat.includes("sport") || id.startsWith("spor")) {
    return allProducts.filter((p) => (p.category || "").toLowerCase().includes("sport") && String(p._id) !== id).slice(0, 8);
  }

  // Electronics — find matching sub-category by ID whitelist
  for (const subcat of ELEC_SUBCATS) {
    if (subcat.ids.has(id)) {
      return allProducts
        .filter((p) => subcat.ids.has(String(p._id)) && String(p._id) !== id)
        .slice(0, 8);
    }
  }

  // Fallback if not found in specific subcategory (e.g. for dynamic products)
  return allProducts.filter((p) => (p.category || "").toLowerCase() === cat && String(p._id) !== id).slice(0, 8);
}


// Precision Star rendering with decimal fill support
function StarRating({ rating = 0, size = "md", showScore = false }) {
  const num = Math.max(0, Math.min(5, Number(rating) || 0));
  const stars = [1, 2, 3, 4, 5].map((index) => {
    const fillPercent = Math.max(0, Math.min(100, Math.round((num - (index - 1)) * 100)));
    return (
      <span key={index} className={`star-item star-${size}`} aria-hidden="true">
        <span className="star-empty-layer">★</span>
        <span className="star-fill-layer" style={{ width: `${fillPercent}%` }}>★</span>
      </span>
    );
  });

  return (
    <div className={`star-row star-row-${size}`} role="img" aria-label={`${num.toFixed(1)} out of 5 stars`}>
      <div className="star-glyphs">{stars}</div>
      {showScore && <span className="star-score-text">{num.toFixed(1)}</span>}
    </div>
  );
}

// Compute exact rating distribution from actual reviews array
function computeRatingDistribution(reviews = []) {
  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  const total = Array.isArray(reviews) ? reviews.length : 0;

  if (total > 0) {
    reviews.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(Number(r.rating) || 5)));
      counts[star] = (counts[star] || 0) + 1;
    });
  }

  return [5, 4, 3, 2, 1].map((star) => {
    const count = counts[star] || 0;
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
    return {
      star,
      count,
      percentage,
    };
  });
}

function getProductSpecs(product, t) {
  if (!product) return {};
  const title = product.title || "";
  const cat = (product.category || "").toLowerCase();
  const id = String(product._id || "");

  const brandKeywords = [
    "Apple", "Samsung", "Sony", "Google", "OnePlus", "Nothing", "Xiaomi", "Dell", "ASUS",
    "Nike", "Adidas", "Puma", "Reebok", "Levi's", "Tommy Hilfiger", "Decathlon", "Canon", "GoPro", "DJI", "Bose", "JBL", "Marshall"
  ];
  let brand = "Premium Brand";
  for (const b of brandKeywords) {
    if (title.toLowerCase().includes(b.toLowerCase())) {
      brand = b;
      break;
    }
  }

  let model = title.split("(")[0].replace(new RegExp(brand, "gi"), "").trim() || title;

  let formattedCategory = "Electronics";
  if (cat.includes("shoe") || id.startsWith("shoe")) formattedCategory = "Footwear & Shoes";
  else if (cat.includes("cloth") || id.startsWith("clot")) formattedCategory = "Clothing & Fashion";
  else if (cat.includes("sport") || id.startsWith("spor")) formattedCategory = "Sports & Fitness";
  else if (title.toLowerCase().includes("phone") || title.toLowerCase().includes("iphone") || title.toLowerCase().includes("galaxy")) formattedCategory = "Smartphones & Mobiles";
  else if (title.toLowerCase().includes("laptop") || title.toLowerCase().includes("macbook")) formattedCategory = "Laptops & Computers";
  else if (title.toLowerCase().includes("headphone") || title.toLowerCase().includes("earbuds")) formattedCategory = "Audio & Headphones";

  const stockCount = typeof product.stock === "number" ? product.stock : 25;
  const isAvailable = stockCount > 0;
  const availabilityText = isAvailable ? `${t("productDetail.inStock")} (${stockCount} ${t("productDetail.units")})` : t("productDetail.outOfStock");

  let warranty = "1 Year Brand Warranty";
  if (brand === "Apple" || brand === "Dell" || brand === "Sony" || brand === "Samsung") {
    warranty = "1 Year Official Manufacturer Warranty";
  } else if (formattedCategory.includes("Clothing")) {
    warranty = "30 Days Quality Guarantee & Easy Return";
  } else if (formattedCategory.includes("Footwear")) {
    warranty = "6 Months Manufacturer Warranty";
  }

  return { brand, model, category: formattedCategory, availability: availabilityText, isAvailable, warranty };
}

function ProductDetail() {
  const { t } = useTranslation();
  const { productId } = useParams();
  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist?.items || []);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const reviewsRef = useRef(null);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adding, setAdding] = useState(false);
  const [showSpecs, setShowSpecs] = useState(false);
  const [showDesc, setShowDesc] = useState(false);
  const [showDelivery, setShowDelivery] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [reviewFilter, setReviewFilter] = useState("all");
  const [helpfulVotes, setHelpfulVotes] = useState({});
  const [toast, setToast] = useState({ show: false, title: "", img: "", type: "cart" });
  const [allProducts, setAllProducts] = useState([]);

  const toggleHelpful = (reviewId, baseCount = 0) => {
    setHelpfulVotes((prev) => {
      const current = prev[reviewId] || { voted: false, count: baseCount };
      return {
        ...prev,
        [reviewId]: {
          voted: !current.voted,
          count: current.voted ? Math.max(0, current.count - 1) : current.count + 1,
        },
      };
    });
  };

  const SAMPLE_ADDRESSES = [
    {
      id: "addr-sample-1",
      fullName: "Shivam Sharma",
      phone: "9871234567",
      street: "F-316, Urban Homes, Aditya World City",
      city: "Ghaziabad",
      state: "Uttar Pradesh",
      pincode: "201002",
      isDefault: true,
    },
    {
      id: "addr-sample-2",
      fullName: "Rahul Verma",
      phone: "8800112233",
      street: "Tower B-402, Sector 62",
      city: "Noida",
      state: "Uttar Pradesh",
      pincode: "201301",
      isDefault: false,
    },
    {
      id: "addr-sample-3",
      fullName: "Priya Malhotra",
      phone: "9911445566",
      street: "House No. 84, Ring Road, Model Town",
      city: "New Delhi",
      state: "Delhi",
      pincode: "110009",
      isDefault: false,
    },
  ];

  const [savedAddresses] = useState(() => {
    try {
      const saved = localStorage.getItem("pvx_user_addresses");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return SAMPLE_ADDRESSES;
    } catch {
      return SAMPLE_ADDRESSES;
    }
  });

  const [selectedAddress, setSelectedAddress] = useState(() => {
    return savedAddresses.find((a) => a.isDefault) || savedAddresses[0] || null;
  });

  const currentCartItem = data ? cartItems.find((i) => String(i.productId || i._id) === String(data._id)) : null;
  const isWishlisted = data ? wishlistItems.some((i) => String(i.productId || i._id) === String(data._id)) : false;

  async function handleIncreaseQty(currentQty) {
    if (!data) return;
    const newQty = currentQty + 1;
    dispatch(updateQuantity({ productId: data._id, quantity: newQty }));
    try {
      await api.patch(`/cart/${data._id}`, { quantity: newQty });
    } catch {}
  }

  async function handleDecreaseQty(currentQty) {
    if (!data) return;
    if (currentQty <= 1) {
      dispatch(removeFromCart(data._id));
      try {
        await api.delete(`/cart/${data._id}`);
      } catch {}
      return;
    }
    const newQty = currentQty - 1;
    dispatch(updateQuantity({ productId: data._id, quantity: newQty }));
    try {
      await api.patch(`/cart/${data._id}`, { quantity: newQty });
    } catch {}
  }

  const scrollToReviews = () => {
    if (reviewsRef.current) {
      reviewsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${productId}`);
        setData(res.data);
      } catch {
        setError(t("productDetail.productNotFound"));
      } finally {
        setLoading(false);
      }
    };
    const fetchAllProducts = async () => {
      try {
        const res = await api.get(`/products`);
        if (Array.isArray(res.data)) {
          setAllProducts(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch all products for related", err);
      }
    };
    fetchProduct();
    fetchAllProducts();
  }, [productId]);

  async function handleCart() {
    if (!data) return;
    try {
      setAdding(true);
      await api.get("/auth/me");
      dispatch(addToCart({ ...data, quantity: 1 }));
      try {
        await api.post("/cart/add", {
          productId: data._id,
          title: data.title,
          price: data.price,
          images: data.images,
          quantity: 1,
        });
      } catch {}

      // ✨ Show Toast popup banner instead of navigating
      setToast({
        show: true,
        title: data.title,
        img: data.images?.[0] || "",
        type: "cart"
      });

      setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 3500);

    } catch {
      navigate("/login");
    } finally {
      setAdding(false);
    }
  }

  async function handleWishlist() {
    if (!data) return;
    try {
      await api.get("/auth/me");
      if (isWishlisted) {
        dispatch(removeFromWishlist(data._id || data.productId));
        setToast({
          show: true,
          title: data.title,
          img: data.images?.[0] || "",
          type: "wishlist-remove"
        });
      } else {
        dispatch(addToWishlist(data));
        setToast({
          show: true,
          title: data.title,
          img: data.images?.[0] || "",
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

  if (loading) return <div className="p3d-status">{t("productDetail.loadingDetails")}</div>;
  if (error)   return <div className="p3d-status">{error}</div>;
  if (!data)   return <div className="p3d-status">{t("productDetail.productNotFound")}</div>;

  const { reviews: rawReviews } = getProductReviews(data._id);
  const reviews = rawReviews || [];
  const totalReviews = reviews.length;

  // Authoritative rating derived directly from the reviews list (or 0 if no reviews)
  const finalRating = totalReviews > 0
    ? Math.round((reviews.reduce((sum, r) => sum + Number(r.rating || 5), 0) / totalReviews) * 10) / 10
    : 0;

  const ratingDistribution = computeRatingDistribution(reviews);
  const positiveReviewsCount = reviews.filter((r) => Number(r.rating) >= 4).length;
  const recommendPct = totalReviews > 0 ? Math.round((positiveReviewsCount / totalReviews) * 100) : 0;

  const filteredReviews = reviews.filter((r) => {
    if (reviewFilter === "all") return true;
    if (reviewFilter === "5") return Math.round(Number(r.rating)) === 5;
    if (reviewFilter === "4") return Math.round(Number(r.rating)) === 4;
    if (reviewFilter === "critical") return Math.round(Number(r.rating)) <= 3;
    return true;
  });

  const displayedReviews = showAllReviews ? filteredReviews : filteredReviews.slice(0, 3);
  const relatedProducts = getRelatedProductsFromList(data, allProducts);
  const specs = getProductSpecs(data, t);

  return (
    <section className="p3d-page">
      {/* 🟢 TOAST NOTIFICATION POPUP */}
      {toast.show && (
        <div className="toast-popup-banner">
          <div className="toast-left">
            <span className="toast-check">
              {toast.type === "wishlist-remove" ? "💔" : toast.type === "wishlist" ? "💚" : "✅"}
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
            className="toast-view-cart-btn" 
            onClick={() => navigate(toast.type.startsWith("wishlist") ? "/wishlist" : "/cart")}
          >
            {toast.type.startsWith("wishlist") ? t("productList.viewWishlist") : t("productList.viewCart")}
          </button>
        </div>
      )}

      <Link to="/productlist" className="p3d-back">{t("productDetail.backToProducts")}</Link>

      <div className="p3d-stage">
        <div className="p3d-card">
          {/* IMAGE STAGE */}
          <div className="p3d-image">
            <div className="p3d-image-bg-glow"></div>
            <div className="p3d-image-badge-tag">{t("productDetail.trendingProduct")}</div>
            <img
              src={data.images?.[0] || `https://picsum.photos/seed/${data._id}/600/400`}
              alt={data.title}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://picsum.photos/seed/${data._id}/600/400`;
              }}
            />
          </div>

          {/* CONTENT SIDE */}
          <div className="p3d-content">
            <h1><ProductTransText text={data.title} /></h1>

            {/* ⭐ RATING & REVIEWS LINK */}
            <div className="p3d-rating-row">
              <StarRating rating={finalRating} size="lg" />
              <span className="p3d-rating-score">{finalRating.toFixed(1)}</span>
              <span className="p3d-rating-count">
                ({totalReviews} {totalReviews === 1 ? "customer review" : "customer reviews"})
              </span>
              <button className="p3d-reviews-link-btn" onClick={scrollToReviews}>
                {t("productDetail.customerReviews")}
              </button>
            </div>

            {/* PRICE CARD WITH DISCOUNT & EMI */}
            <div className="p3d-price-box">
              <div className="p3d-price-main">
                <span className="p3d-price-label">{t("productDetail.specialPrice")}</span>
                <div className="p3d-price-amount-group">
                  <strong className="p3d-price-current">₹{Number(data.price).toLocaleString()}</strong>
                  <span className="p3d-price-mrp">₹{Math.round(data.price * 1.25).toLocaleString()}</span>
                  <span className="p3d-price-discount">20% {t("productDetail.off")}</span>
                </div>
              </div>
              <div className="p3d-emi-info">
                💳 {t("productDetail.emiStarts")} <strong>₹{Math.round(data.price / 12).toLocaleString()}/{t("productDetail.perMonth")}</strong>
              </div>
            </div>

            {/* 📝 PRODUCT OVERVIEW / DESCRIPTION ACCORDION */}
            <div className="p3d-specs-accordion">
              <button
                type="button"
                className={`p3d-specs-toggle-btn ${showDesc ? "active" : ""}`}
                onClick={() => setShowDesc((prev) => !prev)}
              >
                <div className="p3d-specs-toggle-left">
                  <div className="p3d-specs-icon-badge">✨</div>
                  <div className="p3d-specs-title-group">
                    <span className="p3d-specs-main-title">{t("productDetail.aboutItem")}</span>
                    <span className="p3d-specs-sub-title">{t("productDetail.overviewFeatures")}</span>
                  </div>
                </div>
                <span className="p3d-specs-arrow">{showDesc ? t("productDetail.hideOverview") : t("productDetail.readAboutItem")}</span>
              </button>

              {showDesc && (
                <div className="p3d-desc-box">
                  <p className="p3d-desc-text"><ProductTransText text={data.description} /></p>
                </div>
              )}
            </div>

            {/* 📍 DELIVERY DETAILS ACCORDION */}
            <div className="p3d-specs-accordion">
              <button
                type="button"
                className={`p3d-specs-toggle-btn ${showDelivery ? "active" : ""}`}
                onClick={() => setShowDelivery((prev) => !prev)}
              >
                <div className="p3d-specs-toggle-left">
                  <div className="p3d-specs-icon-badge">🚚</div>
                  <div className="p3d-specs-title-group">
                    <span className="p3d-specs-main-title">{t("productDetail.deliveryServiceDetails")}</span>
                    <span className="p3d-specs-sub-title">{t("productDetail.deliverySubText")}</span>
                  </div>
                </div>
                <span className="p3d-specs-arrow">{showDelivery ? t("productDetail.hideDeliveryInfo") : t("productDetail.checkDeliveryETA")}</span>
              </button>

              {showDelivery && (
                <div className="p3d-delivery-box">
                  <div className="p3d-delivery-header">
                    <div className="p3d-delivery-left">
                      <span className="p3d-delivery-icon">🚚</span>
                      <div className="p3d-delivery-info">
                        <h4>{t("productDetail.selectedAddress")}</h4>
                        <div className="p3d-delivery-address-text">
                          {selectedAddress ? (
                            <span className="p3d-addr-pill">
                              <span className="p3d-addr-label">{t("productDetail.deliverTo")}:</span>
                              <strong className="p3d-addr-name">{selectedAddress.fullName}</strong>
                              <span className="p3d-addr-location">({selectedAddress.city} - {selectedAddress.pincode})</span>
                            </span>
                          ) : (
                            <span className="p3d-addr-none">{t("productDetail.selectAddressToCheck")}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="p3d-change-addr-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDeliveryModal(true);
                      }}
                    >
                      <span className="p3d-btn-pin">📍</span>
                      <span>{selectedAddress ? t("productDetail.changeAddress") : t("productDetail.selectAddress")}</span>
                    </button>
                  </div>
                  <div className="p3d-delivery-perks">
                    <span className="p3d-perk-badge perk-express">
                      <span className="perk-icon">⚡</span> {t("productDetail.freeExpressDelivery")}
                    </span>
                    <span className="p3d-perk-badge perk-cod">
                      <span className="perk-icon">💵</span> {t("productDetail.codAvailable")}
                    </span>
                    <span className="p3d-perk-badge perk-return">
                      <span className="perk-icon">🔄</span> {t("productDetail.replacementGuarantee")}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* 📋 PRODUCT SPECIFICATIONS COLLAPSIBLE OPTION */}
            <div className="p3d-specs-accordion">
              <button
                type="button"
                className={`p3d-specs-toggle-btn ${showSpecs ? "active" : ""}`}
                onClick={() => setShowSpecs((prev) => !prev)}
              >
                <div className="p3d-specs-toggle-left">
                  <div className="p3d-specs-icon-badge">📋</div>
                  <div className="p3d-specs-title-group">
                    <span className="p3d-specs-main-title">{t("productDetail.productSpecs")}</span>
                    <span className="p3d-specs-sub-title">{t("productDetail.specsSubtext")}</span>
                  </div>
                </div>
                <span className="p3d-specs-arrow">{showSpecs ? t("productDetail.hideDetails") : t("productDetail.viewSpecsTable")}</span>
              </button>

              {showSpecs && (
                <div className="p3d-specs-table-wrapper">
                  <div className="p3d-specs-grid">
                    <div className="p3d-spec-card">
                      <div className="p3d-spec-card-left">
                        <span className="p3d-spec-card-icon">🏷️</span>
                        <span className="spec-table-label">{t("productDetail.brandName")}</span>
                      </div>
                      <span className="spec-table-val">{specs.brand}</span>
                    </div>

                    <div className="p3d-spec-card">
                      <div className="p3d-spec-card-left">
                        <span className="p3d-spec-card-icon">📱</span>
                        <span className="spec-table-label">{t("productDetail.modelName")}</span>
                      </div>
                      <span className="spec-table-val">{specs.model}</span>
                    </div>

                    <div className="p3d-spec-card">
                      <div className="p3d-spec-card-left">
                        <span className="p3d-spec-card-icon">📁</span>
                        <span className="spec-table-label">{t("productDetail.category")}</span>
                      </div>
                      <span className="spec-table-val">{specs.category}</span>
                    </div>

                    <div className="p3d-spec-card">
                      <div className="p3d-spec-card-left">
                        <span className="p3d-spec-card-icon">📦</span>
                        <span className="spec-table-label">{t("productDetail.stockStatus")}</span>
                      </div>
                      <span className={`p3d-stock-badge ${specs.isAvailable ? "in-stock" : "out-of-stock"}`}>
                        {specs.isAvailable ? "🟢 " : "🔴 "}{specs.availability}
                      </span>
                    </div>

                    <div className="p3d-spec-card">
                      <div className="p3d-spec-card-left">
                        <span className="p3d-spec-card-icon">🛡️</span>
                        <span className="spec-table-label">{t("productDetail.warrantyCoverage")}</span>
                      </div>
                      <span className="spec-table-val">{specs.warranty}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ACTION BUTTONS */}
            <div className="p3d-action-buttons">
              {currentCartItem ? (
                <div className="p3d-qty-control">
                  <button
                    className="p3d-qty-ctrl-btn"
                    onClick={() => handleDecreaseQty(currentCartItem.quantity)}
                    title={currentCartItem.quantity === 1 ? t("productList.removeFromCart") : t("productList.decreaseQuantity")}
                  >
                    −
                  </button>
                  <span className="p3d-qty-ctrl-val">{currentCartItem.quantity} {t("productDetail.inCart")}</span>
                  <button
                    className="p3d-qty-ctrl-btn"
                    onClick={() => handleIncreaseQty(currentCartItem.quantity)}
                    title={t("productList.increaseQuantity")}
                  >
                    +
                  </button>
                </div>
              ) : (
                <button className="p3d-btn" onClick={handleCart} disabled={adding}>
                  🛒 {adding ? t("productDetail.addingToCart") : t("productDetail.addToCart")}
                </button>
              )}
              <button
                className={`p3d-wishlist-btn ${isWishlisted ? "wishlisted" : ""}`}
                onClick={handleWishlist}
                title={isWishlisted ? t("productList.removeFromWishlist") : t("productList.addToWishlist")}
              >
                <span style={{ fontSize: "18px" }}>{isWishlisted ? "💚" : "🤍"}</span>
                <span>{isWishlisted ? t("productDetail.wishlisted") : t("productDetail.addToWishlist")}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== EXPLORE MORE SECTION ===== */}
      {relatedProducts.length > 0 && (
        <div className="p3d-explore-container">
          <div className="p3d-explore-header" style={{ marginBottom: "20px" }}>
            <h3 style={{ fontSize: "20px", fontWeight: "800", color: "#000000" }}>{t("productDetail.exploreMoreSimilar")}</h3>
          </div>
          <div className="p3d-explore-grid-wrap">
            <div className="p3d-explore-grid">
              {relatedProducts.map((p) => (
                <div
                  className="p3d-explore-card"
                  key={p._id}
                  onClick={() => navigate(`/productdetail/${p._id}`)}
                >
                  <div className="p3d-explore-img">
                    <img
                      src={p.images?.[0] || `https://picsum.photos/seed/${p._id}/400/300`}
                      alt={p.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://picsum.photos/seed/${p._id}/400/300`;
                      }}
                    />
                  </div>
                  <div className="p3d-explore-body">
                    <h4><ProductTransText text={p.title} /></h4>
                    <span className="p3d-explore-price">₹{p.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===== REVIEWS SECTION (Amazon / Flipkart Style) ===== */}
      <div className="p3d-reviews-section" ref={reviewsRef} id="reviews-section">
        <div className="p3d-reviews-heading-wrap">
          <div className="p3d-reviews-heading-left">
            <h2>{t("productDetail.customerReviews")}</h2>
            <p className="p3d-reviews-heading-subtitle">
              Customer ratings, feedback & purchase experiences
            </p>
          </div>
          <div className="p3d-verified-buyer-guarantee">
            <span className="p3d-guarantee-icon">🛡️</span>
            <div>
              <strong>Customer Feedback</strong>
              <small>Authentic shopper ratings</small>
            </div>
          </div>
        </div>

        {/* 📊 RATING OVERVIEW & DISTRIBUTION BREAKDOWN */}
        <div className="p3d-rating-overview-card">
          {/* Left Column: Overall Rating Score */}
          <div className="p3d-overall-rating-block">
            <div className="p3d-score-badge-wrap">
              <span className="p3d-score-number">{finalRating.toFixed(1)}</span>
              <span className="p3d-score-star">★</span>
            </div>
            <StarRating rating={finalRating} size="lg" />
            <div className="p3d-score-meta">
              <strong>
                {totalReviews > 0
                  ? `Based on ${totalReviews} customer ${totalReviews === 1 ? "review" : "reviews"}`
                  : "No customer reviews yet"}
              </strong>
            </div>
            {totalReviews > 0 && (
              <div className="p3d-recommend-pill">
                <span className="recommend-check">✓</span>
                <span><strong>{recommendPct}%</strong> of reviewers recommend this</span>
              </div>
            )}
          </div>

          {/* Vertical Divider */}
          <div className="p3d-overview-divider"></div>

          {/* Right Column: Rating Distribution Bars */}
          <div className="p3d-distribution-block">
            <div className="p3d-dist-header">
              <span className="p3d-dist-title">Rating Breakdown</span>
              <span className="p3d-dist-hint">Click a bar to filter</span>
            </div>
            <div className="p3d-rating-bars-list">
              {ratingDistribution.map((item) => (
                <button
                  type="button"
                  key={item.star}
                  className={`p3d-rating-bar-row ${reviewFilter === String(item.star) ? "active-filter" : ""}`}
                  onClick={() => setReviewFilter((prev) => (prev === String(item.star) ? "all" : String(item.star)))}
                  title={`Filter by ${item.star} star reviews`}
                >
                  <span className="p3d-bar-star-label">
                    <span>{item.star}</span>
                    <span className="gold-star">★</span>
                  </span>

                  <div className="p3d-bar-track">
                    <div
                      className={`p3d-bar-fill star-fill-${item.star}`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>

                  <span className="p3d-bar-percentage">{item.percentage}%</span>
                  <span className="p3d-bar-count">({item.count})</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 🏷️ FILTER TABS BAR */}
        <div className="p3d-review-filter-bar">
          <span className="p3d-filter-label">Filter Reviews:</span>
          <div className="p3d-filter-chips">
            <button
              type="button"
              className={`p3d-filter-chip ${reviewFilter === "all" ? "active" : ""}`}
              onClick={() => setReviewFilter("all")}
            >
              All ({reviews.length})
            </button>
            <button
              type="button"
              className={`p3d-filter-chip ${reviewFilter === "5" ? "active" : ""}`}
              onClick={() => setReviewFilter("5")}
            >
              5 ★ ({reviews.filter((r) => Math.round(Number(r.rating)) === 5).length})
            </button>
            <button
              type="button"
              className={`p3d-filter-chip ${reviewFilter === "4" ? "active" : ""}`}
              onClick={() => setReviewFilter("4")}
            >
              4 ★ ({reviews.filter((r) => Math.round(Number(r.rating)) === 4).length})
            </button>
            <button
              type="button"
              className={`p3d-filter-chip ${reviewFilter === "critical" ? "active" : ""}`}
              onClick={() => setReviewFilter("critical")}
            >
              Critical (&le; 3 ★) ({reviews.filter((r) => Math.round(Number(r.rating)) <= 3).length})
            </button>
          </div>
        </div>

        {/* 💬 INDIVIDUAL REVIEW CARDS LIST */}
        <div className="p3d-reviews-list">
          {filteredReviews.length === 0 ? (
            <div className="p3d-empty-reviews-state">
              <div className="p3d-empty-reviews-icon">📝</div>
              <h3>No reviews yet</h3>
              <p>Be the first to review this product or try selecting "All" to view other feedback.</p>
              {reviewFilter !== "all" && (
                <button 
                  type="button" 
                  className="p3d-reset-filter-btn" 
                  onClick={() => setReviewFilter("all")}
                >
                  Show All Reviews
                </button>
              )}
            </div>
          ) : (
            displayedReviews.map((rev) => {
              const reviewId = rev.id || rev._id || rev.name;
              const defaultHelpful = ((Number(rev.id || 1) * 3 + 2) % 9) + 1;
              const helpfulState = helpfulVotes[reviewId] || {
                voted: false,
                count: defaultHelpful,
              };

              return (
                <article className="p3d-review-card" key={reviewId}>
                  <div className="p3d-review-top">
                    <div className="p3d-reviewer-profile">
                      <div className="p3d-avatar">{rev.avatar || rev.name.slice(0, 2).toUpperCase()}</div>
                      <div className="p3d-reviewer-meta">
                        <strong className="p3d-reviewer-name">{rev.name}</strong>
                        <span className="p3d-review-verified-badge">
                          ✓ Verified Purchase
                        </span>
                      </div>
                    </div>
                    <span className="p3d-reviewer-date">📅 {rev.date || "Recently"}</span>
                  </div>

                  <div className="p3d-review-rating-line">
                    <StarRating rating={rev.rating} size="sm" showScore={true} />
                    <span className="p3d-rating-sentiment">
                      {rev.rating >= 4 ? "Satisfied Buyer" : rev.rating === 3 ? "Neutral Feedback" : "Critical Feedback"}
                    </span>
                  </div>

                  <p className="p3d-review-text">{rev.text}</p>

                  <div className="p3d-review-footer">
                    <button
                      type="button"
                      className={`p3d-helpful-btn ${helpfulState.voted ? "voted" : ""}`}
                      onClick={() => toggleHelpful(reviewId, defaultHelpful)}
                      aria-label="Mark review as helpful"
                    >
                      <span className="helpful-icon">{helpfulState.voted ? "👍" : "👍"}</span>
                      <span>{helpfulState.voted ? "Helpful" : "Helpful"}</span>
                      <span className="helpful-badge">({helpfulState.count})</span>
                    </button>
                    <span className="p3d-review-report-text">Report</span>
                  </div>
                </article>
              );
            })
          )}
        </div>

        {filteredReviews.length > 3 && (
          <button
            type="button"
            className="p3d-show-more"
            onClick={() => setShowAllReviews((prev) => !prev)}
          >
            {showAllReviews ? t("productDetail.showLess") : t("productDetail.showAllReviews", { count: filteredReviews.length })}
          </button>
        )}
      </div>

      {/* 📍 ADDRESS SELECTION POPUP MODAL */}
      {showDeliveryModal && (
        <div className="address-select-modal-overlay">
          <div className="address-select-modal">
            <div className="modal-header">
              <h3>{t("checkout.selectDeliveryAddress")}</h3>
              <button className="close-modal-btn" onClick={() => setShowDeliveryModal(false)}>✕</button>
            </div>

            <div className="saved-addresses-modal-list">
              {savedAddresses.map((addr) => (
                <div
                  key={addr.id || addr._id}
                  className={`modal-addr-card ${selectedAddress?.id === addr.id ? "selected" : ""}`}
                  onClick={() => {
                    setSelectedAddress(addr);
                    setShowDeliveryModal(false);
                  }}
                >
                  <div className="modal-addr-top">
                    <strong>{addr.fullName}</strong>
                    {selectedAddress?.id === addr.id && <span className="default-tag">{t("productDetail.selected")}</span>}
                  </div>
                  <p className="modal-addr-phone">📞 {addr.phone}</p>
                  <p className="modal-addr-street">
                    {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default ProductDetail;










