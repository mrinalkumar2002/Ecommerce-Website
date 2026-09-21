import React, { useEffect, useState } from "react";
import api from "../../api";
import "./AdminUsers.css";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data?.users || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.role?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-spinner"></div>
        <span>Loading users...</span>
      </div>
    );
  }

  return (
    <div className="admin-users">
      <h1 className="admin-page-title">Users</h1>
      <p className="admin-page-desc">{users.length} registered users in system</p>

      {/* Stat Cards Grid */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: "#F5F3FF", color: "#8B5CF6" }}>👥</div>
          <div className="admin-stat-info">
            <span className="admin-stat-value">{users.length}</span>
            <span className="admin-stat-label">Total Users</span>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: "#ECFDF5", color: "#10B981" }}>🛍️</div>
          <div className="admin-stat-info">
            <span className="admin-stat-value">{users.filter(u => u.role !== "admin").length}</span>
            <span className="admin-stat-label">Customers</span>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: "#EFF6FF", color: "#3B82F6" }}>
            <img src="/admin-staff-icon.png" alt="Admin Staff" style={{ width: "48px", height: "48px", objectFit: "contain", borderRadius: "12px" }} />
          </div>
          <div className="admin-stat-info">
            <span className="admin-stat-value">{users.filter(u => u.role === "admin").length}</span>
            <span className="admin-stat-label">Admin Staff</span>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: "#FEF3C7", color: "#D97706" }}>⚡</div>
          <div className="admin-stat-info">
            <span className="admin-stat-value">{users.filter(u => u.email).length}</span>
            <span className="admin-stat-label">Active Email Accounts</span>
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
          placeholder="Search by name, email, or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredUsers.length === 0 ? (
        <div className="admin-empty">No users found</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div className="admin-user-avatar-cell">
                      {(user.name || user.email || "U").charAt(0).toUpperCase()}
                    </div>
                  </td>
                  <td className="admin-td-name">{user.name || "-"}</td>
                  <td className="admin-td-email">{user.email}</td>
                  <td className="admin-td-phone">{user.phone || "-"}</td>
                  <td>
                    <span className={`admin-role-badge role-${user.role || "user"}`}>
                      {user.role || "user"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
