import React, { useState, useEffect } from "react";
import api from "../../api";
import "./AdminFeatures.css";

const STATUS_COLORS = {
  open: "af-badge-yellow",
  in_progress: "af-badge-blue",
  resolved: "af-badge-green",
  closed: "af-badge-red",
};

const STATUS_LABELS = {
  open: "OPEN 🟡",
  in_progress: "IN PROGRESS 🔵",
  resolved: "RESOLVED 🟢",
  closed: "CLOSED 🔴",
};

export default function AdminSupport() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [updating, setUpdating] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [viewProductModal, setViewProductModal] = useState(null);

  useEffect(() => {
    fetchTickets();
    api.get("/products")
      .then((res) => { if (Array.isArray(res.data)) setAllProducts(res.data); })
      .catch(() => {});
  }, []);

  const handleInspectProduct = (t) => {
    if (!t) return;
    const prodName = t.productName || "General Inquiry / Other";
    const prodId = t.productId;

    let matched = null;
    if (prodId) {
      matched = allProducts.find((p) => String(p._id || p.id) === String(prodId));
    }
    if (!matched && prodName && prodName !== "General Inquiry / Other") {
      const words = prodName.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
      if (words.length > 0) {
        matched = allProducts.find((p) => {
          const titleLower = p.title.toLowerCase();
          return words.every((w) => titleLower.includes(w));
        });
      }
      if (!matched && words.length > 0) {
        matched = allProducts.find((p) => {
          const titleLower = p.title.toLowerCase();
          return words.some((w) => titleLower.includes(w));
        });
      }
    }

    setViewProductModal({
      title: prodName,
      product: matched,
    });
  };

  const fetchTickets = async () => {
    try {
      const res = await api.get("/admin/tickets");
      const list = res.data.tickets || [];
      setTickets(list);
      if (list.length > 0 && !selected) {
        setSelected(list[0]);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    setUpdating(true);
    try {
      await api.put(`/admin/tickets/${id}`, { status });
      await fetchTickets();
      if (selected?._id === id) {
        setSelected((prev) => (prev ? { ...prev, status } : null));
      }
    } catch {
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteTicket = async (id, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm("Kya aap sach me is support ticket ko hatana (delete karna) chahte hain?")) return;
    setUpdating(true);
    try {
      await api.delete(`/admin/tickets/${id}`);
      setTickets((prev) => {
        const next = prev.filter((t) => t._id !== id);
        if (selected?._id === id) {
          setSelected(next.length > 0 ? next[0] : null);
        }
        return next;
      });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete ticket");
    } finally {
      setUpdating(false);
    }
  };

  const filtered = tickets.filter((t) => {
    const matchesFilter = filter === "all" ? true : t.status === filter;
    const matchesSearch =
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const openCount = tickets.filter((t) => t.status === "open").length;
  const inProgressCount = tickets.filter((t) => t.status === "in_progress").length;
  const resolvedCount = tickets.filter((t) => t.status === "resolved").length;
  const closedCount = tickets.filter((t) => t.status === "closed").length;

  return (
    <div className="af-page">
      {/* Header */}
      <div className="af-header">
        <div>
          <h1 className="af-title" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img src="/support-headset-icon.png" alt="Support" style={{ width: "36px", height: "36px", objectFit: "contain" }} />
            Customer Support Center
          </h1>
          <p className="af-desc">Track, manage, and resolve customer support inquiries & tickets</p>
        </div>
      </div>

      {/* Top Analytics Stats Bar */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: "#EFF6FF", color: "#3B82F6" }}>
            <img src="/total-complaints-icon.png" alt="Total Complaints" style={{ width: "48px", height: "48px", objectFit: "contain", borderRadius: "12px" }} />
          </div>
          <div className="admin-stat-info">
            <div className="admin-stat-top">
              <span className="admin-stat-label">Total Complaints</span>
            </div>
            <span className="admin-stat-value">{tickets.length}</span>
            <div className="admin-stat-subtext">
              <span className="trend-down">↑ 12%</span>{" "}
              <span style={{ color: "#94A3B8", fontWeight: "500" }}>vs last week</span>
            </div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: "#FEF2F2", color: "#EF4444" }}>
            <img src="/open-ticket-icon.png" alt="New Open Tickets" style={{ width: "48px", height: "48px", objectFit: "contain", borderRadius: "12px" }} />
          </div>
          <div className="admin-stat-info">
            <div className="admin-stat-top">
              <span className="admin-stat-label">New Open Tickets</span>
            </div>
            <span className="admin-stat-value">{openCount}</span>
            <div className="admin-stat-subtext">
              <span className="trend-down">↑ 35%</span>{" "}
              <span style={{ color: "#94A3B8", fontWeight: "500" }}>vs last week</span>
            </div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: "#FFFBEB", color: "#D97706" }}>
            <img src="/in-progress-hourglass-icon.png" alt="In Progress" style={{ width: "48px", height: "48px", objectFit: "contain", borderRadius: "12px" }} />
          </div>
          <div className="admin-stat-info">
            <div className="admin-stat-top">
              <span className="admin-stat-label">In Progress</span>
            </div>
            <span className="admin-stat-value">{inProgressCount}</span>
            <div className="admin-stat-subtext">
              <span className="trend-up">↓ 21%</span>{" "}
              <span style={{ color: "#94A3B8", fontWeight: "500" }}>vs last week</span>
            </div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: "#ECFDF5", color: "#10B981" }}>
            <img src="/support-headset-icon.png" alt="Resolved Issues" style={{ width: "48px", height: "48px", objectFit: "contain", borderRadius: "12px" }} />
          </div>
          <div className="admin-stat-info">
            <div className="admin-stat-top">
              <span className="admin-stat-label">Resolved Issues</span>
            </div>
            <span className="admin-stat-value">{resolvedCount}</span>
            <div className="admin-stat-subtext">
              <span className="trend-up">↑ 44%</span>{" "}
              <span style={{ color: "#94A3B8", fontWeight: "500" }}>vs last week</span>
            </div>
          </div>
        </div>
      </div>


      {/* Controls Row */}
      <div className="af-controls-row">
        <div className="af-search-wrap">
          <span className="af-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search ticket by subject, customer name, email, or message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="af-search-input"
          />
        </div>
        <div className="af-filter-tabs">
          <button className={`af-tab ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>
            All ({tickets.length})
          </button>
          <button className={`af-tab ${filter === "open" ? "active" : ""}`} onClick={() => setFilter("open")}>
            Open ({openCount})
          </button>
          <button className={`af-tab ${filter === "in_progress" ? "active" : ""}`} onClick={() => setFilter("in_progress")}>
            In Progress ({inProgressCount})
          </button>
          <button className={`af-tab ${filter === "resolved" ? "active" : ""}`} onClick={() => setFilter("resolved")}>
            Resolved ({resolvedCount})
          </button>
          <button className={`af-tab ${filter === "closed" ? "active" : ""}`} onClick={() => setFilter("closed")}>
            Closed ({closedCount})
          </button>
        </div>
      </div>

      {/* 2-Column Split Support Layout */}
      {loading ? (
        <div className="af-loading">
          <div className="af-spinner"></div>
          <span>Loading Customer Tickets...</span>
        </div>
      ) : (
        <div className="af-support-split-container">
          {/* LEFT LIST COLUMN */}
          <div className="af-support-list-col">
            {filtered.length === 0 ? (
              <div className="af-empty">
                <span className="af-empty-icon">🎧</span>
                <h3>No Tickets Found</h3>
                <p>No customer tickets match your search or status filter.</p>
              </div>
            ) : (
              filtered.map((t) => {
                const isSel = selected?._id === t._id;
                const initials = (t.name || "Customer")
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();
                return (
                  <div
                    key={t._id}
                    className={`af-ticket-rich-card ${isSel ? "selected" : ""}`}
                    onClick={() => setSelected(t)}
                  >
                    <div className="af-ticket-card-top">
                      <div className="af-customer-avatar-small">{initials}</div>
                      <div className="af-ticket-card-header-info">
                        <h4 className="af-ticket-card-subject">{t.subject}</h4>
                        <span className="af-ticket-customer-name">👤 {t.name}</span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
                        <span className={`af-badge ${STATUS_COLORS[t.status] || "af-badge-blue"}`}>
                          {STATUS_LABELS[t.status] || t.status}
                        </span>
                        {(t.status === "resolved" || t.status === "closed") && (
                          <button
                            className="af-quick-delete-btn"
                            title="Delete Resolved Ticket"
                            onClick={(e) => handleDeleteTicket(t._id, e)}
                          >
                            <img src="/delete-icon.png" alt="Delete" style={{ width: "16px", height: "16px", objectFit: "contain", verticalAlign: "middle", marginRight: "4px" }} />
                            Delete
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="af-ticket-card-preview">{t.message}</p>

                    <div className="af-ticket-card-meta">
                      <span>📦 {t.productName || "General Inquiry"}</span>
                      <span>📅 {new Date(t.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* RIGHT DETAIL INSPECTOR COLUMN */}
          <div className="af-support-detail-col">
            {selected ? (
              <div className="af-ticket-inspector-panel">
                <div className="af-inspector-header">
                  <div>
                    <span className="af-inspector-id">TICKET #{selected._id.slice(-6).toUpperCase()}</span>
                    <h2 className="af-inspector-subject">{selected.subject}</h2>
                  </div>
                  <span className={`af-badge af-badge-large ${STATUS_COLORS[selected.status] || "af-badge-blue"}`}>
                    {STATUS_LABELS[selected.status] || selected.status}
                  </span>
                </div>

                {/* Customer Info Box */}
                <div className="af-inspector-customer-card">
                  <div className="af-inspector-avatar">
                    {(selected.name || "C").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="af-inspector-cust-details">
                    <strong>{selected.name}</strong>
                    <span>📧 {selected.email}</span>
                    <span className="af-inspector-date">
                      🕒 Submitted on {new Date(selected.createdAt).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Clickable Related Product Box */}
                <div
                  onClick={() => handleInspectProduct(selected)}
                  title="Click to view product details"
                  style={{
                    background: "linear-gradient(135deg, #FAF8F5 0%, #F3E9DE 100%)",
                    border: "1px solid #8B5E3C",
                    padding: "14px 18px",
                    borderRadius: "14px",
                    marginBottom: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    boxShadow: "0 4px 12px rgba(139, 94, 60, 0.08)"
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.01)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "24px" }}>📦</span>
                    <div>
                      <span style={{ fontSize: "11px", fontWeight: "900", color: "#8B5E3C", textTransform: "uppercase", letterSpacing: "0.5px", display: "block" }}>
                        RELATED PRODUCT / ITEM (CLICK TO INSPECT):
                      </span>
                      <strong style={{ fontSize: "15px", color: "#1F1F1F" }}>{selected.productName || "General Inquiry / Other"}</strong>
                    </div>
                  </div>
                  <span style={{ fontSize: "12px", fontWeight: "700", color: "#8B5E3C", background: "#ffffff", padding: "4px 10px", borderRadius: "8px", border: "1px solid #E5DED6" }}>
                    🔍 Inspect Product ➔
                  </span>
                </div>

                {/* Complaint Message Box */}
                <div className="af-inspector-message-box">
                  <label className="af-inspector-label">CUSTOMER INQUIRY / MESSAGE</label>
                  <blockquote className="af-inspector-quote">{selected.message}</blockquote>
                </div>

                {/* Action Status Controls */}
                <div className="af-inspector-actions-box">
                  <label className="af-inspector-label">UPDATE TICKET STATUS</label>
                  <div className="af-inspector-status-grid">
                    <button
                      className={`af-status-pill-btn open ${selected.status === "open" ? "active" : ""}`}
                      onClick={() => updateStatus(selected._id, "open")}
                      disabled={updating}
                    >
                      🟡 Mark Open
                    </button>
                    <button
                      className={`af-status-pill-btn in_progress ${selected.status === "in_progress" ? "active" : ""}`}
                      onClick={() => updateStatus(selected._id, "in_progress")}
                      disabled={updating}
                    >
                      🔵 Mark In Progress
                    </button>
                    <button
                      className={`af-status-pill-btn resolved ${selected.status === "resolved" ? "active" : ""}`}
                      onClick={() => updateStatus(selected._id, "resolved")}
                      disabled={updating}
                    >
                      🟢 Mark Resolved
                    </button>
                    <button
                      className={`af-status-pill-btn closed ${selected.status === "closed" ? "active" : ""}`}
                      onClick={() => updateStatus(selected._id, "closed")}
                      disabled={updating}
                    >
                      🔴 Mark Closed
                    </button>
                  </div>

                  {/* Delete Action Zone */}
                  <div className="af-inspector-delete-zone">
                    <div>
                      <strong style={{ color: "#991B1B", fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "6px" }}>
                        <img src="/delete-icon.png" alt="Delete" style={{ width: "20px", height: "20px", objectFit: "contain" }} />
                        Delete Ticket
                      </strong>
                      <span style={{ fontSize: "0.82rem", color: "#66615C" }}>
                        {selected.status === "resolved" || selected.status === "closed"
                          ? "This issue is resolved/closed. You can remove it permanently."
                          : "Permanently remove this customer ticket from database."}
                      </span>
                    </div>
                    <button
                      className="af-btn-delete-ticket"
                      onClick={(e) => handleDeleteTicket(selected._id, e)}
                      disabled={updating}
                      style={{ display: "flex", alignItems: "center", gap: "6px" }}
                    >
                      <img src="/delete-icon.png" alt="Delete" style={{ width: "18px", height: "18px", objectFit: "contain" }} />
                      Delete Ticket
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="af-inspector-placeholder">
                <span className="af-inspector-placeholder-icon">👈</span>
                <h3>Select a Support Ticket</h3>
                <p>Click any customer ticket from the left panel to inspect details and update its resolution status.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 📦 PRODUCT QUICK INSPECTION MODAL */}
      {viewProductModal && (
        <div className="af-modal-overlay">
          <div className="af-modal" style={{ maxWidth: "480px" }}>
            <div className="af-modal-header">
              <h3>📦 Related Product Details</h3>
              <button className="af-btn-icon" onClick={() => setViewProductModal(null)}>✕</button>
            </div>
            <div style={{ padding: "24px" }}>
              {viewProductModal.product ? (
                <div>
                  <div style={{ display: "flex", gap: "16px", marginBottom: "18px" }}>
                    <img
                      src={viewProductModal.product.thumbnail || viewProductModal.product.images?.[0] || "https://via.placeholder.com/120"}
                      alt={viewProductModal.product.title}
                      style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "12px", border: "1px solid #E5DED6" }}
                    />
                    <div>
                      <span style={{ fontSize: "11px", fontWeight: "800", color: "#8B5E3C", textTransform: "uppercase" }}>
                        {viewProductModal.product.category || "General Product"}
                      </span>
                      <h3 style={{ fontSize: "16px", fontWeight: "800", color: "#1F1F1F", margin: "4px 0" }}>
                        {viewProductModal.product.title}
                      </h3>
                      <div style={{ fontSize: "18px", fontWeight: "900", color: "#8B5E3C" }}>
                        ₹{(viewProductModal.product.price || 0).toLocaleString()}
                      </div>
                      <span style={{ fontSize: "12px", color: (viewProductModal.product.stock || 0) < 10 ? "#DC2626" : "#065F46", fontWeight: "700" }}>
                        📦 Stock Remaining: {viewProductModal.product.stock ?? 25} units
                      </span>
                    </div>
                  </div>
                  <p style={{ fontSize: "13px", color: "#66615C", background: "#FAF8F5", padding: "12px", borderRadius: "10px", border: "1px solid #E5DED6", margin: "0 0 18px" }}>
                    {viewProductModal.product.description || "High quality catalog product."}
                  </p>
                  <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                    <a
                      href={`/productdetail/${viewProductModal.product._id || viewProductModal.product.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="af-btn-primary"
                      style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}
                    >
                      🔗 Open Product Page
                    </a>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "10px 0" }}>
                  <span style={{ fontSize: "36px", display: "block", marginBottom: "10px" }}>ℹ️</span>
                  <h4 style={{ margin: "0 0 6px", fontSize: "16px", fontWeight: "800", color: "#1F1F1F" }}>
                    {viewProductModal.title}
                  </h4>
                  <p style={{ fontSize: "13.5px", color: "#66615C", marginBottom: "16px" }}>
                    {viewProductModal.title === "General Inquiry / Other"
                      ? "This ticket is filed as a general inquiry or account issue not linked to a specific catalog item."
                      : `Inquiry Item: "${viewProductModal.title}". You can search for matching products in the Store Products catalog.`}
                  </p>
                  {viewProductModal.title !== "General Inquiry / Other" && (
                    <a
                      href={`/admin/products?search=${encodeURIComponent(viewProductModal.title)}`}
                      className="af-btn-primary"
                      style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}
                    >
                      🔍 Search Catalog for "{viewProductModal.title}"
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
