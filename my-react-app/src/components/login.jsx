import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
 import api from "../api";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

 // ✅ use central axios instance

const submit = async (e) => {
  e.preventDefault();
  setMsg("");

  try {
    // ✅ FIXED: use api.js instead of localhost fetch
    await api.post("/auth/login", {
      email,
      password,
    });

    setMsg("Login successful!");
    navigate("/cart"); // or /productlist if you prefer

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    setMsg(
      err.response?.data?.message || "Login failed"
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
          ← Back
        </button>

        <h2>Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="login-btn">
          Login
        </button>

        {msg && <p className="login-msg">{msg}</p>}

        <div className="register-link">
          <span>Don’t have an account?</span>
          <button type="button" onClick={goRegister}>
            Register
          </button>
        </div>
      </form>
    </div>
  );
}





