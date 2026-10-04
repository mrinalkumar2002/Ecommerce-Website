import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import api from "../api";
import { useTranslation } from "react-i18next";

export default function Register() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [userData, setUserData] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" }); // type: "" | "error" | "success"

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      await api.post("/auth/register", userData);

      setMessage({
        text: t('register.registerSuccess'),
        type: "success",
      });

      setTimeout(() => navigate("/login"), 900);

    } catch (error) {
      const status = error.response?.status;
      const errorMsg = error.response?.data?.message || "";

      // Email already exists → redirect to login
      if (
        status === 400 || status === 409 ||
        errorMsg.toLowerCase().includes("exist") ||
        errorMsg.toLowerCase().includes("already")
      ) {
        setMessage({
          text: "Email already registered. Redirecting to Login...",
          type: "error",
        });
        setTimeout(
          () => navigate("/login", { state: { email: userData.email } }),
          1200
        );
      } else if (!error.response) {
        // Network error — backend not running
        setMessage({
          text: "Cannot connect to server. Please make sure the backend is running.",
          type: "error",
        });
      } else {
        setMessage({
          text: errorMsg || t('register.somethingWrong'),
          type: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  function handleback() {
    navigate("/");
  }

  return (
    <div className="auth-wrapper">
      <div className={`register-card ${message.type === "success" ? "success" : ""}`}>
        <button onClick={handleback}>{t('register.back')}</button>


        <h2>{t('register.title')}</h2>

        <form className="register-form" onSubmit={handleSubmit}>
          <label className="field">
            <input
              type="email"
              placeholder={t('register.emailPlaceholder')}
              required
              value={userData.email}
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
            />
            <div className="field-underline" />
          </label>

          <label className="field">
            <input
              type="password"
              placeholder={t('register.passwordPlaceholder')}
              required
              value={userData.password}
              onChange={(e) =>
                setUserData({ ...userData, password: e.target.value })
              }
            />
            <div className="field-underline" />
          </label>

          <button className="register-btn" type="submit" disabled={loading}>
            {loading ? t('register.registering') : t('register.createAccount')}
          </button>

          <div className="form-msg">
            {message.text && (
              <span className={message.type === "error" ? "form-error" : ""}>
                {message.text}
              </span>
            )}
          </div>

          <p className="form-msg">
            {t('register.alreadyHaveAccount')}{" "}
            <span
              style={{ color: "var(--accent)", cursor: "pointer", fontWeight: 700 }}
              onClick={() => navigate("/login")}
            >
              {t('register.login')}
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
