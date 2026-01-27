import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.css"; // import the new CSS

export default function Register() {
  const navigate = useNavigate();

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
      await axios.post("http://localhost:1900/api/auth/register", userData);

      setMessage({ text: "Registration successful! Redirecting to login...", type: "success" });

      // small delay for UX so user sees success
      setTimeout(() => navigate("/login"), 900);
    } catch (error) {
      if (error.response?.status === 409) {
        setMessage({ text: "User already exists. Redirecting to login...", type: "error" });
        setTimeout(() => navigate("/login", { state: { email: userData.email } }), 900);
      } else {
        setMessage({ text: "Something went wrong. Try again.", type: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  function handleback(){
    navigate("/")
  }

  return (
    <div className="auth-wrapper">
      <div className={`register-card ${message.type === "success" ? "success" : ""}`}>
        <button onClick={handleback}>Back</button>
        <div className="register-logo" aria-hidden="true" />
        
        <h2>Register</h2>

        <form className="register-form" onSubmit={handleSubmit}>
          <label className="field">
            <input
              type="email"
              placeholder="Email"
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
              placeholder="Password (min 6 chars)"
              required
              value={userData.password}
              onChange={(e) =>
                setUserData({ ...userData, password: e.target.value })
              }
            />
            <div className="field-underline" />
          </label>

          <button className="register-btn" type="submit" disabled={loading}>
            {loading ? "Registering..." : "Create account"}
          </button>

          <div className="form-msg">
            {message.text && (
              <span className={message.type === "error" ? "form-error" : ""}>
                {message.text}
              </span>
            )}
          </div>

          <p className="form-msg">
            Already have an account?{" "}
            <span
              style={{ color: "var(--accent)", cursor: "pointer", fontWeight: 700 }}
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}




