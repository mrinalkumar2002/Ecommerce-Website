import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import "./Header.css";
import { FaCartPlus, FaHome, FaStore, FaUser, FaGlobe } from "react-icons/fa";
import { GoSearch } from "react-icons/go";
import { BiCategoryAlt } from "react-icons/bi";
import { useSelector } from "react-redux";
import api from "../api";
import { useTranslation } from "react-i18next";

function Header() {
  const { t, i18n } = useTranslation();
  const cartItems = useSelector((state) => state.cart.items);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  const [loggedIn, setLoggedIn] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showCatMenu, setShowCatMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const catRef = React.useRef(null);
  const accountRef = React.useRef(null);

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "hi" : "en";
    i18n.changeLanguage(newLang);
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (catRef.current && !catRef.current.contains(e.target)) {
        setShowCatMenu(false);
      }
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setShowAccountMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    api.get("/auth/me")
      .then(() => setLoggedIn(true))
      .catch(() => setLoggedIn(false));
  }, [location.pathname]);

  // Sync category & search state from URL query parameters
  useEffect(() => {
    const cat = searchParams.get("category") || "all";
    const q = searchParams.get("search") || "";
    setSelectedCategory(cat);
    setSearchQuery(q);
  }, [searchParams]);

  const handleLogout = async () => {
    await api.post("/auth/logout");
    setLoggedIn(false);
    navigate("/login");
  };

  const handleCategoryChange = (e) => {
    const cat = e.target.value;
    setSelectedCategory(cat);
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("search", searchQuery.trim());
    if (cat && cat !== "all") params.set("category", cat);
    navigate(`/productlist?${params.toString()}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("search", searchQuery.trim());
    if (selectedCategory && selectedCategory !== "all") params.set("category", selectedCategory);
    navigate(`/productlist?${params.toString()}`);
  };

  return (
    <header className="pill-header">
      <div className="pill-inner">
        {/* LEFT */}
        <Link to="/productlist?banner=true" className="pill-brand" title={t('header.goToShop')}>
          <FaStore />
          <span>{t('header.shop')}</span>
        </Link>

        {/* CENTER */}
        <div className="pill-nav">
          <Link to="/" className="pill-link">{t('header.home')}</Link>
          <Link to="/productlist" className="pill-link">{t('header.products')}</Link>
          
          {/* CATEGORY SELECTOR IN NAVBAR (Click-to-Toggle Dropdown) */}
          <div className="pill-category-dropdown" ref={catRef}>
            <button
              type="button"
              className="pill-category-btn"
              onClick={() => setShowCatMenu((prev) => !prev)}
            >
              <BiCategoryAlt className="pill-cat-icon" />
              <span>
                {selectedCategory === "electronics" ? t('header.electronics') :
                 selectedCategory === "clothes" ? t('header.clothes') :
                 selectedCategory === "sports" ? t('header.sports') :
                 selectedCategory === "shoes" ? t('header.shoes') : t('header.allCategories')}
              </span>
              <span className="pill-dropdown-arrow">{showCatMenu ? "▲" : "▼"}</span>
            </button>

            {showCatMenu && (
              <div className="pill-category-menu">
                {[
                  { id: "all", label: t('header.allCategories'), icon: "🪟" },
                  { id: "electronics", label: t('header.electronics'), icon: "💻" },
                  { id: "clothes", label: t('header.clothes'), icon: "👕" },
                  { id: "sports", label: t('header.sports'), icon: "⚽" },
                  { id: "shoes", label: t('header.shoes'), icon: "👟" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`pill-cat-menu-item ${selectedCategory === cat.id ? "active" : ""}`}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setShowCatMenu(false);
                      const params = new URLSearchParams();
                      if (searchQuery.trim()) params.set("search", searchQuery.trim());
                      if (cat.id && cat.id !== "all") params.set("category", cat.id);
                      navigate(`/productlist?${params.toString()}`);
                    }}
                  >
                    <span className="pill-cat-emoji">{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleSearchSubmit} className="pill-search-form">
            <input
              type="text"
              placeholder={t('header.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pill-search-input"
            />
            <button type="submit" className="pill-search-button" title={t('header.search')}>
              <GoSearch />
              <span>{t('header.search')}</span>
            </button>
          </form>


        </div>

        {/* RIGHT */}
        <div className="pill-right">
          {/* LANGUAGE TOGGLE */}
          <button
            type="button"
            className="pill-lang-toggle"
            onClick={toggleLanguage}
            title={i18n.language === "en" ? "हिंदी में बदलें" : "Switch to English"}
          >
            <FaGlobe className="pill-lang-icon" />
            <span className={`pill-lang-label ${i18n.language === "en" ? "active" : ""}`}>EN</span>
            <span className="pill-lang-sep">|</span>
            <span className={`pill-lang-label ${i18n.language === "hi" ? "active" : ""}`}>हि</span>
          </button>

          <Link to="/cart" className="pill-link pill-cart" title={t('header.shoppingCart')}>
            <FaCartPlus />
            {cartItems.length > 0 && (
              <span className="pill-badge">
                {cartItems.reduce((acc, i) => acc + Number(i.quantity || 1), 0)}
              </span>
            )}
          </Link>
          {loggedIn ? (
            <div 
              className="pill-account-dropdown"
              ref={accountRef}
              onMouseEnter={() => setShowAccountMenu(true)}
            >
              <button 
                type="button"
                className="pill-account-btn" 
                onClick={() => setShowAccountMenu((prev) => !prev)}
                title={t('header.accountSettings')}
              >
                <FaUser className="pill-account-icon" />
              </button>

              {showAccountMenu && (
                <div className="pill-account-menu">
                  <Link 
                    to="/profile" 
                    className="pill-menu-item"
                    onClick={() => setShowAccountMenu(false)}
                  >
                    👤 {t('header.profile')}
                  </Link>
                  <Link 
                    to="/orders" 
                    className="pill-menu-item"
                    onClick={() => setShowAccountMenu(false)}
                  >
                    📦 {t('header.orders')}
                  </Link>
                  <Link 
                    to="/wishlist" 
                    className="pill-menu-item"
                    onClick={() => setShowAccountMenu(false)}
                  >
                    💙 {t('header.wishlist')}
                  </Link>
                  <Link 
                    to="/address" 
                    className="pill-menu-item"
                    onClick={() => setShowAccountMenu(false)}
                  >
                    📍 {t('header.address')}
                  </Link>
                  <div className="pill-menu-divider"></div>
                  <button 
                    type="button"
                    className="pill-menu-item pill-menu-logout"
                    onClick={() => {
                      setShowAccountMenu(false);
                      handleLogout();
                    }}
                  >
                    🚪 {t('header.logout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="pill-logout" style={{ textDecoration: 'none' }}>
              {t('header.login')}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
