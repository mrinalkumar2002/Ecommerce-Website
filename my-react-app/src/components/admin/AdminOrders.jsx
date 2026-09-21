import React, { useEffect, useState } from "react";
import api from "../../api";
import "./AdminOrders.css";

const statuses = ["Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/admin/orders");
      setOrders(res.data?.orders || []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/admin/orders/${orderId}`, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) =>
          o.orderId === orderId ? { ...o, status: newStatus } : o
        )
      );
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.orderId?.toLowerCase().includes(search.toLowerCase()) ||
      o.userEmail?.toLowerCase().includes(search.toLowerCase()) ||
      o.status?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-spinner"></div>
        <span>Loading orders...</span>
      </div>
    );
  }

  return (
    <div className="admin-orders">
      <h1 className="admin-page-title">Orders</h1>
      <p className="admin-page-desc">{orders.length} total orders managed</p>

      {/* Stat Cards Grid */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: "#EFF6FF", color: "#3B82F6" }}>
            <img src="/total-orders-icon.png" alt="Total Orders" style={{ width: "46px", height: "46px", objectFit: "contain", borderRadius: "10px" }} />
          </div>
          <div className="admin-stat-info">
            <span className="admin-stat-value">{orders.length}</span>
            <span className="admin-stat-label">Total Orders</span>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: "#FEF3C7", color: "#D97706" }}>
            <img src="/in-transit-icon.png" alt="In-Transit / Active" style={{ width: "48px", height: "48px", objectFit: "contain", borderRadius: "12px" }} />
          </div>
          <div className="admin-stat-info">
            <span className="admin-stat-value">{orders.filter(o => ["Confirmed", "Processing", "Shipped"].includes(o.status)).length}</span>
            <span className="admin-stat-label">In-Transit / Active</span>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: "#F3E8FF", color: "#9333EA" }}>
            <img src="/delivered-orders-icon.png" alt="Delivered Orders" style={{ width: "46px", height: "46px", objectFit: "contain", borderRadius: "10px" }} />
          </div>
          <div className="admin-stat-info">
            <span className="admin-stat-value">{orders.filter(o => o.status === "Delivered").length}</span>
            <span className="admin-stat-label">Delivered Orders</span>
          </div>
        </div>
      </div>


      <div className="admin-search-bar">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Search by order ID, email, or status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredOrders.length === 0 ? (
        <div className="admin-empty">No orders found</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <React.Fragment key={order.orderId || order._id}>
                  <tr>
                    <td className="admin-td-mono">{order.orderId}</td>
                    <td>{order.userEmail}</td>
                    <td>{order.items?.length || 0}</td>
                    <td className="admin-td-price">₹{order.totalAmount?.toLocaleString("en-IN")}</td>
                    <td className="admin-td-payment">{order.paymentMethod || "-"}</td>
                    <td>
                      <select
                        className={`admin-status-select status-${(order.status || "confirmed").toLowerCase()}`}
                        value={order.status || "Confirmed"}
                        onChange={(e) => updateStatus(order.orderId, e.target.value)}
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="admin-td-date">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN") : "-"}
                    </td>
                    <td>
                      <button
                        className="admin-expand-btn"
                        onClick={() =>
                          setExpandedOrder(expandedOrder === order.orderId ? null : order.orderId)
                        }
                      >
                        {expandedOrder === order.orderId ? "▲" : "▼"}
                      </button>
                    </td>
                  </tr>
                  {expandedOrder === order.orderId && (
                    <tr className="admin-order-details-row">
                      <td colSpan="8">
                        <div className="admin-order-details">
                          <div className="admin-order-items">
                            <strong>Items:</strong>
                            {order.items?.map((item, idx) => (
                              <div key={idx} className="admin-order-item">
                                <span className="admin-order-item-title">{item.title}</span>
                                <span>× {item.quantity}</span>
                                <span className="admin-td-price">₹{item.price?.toLocaleString("en-IN")}</span>
                              </div>
                            ))}
                          </div>
                          {order.shippingAddress && Object.keys(order.shippingAddress).length > 0 && (
                            <div className="admin-order-address">
                              <strong>Shipping Address:</strong>
                              <span>
                                {order.shippingAddress.street && `${order.shippingAddress.street}, `}
                                {order.shippingAddress.city && `${order.shippingAddress.city}, `}
                                {order.shippingAddress.state && `${order.shippingAddress.state} `}
                                {order.shippingAddress.zip && order.shippingAddress.zip}
                              </span>
                            </div>
                          )}
                          {order.couponCode && (
                            <div className="admin-order-coupon">
                              <strong>Coupon:</strong> {order.couponCode} (-₹{order.discountAmount})
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
