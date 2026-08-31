import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import api from "../api";
import { useTranslation } from "react-i18next";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      setMsg(t('login.loginSuccess'));

      // Save user session in localStorage
      if (res.data?.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("isLoggedIn", "true");
      }

      // Smooth redirect to Home page
      setTimeout(() => {
        navigate("/");
      }, 400);

    } catch (err) {
      console.error("LOGIN ERROR:", err);
      setMsg(
        err.response?.data?.message || t('login.loginFailed')
      );
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
          {t('login.back')}
        </button>

        <h2>{t('login.title')}</h2>

        <input
          type="email"
          placeholder={t('login.emailPlaceholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder={t('login.passwordPlaceholder')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="login-btn">
          {t('login.loginBtn')}
        </button>

        {msg && <p className="login-msg">{msg}</p>}

        <div className="register-link">
          <span>{t('login.noAccount')}</span>
          <button type="button" onClick={goRegister}>
            {t('login.register')}
          </button>
        </div>
      </form>
    </div>
  );
}
