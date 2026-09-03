import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromWishlist, clearWishlist } from "../redux/wishlistSlice";
import { addToCart } from "../redux/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import "./Wishlist.css";
import { useTranslation } from "react-i18next";
import ProductTransText from "./ProductTransText";

function Wishlist() {
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [addedToast, setAddedToast] = useState("");

  const handleAddToCart = async (product) => {
    dispatch(addToCart({ ...product, quantity: 1 }));
    setAddedToast(product.title);
    setTimeout(() => setAddedToast(""), 3000);
    try {
      await api.post("/cart/add", {
        productId: product._id,
        title: product.title,
        price: product.price,
        images: product.images,
        quantity: 1,
      });
    } catch {}
  };

  const handleRemove = (productId) => {
    dispatch(removeFromWishlist(productId));
  };

  return (
    <div className="wishlist-page">
      {addedToast && (
        <div className="toast-popup-banner">
          <div className="toast-left">
            <span className="toast-check">✅</span>
            <div className="toast-info">
              <strong>{t('productList.itemAddedToCart')}</strong>
              <span className="toast-prod-title"><ProductTransText text={addedToast} /></span>
            </div>
          </div>
          <button className="toast-view-cart-btn" onClick={() => navigate("/cart")}>
            {t('productList.viewCart')}
          </button>
        </div>
      )}

      <div className="wishlist-container">
        <Link to="/profile" className="wishlist-back-btn">
          {t('wishlist.back')}
        </Link>
        <div className="wishlist-header">
          <h1>{t('wishlist.myWishlist')}</h1>
          {wishlistItems.length > 0 && (
            <button className="wishlist-clear-btn" onClick={() => dispatch(clearWishlist())}>
              {t('wishlist.clearAll')}
            </button>
          )}
        </div>

        {wishlistItems.length === 0 ? (
          <div className="wishlist-empty">
            <div className="empty-icon">💔</div>
            <h2>{t('wishlist.emptyTitle')}</h2>
            <p>{t('wishlist.emptyDesc')}</p>
            <Link to="/productlist" className="wishlist-shop-btn">
              {t('wishlist.discoverProducts')}
            </Link>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlistItems.map((item) => (
              <div
                key={item._id}
                className="wishlist-card"
                onClick={() => navigate(`/productdetail/${item._id}`)}
              >
                <button
                  className="wishlist-remove-card-btn"
                  title={t('wishlist.removeFromWishlist')}
                  aria-label={t('wishlist.removeFromWishlist')}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(item._id);
                  }}
                >
                  ✕
                </button>
                <div className="wishlist-media">
                  <img
                    src={item.images?.[0] || `https://picsum.photos/seed/${item._id}/400/300`}
                    alt={item.title}
                  />
                </div>
                <div className="wishlist-details">
                  <h3><ProductTransText text={item.title} /></h3>
                  <div className="wishlist-price-row">
                    <span className="wishlist-price">₹{item.price}</span>
                  </div>
                  <button
                    className="wishlist-add-cart-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(item);
                    }}
                  >
                    {t('wishlist.moveToCart')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;
