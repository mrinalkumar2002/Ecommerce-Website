import React, { useState, useEffect } from "react";
import api from "../../api";
import "./AdminFeatures.css";

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => { fetchReviews(); }, []);

  const fetchReviews = async () => {
    try {
      const res = await api.get("/admin/reviews");
      setReviews(res.data.reviews || []);
    } catch { } finally { setLoading(false); }
  };

  const handleApprove = async (id) => {
    try { await api.put(`/admin/reviews/${id}`, { isApproved: true }); fetchReviews(); }
    catch { alert("Error approving review."); }
  };

  const handleReject = async (id) => {
    try { await api.put(`/admin/reviews/${id}`, { isApproved: false }); fetchReviews(); }
    catch { alert("Error rejecting review."); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    try { await api.delete(`/admin/reviews/${id}`); fetchReviews(); }
    catch { alert("Error deleting review."); }
  };

  const stars = (n) => "★".repeat(n) + "☆".repeat(5 - n);

  const filtered = filter === "approved" ? reviews.filter(r => r.isApproved)
    : filter === "pending" ? reviews.filter(r => !r.isApproved)
    : reviews;

  return (
    <div className="af-page">
      <div className="af-header">
        <div>
          <h1 className="af-title">Reviews & Ratings</h1>
          <p className="af-desc">Moderate customer product reviews</p>
        </div>
        <div className="af-filter-tabs">
          {["all", "approved", "pending"].map(f => (
            <button key={f} className={`af-tab ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
              <span className="af-tab-count">{f === "all" ? reviews.length : f === "approved" ? reviews.filter(r => r.isApproved).length : reviews.filter(r => !r.isApproved).length}</span>
            </button>
          ))}
        </div>
      </div>

      {loading ? <div className="af-loading">Loading...</div> : (
        filtered.length === 0 ? <div className="af-empty">No reviews found.</div> : (
          <div className="af-reviews-list">
            {filtered.map(r => (
              <div key={r._id} className={`af-review-card ${r.isApproved ? "approved" : "pending"}`}>
                <div className="af-review-top">
                  <div>
                    <span className="af-review-stars">{stars(r.rating)}</span>
                    <span className="af-review-product">{r.product?.title || "Unknown Product"}</span>
                  </div>
                  <span className={`af-badge ${r.isApproved ? "af-badge-green" : "af-badge-yellow"}`}>{r.isApproved ? "Approved" : "Pending"}</span>
                </div>
                <p className="af-review-comment">"{r.comment}"</p>
                <div className="af-review-bottom">
                  <span className="af-review-user">By: {r.user?.name || r.user?.email || "Anonymous"}</span>
                  <span className="af-review-date">{new Date(r.createdAt).toLocaleDateString("en-IN")}</span>
                </div>
                <div className="af-review-actions">
                  {!r.isApproved && <button className="af-action-btn af-approve" onClick={() => handleApprove(r._id)}>✓ Approve</button>}
                  {r.isApproved && <button className="af-action-btn af-reject" onClick={() => handleReject(r._id)}>✕ Reject</button>}
                  <button className="af-action-btn af-delete" onClick={() => handleDelete(r._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
