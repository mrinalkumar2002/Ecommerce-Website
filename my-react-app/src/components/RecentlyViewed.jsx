import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ProductTransText from "./ProductTransText";
import "./RecentlyViewed.css";

const RECENTLY_VIEWED_KEY = "pvx_recently_viewed";

export function addRecentlyViewed(product) {
  if (!product || !product._id) return;
  try {
    const raw = localStorage.getItem(RECENTLY_VIEWED_KEY);
    let items = raw ? JSON.parse(raw) : [];
    items = items.filter((p) => String(p._id) !== String(product._id));
    items.unshift({
      _id: product._id,
      title: product.title,
      price: product.price,
      images: product.images || [],
      category: product.category || "",
      timestamp: Date.now(),
    });
    if (items.length > 12) items = items.slice(0, 12);
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(items));
  } catch (err) {
    console.warn("Could not save to recently viewed", err);
  }
}

export default function RecentlyViewed({ excludeId = null }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  const loadItems = () => {
    try {
      const raw = localStorage.getItem(RECENTLY_VIEWED_KEY);
      if (raw) {
        let parsed = JSON.parse(raw);
        if (excludeId) {
          parsed = parsed.filter((i) => String(i._id) !== String(excludeId));
        }
        setItems(parsed);
      } else {
        setItems([]);
      }
    } catch {
      setItems([]);
    }
  };

  useEffect(() => {
    loadItems();
  }, [excludeId]);

  const handleClear = () => {
    localStorage.removeItem(RECENTLY_VIEWED_KEY);
    setItems([]);
  };

  if (!items || items.length === 0) return null;

  return (
    <section className="recently-viewed-section" aria-label="Recently Viewed Products">
      <div className="recently-viewed-header">
        <div>
          <h3 className="recently-viewed-title">🕒 {t("recentlyViewed.title")}</h3>
          <p className="recently-viewed-sub">{t("recentlyViewed.subtitle")}</p>
        </div>
        <button
          type="button"
          className="recently-viewed-clear-btn"
          onClick={handleClear}
          title={t("recentlyViewed.clear")}
        >
          🗑️ {t("recentlyViewed.clear")}
        </button>
      </div>

      <div className="recently-viewed-track">
        {items.map((prod) => (
          <article
            key={prod._id}
            className="recently-viewed-card"
            onClick={() => navigate(`/productdetail/${prod._id}`)}
          >
            <div className="recently-viewed-img-wrap">
              <img
                src={prod.images?.[0] || `https://picsum.photos/seed/${prod._id}/300/200`}
                alt={prod.title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://picsum.photos/seed/${prod._id}/300/200`;
                }}
              />
            </div>
            <div className="recently-viewed-body">
              <h4><ProductTransText text={prod.title} /></h4>
              <span className="recently-viewed-price">₹{Number(prod.price).toLocaleString()}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
