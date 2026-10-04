import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./login.css";
import api from "../api";
import { useTranslation } from "react-i18next";

export default function Login() {
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

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      // Unified Single Login API Endpoint
      const res = await api.post("/auth/login", { email, password });
      const userObj = res.data?.user;

      if (userObj) {
        if (userObj.role === "admin") {
          // Admin credentials detected
          localStorage.setItem("adminUser", JSON.stringify(userObj));
          localStorage.setItem("isAdminLoggedIn", "true");
          localStorage.setItem("user", JSON.stringify(userObj));
          localStorage.setItem("isLoggedIn", "true");
          setMsg("⚡ Welcome Admin! Redirecting to Management Console...");
          setTimeout(() => {
            window.location.href = "/admin/dashboard";
          }, 400);
        } else {
          // Regular User credentials
          localStorage.setItem("user", JSON.stringify(userObj));
          localStorage.setItem("isLoggedIn", "true");
          setMsg("✅ " + (t("login.loginSuccess") || "Login successful!"));
          setTimeout(() => {
            window.location.href = "/";
          }, 400);
        }
      }
    } catch (err) {
      if (!err.response) {
        setMsg("Cannot connect to server. Please make sure the backend is running.");
      } else {
        setMsg(err.response?.data?.message || t("login.loginFailed") || "Invalid email or password");
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


        <h2>{t("login.title") || "Welcome Back"}</h2>
        <p className="login-sub-text">Enter your credentials to sign in to your account</p>

        <input
          type="email"
          placeholder={t("login.emailPlaceholder") || "Enter your email"}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder={t("login.passwordPlaceholder") || "Enter your password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? <span className="login-btn-loader"></span> : (t("login.loginBtn") || "Sign In")}
        </button>

        {msg && (
          <p className={`login-msg ${msg.includes("✅") || msg.includes("⚡") ? "success" : ""}`}>
            {msg}
          </p>
        )}

        <div className="register-link">
          <span>{t("login.noAccount") || "Don't have an account?"}</span>
          <button type="button" onClick={goRegister}>
            {t("login.register") || "Register"}
          </button>
        </div>
      </form>
    </div>
  );
}
