import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Header.css";
import { FaCartPlus, FaHome } from "react-icons/fa";
import { useSelector } from "react-redux";
import api from "../api";

function Header() {
  const cartItems = useSelector((state) => state.cart.items);
  const navigate = useNavigate();
  const location = useLocation();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    api.get("/auth/me")
      .then(() => setLoggedIn(true))
      .catch(() => setLoggedIn(false));
  }, [location.pathname]);

  const handleLogout = async () => {
    await api.post("/auth/logout");
    setLoggedIn(false);
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="brand">
          <FaHome />
          <span>Shop</span>
        </Link>

        <nav className="nav-actions">
          <Link to="/cart" className="cart-link">
            <FaCartPlus />
            {cartItems.length > 0 && (
              <span className="cart-badge">{cartItems.length}</span>
            )}
          </Link>

          {loggedIn && (
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;







