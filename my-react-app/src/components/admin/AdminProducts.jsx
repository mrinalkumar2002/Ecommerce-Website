import React, { useEffect, useState } from "react";
import api from "../../api";
import "./AdminProducts.css";

const emptyProduct = {
  title: "",
  description: "",
  price: "",
  stock: "50",
  category: "general",
  company: "Generic",
  images: "",
  rating: "4.5",
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ ...emptyProduct });
  const [msg, setMsg] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isNewCategory, setIsNewCategory] = useState(false);

  const [newlyAddedId, setNewlyAddedId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (highlightId = null) => {
    try {
      const res = await api.get("/products");
      // Sort newest first
      const sorted = (res.data || []).slice().reverse();
      setProducts(sorted);
      if (highlightId && highlightId !== "TOP") {
        setNewlyAddedId(highlightId);
      } else if (highlightId === "TOP" && sorted.length > 0) {
        setNewlyAddedId(sorted[0]._id);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  const uniqueCategories = ["All Categories", ...new Set(products.map(p => p.category).filter(Boolean))];

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.title?.toLowerCase().includes(search.toLowerCase()) || p.category?.toLowerCase().includes(search.toLowerCase()) || p.company?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "All Categories" || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const openAddModal = () => {
    setForm({ ...emptyProduct });
    setEditMode(false);
    setEditId(null);
    setMsg("");
    setIsNewCategory(false);
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setForm({
      title: product.title || "",
      description: product.description || "",
      price: String(product.price || ""),
      stock: String(product.stock || "50"),
      category: product.category || "general",
      company: product.company || "Generic",
      images: (product.images || []).join(", "),
      rating: String(product.rating || "4.5"),
    });
    setEditMode(true);
    setEditId(product._id);
    setMsg("");
    setIsNewCategory(false);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    const payload = {
      title: form.title,
      description: form.description,
      price: Number(form.price),
      stock: Number(form.stock),
      category: form.category,
      company: form.company,
      images: form.images
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      rating: Number(form.rating),
    };

    try {
      let createdId = null;
      if (editMode) {
        await api.put(`/admin/products/${editId}`, payload);
        setMsg("✅ Product updated!");
        createdId = editId;
      } else {
        const res = await api.post("/admin/products", payload);
        setMsg("✅ Product added!");
        createdId = res.data?.product?._id || res.data?._id || "TOP";
      }
      setTimeout(() => {
        setShowModal(false);
        // Reset category filter & search so user sees the newly added product right at the top
        setCategoryFilter("All Categories");
        setSearch("");
        fetchProducts(createdId);
      }, 600);
    } catch (err) {
      setMsg(err.response?.data?.message || "Error saving product");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/products/${id}`);
      setDeleteConfirm(null);
      fetchProducts();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-spinner"></div>
        <span>Loading products...</span>
      </div>
    );
  }

  return (
    <div className="admin-products">
      <div className="admin-products-header">
        <div>
          <h1 className="admin-page-title">Products</h1>
          <p className="admin-page-desc">{products.length} products in database</p>
        </div>
        <button className="admin-add-btn" onClick={openAddModal}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Product
        </button>
      </div>

      {/* Stat Cards Grid */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: "#FFFBEB", color: "#D97706" }}>
            <img src="/product-box-icon.png" alt="Total Products" style={{ width: "46px", height: "46px", objectFit: "contain", borderRadius: "10px" }} />
          </div>
          <div className="admin-stat-info">
            <span className="admin-stat-value">{products.length}</span>
            <span className="admin-stat-label">Total Products</span>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: "#F5F3FF", color: "#8B5CF6" }}>🏷️</div>
          <div className="admin-stat-info">
            <span className="admin-stat-value">{uniqueCategories.filter(c => c !== "All Categories").length}</span>
            <span className="admin-stat-label">Categories</span>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: "#ECFDF5", color: "#10B981" }}>✅</div>
          <div className="admin-stat-info">
            <span className="admin-stat-value">{products.filter(p => Number(p.stock) > 0).length}</span>
            <span className="admin-stat-label">In Stock Items</span>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: "#FEF2F2", color: "#EF4444" }}>⚠️</div>
          <div className="admin-stat-info">
            <span className="admin-stat-value">{products.filter(p => Number(p.stock) <= 5).length}</span>
            <span className="admin-stat-label">Low Stock Alert</span>
          </div>
        </div>
      </div>


      {/* Search & Filter */}
      <div className="admin-filters-row">
        <div className="admin-search-bar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search products by name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="admin-category-select"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          {uniqueCategories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      {filteredProducts.length === 0 ? (
        <div className="admin-empty">No products found</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Category</th>
                <th>Company</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => {
                const isNew = p._id === newlyAddedId;
                return (
                  <tr key={p._id} className={isNew ? "admin-tr-highlight" : ""}>
                    <td>
                      <div className="admin-product-img">
                        {p.images?.[0] ? (
                          <img src={p.images[0]} alt={p.title} />
                        ) : (
                          <div className="admin-no-img">📦</div>
                        )}
                      </div>
                    </td>
                    <td className="admin-td-title">
                      <div className="admin-title-with-badge">
                        <span>{p.title}</span>
                        {isNew && <span className="admin-new-badge">✨ NEW</span>}
                      </div>
                    </td>
                    <td>
                      <span className="admin-category-badge">{p.category}</span>
                    </td>
                  <td>
                    <span className="admin-company-text">{p.company || "-"}</span>
                  </td>
                  <td className="admin-td-price">₹{p.price?.toLocaleString("en-IN")}</td>
                  <td>
                    <span className={`admin-stock-badge ${p.stock <= 5 ? "low" : ""}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td>⭐ {p.rating || "-"}</td>
                  <td>
                    <div className="admin-actions">
                      <button className="admin-action-edit" onClick={() => openEditModal(p)} title="Edit">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      {deleteConfirm === p._id ? (
                        <div className="admin-delete-confirm">
                          <button className="admin-action-confirm" onClick={() => handleDelete(p._id)}>Yes</button>
                          <button className="admin-action-cancel" onClick={() => setDeleteConfirm(null)}>No</button>
                        </div>
                      ) : (
                        <button className="admin-action-delete" onClick={() => setDeleteConfirm(p._id)} title="Delete">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <button className="admin-modal-close" onClick={() => setShowModal(false)}>×</button>
            <h2 className="admin-modal-title">
              {editMode ? "Edit Product" : "Add New Product"}
            </h2>
            <form onSubmit={handleSubmit} className="admin-modal-form">
              <div className="admin-form-group">
                <label>Product Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Wireless Bluetooth Headphones"
                  required
                />
              </div>
              <div className="admin-form-group">
                <label>Description *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Product description..."
                  required
                  rows={3}
                />
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Price (₹) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label>Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  />
                </div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    Category *
                    <button
                      type="button"
                      onClick={() => {
                        setIsNewCategory(!isNewCategory);
                        if (!isNewCategory) setForm({ ...form, category: "" });
                        else setForm({ ...form, category: "general" });
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#4f46e5",
                        cursor: "pointer",
                        fontSize: "13px",
                        fontWeight: "600",
                        padding: 0,
                      }}
                    >
                      {isNewCategory ? "Choose Existing" : "➕ Add New"}
                    </button>
                  </label>
                  {isNewCategory ? (
                    <input
                      type="text"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      placeholder="Type new category..."
                      required
                      autoFocus
                    />
                  ) : (
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      required
                      className="admin-form-select"
                    >
                      <option value="" disabled>Select category...</option>
                      {uniqueCategories
                        .filter((c) => c !== "All Categories")
                        .map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                    </select>
                  )}
                </div>
                <div className="admin-form-group">
                  <label>Company/Brand</label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    placeholder="e.g. Apple"
                  />
                </div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Rating</label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: e.target.value })}
                  />
                </div>
              </div>
              <div className="admin-form-group">
                <label>Image URLs (comma separated)</label>
                <input
                  type="text"
                  value={form.images}
                  onChange={(e) => setForm({ ...form, images: e.target.value })}
                  placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                />
              </div>
              <button type="submit" className="admin-form-submit">
                {editMode ? "Update Product" : "Add Product"}
              </button>
              {msg && (
                <p className={`admin-form-msg ${msg.includes("✅") ? "success" : "error"}`}>
                  {msg}
                </p>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
