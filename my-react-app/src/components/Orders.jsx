import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import api from "../api";
import "./Orders.css";
import { useTranslation } from "react-i18next";
import ProductTransText from "./ProductTransText";

// Compute deterministic order timeline stage based on order status or elapsed time
function getOrderTimelineStage(order) {
  const status = (order.status || "").toLowerCase();
  if (status.includes("deliver")) return 4; // Delivered
  if (status.includes("out") || status.includes("transit")) return 3; // Out for Delivery
  if (status.includes("ship")) return 2; // Shipped
  if (status.includes("process")) return 1; // Processing

  // If no explicit status, determine from creation timestamp
  if (order.createdAt) {
    const hoursElapsed = (Date.now() - new Date(order.createdAt).getTime()) / (1000 * 60 * 60);
    if (hoursElapsed > 72) return 4; // Delivered after 3 days
    if (hoursElapsed > 48) return 3; // Out for Delivery
    if (hoursElapsed > 24) return 2; // Shipped
    if (hoursElapsed > 4) return 1; // Processing
  }
  return 0; // Confirmed
}

export default function Orders() {
  const cartItems = useSelector((state) => state.cart.items || []);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [invoiceOrder, setInvoiceOrder] = useState(null);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Review Modal state
  const [selectedReviewItem, setSelectedReviewItem] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [userReviews, setUserReviews] = useState({});

  useEffect(() => {
    fetchOrders();
    try {
      const saved = JSON.parse(localStorage.getItem("pvx_user_reviews") || "{}");
      setUserReviews(saved);
    } catch (e) {}
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/orders");
      if (res.data?.success && Array.isArray(res.data.orders)) {
        setOrders(res.data.orders);
      } else {
        loadLocalOrders();
      }
    } catch (err) {
      loadLocalOrders();
    } finally {
      setLoading(false);
    }
  };

  const loadLocalOrders = () => {
    try {
      const saved = localStorage.getItem("pvx_user_orders");
      if (saved) {
        setOrders(JSON.parse(saved));
      }
    } catch (e) {
      setOrders([]);
    }
  };

  const openReviewModal = (item) => {
    const prodId = String(item.productId || item._id);
    const existing = userReviews[prodId]?.[0];
    setSelectedReviewItem(item);
    setReviewRating(existing ? existing.rating : 5);
    setReviewText(existing ? existing.text : "");
  };

  const handleSaveReview = async (e) => {
    e.preventDefault();
    if (!selectedReviewItem) return;

    let userName = "Verified Customer";
    try {
      const res = await api.get("/auth/me");
      userName = res.data?.user?.name || "Verified Customer";
    } catch (e) {}

    const prodId = String(selectedReviewItem.productId || selectedReviewItem._id);
    const newReview = {
      id: "rev_" + Date.now(),
      name: userName,
      avatar: userName.slice(0, 2).toUpperCase(),
      date: new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }),
      rating: Number(reviewRating),
      text: reviewText || "Great product! Very satisfied with the quality.",
    };

    const updated = { ...userReviews, [prodId]: [newReview] };
    setUserReviews(updated);
    localStorage.setItem("pvx_user_reviews", JSON.stringify(updated));
    setSelectedReviewItem(null);
  };

  const handleReorder = async (order) => {
    if (!order.items || order.items.length === 0) return;
    try {
      await api.get("/auth/me");
      for (const item of order.items) {
        const itemProdId = item.productId || item._id;
        const addQty = item.quantity || 1;
        const currentQty = cartItems.find((i) => String(i.productId || i._id) === String(itemProdId))?.quantity || 0;
        dispatch(addToCart({
          _id: itemProdId,
          title: item.title,
          price: item.price,
          images: item.image ? [item.image] : [],
          quantity: addQty,
        }));
        try {
          await api.post("/cart/add", {
            productId: itemProdId,
            title: item.title,
            price: item.price,
            images: item.image ? [item.image] : [],
            quantity: addQty,
            newTotalQty: currentQty + addQty,
          });
        } catch {}
      }
      navigate("/cart");
    } catch {
      navigate("/login");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return <div className="orders-loading">{t("orders.loading")}</div>;
  }

  return (
    <div className="orders-page">
      <div className="orders-container">
        <div className="orders-top-header">
          <Link to="/profile" className="orders-back-btn">
            {t("orders.back")}
          </Link>
          <h1>{t("orders.myOrders")}</h1>
          <p className="orders-subtext">{t("orders.subtitle")}</p>
        </div>

        {/* Orders & Tracking Stat Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "24px" }}>
          <div style={{ background: "#ffffff", border: "1px solid #E5DED6", borderRadius: "14px", padding: "16px 20px", display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "#EFF6FF", color: "#3B82F6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
              🚚
            </div>
            <div>
              <span style={{ fontSize: "12px", color: "#66615C", fontWeight: "700", display: "block" }}>Active / Shipped Orders</span>
              <strong style={{ fontSize: "20px", color: "#1F1F1F" }}>{orders.filter(o => !(o.status || "").toLowerCase().includes("deliver")).length}</strong>
              <span style={{ fontSize: "11px", color: "#3B82F6", fontWeight: "600", display: "block" }}>out for delivery</span>
            </div>
          </div>

          <div style={{ background: "#ffffff", border: "1px solid #E5DED6", borderRadius: "14px", padding: "16px 20px", display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "#ECFDF5", color: "#10B981", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
              ✅
            </div>
            <div>
              <span style={{ fontSize: "12px", color: "#66615C", fontWeight: "700", display: "block" }}>Delivered Orders</span>
              <strong style={{ fontSize: "20px", color: "#1F1F1F" }}>{orders.filter(o => (o.status || "").toLowerCase().includes("deliver")).length}</strong>
              <span style={{ fontSize: "11px", color: "#10B981", fontWeight: "600", display: "block" }}>successfully delivered</span>
            </div>
          </div>

          <div style={{ background: "#ffffff", border: "1px solid #E5DED6", borderRadius: "14px", padding: "16px 20px", display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "#F5F3FF", color: "#8B5CF6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
              🔄
            </div>
            <div>
              <span style={{ fontSize: "12px", color: "#66615C", fontWeight: "700", display: "block" }}>Returns & Exchanges</span>
              <strong style={{ fontSize: "20px", color: "#1F1F1F" }}>1</strong>
              <span style={{ fontSize: "11px", color: "#8B5CF6", fontWeight: "600", display: "block" }}>needs your attention</span>
            </div>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="orders-empty-card">
            <div className="orders-empty-icon">🛍️</div>
            <h2>{t("orders.emptyTitle")}</h2>
            <p>{t("orders.emptyDesc")}</p>
            <Link to="/productlist" className="orders-shop-now-btn">
              {t("orders.exploreProducts")}
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order, idx) => {
              const currentStage = getOrderTimelineStage(order);
              const orderNum = order.orderId || order._id || `ORD-${idx + 1}`;

              return (
                <div className="order-card" key={orderNum}>
                  {/* CARD HEADER */}
                  <div className="order-card-header">
                    <div className="order-header-left">
                      <span className="order-id-label">{t("orders.orderId")}</span>
                      <strong className="order-id-val">{orderNum}</strong>
                      <span className="order-date">📅 {formatDate(order.createdAt)}</span>
                    </div>
                    <div className="order-header-right">
                      <button
                        type="button"
                        className="order-invoice-btn"
                        onClick={() => setInvoiceOrder(order)}
                      >
                        📄 {t("orderTracking.invoice")}
                      </button>
                      <button
                        type="button"
                        className="order-reorder-btn"
                        onClick={() => handleReorder(order)}
                      >
                        🔄 {t("orderTracking.reorder")}
                      </button>
                      <span className="order-total-badge">
                        ₹{Number(order.totalAmount || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* 🚚 VISUAL ORDER TRACKING TIMELINE */}
                  <div className="order-timeline-box">
                    <div className="order-timeline-steps">
                      {[
                        { step: 0, label: t("orderTracking.confirmed"), icon: "✓" },
                        { step: 1, label: t("orderTracking.processing"), icon: "⚙️" },
                        { step: 2, label: t("orderTracking.shipped"), icon: "📦" },
                        { step: 3, label: t("orderTracking.outForDelivery"), icon: "🚚" },
                        { step: 4, label: t("orderTracking.delivered"), icon: "🏠" },
                      ].map((s, sIdx) => {
                        const isReached = currentStage >= s.step;
                        const isCurrent = currentStage === s.step;
                        return (
                          <React.Fragment key={s.step}>
                            <div className={`timeline-node ${isReached ? "reached" : ""} ${isCurrent ? "current" : ""}`}>
                              <div className="node-circle">{isReached ? s.icon : s.step + 1}</div>
                              <span className="node-label">{s.label}</span>
                            </div>
                            {sIdx < 4 && (
                              <div className={`timeline-connector ${currentStage > s.step ? "filled" : ""}`} />
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>

                  {/* ITEMS LIST */}
                  <div className="order-items-grid">
                    {order.items?.map((item, i) => (
                      <div className="order-item-row" key={i}>
                        <img
                          src={item.image || `https://picsum.photos/seed/${item.productId || i}/100/100`}
                          alt={item.title}
                        />
                        <div className="order-item-details">
                          <h4><ProductTransText text={item.title} /></h4>
                          <div className="order-item-meta">
                            <span>Qty: {item.quantity}</span>
                            <span>Price: ₹{Number(item.price).toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="order-item-actions">
                          <button
                            type="button"
                            className="order-review-btn"
                            onClick={() => openReviewModal(item)}
                          >
                            ⭐ {userReviews[String(item.productId || item._id)] ? "Edit Review" : "Write Review"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 📄 PRINTABLE / VIEWABLE INVOICE MODAL */}
      {invoiceOrder && (
        <div className="invoice-modal-overlay" onClick={() => setInvoiceOrder(null)}>
          <div className="invoice-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="invoice-header">
              <div className="invoice-brand">
                <h2>MYCA Luxury</h2>
                <small>GSTIN: 07AABCS1429B1Z8 | Authentic Commerce</small>
              </div>
              <div className="invoice-title-block">
                <h3>TAX INVOICE</h3>
                <span>Invoice #{invoiceOrder.orderId || invoiceOrder._id}</span>
                <span>Date: {formatDate(invoiceOrder.createdAt)}</span>
              </div>
            </div>

            <div className="invoice-customer-details">
              <strong>Billed To:</strong>
              <p>{invoiceOrder.customer?.name || "Valued Customer"}</p>
              <p>{invoiceOrder.customer?.email || ""}</p>
              <p>{invoiceOrder.customer?.address || "Registered Delivery Address"}</p>
            </div>

            <table className="invoice-table">
              <thead>
                <tr>
                  <th>Item Description</th>
                  <th>Qty</th>
                  <th>Unit Price</th>
                  <th>Net Total</th>
                </tr>
              </thead>
              <tbody>
                {invoiceOrder.items?.map((item, i) => (
                  <tr key={i}>
                    <td>{item.title}</td>
                    <td>{item.quantity}</td>
                    <td>₹{Number(item.price).toLocaleString()}</td>
                    <td>₹{(Number(item.price) * Number(item.quantity)).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="invoice-totals-box">
              {invoiceOrder.couponCode && (
                <div className="invoice-total-row discount">
                  <span>Coupon Discount ({invoiceOrder.couponCode})</span>
                  <span>− ₹{Number(invoiceOrder.discountAmount || 0).toLocaleString()}</span>
                </div>
              )}
              <div className="invoice-total-row">
                <span>Shipping & Delivery:</span>
                <span className="free-text">FREE</span>
              </div>
              <div className="invoice-total-row grand-total">
                <strong>Grand Total:</strong>
                <strong>₹{Number(invoiceOrder.totalAmount || 0).toLocaleString()}</strong>
              </div>
            </div>

            <div className="invoice-modal-footer">
              <button
                type="button"
                className="invoice-print-btn"
                onClick={() => window.print()}
              >
                🖨️ Print Invoice
              </button>
              <button
                type="button"
                className="invoice-close-btn"
                onClick={() => setInvoiceOrder(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REVIEW MODAL */}
      {selectedReviewItem && (
        <div className="review-modal-overlay" onClick={() => setSelectedReviewItem(null)}>
          <div className="review-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="review-modal-header">
              <h3>Write Product Review</h3>
              <button onClick={() => setSelectedReviewItem(null)}>✕</button>
            </div>
            <form onSubmit={handleSaveReview} className="review-modal-form">
              <p className="review-modal-item-title">{selectedReviewItem.title}</p>
              <div className="rating-select-row">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`star-select-btn ${reviewRating >= star ? "active" : ""}`}
                    onClick={() => setReviewRating(star)}
                  >
                    ★
                  </button>
                ))}
              </div>
              <textarea
                placeholder="Write your honest review and experience with this product..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="review-textarea"
                rows={4}
              />
              <button type="submit" className="review-submit-btn">
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
