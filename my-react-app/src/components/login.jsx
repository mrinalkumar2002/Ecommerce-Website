import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./login.css";
import api from "../api";
import { useTranslation } from "react-i18next";

export default function Login() {
  const [activeTab, setActiveTab] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  // Auto-fill email if redirected from Register page
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
      setMsg("Email already registered. Please login below.");
    }
  }, [location.state]);

  // If navigated from /admin/login, set admin tab active
  useEffect(() => {
    if (location.state?.adminTab) {
      setActiveTab("admin");
    }
  }, [location.state]);

  // Clear message and fields when switching tabs
  const switchTab = (tab) => {
    setActiveTab(tab);
    setMsg("");
    setEmail("");
    setPassword("");
  };

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      if (activeTab === "admin") {
        // Admin Login
        const res = await api.post("/auth/admin-login", { email, password });
        if (res.data?.user) {
          localStorage.setItem("adminUser", JSON.stringify(res.data.user));
          localStorage.setItem("isAdminLoggedIn", "true");
        }
        setMsg("✅ Admin login successful!");
        setTimeout(() => navigate("/admin/dashboard"), 500);
      } else {
        // User Login
        const res = await api.post("/auth/login", { email, password });
        if (res.data?.user) {
          localStorage.setItem("user", JSON.stringify(res.data.user));
          localStorage.setItem("isLoggedIn", "true");
        }
        setMsg("✅ " + (t("login.loginSuccess") || "Login successful!"));
        setTimeout(() => navigate("/"), 400);
      }
    } catch (err) {
      if (!err.response) {
        setMsg("Cannot connect to server. Please make sure the backend is running.");
      } else if (err.response.status === 403) {
        setMsg("🚫 Access denied. Admin only.");
      } else {
        setMsg(err.response?.data?.message || t("login.loginFailed") || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  function goBack(e) {
    e.preventDefault();
    navigate("/");
  }

  function goRegister(e) {
    e.preventDefault();
    navigate("/register");
  }

  return (
    <div className="login-page">
      <form className="login-container" onSubmit={submit}>
        {/* Back Button */}
        <button type="button" className="back-btn" onClick={goBack}>
          {t("login.back") || "← Back"}
        </button>

        <div className="login-logo-wrap">
          <img src="/myca-logo.png" alt="MYCA - Make Your Cart Anywhere" className="auth-brand-logo" />
        </div>

        {/* Tab Switcher */}
        <div className="login-tabs">
          <button
            type="button"
            className={`login-tab ${activeTab === "user" ? "active" : ""}`}
            onClick={() => switchTab("user")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            User Login
          </button>
          <button
            type="button"
            className={`login-tab ${activeTab === "admin" ? "active" : ""}`}
            onClick={() => switchTab("admin")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
            Admin Login
          </button>
        </div>

        {/* Title changes based on tab */}
        <h2>
          {activeTab === "admin" ? "Admin Panel Access" : t("login.title") || "Welcome Back"}
        </h2>

        {activeTab === "admin" && (
          <p className="login-admin-hint">Enter admin credentials to access the management console</p>
        )}

        <input
          type="email"
          placeholder={activeTab === "admin" ? "admin@shoppyglobe.com" : t("login.emailPlaceholder") || "Enter your email"}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder={activeTab === "admin" ? "Admin password" : t("login.passwordPlaceholder") || "Enter your password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className={`login-btn ${activeTab === "admin" ? "admin-theme" : ""}`} disabled={loading}>
          {loading ? (
            <span className="login-btn-loader"></span>
          ) : activeTab === "admin" ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              Sign In as Admin
            </>
          ) : (
            t("login.loginBtn") || "Sign In"
          )}
        </button>

        {msg && (
          <p className={`login-msg ${msg.includes("✅") ? "success" : ""}`}>
            {msg}
          </p>
        )}

        {activeTab === "user" && (
          <div className="register-link">
            <span>{t("login.noAccount") || "Don't have an account?"}</span>
            <button type="button" onClick={goRegister}>
              {t("login.register") || "Register"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
