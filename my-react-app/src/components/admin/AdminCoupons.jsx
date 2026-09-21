import React, { useState, useEffect } from "react";
import api from "../../api";
import "./AdminFeatures.css";

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    minOrderValue: "",
    expiryDate: "",
    isActive: true,
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [copiedCode, setCopiedCode] = useState("");

  useEffect(() => { fetchCoupons(); }, []);

  const fetchCoupons = async () => {
    try {
      const res = await api.get("/admin/coupons");
      setCoupons(res.data.coupons || []);
    } catch { } finally { setLoading(false); }
  };

  const openAdd = () => {
    setEditItem(null);
    setForm({ code: "", discountType: "percentage", discountValue: "", minOrderValue: "", expiryDate: "", isActive: true });
    setShowForm(true);
    setMsg("");
  };

  const openEdit = (c) => {
    setEditItem(c);
    setForm({
      code: c.code,
      discountType: c.discountType,
      discountValue: c.discountValue,
      minOrderValue: c.minOrderValue || "",
      expiryDate: c.expiryDate ? c.expiryDate.slice(0, 10) : "",
      isActive: c.isActive,
    });
    setShowForm(true);
    setMsg("");
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!form.code.trim() || !form.discountValue || !form.expiryDate) {
      return setMsg("Coupon code, discount value, and expiry date are required.");
    }
    setSaving(true);
    setMsg("");
    try {
      const payload = {
        ...form,
        code: form.code.toUpperCase().trim(),
        discountValue: Number(form.discountValue),
        minOrderValue: Number(form.minOrderValue || 0),
      };
      if (editItem) {
        await api.put(`/admin/coupons/${editItem._id}`, payload);
      } else {
        await api.post("/admin/coupons", payload);
      }
      setShowForm(false);
      fetchCoupons();
    } catch (e) {
      setMsg(e.response?.data?.message || "Error saving coupon.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;
    try {
      await api.delete(`/admin/coupons/${id}`);
      fetchCoupons();
    } catch {
      alert("Error deleting coupon.");
    }
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(""), 2000);
  };

  const isExpired = (date) => new Date(date) < new Date();

  const filtered = coupons.filter((c) => {
    const matchesSearch = c.code.toLowerCase().includes(searchQuery.toLowerCase());
    const expired = isExpired(c.expiryDate);
    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
        ? c.isActive && !expired
        : statusFilter === "expired"
        ? expired
        : !c.isActive;
    return matchesSearch && matchesStatus;
  });

  const activeCount = coupons.filter((c) => c.isActive && !isExpired(c.expiryDate)).length;
  const expiredCount = coupons.filter((c) => isExpired(c.expiryDate)).length;

  return (
    <div className="af-page">
      {/* Header */}
      <div className="af-header">
        <div>
          <h1 className="af-title">🎟️ Coupons & Offers</h1>
          <p className="af-desc">Create discount vouchers, promo codes, and special customer offers</p>
        </div>
        <button className="af-btn-primary" onClick={openAdd}>
          + Create New Coupon
        </button>
      </div>

      {/* Top Analytics Stats Bar */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: "#F5F3FF", color: "#8B5CF6" }}>🏷️</div>
          <div className="admin-stat-info">
            <div className="admin-stat-top">
              <span className="admin-stat-label">Total Coupons</span>
            </div>
            <span className="admin-stat-value">{coupons.length}</span>
            <div className="admin-stat-subtext">
              <span className="trend-up">+8</span>{" "}
              <span style={{ color: "#94A3B8", fontWeight: "500" }}>added this month</span>
            </div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: "#ECFDF5", color: "#10B981" }}>✅</div>
          <div className="admin-stat-info">
            <div className="admin-stat-top">
              <span className="admin-stat-label">Active & Valid</span>
            </div>
            <span className="admin-stat-value">{activeCount}</span>
            <div className="admin-stat-subtext">
              <span className="trend-up">{coupons.length ? Math.round((activeCount / coupons.length) * 100) : 74}%</span>{" "}
              <span style={{ color: "#94A3B8", fontWeight: "500" }}>of total coupons</span>
            </div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: "#FFFBEB", color: "#D97706" }}>
            <img src="/in-progress-hourglass-icon.png" alt="Expired Codes" style={{ width: "48px", height: "48px", objectFit: "contain", borderRadius: "12px" }} />
          </div>
          <div className="admin-stat-info">
            <div className="admin-stat-top">
              <span className="admin-stat-label">Expired Codes</span>
            </div>
            <span className="admin-stat-value">{expiredCount}</span>
            <div className="admin-stat-subtext">
              <span style={{ color: "#94A3B8", fontWeight: "600" }}>{coupons.length ? Math.round((expiredCount / coupons.length) * 100) : 26}%</span>{" "}
              <span style={{ color: "#94A3B8", fontWeight: "500" }}>of total coupons</span>
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
            placeholder="Search coupon code (e.g. SAVE20, SHOPPY10)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="af-search-input"
          />
        </div>
        <div className="af-filter-tabs">
          <button className={`af-tab ${statusFilter === "all" ? "active" : ""}`} onClick={() => setStatusFilter("all")}>
            All ({coupons.length})
          </button>
          <button className={`af-tab ${statusFilter === "active" ? "active" : ""}`} onClick={() => setStatusFilter("active")}>
            Active ({activeCount})
          </button>
          <button className={`af-tab ${statusFilter === "expired" ? "active" : ""}`} onClick={() => setStatusFilter("expired")}>
            Expired ({expiredCount})
          </button>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showForm && (
        <div className="af-modal-overlay">
          <div className="af-modal">
            <div className="af-modal-header">
              <h3>{editItem ? "✏️ Edit Coupon" : "✨ Create New Coupon"}</h3>
              <button className="af-btn-icon" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <form onSubmit={handleSave} className="af-form">
              {msg && <div className="af-alert-msg">{msg}</div>}

              <div className="af-form-grid-2">
                <div className="af-field">
                  <label>Coupon Code *</label>
                  <input
                    type="text"
                    className="af-input"
                    style={{ textTransform: "uppercase", fontWeight: "800", letterSpacing: "1px" }}
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. FESTIVE20"
                    required
                  />
                </div>

                <div className="af-field">
                  <label>Discount Type *</label>
                  <select
                    className="af-select"
                    value={form.discountType}
                    onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
              </div>

              <div className="af-form-grid-2">
                <div className="af-field">
                  <label>Discount Value *</label>
                  <input
                    type="number"
                    className="af-input"
                    value={form.discountValue}
                    onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                    placeholder={form.discountType === "percentage" ? "e.g. 20 (for 20%)" : "e.g. 200 (for ₹200)"}
                    required
                  />
                </div>

                <div className="af-field">
                  <label>Min Order Value (₹)</label>
                  <input
                    type="number"
                    className="af-input"
                    value={form.minOrderValue}
                    onChange={(e) => setForm({ ...form, minOrderValue: e.target.value })}
                    placeholder="e.g. 499 (0 for no limit)"
                  />
                </div>
              </div>

              <div className="af-field">
                <label>Expiry Date *</label>
                <input
                  type="date"
                  className="af-input"
                  value={form.expiryDate}
                  onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                  required
                />
              </div>

              <div className="af-field">
                <label className="af-checkbox-label">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  />
                  <span>Active (Allow users to apply during checkout)</span>
                </label>
              </div>

              <div className="af-form-actions">
                <button type="button" className="af-btn-secondary" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="af-btn-primary" disabled={saving}>
                  {saving ? "Saving Coupon..." : editItem ? "Update Coupon" : "Create Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Coupon Ticket Cards Grid */}
      {loading ? (
        <div className="af-loading">
          <div className="af-spinner"></div>
          <span>Loading Coupons...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="af-empty">
          <span className="af-empty-icon">🎟️</span>
          <h3>No Coupons Found</h3>
          <p>No coupons match your filter. Click "+ Create New Coupon" to create one.</p>
        </div>
      ) : (
        <div className="af-coupons-grid">
          {filtered.map((c) => {
            const expired = isExpired(c.expiryDate);
            const valid = c.isActive && !expired;
            return (
              <div key={c._id} className={`af-coupon-card ${valid ? "valid" : "invalid"}`}>
                <div className="af-coupon-top">
                  <div className="af-coupon-code-wrap" onClick={() => copyCode(c.code)}>
                    <span className="af-coupon-code-text">{c.code}</span>
                    <span className="af-copy-icon">{copiedCode === c.code ? "✓ Copied" : "📋"}</span>
                  </div>
                  <span className={`af-badge ${valid ? "af-badge-green" : "af-badge-red"}`}>
                    {valid ? "ACTIVE" : expired ? "EXPIRED" : "DISABLED"}
                  </span>
                </div>

                <div className="af-coupon-discount-box">
                  <span className="af-coupon-value">
                    {c.discountType === "percentage" ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
                  </span>
                  <span className="af-coupon-min-order">
                    {c.minOrderValue > 0 ? `Min. Order ₹${c.minOrderValue}` : "No Minimum Purchase"}
                  </span>
                </div>

                <div className="af-coupon-meta">
                  <span>📅 Expiry: {new Date(c.expiryDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</span>
                </div>

                <div className="af-coupon-footer">
                  <button className="af-action-btn edit" onClick={() => openEdit(c)}>
                    ✏️ Edit
                  </button>
                  <button className="af-action-btn delete" onClick={() => handleDelete(c._id)}>
                    🗑️ Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
