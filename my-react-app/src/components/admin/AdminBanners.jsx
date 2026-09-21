import React, { useState, useEffect } from "react";
import api from "../../api";
import "./AdminFeatures.css";

export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ title: "", imageUrl: "", link: "", isActive: true });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => { fetchBanners(); }, []);

  const fetchBanners = async () => {
    try {
      const res = await api.get("/admin/banners");
      setBanners(res.data.banners || []);
    } catch { } finally { setLoading(false); }
  };

  const openAdd = () => { setEditItem(null); setForm({ title: "", imageUrl: "", link: "", isActive: true }); setShowForm(true); setMsg(""); };
  const openEdit = (b) => { setEditItem(b); setForm({ title: b.title, imageUrl: b.imageUrl, link: b.link || "", isActive: b.isActive }); setShowForm(true); setMsg(""); };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!form.title.trim() || !form.imageUrl.trim()) return setMsg("Title and Image URL are required.");
    setSaving(true); setMsg("");
    try {
      if (editItem) {
        await api.put(`/admin/banners/${editItem._id}`, form);
      } else {
        await api.post("/admin/banners", form);
      }
      setShowForm(false);
      fetchBanners();
    } catch (e) { setMsg(e.response?.data?.message || "Error saving banner."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;
    try { await api.delete(`/admin/banners/${id}`); fetchBanners(); }
    catch { alert("Error deleting banner."); }
  };

  const toggleActive = async (b) => {
    try {
      await api.put(`/admin/banners/${b._id}`, { ...b, isActive: !b.isActive });
      fetchBanners();
    } catch { }
  };

  const filtered = banners.filter((b) => {
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) || (b.link || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" ? true : statusFilter === "active" ? b.isActive : !b.isActive;
    return matchesSearch && matchesStatus;
  });

  const activeCount = banners.filter((b) => b.isActive).length;
  const inactiveCount = banners.length - activeCount;

  return (
    <div className="af-page">
      {/* Header */}
      <div className="af-header">
        <div>
          <h1 className="af-title" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img src="/image-placeholder-icon.png" alt="Banners" style={{ width: "32px", height: "32px", objectFit: "contain" }} />
            Banners & Promotions
          </h1>
          <p className="af-desc">Manage Homepage promotional sliders, hero banners, and brand graphics</p>
        </div>
        <button className="af-btn-primary" onClick={openAdd}>
          + Add New Banner
        </button>
      </div>

      {/* Top Analytics Stats Bar */}
      <div className="af-stats-bar">
        <div className="af-stat-pill">
          <span className="af-stat-icon" style={{ background: "transparent", padding: 0 }}>
            <img src="/image-placeholder-icon.png" alt="Total Banners" style={{ width: "48px", height: "48px", objectFit: "contain", borderRadius: "12px" }} />
          </span>
          <div>
            <span className="af-stat-num">{banners.length}</span>
            <span className="af-stat-lbl">Total Banners</span>
          </div>
        </div>
        <div className="af-stat-pill">
          <span className="af-stat-icon" style={{ background: "transparent", padding: 0 }}>
            <img src="/active-in-store-icon.png" alt="Active on Homepage" style={{ width: "48px", height: "48px", objectFit: "contain", borderRadius: "12px" }} />
          </span>
          <div>
            <span className="af-stat-num">{activeCount}</span>
            <span className="af-stat-lbl">Active on Homepage</span>
          </div>
        </div>
        <div className="af-stat-pill">
          <span className="af-stat-icon" style={{ background: "transparent", padding: 0 }}>
            <img src="/disabled-hidden-icon.png" alt="Drafts / Inactive" style={{ width: "48px", height: "48px", objectFit: "contain", borderRadius: "12px" }} />
          </span>
          <div>
            <span className="af-stat-num">{inactiveCount}</span>
            <span className="af-stat-lbl">Drafts / Inactive</span>
          </div>
        </div>
      </div>

      {/* Controls Row */}
      <div className="af-controls-row">
        <div className="af-search-wrap">
          <span className="af-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search banner by title or destination link..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="af-search-input"
          />
        </div>
        <div className="af-filter-tabs">
          <button className={`af-tab ${statusFilter === "all" ? "active" : ""}`} onClick={() => setStatusFilter("all")}>
            All ({banners.length})
          </button>
          <button className={`af-tab ${statusFilter === "active" ? "active" : ""}`} onClick={() => setStatusFilter("active")}>
            Active ({activeCount})
          </button>
          <button className={`af-tab ${statusFilter === "inactive" ? "active" : ""}`} onClick={() => setStatusFilter("inactive")}>
            Inactive ({inactiveCount})
          </button>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showForm && (
        <div className="af-modal-overlay">
          <div className="af-modal">
            <div className="af-modal-header">
              <h3>{editItem ? "✏️ Edit Banner" : "✨ Create New Banner"}</h3>
              <button className="af-btn-icon" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <form onSubmit={handleSave} className="af-form">
              {msg && <div className="af-alert-msg">{msg}</div>}

              <div className="af-field">
                <label>Banner Title / Campaign Name *</label>
                <input
                  type="text"
                  className="af-input"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Festival Mega Sale, 50% Off Headphones"
                  required
                />
              </div>

              <div className="af-field">
                <label>Image URL *</label>
                <input
                  type="url"
                  className="af-input"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  required
                />
                {form.imageUrl && (
                  <div className="af-img-preview-wrap">
                    <label>Live Preview:</label>
                    <img
                      src={form.imageUrl}
                      alt="Banner Preview"
                      className="af-img-preview"
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  </div>
                )}
              </div>

              <div className="af-field">
                <label>Destination Link (Optional)</label>
                <input
                  type="text"
                  className="af-input"
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  placeholder="e.g. /productlist?category=electronics"
                />
              </div>

              <div className="af-field">
                <label className="af-checkbox-label">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  />
                  <span>Active (Display on Homepage banner strip)</span>
                </label>
              </div>

              <div className="af-form-actions">
                <button type="button" className="af-btn-secondary" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="af-btn-primary" disabled={saving}>
                  {saving ? "Saving Banner..." : editItem ? "Update Banner" : "Publish Banner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Banner Cards Grid */}
      {loading ? (
        <div className="af-loading">
          <div className="af-spinner"></div>
          <span>Loading Banners...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="af-empty">
          <span className="af-empty-icon" style={{ background: "transparent" }}>
            <img src="/image-placeholder-icon.png" alt="No Banners" style={{ width: "64px", height: "64px", objectFit: "contain" }} />
          </span>
          <h3>No Banners Found</h3>
          <p>No banners match your filter. Click "+ Add New Banner" to create one.</p>
        </div>
      ) : (
        <div className="af-banners-grid">
          {filtered.map((b) => (
            <div key={b._id} className={`af-banner-rich-card ${b.isActive ? "active" : "inactive"}`}>
              <div className="af-banner-preview-box">
                <img
                  src={b.imageUrl}
                  alt={b.title}
                  onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600"; }}
                />
                <span className={`af-badge af-badge-floating ${b.isActive ? "af-badge-green" : "af-badge-red"}`}>
                  {b.isActive ? "LIVE ON HOMEPAGE" : "HIDDEN / INACTIVE"}
                </span>
              </div>
              <div className="af-banner-card-body">
                <h3 className="af-banner-card-title">{b.title}</h3>
                {b.link ? (
                  <span className="af-banner-link-pill">🔗 {b.link}</span>
                ) : (
                  <span className="af-banner-nolink">No link assigned</span>
                )}
              </div>
              <div className="af-banner-card-footer">
                <button
                  className={`af-action-btn ${b.isActive ? "deactivate" : "activate"}`}
                  onClick={() => toggleActive(b)}
                >
                  {b.isActive ? "⏸️ Deactivate" : "▶️ Activate"}
                </button>
                <button className="af-action-btn edit" onClick={() => openEdit(b)}>
                  ✏️ Edit
                </button>
                <button className="af-action-btn delete" onClick={() => handleDelete(b._id)}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
