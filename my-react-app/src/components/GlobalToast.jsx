import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function GlobalToast() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const handleShowToast = (e) => {
      if (!e.detail) return;
      const { title, text, img, type, duration } = e.detail;

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      setToast({
        title: title || (type === "wishlist" ? "Added to Wishlist ❤️" : type === "wishlist-remove" ? "Removed from Wishlist" : "Success"),
        text: text || "",
        img: img || "",
        type: type || "info",
      });

      timerRef.current = setTimeout(() => {
        setToast(null);
      }, duration || 3200);
    };

    window.addEventListener("pvx_show_toast", handleShowToast);
    return () => {
      window.removeEventListener("pvx_show_toast", handleShowToast);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (!toast) return null;

  const isWishlist = toast.type === "wishlist" || toast.type === "wishlist-remove";
  const isCart = toast.type === "cart";
  const isReview = toast.type?.startsWith("review");

  const getCheckIcon = () => {
    if (toast.type === "wishlist") return "❤️";
    if (toast.type === "wishlist-remove") return "💔";
    if (toast.type === "cart") return "✅";
    if (isReview) return "⭐";
    return "✨";
  };

  const handleAction = () => {
    setToast(null);
    if (isWishlist) {
      navigate("/wishlist");
    } else if (isCart) {
      navigate("/cart");
    } else if (isReview) {
      const el = document.getElementById("reviews-section");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="toast-popup-banner" role="status" aria-live="polite">
      <div className="toast-left">
        <span className="toast-check">{getCheckIcon()}</span>
        {toast.img && <img src={toast.img} alt="" className="toast-img" />}
        <div className="toast-info">
          <strong>{toast.title}</strong>
          {toast.text && <span className="toast-prod-title">{toast.text}</span>}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {(isWishlist || isCart || isReview) && (
          <button
            type="button"
            className="toast-view-cart-btn"
            onClick={handleAction}
          >
            {isWishlist
              ? t("productList.viewWishlist") || "View Wishlist"
              : isCart
              ? t("productList.viewCart") || "View Cart"
              : t("productDetail.customerReviews") || "View Reviews"}
          </button>
        )}
        <button
          type="button"
          onClick={() => setToast(null)}
          className="toast-close-btn"
          aria-label="Close notification"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
