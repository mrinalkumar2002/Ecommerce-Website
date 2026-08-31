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
      const errorMsg = error.response?.data?.message || t('register.somethingWrong');
      if (error.response?.status === 409 || error.response?.status === 400) {
        setMessage({
          text: errorMsg,
          type: "error",
        });
        if (errorMsg.toLowerCase().includes("exist")) {
          setTimeout(
            () => navigate("/login", { state: { email: userData.email } }),
            1200
          );
        }
      } else {
        setMessage({
          text: errorMsg,
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
        <div className="register-logo" aria-hidden="true" />

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
