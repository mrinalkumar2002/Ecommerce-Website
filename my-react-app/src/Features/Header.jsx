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
    <header className="pill-header">
      <div className="pill-inner">
        {/* LEFT */}
        <Link to="/" className="pill-brand">
          <FaHome />
          <span>Shop</span>
        </Link>

        {/* CENTER */}
        <div className="pill-nav">
          <Link to="/" className="pill-link">Home</Link>
          <Link to="/productlist" className="pill-link">Products</Link>
          <Link to="/cart" className="pill-link pill-cart">
            <FaCartPlus />
            {cartItems.length > 0 && (
              <span className="pill-badge">{cartItems.length}</span>
            )}
          </Link>
        </div>

        {/* RIGHT */}
        {loggedIn && (
          <button className="pill-logout" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;







