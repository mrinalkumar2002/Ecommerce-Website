import React, { useState, useEffect } from "react";
import api from "../../api";
import "./AdminFeatures.css";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", isActive: true });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/admin/categories");
      setCategories(res.data.categories || []);
    } catch { } finally { setLoading(false); }
  };

  const openAdd = () => { setEditItem(null); setForm({ name: "", description: "", isActive: true }); setShowForm(true); setMsg(""); };
  const openEdit = (cat) => { setEditItem(cat); setForm({ name: cat.name, description: cat.description || "", isActive: cat.isActive }); setShowForm(true); setMsg(""); };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!form.name.trim()) return setMsg("Category name is required.");
    setSaving(true); setMsg("");
    try {
      if (editItem) {
        await api.put(`/admin/categories/${editItem._id}`, form);
      } else {
        await api.post("/admin/categories", form);
      }
      setShowForm(false);
      fetchCategories();
    } catch (e) { setMsg(e.response?.data?.message || "Error saving category."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try { await api.delete(`/admin/categories/${id}`); fetchCategories(); }
    catch { alert("Error deleting category."); }
  };

  const filtered = categories.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || (c.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" ? true : statusFilter === "active" ? c.isActive : !c.isActive;
    return matchesSearch && matchesStatus;
  });

  const activeCount = categories.filter((c) => c.isActive).length;
  const inactiveCount = categories.length - activeCount;

  return (
    <div className="af-page">
      {/* Header */}
      <div className="af-header">
        <div>
          <h1 className="af-title">📁 Categories & Brands</h1>
          <p className="af-desc">Organize your store catalog with dynamic product categories</p>
        </div>
        <button className="af-btn-primary" onClick={openAdd}>
          + Add New Category
        </button>
      </div>

      {/* Top Analytics Stats Bar */}
      <div className="af-stats-bar">
        <div className="af-stat-pill">
          <span className="af-stat-icon">📂</span>
          <div>
            <span className="af-stat-num">{categories.length}</span>
            <span className="af-stat-lbl">Total Categories</span>
          </div>
        </div>
        <div className="af-stat-pill">
          <span className="af-stat-icon" style={{ background: "transparent", padding: 0 }}>
            <img src="/active-in-store-icon.png" alt="Active in Store" style={{ width: "48px", height: "48px", objectFit: "contain", borderRadius: "12px" }} />
          </span>
          <div>
            <span className="af-stat-num">{activeCount}</span>
            <span className="af-stat-lbl">Active in Store</span>
          </div>
        </div>
        <div className="af-stat-pill">
          <span className="af-stat-icon" style={{ background: "transparent", padding: 0 }}>
            <img src="/disabled-hidden-icon.png" alt="Disabled/Hidden" style={{ width: "48px", height: "48px", objectFit: "contain", borderRadius: "12px" }} />
          </span>
          <div>
            <span className="af-stat-num">{inactiveCount}</span>
            <span className="af-stat-lbl">Disabled/Hidden</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="af-controls-row">
        <div className="af-search-wrap">
          <span className="af-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search category by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="af-search-input"
          />
        </div>
        <div className="af-filter-tabs">
          <button className={`af-tab ${statusFilter === "all" ? "active" : ""}`} onClick={() => setStatusFilter("all")}>
            All ({categories.length})
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
              <h3>{editItem ? "✏️ Edit Category" : "✨ Create New Category"}</h3>
              <button className="af-btn-icon" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <form onSubmit={handleSave} className="af-form">
              {msg && <div className="af-alert-msg">{msg}</div>}
              
              <div className="af-field">
                <label>Category Name *</label>
                <input
                  type="text"
                  className="af-input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Footwear, Electronics, Beauty"
                  required
                />
              </div>

              <div className="af-field">
                <label>Description</label>
                <textarea
                  className="af-textarea"
                  rows="3"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Brief description of this product collection..."
                />
              </div>

              <div className="af-field">
                <label className="af-checkbox-label">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  />
                  <span>Active (Visible in catalog filters)</span>
                </label>
              </div>

              <div className="af-form-actions">
                <button type="button" className="af-btn-secondary" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="af-btn-primary" disabled={saving}>
                  {saving ? "Saving Category..." : editItem ? "Update Category" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Data Table Grid */}
      {loading ? (
        <div className="af-loading">
          <div className="af-spinner"></div>
          <span>Loading Categories...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="af-empty">
          <span className="af-empty-icon">📁</span>
          <h3>No Categories Found</h3>
          <p>No product categories match your filter. Click "+ Add New Category" to create one.</p>
        </div>
      ) : (
        <div className="af-cards-grid">
          {filtered.map((cat) => (
            <div key={cat._id} className="af-rich-card">
              <div className="af-rich-card-top">
                <div className="af-rich-card-icon">📂</div>
                <span className={`af-badge ${cat.isActive ? "af-badge-green" : "af-badge-red"}`}>
                  {cat.isActive ? "Active" : "Disabled"}
                </span>
              </div>
              <h3 className="af-rich-card-title">{cat.name}</h3>
              <p className="af-rich-card-desc">{cat.description || "No description provided."}</p>
              <div className="af-rich-card-footer">
                <button className="af-action-btn edit" onClick={() => openEdit(cat)}>
                  ✏️ Edit
                </button>
                <button className="af-action-btn delete" onClick={() => handleDelete(cat._id)}>
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
