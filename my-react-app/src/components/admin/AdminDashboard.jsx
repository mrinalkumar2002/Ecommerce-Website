import React, { useEffect, useState, useCallback } from "react";
import api from "../../api";
import "./AdminDashboard.css";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [monthFilter, setMonthFilter] = useState(6);
  const [chartLoading, setChartLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats(monthFilter);
  }, [monthFilter]);

  const fetchStats = useCallback(async (months = 6) => {
    try {
      setChartLoading(true);
      const res = await api.get(`/admin/stats?months=${months}`);
      if (res.data?.stats) setStats(res.data.stats);
      if (res.data?.recentOrders) setRecentOrders(res.data.recentOrders);
      if (res.data?.lowStockProducts) setLowStockProducts(res.data.lowStockProducts);
      if (res.data?.monthlySales) setMonthlySales(res.data.monthlySales);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setLoading(false);
      setChartLoading(false);
    }
  }, []);

  const statCards = [
    {
      label: "Total Revenue",
      value: stats.totalRevenue > 0 ? `₹${stats.totalRevenue.toLocaleString("en-IN")}` : "₹4,82,315",
      trendVal: "↑ 14.2%",
      trendText: "vs last month",
      icon: "/total-revenue-icon.png",
      color: "#10B981",
      bg: "#ECFDF5",
      hasDots: true,
    },
    {
      label: "Total Orders",
      value: stats.totalOrders > 0 ? stats.totalOrders.toLocaleString("en-IN") : "1,284",
      trendVal: "↑ 6.8%",
      trendText: "vs last month",
      icon: "/total-orders-icon.png",
      color: "#3B82F6",
      bg: "#EFF6FF",
      hasDots: true,
    },
    {
      label: "Active Users",
      value: stats.totalUsers > 0 ? stats.totalUsers.toLocaleString("en-IN") : "2,846",
      trendVal: "↑ 8.4%",
      trendText: "vs last month",
      icon: "👥",
      color: "#8B5CF6",
      bg: "#F5F3FF",
      hasDots: true,
    },
    {
      label: "Total Products",
      value: stats.totalProducts > 0 ? stats.totalProducts.toLocaleString("en-IN") : "486",
      trendVal: "+24",
      trendText: "added this month",
      icon: "/product-box-icon.png",
      color: "#D97706",
      bg: "#FFFBEB",
      hasDots: true,
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
      <h1 className="admin-page-title">📊 Admin Dashboard</h1>
      <p className="admin-page-desc">Welcome back! Here's your store performance snapshot.</p>

      {/* Stats Grid */}
      <div className="admin-stats-grid">
        {statCards.map((card, i) => (
          <div className="admin-stat-card" key={i}>
            <div className="admin-stat-icon" style={{ background: card.bg, color: card.color }}>
              {typeof card.icon === "string" && (card.icon.endsWith(".png") || card.icon.startsWith("/")) ? (
                <img src={card.icon} alt={card.label} style={{ width: "46px", height: "46px", objectFit: "contain", borderRadius: "10px" }} />
              ) : (
                card.icon
              )}
            </div>
            <div className="admin-stat-info">
              <div className="admin-stat-top">
                <span className="admin-stat-label">{card.label}</span>
                {card.hasDots && <span className="admin-stat-dots">⋮</span>}
              </div>
              <span className="admin-stat-value">{card.value}</span>
              <div className="admin-stat-subtext">
                <span className="trend-up">{card.trendVal}</span>{" "}
                <span style={{ color: "#94A3B8", fontWeight: "500" }}>{card.trendText}</span>
              </div>
            </div>
          </div>
        ))}
      </div>


      <div className="admin-dashboard-row">
        {/* Sales Chart */}
        <div className="admin-section flex-2">
          <div className="admin-chart-header">
            <h2 className="admin-section-title">Sales Analytics</h2>
            <div className="admin-chart-toggle">
              {[3, 6, 12].map(m => (
                <button
                  key={m}
                  className={`admin-toggle-btn ${monthFilter === m ? 'active' : ''}`}
                  onClick={() => setMonthFilter(m)}
                >
                  {m}M
                </button>
              ))}
            </div>
          </div>
          {chartLoading ? (
            <div className="admin-chart-loading">Updating chart...</div>
          ) : (
            <div style={{ width: '100%', height: 320 }}>
              <ResponsiveContainer>
                <BarChart data={monthlySales} barGap={4} margin={{ top: 10, right: 10, left: 15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis
                    yAxisId="left"
                    width={75}
                    tick={{ fontSize: 12, fill: '#6366f1', fontWeight: 600 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(val) => {
                      if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
                      if (val >= 100000) return `₹${(val / 100000).toFixed(0)}L`;
                      if (val >= 1000) return `₹${(val / 1000).toFixed(0)}k`;
                      return `₹${val}`;
                    }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    width={45}
                    tick={{ fontSize: 12, fill: '#10b981', fontWeight: 600 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(val) => `${val}`}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '13px' }}
                    formatter={(value, name) => [
                      name === 'sales' ? `₹${Number(value).toLocaleString('en-IN')}` : value,
                      name === 'sales' ? 'Revenue' : 'Orders'
                    ]}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="sales" name="sales" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  <Bar yAxisId="right" dataKey="orders" name="orders" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div className="admin-section flex-1">
          <h2 className="admin-section-title" style={{ color: "#ef4444" }}>Low Stock Alerts</h2>
          {lowStockProducts.length === 0 ? (
            <div className="admin-empty">Inventory looks good!</div>
          ) : (
            <ul className="admin-alert-list">
              {lowStockProducts.map(p => (
                <li key={p._id} className="admin-alert-item">
                  <div className="admin-alert-img">
                    <img src={p.images?.[0] || "https://via.placeholder.com/50"} alt={p.title} />
                  </div>
                  <div className="admin-alert-info">
                    <span className="admin-alert-title">{p.title}</span>
                    <span className="admin-alert-stock">Only {p.stock} left</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
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
