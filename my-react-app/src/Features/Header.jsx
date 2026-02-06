import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Header.css";
import { FaCartPlus, FaHome } from "react-icons/fa";
import { useSelector } from "react-redux";
import api from "../api"; // ✅ use central api

function Header() {
  const cartItems = useSelector((state) => state.cart.items);
  const navigate = useNavigate();
  const location = useLocation();
  const [loggedIn, setLoggedIn] = useState(false);

  // 🔐 Re-check login on every route change
  useEffect(() => {
    api
      .get("/auth/me") // ✅ backend checks cookie
      .then(() => setLoggedIn(true))
      .catch(() => setLoggedIn(false));
  }, [location.pathname]);

  // 🚪 Logout
  const handleLogout = async () => {
    try {
      await api.post("/auth/logout"); // ✅ no localhost

      setLoggedIn(false);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div className="navbar">
      <nav className="nav-links">
        <Link to="/">
          <FaHome /> Home
        </Link>

        <Link to="/cart">
          <FaCartPlus /> {cartItems.length}
        </Link>

        {/* ✅ Logout ONLY if logged in */}
        {loggedIn && (
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        )}
      </nav>
    </div>
  );
}

export default Header;





