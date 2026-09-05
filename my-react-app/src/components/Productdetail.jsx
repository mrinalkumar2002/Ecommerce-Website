import React, { useEffect, useState, useRef, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, updateQuantity, removeFromCart } from "../redux/cartSlice";
import { addToWishlist, removeFromWishlist } from "../redux/wishlistSlice";
import { addToCompare, openCompareModal } from "../redux/compareSlice";
import { addRecentlyViewed } from "./RecentlyViewed";
import RecentlyViewed from "./RecentlyViewed";
import { ProductDetailSkeleton } from "./SkeletonLoader";
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

function getRelatedProductsFromList(currentProduct, allProducts) {
  if (!currentProduct || !allProducts || allProducts.length === 0) return [];
  const id = String(currentProduct._id);
  const cat = (currentProduct.category || "").toLowerCase();

  if (cat.includes("shoe") || id.startsWith("shoe")) {
    return allProducts.filter((p) => (p.category || "").toLowerCase().includes("shoe") && String(p._id) !== id).slice(0, 8);
  }
  if (cat.includes("cloth") || id.startsWith("clot")) {
    return allProducts.filter((p) => (p.category || "").toLowerCase().includes("cloth") && String(p._id) !== id).slice(0, 8);
  }
  if (cat.includes("sport") || id.startsWith("spor")) {
    return allProducts.filter((p) => (p.category || "").toLowerCase().includes("sport") && String(p._id) !== id).slice(0, 8);
  }

  for (const subcat of ELEC_SUBCATS) {
    if (subcat.ids.has(id)) {
      return allProducts
        .filter((p) => subcat.ids.has(String(p._id)) && String(p._id) !== id)
        .slice(0, 8);
    }
  }

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
    return { star, count, percentage };
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
  const compareItems = useSelector((state) => state.compare?.items || []);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const reviewsRef = useRef(null);
  const imgContainerRef = useRef(null);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adding, setAdding] = useState(false);
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);

  // Zoom Lens State
  const [zoomStyle, setZoomStyle] = useState({ display: "none" });

  // Pincode Delivery Estimator
  const [pincode, setPincode] = useState("");
  const [pincodeResult, setPincodeResult] = useState(null);
  const [pincodeLoading, setPincodeLoading] = useState(false);

  // Accordions
  const [showSpecs, setShowSpecs] = useState(false);
  const [showDesc, setShowDesc] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [reviewFilter, setReviewFilter] = useState("all");

  // 📝 Review System State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewBody, setReviewBody] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewFormError, setReviewFormError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  // Local reviews store
  const [userReviewsMap, setUserReviewsMap] = useState(() => {
    try {
      const saved = localStorage.getItem("pvx_user_reviews");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Helpful votes map
  const [helpfulVotes, setHelpfulVotes] = useState(() => {
    try {
      const saved = localStorage.getItem("pvx_helpful_votes");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [toast, setToast] = useState({ show: false, title: "", img: "", type: "cart" });
  const [allProducts, setAllProducts] = useState([]);

  // Check auth user
  useEffect(() => {
    api.get("/auth/me")
      .then((res) => {
        if (res.data?.user) {
          setCurrentUser(res.data.user);
        }
      })
      .catch(() => setCurrentUser(null));
  }, []);

  // Track product fetch and register recently viewed
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products/${productId}`);
        setData(res.data);
        addRecentlyViewed(res.data);
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
      } catch (err) {}
    };
    fetchProduct();
    fetchAllProducts();
  }, [productId]);

  // Gallery images (main image + alternate angles if single)
  const galleryImages = useMemo(() => {
    if (!data) return [];
    if (data.images && data.images.length > 1) return data.images;
    const base = data.images?.[0] || `https://picsum.photos/seed/${data._id}/600/400`;
    return [
      base,
      base.includes("picsum") ? `https://picsum.photos/seed/${data._id}-side/600/400` : base,
      base.includes("picsum") ? `https://picsum.photos/seed/${data._id}-angle/600/400` : base,
    ];
  }, [data]);

  // Frequently Bought Together Bundle calculation
  const bundleItems = useMemo(() => {
    if (!data || allProducts.length === 0) return [];
    const related = getRelatedProductsFromList(data, allProducts);
    return related.slice(0, 2);
  }, [data, allProducts]);

  const bundleTotal = useMemo(() => {
    if (!data) return 0;
    const items = [data, ...bundleItems];
    return items.reduce((acc, item) => acc + Number(item.price || 0), 0);
  }, [data, bundleItems]);

  const currentCartItem = data ? cartItems.find((i) => String(i.productId || i._id) === String(data._id)) : null;
  const isWishlisted = data ? wishlistItems.some((i) => String(i.productId || i._id) === String(data._id)) : false;
  const isCompared = data ? compareItems.some((i) => String(i._id) === String(data._id)) : false;

  // 📝 Reviews Computation (Curated Pool + Local User Reviews)
  const { reviews: rawReviews } = data ? getProductReviews(data._id) : { reviews: [] };
  const userReviewsForProd = (data && userReviewsMap[String(data._id)]) || [];

  const combinedReviews = useMemo(() => {
    // User submitted reviews are prepended first
    return [...userReviewsForProd, ...(rawReviews || [])];
  }, [userReviewsForProd, rawReviews]);

  const totalReviews = combinedReviews.length;

  const finalRating = useMemo(() => {
    if (totalReviews === 0) return 0;
    const sum = combinedReviews.reduce((acc, r) => acc + Number(r.rating || 5), 0);
    return Math.round((sum / totalReviews) * 10) / 10;
  }, [combinedReviews, totalReviews]);

  const ratingDistribution = useMemo(() => {
    return computeRatingDistribution(combinedReviews);
  }, [combinedReviews]);

  const positiveReviewsCount = combinedReviews.filter((r) => Number(r.rating) >= 4).length;
  const recommendPct = totalReviews > 0 ? Math.round((positiveReviewsCount / totalReviews) * 100) : 0;

  // Check if current logged-in user already wrote a review
  const existingUserReview = useMemo(() => {
    if (!userReviewsForProd || userReviewsForProd.length === 0) return null;
    return userReviewsForProd[0] || null;
  }, [userReviewsForProd]);

  // Image Zoom Lens Handler
  const handleMouseMove = (e) => {
    if (!imgContainerRef.current) return;
    const { left, top, width, height } = imgContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      display: "block",
      backgroundPosition: `${x}% ${y}%`,
      backgroundImage: `url(${galleryImages[selectedImgIndex] || galleryImages[0]})`,
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: "none" });
  };

  // Pincode Verification Handler
  const handlePincodeCheck = (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode)) {
      setPincodeResult({ valid: false, message: t("deliveryEstimator.invalid") });
      return;
    }
    setPincodeLoading(true);
    setTimeout(() => {
      setPincodeLoading(false);
      const isMetro = ["11", "40", "56", "70", "60", "20"].some((p) => pincode.startsWith(p));
      setPincodeResult({
        valid: true,
        isMetro,
        eta: isMetro ? t("deliveryEstimator.expressETA") : t("deliveryEstimator.standardETA"),
        cod: t("deliveryEstimator.codEligible"),
        freeShip: t("deliveryEstimator.freeDelivery"),
      });
    }, 400);
  };

  // Social Share Handler
  const handleShare = async () => {
    const shareData = {
      title: data?.title || "ShoppyGlobe Luxury",
      text: `Check out this ${data?.title} on ShoppyGlobe!`,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      setToast({
        show: true,
        title: t("productDetail.copied"),
        img: data.images?.[0] || "",
        type: "share",
      });
      setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
    }
  };

  const handleAddBundleToCart = async () => {
    try {
      await api.get("/auth/me");
      const itemsToAdd = [data, ...bundleItems];
      for (const item of itemsToAdd) {
        dispatch(addToCart({ ...item, quantity: 1 }));
        try {
          await api.post("/cart/add", {
            productId: item._id,
            title: item.title,
            price: item.price,
            images: item.images,
            quantity: 1,
          });
        } catch {}
      }
      setToast({
        show: true,
        title: "Bundle added to Cart! 🎁",
        img: data.images?.[0] || "",
        type: "cart",
      });
      setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3500);
    } catch {
      navigate("/login");
    }
  };

  const handleToggleCompare = () => {
    if (!data) return;
    if (!isCompared && compareItems.length >= 4) {
      dispatch(openCompareModal());
      return;
    }
    dispatch(addToCompare(data));
  };

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

      setToast({
        show: true,
        title: data.title,
        img: data.images?.[0] || "",
        type: "cart",
      });
      setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3500);
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
        window.dispatchEvent(
          new CustomEvent("pvx_show_toast", {
            detail: {
              title: "Removed from Wishlist",
              text: data.title,
              img: data.images?.[0] || "",
              type: "wishlist-remove",
            },
          })
        );
      } else {
        dispatch(addToWishlist(data));
        window.dispatchEvent(
          new CustomEvent("pvx_show_toast", {
            detail: {
              title: "Added to Wishlist ❤️",
              text: data.title,
              img: data.images?.[0] || "",
              type: "wishlist",
            },
          })
        );
      }
    } catch {
      navigate("/login");
    }
  }

  // 📝 Review Modal Open & Pre-fill
  const handleOpenReviewModal = async () => {
    try {
      await api.get("/auth/me");
      setReviewFormError("");
      if (existingUserReview) {
        setReviewRating(Number(existingUserReview.rating) || 5);
        setReviewTitle(existingUserReview.title || "");
        setReviewBody(existingUserReview.text || "");
      } else {
        setReviewRating(5);
        setReviewTitle("");
        setReviewBody("");
      }
      setShowReviewModal(true);
    } catch {
      navigate("/login");
    }
  };

  // 📝 Save or Update Review
  const handleSaveReview = async (e) => {
    e.preventDefault();
    setReviewFormError("");

    if (!reviewRating || reviewRating < 1 || reviewRating > 5) {
      setReviewFormError(t("reviews.ratingRequired"));
      return;
    }

    if (reviewBody.trim().length < 10) {
      setReviewFormError(t("reviews.minCharWarning"));
      return;
    }

    setIsSubmittingReview(true);

    try {
      let userName = currentUser?.name || "Verified Customer";
      try {
        const authRes = await api.get("/auth/me");
        userName = authRes.data?.user?.name || userName;
      } catch {}

      const prodKey = String(data._id);
      const newReviewItem = {
        id: existingUserReview?.id || "user_rev_" + Date.now(),
        name: userName,
        avatar: (userName || "VC").slice(0, 2).toUpperCase(),
        rating: Number(reviewRating),
        title: reviewTitle.trim() || undefined,
        text: reviewBody.trim(),
        date: new Date().toLocaleDateString("en-IN", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        isUserReview: true,
        isVerified: true,
      };

      const updatedMap = {
        ...userReviewsMap,
        [prodKey]: [newReviewItem],
      };

      setUserReviewsMap(updatedMap);
      localStorage.setItem("pvx_user_reviews", JSON.stringify(updatedMap));

      setShowReviewModal(false);
      setToast({
        show: true,
        title: existingUserReview
          ? t("reviews.reviewUpdated")
          : t("reviews.reviewSubmitted"),
        img: data.images?.[0] || "",
        type: "review",
      });
      setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3500);
    } catch (err) {
      setReviewFormError("Failed to save review. Please try again.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // 🗑️ Delete User Review
  const handleDeleteReview = () => {
    if (!data || !existingUserReview) return;
    if (window.confirm(t("reviews.deleteConfirm"))) {
      const prodKey = String(data._id);
      const updatedMap = { ...userReviewsMap };
      delete updatedMap[prodKey];
      setUserReviewsMap(updatedMap);
      localStorage.setItem("pvx_user_reviews", JSON.stringify(updatedMap));
      setShowReviewModal(false);

      setToast({
        show: true,
        title: t("reviews.reviewDeleted"),
        img: data.images?.[0] || "",
        type: "review-delete",
      });
      setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3500);
    }
  };

  // 👍 Helpful Vote Toggle
  const handleHelpfulVote = (reviewId) => {
    const defaultCount = ((Math.abs(String(reviewId).split("").reduce((a, b) => a + b.charCodeAt(0), 0)) % 7) + 2);
    const current = helpfulVotes[reviewId] || { count: defaultCount, voted: false };
    const newVoted = !current.voted;
    const newCount = newVoted ? current.count + 1 : Math.max(0, current.count - 1);

    const updated = {
      ...helpfulVotes,
      [reviewId]: { count: newCount, voted: newVoted },
    };

    setHelpfulVotes(updated);
    localStorage.setItem("pvx_helpful_votes", JSON.stringify(updated));
  };

  const getRatingLabel = (ratingValue) => {
    switch (ratingValue) {
      case 1: return t("reviews.ratingPoor");
      case 2: return t("reviews.ratingFair");
      case 3: return t("reviews.ratingAverage");
      case 4: return t("reviews.ratingGood");
      case 5: return t("reviews.ratingExcellent");
      default: return "";
    }
  };

  if (loading) return <ProductDetailSkeleton />;
  if (error)   return <div className="p3d-status">{error}</div>;
  if (!data)   return <div className="p3d-status">{t("productDetail.productNotFound")}</div>;

  // Review filtering
  const filteredReviews = combinedReviews.filter((r) => {
    const star = Math.round(Number(r.rating || 5));
    if (reviewFilter === "all") return true;
    if (reviewFilter === "5") return star === 5;
    if (reviewFilter === "4") return star === 4;
    if (reviewFilter === "3") return star === 3;
    if (reviewFilter === "2") return star === 2;
    if (reviewFilter === "1") return star === 1;
    if (reviewFilter === "critical") return star <= 3;
    return true;
  });

  const displayedReviews = showAllReviews ? filteredReviews : filteredReviews.slice(0, 3);
  const specs = getProductSpecs(data, t);

  return (
    <section className="p3d-page">
      {/* 🟢 TOAST NOTIFICATION POPUP */}
      {toast.show && (
        <div className="toast-popup-banner">
          <div className="toast-left">
            <span className="toast-check">
              {toast.type === "wishlist-remove"
                ? "💔"
                : toast.type === "wishlist"
                ? "💚"
                : toast.type?.startsWith("review")
                ? "⭐"
                : "✅"}
            </span>
            {toast.img && <img src={toast.img} alt="" className="toast-img" />}
            <div className="toast-info">
              <strong>{toast.title}</strong>
              <span className="toast-prod-title">{data.title}</span>
            </div>
          </div>
          <button
            className="toast-view-cart-btn"
            onClick={() =>
              navigate(
                toast.type.startsWith("wishlist")
                  ? "/wishlist"
                  : toast.type.startsWith("review")
                  ? "#reviews-section"
                  : "/cart"
              )
            }
          >
            {toast.type.startsWith("wishlist")
              ? t("productList.viewWishlist")
              : toast.type.startsWith("review")
              ? t("productDetail.customerReviews")
              : t("productList.viewCart")}
          </button>
        </div>
      )}

      {/* TOP NAVIGATION / SHARE BAR */}
      <div className="p3d-top-bar">
        <Link to="/productlist" className="p3d-back">{t("productDetail.backToProducts")}</Link>
        <div className="p3d-top-actions">
          <button
            type="button"
            className={`p3d-top-btn ${isCompared ? "active" : ""}`}
            onClick={handleToggleCompare}
          >
            ⚖️ {isCompared ? t("productDetail.inCompare") : t("productDetail.addToCompare")}
          </button>
          <button type="button" className="p3d-top-btn" onClick={handleShare}>
            📤 {t("productDetail.share")}
          </button>
        </div>
      </div>

      <div className="p3d-stage">
        <div className="p3d-card">
          {/* IMAGE GALLERY & ZOOM LENS */}
          <div className="p3d-gallery-side">
            <div
              className="p3d-image"
              ref={imgContainerRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <div className="p3d-image-bg-glow"></div>
              <div className="p3d-image-badge-tag">{t("productDetail.trendingProduct")}</div>
              <img
                src={galleryImages[selectedImgIndex] || galleryImages[0]}
                alt={data.title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://picsum.photos/seed/${data._id}/600/400`;
                }}
              />
              {/* Floating Zoom Magnifier Preview */}
              <div className="p3d-zoom-lens" style={zoomStyle} />
            </div>

            {/* THUMBNAILS ROW */}
            {galleryImages.length > 1 && (
              <div className="p3d-thumbnails-row">
                {galleryImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`p3d-thumb-btn ${selectedImgIndex === idx ? "active" : ""}`}
                    onClick={() => setSelectedImgIndex(idx)}
                  >
                    <img src={imgUrl} alt={`Angle ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
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

            {/* 🚚 DELIVERY PINCODE ESTIMATOR */}
            <div className="p3d-pincode-card">
              <span className="p3d-pincode-label">📍 {t("deliveryEstimator.title")}</span>
              <form onSubmit={handlePincodeCheck} className="p3d-pincode-form">
                <input
                  type="text"
                  maxLength={6}
                  placeholder={t("deliveryEstimator.placeholder")}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                  className="p3d-pincode-input"
                />
                <button type="submit" className="p3d-pincode-btn" disabled={pincodeLoading}>
                  {pincodeLoading ? t("deliveryEstimator.checking") : t("deliveryEstimator.checkBtn")}
                </button>
              </form>

              {pincodeResult && (
                <div className={`p3d-pincode-result ${pincodeResult.valid ? "valid" : "invalid"}`}>
                  {pincodeResult.valid ? (
                    <>
                      <p className="pincode-eta">{pincodeResult.eta}</p>
                      <p className="pincode-perk">{pincodeResult.cod}</p>
                      <p className="pincode-perk">{pincodeResult.freeShip}</p>
                    </>
                  ) : (
                    <p className="pincode-error">{pincodeResult.message}</p>
                  )}
                </div>
              )}
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

            {/* 📋 PRODUCT SPECIFICATIONS COLLAPSIBLE */}
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
                <span style={{ fontSize: "18px" }}>{isWishlisted ? "❤️" : "🤍"}</span>
                <span>{isWishlisted ? t("productDetail.wishlisted") : t("productDetail.addToWishlist")}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 🎁 FREQUENTLY BOUGHT TOGETHER BUNDLE */}
      {bundleItems.length > 0 && (
        <div className="p3d-bundle-container">
          <div className="p3d-bundle-card">
            <div className="p3d-bundle-header">
              <h3>🎁 {t("bundles.title")}</h3>
              <p>{t("bundles.subtitle")}</p>
            </div>

            <div className="p3d-bundle-row">
              <div className="p3d-bundle-items-visual">
                <div className="bundle-thumb-item main">
                  <img src={data.images?.[0] || ""} alt={data.title} />
                  <span>{data.title.slice(0, 20)}...</span>
                </div>
                <span className="bundle-plus">+</span>
                {bundleItems.map((bItem) => (
                  <React.Fragment key={bItem._id}>
                    <div className="bundle-thumb-item">
                      <img src={bItem.images?.[0] || ""} alt={bItem.title} />
                      <span>{bItem.title.slice(0, 20)}...</span>
                    </div>
                    {bItem !== bundleItems[bundleItems.length - 1] && <span className="bundle-plus">+</span>}
                  </React.Fragment>
                ))}
              </div>

              <div className="p3d-bundle-pricing-side">
                <div className="bundle-price-details">
                  <span className="bundle-total-label">{t("bundles.totalPrice")}:</span>
                  <strong className="bundle-total-val">₹{bundleTotal.toLocaleString()}</strong>
                </div>
                <button className="bundle-add-all-btn" onClick={handleAddBundleToCart}>
                  🛒 {t("bundles.buyBundle")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          ⭐ 4. PREMIUM MARKETPLACE REVIEWS & RATINGS SECTION
          ============================================================ */}
      <div className="p3d-reviews-section" ref={reviewsRef} id="reviews-section">
        <div className="p3d-reviews-heading-wrap">
          <div className="p3d-reviews-heading-left">
            <h2>{t("reviews.title")}</h2>
            <p className="p3d-reviews-heading-subtitle">{t("reviews.subtitle")}</p>
          </div>

          <div className="p3d-reviews-heading-actions">
            <button
              type="button"
              className="p3d-write-review-cta"
              onClick={handleOpenReviewModal}
            >
              {existingUserReview ? `✏️ ${t("reviews.editReview")}` : `✍️ ${t("reviews.writeReview")}`}
            </button>
          </div>
        </div>

        {/* 📊 RATING OVERVIEW & DISTRIBUTION BREAKDOWN */}
        <div className="p3d-rating-overview-card">
          <div className="p3d-overall-rating-block">
            <div className="p3d-score-badge-wrap">
              <span className="p3d-score-number">{finalRating.toFixed(1)}</span>
              <span className="p3d-score-star">★</span>
            </div>
            <StarRating rating={finalRating} size="lg" />
            <div className="p3d-score-meta">
              <strong>
                {totalReviews > 0
                  ? t("reviews.basedOn", { count: totalReviews })
                  : t("reviews.noReviewsTitle")}
              </strong>
            </div>
            {totalReviews > 0 && (
              <div className="p3d-recommend-pill">
                <span className="recommend-check">✓</span>
                <span>
                  <strong>{recommendPct}%</strong> {t("reviews.recommendNote")}
                </span>
              </div>
            )}
          </div>

          <div className="p3d-overview-divider"></div>

          <div className="p3d-distribution-block">
            <div className="p3d-dist-header">
              <span className="p3d-dist-title">{t("reviews.ratingBreakdown")}</span>
              <span className="p3d-dist-hint">{t("productDetail.specsSubtext")}</span>
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
          <span className="p3d-filter-label">{t("reviews.filterPrompt")}</span>
          <div className="p3d-filter-chips">
            <button
              type="button"
              className={`p3d-filter-chip ${reviewFilter === "all" ? "active" : ""}`}
              onClick={() => setReviewFilter("all")}
            >
              {t("reviews.allFilter", { count: totalReviews })}
            </button>
            <button
              type="button"
              className={`p3d-filter-chip ${reviewFilter === "5" ? "active" : ""}`}
              onClick={() => setReviewFilter("5")}
            >
              5 ★ ({combinedReviews.filter((r) => Math.round(Number(r.rating || 5)) === 5).length})
            </button>
            <button
              type="button"
              className={`p3d-filter-chip ${reviewFilter === "4" ? "active" : ""}`}
              onClick={() => setReviewFilter("4")}
            >
              4 ★ ({combinedReviews.filter((r) => Math.round(Number(r.rating || 5)) === 4).length})
            </button>
            <button
              type="button"
              className={`p3d-filter-chip ${reviewFilter === "3" ? "active" : ""}`}
              onClick={() => setReviewFilter("3")}
            >
              3 ★ ({combinedReviews.filter((r) => Math.round(Number(r.rating || 5)) === 3).length})
            </button>
            <button
              type="button"
              className={`p3d-filter-chip ${reviewFilter === "critical" ? "active" : ""}`}
              onClick={() => setReviewFilter("critical")}
            >
              {t("reviews.criticalFilter", { count: combinedReviews.filter((r) => Math.round(Number(r.rating || 5)) <= 3).length })}
            </button>
          </div>
        </div>

        {/* 💬 INDIVIDUAL REVIEW CARDS LIST */}
        <div className="p3d-reviews-list">
          {filteredReviews.length === 0 ? (
            <div className="p3d-empty-reviews-state">
              <div className="p3d-empty-reviews-icon">📝</div>
              <h3>{t("reviews.noReviewsTitle")}</h3>
              <p>{t("reviews.noReviewsDesc")}</p>
              <button
                type="button"
                className="p3d-write-first-review-btn"
                onClick={handleOpenReviewModal}
              >
                ✍️ {t("reviews.writeFirstReview")}
              </button>
            </div>
          ) : (
            displayedReviews.map((rev) => {
              const reviewId = rev.id || rev._id || rev.name;
              const defaultHelpful = ((Math.abs(String(reviewId).split("").reduce((a, b) => a + b.charCodeAt(0), 0)) % 7) + 2);
              const helpfulState = helpfulVotes[reviewId] || {
                voted: false,
                count: defaultHelpful,
              };

              return (
                <article className="p3d-review-card" key={reviewId}>
                  <div className="p3d-review-top">
                    <div className="p3d-reviewer-profile">
                      <div className="p3d-avatar">{rev.avatar || (rev.name || "VC").slice(0, 2).toUpperCase()}</div>
                      <div className="p3d-reviewer-meta">
                        <div className="reviewer-name-row">
                          <strong className="p3d-reviewer-name">{rev.name}</strong>
                          {rev.isUserReview && (
                            <span className="p3d-your-review-tag">{t("reviews.yourReviewBadge")}</span>
                          )}
                        </div>
                        {rev.isVerified && (
                          <span className="p3d-review-verified-badge">
                            ✓ {t("reviews.verifiedPurchase")}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="p3d-reviewer-date">📅 {rev.date || "Recently"}</span>
                  </div>

                  <div className="p3d-review-rating-line">
                    <StarRating rating={rev.rating} size="sm" showScore={true} />
                    <span className="p3d-rating-sentiment">
                      {getRatingLabel(Math.round(Number(rev.rating || 5)))}
                    </span>
                  </div>

                  {rev.title && <h4 className="p3d-review-headline">{rev.title}</h4>}

                  <p className="p3d-review-text">{rev.text}</p>

                  <div className="p3d-review-card-footer">
                    <button
                      type="button"
                      className={`p3d-helpful-btn ${helpfulState.voted ? "voted" : ""}`}
                      onClick={() => handleHelpfulVote(reviewId)}
                      title={helpfulState.voted ? "You found this helpful" : "Mark as helpful"}
                    >
                      <span>👍</span>
                      <span>{t("reviews.helpful")} ({helpfulState.count})</span>
                    </button>

                    {rev.isUserReview && (
                      <div className="p3d-user-review-actions">
                        <button
                          type="button"
                          className="p3d-edit-own-btn"
                          onClick={handleOpenReviewModal}
                        >
                          ✏️ {t("reviews.updateReview")}
                        </button>
                        <button
                          type="button"
                          className="p3d-delete-own-btn"
                          onClick={handleDeleteReview}
                        >
                          🗑️ {t("reviews.deleteReview")}
                        </button>
                      </div>
                    )}
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
            {showAllReviews ? t("reviews.showLess") : t("reviews.showAll", { count: filteredReviews.length })}
          </button>
        )}
      </div>

      {/* ============================================================
          📝 POLISHED WRITE / EDIT REVIEW MODAL
          ============================================================ */}
      {showReviewModal && (
        <div className="review-modal-overlay" onClick={() => setShowReviewModal(false)}>
          <div className="review-modal-container" onClick={(e) => e.stopPropagation()}>
            {/* MODAL HEADER */}
            <div className="review-modal-header">
              <div className="review-modal-header-left">
                <img
                  src={data.images?.[0] || `https://picsum.photos/seed/${data._id}/80/80`}
                  alt=""
                  className="review-modal-prod-thumb"
                />
                <div>
                  <h3>{existingUserReview ? t("reviews.editModalTitle") : t("reviews.writeModalTitle")}</h3>
                  <span className="review-modal-prod-title">{data.title}</span>
                </div>
              </div>
              <button
                type="button"
                className="review-modal-close-btn"
                onClick={() => setShowReviewModal(false)}
                title="Close"
              >
                ✕
              </button>
            </div>

            {/* MODAL FORM */}
            <form onSubmit={handleSaveReview} className="review-modal-form">
              {/* STAR RATING SELECTOR */}
              <div className="review-form-group">
                <label className="review-form-label">
                  {t("reviews.yourRating")} <span className="req-star">*</span>
                </label>
                <div className="review-star-picker">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`star-picker-btn ${
                        (hoverRating || reviewRating) >= star ? "active" : ""
                      }`}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setReviewRating(star)}
                      aria-label={`${star} Star`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="star-picker-feedback">
                    {getRatingLabel(hoverRating || reviewRating)}
                  </span>
                </div>
              </div>

              {/* REVIEW TITLE */}
              <div className="review-form-group">
                <label className="review-form-label">{t("reviews.reviewTitle")}</label>
                <input
                  type="text"
                  placeholder={t("reviews.reviewTitlePlaceholder")}
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  maxLength={80}
                  className="review-input-headline"
                />
              </div>

              {/* REVIEW BODY */}
              <div className="review-form-group">
                <div className="review-label-with-count">
                  <label className="review-form-label">
                    {t("reviews.reviewBody")} <span className="req-star">*</span>
                  </label>
                  <span className="review-char-count">
                    {t("reviews.charCount", { count: reviewBody.length })}
                  </span>
                </div>
                <textarea
                  placeholder={t("reviews.reviewBodyPlaceholder")}
                  value={reviewBody}
                  onChange={(e) => setReviewBody(e.target.value)}
                  maxLength={500}
                  rows={5}
                  className="review-textarea-body"
                />
              </div>

              {reviewFormError && (
                <div className="review-form-error-banner">
                  ⚠️ {reviewFormError}
                </div>
              )}

              {/* MODAL ACTIONS */}
              <div className="review-modal-actions-bar">
                {existingUserReview && (
                  <button
                    type="button"
                    className="review-delete-btn"
                    onClick={handleDeleteReview}
                  >
                    🗑️ {t("reviews.deleteReview")}
                  </button>
                )}

                <div className="review-actions-right">
                  <button
                    type="button"
                    className="review-cancel-btn"
                    onClick={() => setShowReviewModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="review-submit-btn"
                    disabled={isSubmittingReview}
                  >
                    {isSubmittingReview
                      ? t("reviews.submitting")
                      : existingUserReview
                      ? t("reviews.updateReview")
                      : t("reviews.submitReview")}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🕒 RECENTLY VIEWED PRODUCTS SECTION */}
      <RecentlyViewed excludeId={data._id} />

      {/* 📱 MOBILE STICKY BOTTOM PURCHASE BAR */}
      <div className="p3d-mobile-sticky-bar">
        <div className="p3d-sticky-price">
          <span className="p3d-sticky-label">{t("productDetail.specialPrice")}</span>
          <strong>₹{Number(data.price).toLocaleString()}</strong>
        </div>
        <div className="p3d-sticky-btns">
          <button className="p3d-sticky-cart-btn" onClick={handleCart}>
            🛒 {t("productDetail.addToCart")}
          </button>
          <button
            className="p3d-sticky-buy-btn"
            onClick={() => navigate("/checkout", { state: { singleItem: data } })}
          >
            ⚡ {t("cart.buyThisNow")}
          </button>
        </div>
      </div>
    </section>
  );
}

export default ProductDetail;
