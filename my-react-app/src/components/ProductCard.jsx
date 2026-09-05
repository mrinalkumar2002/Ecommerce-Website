import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, updateQuantity, removeFromCart } from "../redux/cartSlice";
import { addToWishlist, removeFromWishlist } from "../redux/wishlistSlice";
import { addToCompare, openCompareModal } from "../redux/compareSlice";
import { getProductReviews } from "../data/productReviews";
import { useTranslation } from "react-i18next";
import ProductTransText from "./ProductTransText";
import api from "../api";
import "./ProductCard.css";

const ALLOWED_CATEGORIES = ["electronics", "clothes", "sports", "shoes"];

export function getProductCategory(p) {
  if (p.category && ALLOWED_CATEGORIES.includes(p.category.toLowerCase())) {
    return p.category.toLowerCase();
  }
  const text = `${p.title || ""} ${p.description || ""}`.toLowerCase();
  if (text.includes("shoe") || text.includes("sneaker") || text.includes("boot") || text.includes("footwear")) return "shoes";
  if (text.includes("sport") || text.includes("ball") || text.includes("fitness") || text.includes("gym")) return "sports";
  if (text.includes("shirt") || text.includes("cloth") || text.includes("wear") || text.includes("dress") || text.includes("pant") || text.includes("jacket") || text.includes("powder") || text.includes("beauty") || text.includes("lipstick")) return "clothes";
  return "electronics";
}

