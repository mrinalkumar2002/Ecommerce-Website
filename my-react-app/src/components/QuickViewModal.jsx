import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { addToWishlist, removeFromWishlist } from "../redux/wishlistSlice";
import { useTranslation } from "react-i18next";
import ProductTransText from "./ProductTransText";
import { getProductReviews } from "../data/productReviews";
import "./QuickViewModal.css";
import api from "../api";

export default function QuickViewModal({ product, onClose, onShowToast }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist?.items || []);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  const isWishlisted = wishlistItems.some((i) => String(i.productId || i._id) === String(product._id));
  const { rating, reviewCount } = getProductReviews(product._id);
  const mrp = Math.round(Number(product.price) * 1.25);

  const handleAddToCart = async () => {
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
          type: "cart"
        });
      }
      onClose();
    } catch {
      navigate("/login");
    }
  };

  const handleToggleWishlist = async () => {
    try {
      await api.get("/auth/me");
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
        if (onShowToast) {
          onShowToast({
            show: true,
            title: product.title,
            img: product.images?.[0] || "",
            type: "wishlist-remove"
          });
        }
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
        if (onShowToast) {
          onShowToast({
            show: true,
            title: product.title,
            img: product.images?.[0] || "",
            type: "wishlist"
          });
        }
      }
    } catch {
      navigate("/login");
    }
  };

  const handleViewFull = () => {
    onClose();
    navigate(`/productdetail/${product._id}`);
  };

  return (
    <div className="quickview-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={product.title}>
      <div className="quickview-modal" onClick={(e) => e.stopPropagation()}>
        <button className="quickview-close-btn" onClick={onClose} aria-label="Close modal">✕</button>

        <div className="quickview-grid">
          {/* MEDIA */}
          <div className="quickview-media">
            <img
              src={product.images?.[0] || `https://picsum.photos/seed/${product._id}/600/400`}
              alt={product.title}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://picsum.photos/seed/${product._id}/600/400`;
              }}
            />
            <button
              type="button"
              className={`quickview-heart-btn ${isWishlisted ? "active" : ""}`}
              onClick={handleToggleWishlist}
              title={isWishlisted ? t("productList.removeFromWishlist") : t("productList.addToWishlist")}
            >
              {isWishlisted ? "❤️" : "🤍"}
            </button>
          </div>

          {/* DETAILS */}
          <div className="quickview-content">
            <span className="quickview-cat-badge">{product.category || "General"}</span>
            <h2 className="quickview-title"><ProductTransText text={product.title} /></h2>

            {/* RATING */}
            <div className="quickview-rating-row">
              <span className="quickview-star-pill">★ {rating.toFixed(1)}</span>
              <span className="quickview-review-count">({reviewCount.toLocaleString()} {t("productDetail.customerReviews")})</span>
            </div>

            {/* PRICING */}
            <div className="quickview-price-box">
              <span className="quickview-curr-price">₹{Number(product.price).toLocaleString()}</span>
              <span className="quickview-mrp-price">₹{mrp.toLocaleString()}</span>
              <span className="quickview-discount-tag">20% {t("productDetail.off")}</span>
            </div>

            <p className="quickview-desc">
              <ProductTransText
                text={
                  product.description?.length > 140
                    ? product.description.slice(0, 140) + "…"
                    : product.description
                }
              />
            </p>

            <div className="quickview-stock-line">
              <span className="stock-dot">🟢</span>
              <span>{t("productDetail.inStock")} ({product.stock || 25} {t("productDetail.units")})</span>
            </div>

            {/* ACTIONS */}
            <div className="quickview-actions">
              <button className="quickview-add-btn" onClick={handleAddToCart}>
                🛒 {t("productList.addToCart")}
              </button>
              <button className="quickview-view-full-btn" onClick={handleViewFull}>
                {t("quickView.viewFull")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
