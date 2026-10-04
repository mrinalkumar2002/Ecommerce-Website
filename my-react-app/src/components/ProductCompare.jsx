import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  removeFromCompare,
  clearCompare,
  openCompareModal,
  closeCompareModal,
} from "../redux/compareSlice";
import { addToCart } from "../redux/cartSlice";
import { useTranslation } from "react-i18next";
import ProductTransText from "./ProductTransText";
import { getProductReviews } from "../data/productReviews";
import api from "../api";
import "./ProductCompare.css";

export default function ProductCompare({ onShowToast }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, isOpen } = useSelector((state) => state.compare);
  const cartItems = useSelector((state) => state.cart.items || []);

  if (!items || items.length === 0) return null;

  const handleAddToCart = async (product) => {
    try {
      await api.get("/auth/me");
      const currentQty = cartItems.find((i) => String(i.productId || i._id) === String(product._id))?.quantity || 0;
      dispatch(addToCart({ ...product, quantity: 1 }));
      try {
        await api.post("/cart/add", {
          productId: product._id,
          title: product.title,
          price: product.price,
          images: product.images,
          quantity: 1,
          newTotalQty: currentQty + 1,
        });
      } catch {}
      if (onShowToast) {
        onShowToast({
          show: true,
          title: product.title,
          img: product.images?.[0] || "",
          type: "cart",
        });
      }
    } catch {
      navigate("/login");
    }
  };

  return (
    <>
      {/* 🏷️ FLOATING BOTTOM COMPARISON TRAY */}
      {!isOpen && (
        <div className="compare-floating-tray">
          <div className="compare-tray-left">
            <span className="compare-tray-icon">⚖️</span>
            <div>
              <strong>{t("compare.compareTray")}</strong>
              <small>{t("compare.compareCount", { count: items.length })}</small>
            </div>
          </div>

          <div className="compare-tray-thumbs">
            {items.map((item) => (
              <div key={item._id} className="compare-tray-thumb" title={item.title}>
                <img
                  src={item.images?.[0] || `https://picsum.photos/seed/${item._id}/100/100`}
                  alt={item.title}
                />
                <button
                  className="compare-thumb-remove"
                  onClick={() => dispatch(removeFromCompare(item._id))}
                  title={t("compare.remove")}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="compare-tray-actions">
            <button
              className="compare-tray-btn-primary"
              onClick={() => dispatch(openCompareModal())}
            >
              {t("compare.compareNow")} ({items.length})
            </button>
            <button
              className="compare-tray-btn-clear"
              onClick={() => dispatch(clearCompare())}
            >
              {t("compare.clearAll")}
            </button>
          </div>
        </div>
      )}

      {/* 📊 FULL COMPARISON MODAL */}
      {isOpen && (
        <div
          className="compare-modal-overlay"
          onClick={() => dispatch(closeCompareModal())}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="compare-modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div className="compare-modal-header">
              <div>
                <h2>⚖️ {t("compare.title")}</h2>
                <p>{t("compare.subtitle")}</p>
              </div>
              <div className="compare-modal-header-actions">
                <button
                  className="compare-clear-btn"
                  onClick={() => dispatch(clearCompare())}
                >
                  {t("compare.clearAll")}
                </button>
                <button
                  className="compare-close-btn"
                  onClick={() => dispatch(closeCompareModal())}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* COMPARISON TABLE */}
            <div className="compare-table-wrapper">
              <table className="compare-table">
                <thead>
                  <tr>
                    <th className="compare-feature-col">{t("compare.specifications")}</th>
                    {items.map((prod) => (
                      <th key={prod._id} className="compare-prod-col">
                        <div className="compare-header-card">
                          <button
                            className="compare-card-remove-btn"
                            onClick={() => dispatch(removeFromCompare(prod._id))}
                            title={t("compare.remove")}
                          >
                            ✕
                          </button>
                          <img
                            src={
                              prod.images?.[0] ||
                              `https://picsum.photos/seed/${prod._id}/300/200`
                            }
                            alt={prod.title}
                            onClick={() => {
                              dispatch(closeCompareModal());
                              navigate(`/productdetail/${prod._id}`);
                            }}
                          />
                          <h4>
                            <ProductTransText text={prod.title} />
                          </h4>
                          <span className="compare-prod-price">
                            ₹{Number(prod.price).toLocaleString()}
                          </span>
                          <button
                            className="compare-card-add-btn"
                            onClick={() => handleAddToCart(prod)}
                          >
                            🛒 {t("productList.addToCart")}
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Price */}
                  <tr>
                    <td className="compare-label-cell">{t("compare.price")}</td>
                    {items.map((prod) => (
                      <td key={prod._id} className="compare-val-cell highlight">
                        <strong>₹{Number(prod.price).toLocaleString()}</strong>
                      </td>
                    ))}
                  </tr>

                  {/* MRP & Discount */}
                  <tr>
                    <td className="compare-label-cell">{t("compare.mrp")}</td>
                    {items.map((prod) => (
                      <td key={prod._id} className="compare-val-cell">
                        <span className="compare-mrp-val">
                          ₹{Math.round(Number(prod.price) * 1.25).toLocaleString()}
                        </span>{" "}
                        <span className="compare-disc-val">(20% off)</span>
                      </td>
                    ))}
                  </tr>

                  {/* Rating */}
                  <tr>
                    <td className="compare-label-cell">{t("compare.rating")}</td>
                    {items.map((prod) => {
                      const { rating, reviewCount } = getProductReviews(prod._id);
                      return (
                        <td key={prod._id} className="compare-val-cell">
                          <span className="compare-star-badge">★ {rating.toFixed(1)}</span>
                          <span className="compare-review-sub">
                            ({reviewCount.toLocaleString()} {t("cart.ratings")})
                          </span>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Category */}
                  <tr>
                    <td className="compare-label-cell">{t("compare.category")}</td>
                    {items.map((prod) => (
                      <td key={prod._id} className="compare-val-cell capitalize">
                        {prod.category || "General"}
                      </td>
                    ))}
                  </tr>

                  {/* Stock Status */}
                  <tr>
                    <td className="compare-label-cell">{t("compare.stock")}</td>
                    {items.map((prod) => {
                      const stockCount = typeof prod.stock === "number" ? prod.stock : 25;
                      return (
                        <td key={prod._id} className="compare-val-cell">
                          <span
                            className={`compare-stock-pill ${
                              stockCount > 0 ? "in-stock" : "out-of-stock"
                            }`}
                          >
                            {stockCount > 0
                              ? `🟢 ${t("productDetail.inStock")} (${stockCount})`
                              : `🔴 ${t("productDetail.outOfStock")}`}
                          </span>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Description snippet */}
                  <tr>
                    <td className="compare-label-cell">Overview</td>
                    {items.map((prod) => (
                      <td key={prod._id} className="compare-val-cell desc">
                        <ProductTransText
                          text={
                            prod.description?.length > 100
                              ? prod.description.slice(0, 100) + "…"
                              : prod.description
                          }
                        />
                      </td>
                    ))}
                  </tr>

                  {/* Action */}
                  <tr>
                    <td className="compare-label-cell">{t("compare.action")}</td>
                    {items.map((prod) => (
                      <td key={prod._id} className="compare-val-cell">
                        <button
                          className="compare-table-action-btn"
                          onClick={() => {
                            dispatch(closeCompareModal());
                            navigate(`/productdetail/${prod._id}`);
                          }}
                        >
                          {t("quickView.viewFull")}
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