export function getProductBadge(product) {
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

export default function ProductCard({
  product,
  onQuickView,
  onToast,
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist?.items || []);
  const compareItems = useSelector((state) => state.compare?.items || []);

  const [adding, setAdding] = useState(false);

  if (!product) return null;

  const isWishlisted = wishlistItems.some(
    (i) => String(i.productId || i._id) === String(product._id)
  );
  const isCompared = compareItems.some((i) => String(i._id) === String(product._id));
  const cartItem = cartItems.find(
    (i) => String(i.productId || i._id) === String(product._id)
  );

  const prodCat = getProductCategory(product);
  const badge = getProductBadge(product);
  const { rating, reviewCount } = getProductReviews(product._id);
  const price = Number(product.price) || 0;
  const mrp = Math.round(price * 1.25);
  const discountPercent = 20;

  const handleCardClick = () => {
    navigate(`/productdetail/${product._id}`);
  };

  const handleToggleWishlist = async (e) => {
    e.stopPropagation();
    try {
      await api.get("/auth/me");
      if (isWishlisted) {
        dispatch(removeFromWishlist(product._id || product.productId));
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
        if (onToast) {
          onToast({
            show: true,
            title: product.title,
            img: product.images?.[0] || "",
            type: "wishlist-remove",
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
        if (onToast) {
          onToast({
            show: true,
            title: product.title,
            img: product.images?.[0] || "",
            type: "wishlist",
          });
        }
      }
    } catch {
      navigate("/login");
    }
  };

  const handleToggleCompare = (e) => {
    e.stopPropagation();
    if (!isCompared && compareItems.length >= 4) {
      dispatch(openCompareModal());
      return;
    }
    dispatch(addToCompare(product));
  };

  const [addedFeedback, setAddedFeedback] = useState(false);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    try {
      setAdding(true);
      await api.get("/auth/me");
      dispatch(addToCart({ ...product, quantity: 1 }));
      setAddedFeedback(true);
      setTimeout(() => setAddedFeedback(false), 1200);
      try {
        await api.post("/cart/add", {
          productId: product._id,
          title: product.title,
          price: product.price,
          images: product.images,
          quantity: 1,
        });
      } catch {}

      if (onToast) {
        onToast({
          show: true,
          title: product.title,
          img: product.images?.[0] || "",
          type: "cart",
        });
      }
    } catch {
      navigate("/login");
    } finally {
      setAdding(false);
    }
  };

  const handleIncreaseQty = async (e, currentQty) => {
    e.stopPropagation();
    const newQty = currentQty + 1;
    dispatch(updateQuantity({ productId: product._id, quantity: newQty }));
    try {
      await api.patch(`/cart/${product._id}`, { quantity: newQty });
    } catch {}
  };

  const handleDecreaseQty = async (e, currentQty) => {
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

  return (
    <article className="mp-product-card" onClick={handleCardClick}>
      {/* 🖼️ MEDIA & FLOATING ACTIONS */}
      <div className="mp-card-media">
        {badge && (
          <span className={`mp-badge-pill mp-badge-${badge.type}`}>
            {t(badge.label)}
          </span>
        )}

        <div className="mp-card-floating-actions">
          {/* Wishlist Heart */}
          <button
            type="button"
            className={`mp-action-btn mp-wishlist-btn ${isWishlisted ? "active" : ""}`}
            onClick={handleToggleWishlist}
            title={isWishlisted ? t("productList.removeFromWishlist") : t("productList.addToWishlist")}
            aria-label="Wishlist"
          >
            {isWishlisted ? "❤️" : "🤍"}
          </button>

          {/* Compare Button */}
          <button
            type="button"
            className={`mp-action-btn mp-compare-btn ${isCompared ? "active" : ""}`}
            onClick={handleToggleCompare}
            title={isCompared ? t("productDetail.inCompare") : t("productDetail.addToCompare")}
            aria-label="Compare"
          >
            ⚖️
          </button>
        </div>

        <div className="mp-img-wrap">
          <img
            src={
              product.images?.length
                ? product.images[0]
                : `https://picsum.photos/seed/${product._id}/600/400`
            }
            alt={product.title}
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://picsum.photos/seed/${product._id}/600/400`;
            }}
          />
        </div>

        {/* Hover Quick View Trigger */}
        {onQuickView && (
          <button
            type="button"
            className="mp-quick-view-overlay-btn"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
          >
            👁️ {t("quickView.title")}
          </button>
        )}
      </div>

      {/* 📋 CARD CONTENT */}
      <div className="mp-card-body">
        <span className="mp-card-cat">{prodCat}</span>

        <h3 className="mp-card-title" title={product.title}>
          <ProductTransText text={product.title} />
        </h3>

        {/* ⭐ RATING & REVIEWS */}
        <div className="mp-card-rating-row">
          <span className="mp-rating-pill">
            ★ {rating.toFixed(1)}
          </span>
          <span className="mp-reviews-count">
            ({reviewCount.toLocaleString()})
          </span>
        </div>

        {/* 💰 PRICE & MRP HIERARCHY */}
        <div className="mp-card-price-row">
          <div className="mp-price-group">
            <strong className="mp-price-current">
              ₹{price.toLocaleString()}
            </strong>
            <span className="mp-price-mrp">
              ₹{mrp.toLocaleString()}
            </span>
          </div>
          <span className="mp-price-discount-tag">
            {discountPercent}% OFF
          </span>
        </div>
      </div>

      {/* 🛒 FOOTER CTA */}
      <div className="mp-card-footer">
        {cartItem ? (
          <div className="mp-qty-control" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="mp-qty-btn"
              onClick={(e) => handleDecreaseQty(e, cartItem.quantity)}
              title={cartItem.quantity === 1 ? t("productList.removeFromCart") : t("productList.decreaseQuantity")}
            >
              −
            </button>
            <span className="mp-qty-val">{cartItem.quantity}</span>
            <button
              type="button"
              className="mp-qty-btn"
              onClick={(e) => handleIncreaseQty(e, cartItem.quantity)}
              title={t("productList.increaseQuantity")}
            >
              +
            </button>
          </div>
        ) : (
          <button
            type="button"
            className={`mp-add-cart-btn ${addedFeedback ? "mp-added-success" : ""}`}
            onClick={handleAddToCart}
            disabled={adding}
          >
            {addedFeedback ? "✓ Added!" : adding ? `⏳ ${t("productList.adding")}` : `🛒 ${t("productList.addToCart")}`}
          </button>
        )}
      </div>
    </article>
  );
}
