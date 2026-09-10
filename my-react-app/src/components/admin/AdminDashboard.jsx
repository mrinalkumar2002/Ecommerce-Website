import React, { useEffect, useState } from "react";
import api from "../../api";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/stats");
      if (res.data?.stats) {
        setStats(res.data.stats);
      }
      if (res.data?.recentOrders) {
        setRecentOrders(res.data.recentOrders);
      }
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: "Total Products",
      value: stats.totalProducts,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
        </svg>
      ),
      color: "#6366f1",
      bg: "rgba(99, 102, 241, 0.1)",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      ),
      color: "#10b981",
      bg: "rgba(16, 185, 129, 0.1)",
    },
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
        </svg>
      ),
      color: "#f59e0b",
      bg: "rgba(245, 158, 11, 0.1)",
    },
    {
      label: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString("en-IN")}`,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
        </svg>
      ),
      color: "#ec4899",
      bg: "rgba(236, 72, 153, 0.1)",
    },
  ];

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-spinner"></div>
        <span>Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <h1 className="admin-page-title">Dashboard</h1>
      <p className="admin-page-desc">Welcome back! Here's your store overview.</p>

      {/* Stats Grid */}
      <div className="admin-stats-grid">
        {statCards.map((card, i) => (
          <div
            className="admin-stat-card"
            key={i}
            style={{ "--stat-color": card.color, "--stat-bg": card.bg }}
          >
            <div className="admin-stat-icon" style={{ background: card.bg, color: card.color }}>
              {card.icon}
            </div>
            <div className="admin-stat-info">
              <span className="admin-stat-value">{card.value}</span>
              <span className="admin-stat-label">{card.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="admin-section">
        <h2 className="admin-section-title">Recent Orders</h2>
        {recentOrders.length === 0 ? (
          <div className="admin-empty">No orders yet</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.orderId || order._id}>
                    <td className="admin-td-mono">{order.orderId}</td>
                    <td>{order.userEmail}</td>
                    <td>{order.items?.length || 0}</td>
                    <td className="admin-td-price">₹{order.totalAmount?.toLocaleString("en-IN")}</td>
                    <td>
                      <span className={`admin-status-badge status-${(order.status || "confirmed").toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="admin-td-date">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN") : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
