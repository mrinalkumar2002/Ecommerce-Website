import React, { useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromWishlist, clearWishlist } from "../redux/wishlistSlice";
import { addToCart } from "../redux/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import "./Wishlist.css";
import { useTranslation } from "react-i18next";
import ProductTransText from "./ProductTransText";
import VirtualTryOnModal from "./VirtualTryOnModal";

function Wishlist() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [tryOnProduct, setTryOnProduct] = useState(null);

  // Safely select wishlist items with array validation
  const rawWishlistItems = useSelector((state) => state.wishlist?.items);
  const wishlistItems = useMemo(() => {
    if (Array.isArray(rawWishlistItems)) {
      return rawWishlistItems.filter((item) => item && typeof item === "object");
    }
    try {
      const stored = localStorage.getItem("pvx_wishlist");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.filter((item) => item && typeof item === "object");
        }
      }
    } catch {}
    return [];
  }, [rawWishlistItems]);

  const handleAddToCart = async (product) => {
    if (!product) return;
    const prodId = String(product._id || product.productId || `prod_${Date.now()}`);
    const prodTitle = product.title || "Product";
    const prodPrice = Number(product.price) || 0;
    const prodImages =
      Array.isArray(product.images) && product.images.length > 0
        ? product.images
        : product.image
        ? [product.image]
        : [`https://picsum.photos/seed/${prodId}/400/300`];

    dispatch(
      addToCart({
        _id: prodId,
        productId: prodId,
        title: prodTitle,
        price: prodPrice,
        images: prodImages,
        quantity: 1,
      })
    );

    dispatch(removeFromWishlist(prodId));

    window.dispatchEvent(
      new CustomEvent("pvx_show_toast", {
        detail: {
          title: t("productList.itemAddedToCart") || "Added to Cart ✅",
          text: prodTitle,
          img: prodImages[0],
          type: "cart",
        },
      })
    );

    try {
      await api.post("/cart/add", {
        productId: prodId,
        title: prodTitle,
        price: prodPrice,
        images: prodImages,
        quantity: 1,
      });
    } catch {}
  };

  const handleRemove = (productId, title, img) => {
    dispatch(removeFromWishlist(productId));
    window.dispatchEvent(
      new CustomEvent("pvx_show_toast", {
        detail: {
          title: "Removed from Wishlist",
          text: title || "Product",
          img: img || "",
          type: "wishlist-remove",
        },
      })
    );
  };

  const handleClearAll = () => {
    dispatch(clearWishlist());
    window.dispatchEvent(
      new CustomEvent("pvx_show_toast", {
        detail: {
          title: "Wishlist Cleared",
          text: "All items removed from wishlist",
          type: "wishlist-remove",
        },
      })
    );
  };

  return (
    <div className="wishlist-page">
      <div className="wishlist-container">
        <Link to="/profile" className="wishlist-back-btn">
          {t("wishlist.back") || "← Back to Account"}
        </Link>

        <div className="wishlist-header">
          <h1>{t("wishlist.myWishlist") || "My Wishlist"}</h1>
          {wishlistItems && wishlistItems.length > 0 && (
            <button
              type="button"
              className="wishlist-clear-btn"
              onClick={handleClearAll}
            >
              {t("wishlist.clearAll") || "Clear All"}
            </button>
          )}
        </div>

        {!wishlistItems || wishlistItems.length === 0 ? (
          <div className="wishlist-empty">
            <div className="empty-icon">💔</div>
            <h2>{t("wishlist.emptyTitle") || "Your wishlist is empty"}</h2>
            <p>
              {t("wishlist.emptyDesc") ||
                "Explore our top categories and save items you want to shop later."}
            </p>
            <Link to="/productlist" className="wishlist-shop-btn">
              {t("wishlist.discoverProducts") || "Discover Products"}
            </Link>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlistItems.map((item, idx) => {
              if (!item) return null;
              const id = String(item._id || item.productId || `wish_${idx}`);
              const title = item.title || "Luxury Product";
              const price = Number(item.price) || 0;
              const imageSrc =
                (Array.isArray(item.images) && item.images[0]) ||
                item.image ||
                `https://picsum.photos/seed/${id}/400/300`;

              return (
                <div
                  key={id}
                  className="wishlist-card"
                  onClick={() => navigate(`/productdetail/${id}`)}
                >
                  <button
                    type="button"
                    className="wishlist-remove-card-btn"
                    title={t("wishlist.removeFromWishlist") || "Remove from Wishlist"}
                    aria-label={t("wishlist.removeFromWishlist") || "Remove from Wishlist"}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(id, title, imageSrc);
                    }}
                  >
                    ✕
                  </button>

                  <div className="wishlist-media">
                    <img
                      src={imageSrc}
                      alt={title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://picsum.photos/seed/${id}/400/300`;
                      }}
                    />
                  </div>

                  <div className="wishlist-details">
                    <h3>
                      <ProductTransText text={title} />
                    </h3>
                    <div className="wishlist-price-row">
                      <span className="wishlist-price">
                        ₹{price.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="wishlist-add-cart-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(item);
                      }}
                    >
                      {t("wishlist.moveToCart") || "Move to Cart"}
                    </button>
                    <button
                      type="button"
                      className="wishlist-try-on-btn"
                      style={{
                        background: "#FAF8F5",
                        border: "1px solid #8B5E3C",
                        color: "#8B5E3C",
                        padding: "8px 16px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "600",
                        marginTop: "8px",
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px"
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setTryOnProduct(item);
                      }}
                    >
                      ✨ Try On
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {tryOnProduct && (
        <VirtualTryOnModal
          isOpen={true}
          onClose={() => setTryOnProduct(null)}
          initialProduct={tryOnProduct}
          onToast={(toastData) => {
            window.dispatchEvent(
              new CustomEvent("pvx_show_toast", { detail: toastData })
            );
          }}
        />
      )}
    </div>
  );
}

export default Wishlist;
