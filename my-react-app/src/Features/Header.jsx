import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import "./Header.css";
import { FaCartPlus, FaStore, FaUser, FaGlobe, FaBalanceScale, FaBolt, FaSearch, FaTimes, FaSun, FaMoon, FaCamera } from "react-icons/fa";
import { BiCategoryAlt } from "react-icons/bi";
import { useSelector, useDispatch } from "react-redux";
import { openCompareModal } from "../redux/compareSlice";
import api from "../api";
import { useTranslation } from "react-i18next";
import ProductTransText from "../components/ProductTransText";
import VisualSearchModal from "../components/VisualSearchModal";

const RECENT_SEARCHES_KEY = "pvx_recent_searches";

export default function Header() {
  const { t, i18n } = useTranslation();
  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist?.items || []);
  const compareItems = useSelector((state) => state.compare?.items || []);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [loggedIn, setLoggedIn] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showCatMenu, setShowCatMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showVisualSearchModal, setShowVisualSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);

  const catRef = useRef(null);
  const accountRef = useRef(null);
  const langRef = useRef(null);
  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("pvx_theme") || (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("pvx_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "hi" : "en";
    i18n.changeLanguage(newLang);
  };

  const loadRecentSearches = () => {
    try {
      const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
      setRecentSearches(raw ? JSON.parse(raw) : []);
    } catch {
      setRecentSearches([]);
    }
  };

  const saveRecentSearch = (query) => {
    if (!query || !query.trim()) return;
    const clean = query.trim();
    try {
      let recents = recentSearches.filter((s) => s.toLowerCase() !== clean.toLowerCase());
      recents.unshift(clean);
      if (recents.length > 6) recents = recents.slice(0, 6);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recents));
      setRecentSearches(recents);
    } catch (e) {}
  };

  const removeRecentSearch = (e, item) => {
    e.stopPropagation();
    const updated = recentSearches.filter((s) => s !== item);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    setRecentSearches(updated);
  };

  useEffect(() => {
    loadRecentSearches();
    api.get("/products")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setAllProducts(res.data);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (catRef.current && !catRef.current.contains(e.target)) {
        setShowCatMenu(false);
      }
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setShowAccountMenu(false);
      }
      if (langRef.current && !langRef.current.contains(e.target)) {
        setShowLangMenu(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
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

  useEffect(() => {
    const cat = searchParams.get("category") || "all";
    const q = searchParams.get("search") || "";
    setSelectedCategory(cat);
    setSearchQuery(q);
  }, [searchParams]);

  useEffect(() => {
    if (!searchQuery.trim() || allProducts.length === 0) {
      setSuggestions([]);
      return;
    }
    const q = searchQuery.toLowerCase().trim();
    const matches = allProducts
      .filter((p) => p.title?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q))
      .slice(0, 5);
    setSuggestions(matches);
  }, [searchQuery, allProducts]);

  const handleLogout = async () => {
    await api.post("/auth/logout");
    setLoggedIn(false);
    navigate("/login");
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim() && selectedCategory === "all") return;
    saveRecentSearch(searchQuery);
    setShowSearchDropdown(false);
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("search", searchQuery.trim());
    if (selectedCategory && selectedCategory !== "all") params.set("category", selectedCategory);
    navigate(`/productlist?${params.toString()}`);
  };

  const handleSuggestionClick = (product) => {
    saveRecentSearch(product.title);
    setShowSearchDropdown(false);
    navigate(`/productdetail/${product._id}`);
  };

  const handleRecentClick = (text) => {
    setSearchQuery(text);
    saveRecentSearch(text);
    setShowSearchDropdown(false);
    const params = new URLSearchParams();
    params.set("search", text);
    if (selectedCategory && selectedCategory !== "all") params.set("category", selectedCategory);
    navigate(`/productlist?${params.toString()}`);
  };

  const handleKeyDown = (e) => {
    if (!showSearchDropdown) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestionIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestionIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter" && activeSuggestionIndex >= 0 && suggestions[activeSuggestionIndex]) {
      e.preventDefault();
      handleSuggestionClick(suggestions[activeSuggestionIndex]);
    } else if (e.key === "Escape") {
      setShowSearchDropdown(false);
    }
  };

  const TRENDING_SEARCHES = [
    "Running shoes under 2000",
    "Smartphones",
    "Wireless Earbuds",
    "Laptops",
    "Gym gear",
  ];

  const totalCartCount = cartItems.reduce((acc, i) => acc + Number(i.quantity || 1), 0);

  return (
    <header className="marketplace-header-wrapper">
      {/* 1. TOP UTILITY STRIP */}
      <div className="header-top-utility">
        <div className="header-top-inner">
          <div className="utility-left">
            <FaBolt className="utility-bolt" />
            <span>{t("home.tickerFreeShipping")}</span>
          </div>
          <div className="utility-right">
            <Link to="/orders" className="utility-link">
              {t("header.orders")}
            </Link>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION BAR */}
      <div className="main-navbar-sticky">
        <div className="main-navbar-inner">
          {/* BRAND LOGO */}
          <Link to="/" className="mp-brand-logo" title="MYCA - Make Your Cart Anywhere">
            <img src="/myca-logo.png" alt="MYCA - Make Your Cart Anywhere" className="mp-logo-img" />
          </Link>

          {/* PRIMARY NAV LINKS */}
          <nav className="mp-nav-links" aria-label="Main Navigation">
            <Link
              to="/"
              className={`mp-nav-link ${location.pathname === "/" ? "active" : ""}`}
            >
              {t("header.home")}
            </Link>
            <Link
              to="/productlist"
              className={`mp-nav-link ${location.pathname === "/productlist" && !location.search.includes("banner") ? "active" : ""}`}
            >
              {t("header.products")}
            </Link>
            <Link
              to="/productlist?banner=true"
              className={`mp-nav-link ${location.search.includes("banner") ? "active" : ""}`}
            >
              {t("home.shopDeals")}
            </Link>

            {/* CATEGORY SELECTOR DROPDOWN */}
            <div className="mp-cat-dropdown-wrap" ref={catRef}>
              <button
                type="button"
                className="mp-cat-dropdown-btn"
                onClick={() => setShowCatMenu((prev) => !prev)}
                aria-expanded={showCatMenu}
              >
                <BiCategoryAlt className="mp-cat-btn-icon" />
                <span>
                  {selectedCategory === "electronics" ? t("header.electronics") :
                   selectedCategory === "clothes" ? t("header.clothes") :
                   selectedCategory === "sports" ? t("header.sports") :
                   selectedCategory === "shoes" ? t("header.shoes") : t("header.allCategories")}
                </span>
                <span className="mp-dropdown-caret">{showCatMenu ? "▲" : "▼"}</span>
              </button>

              {showCatMenu && (
                <div className="mp-cat-dropdown-menu">
                  {[
                    { id: "all", label: t("header.allCategories"), icon: "🪟" },
                    { id: "electronics", label: t("header.electronics"), icon: "💻" },
                    { id: "clothes", label: t("header.clothes"), icon: "👕" },
                    { id: "sports", label: t("header.sports"), icon: "⚽" },
                    { id: "shoes", label: t("header.shoes"), icon: "👟" },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      className={`mp-cat-menu-item ${selectedCategory === cat.id ? "active" : ""}`}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setShowCatMenu(false);
                        const params = new URLSearchParams();
                        if (searchQuery.trim()) params.set("search", searchQuery.trim());
                        if (cat.id && cat.id !== "all") params.set("category", cat.id);
                        navigate(`/productlist?${params.toString()}`);
                      }}
                    >
                      <span className="mp-cat-emoji">{cat.icon}</span>
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* SEARCH BAR WITH LIVE AUTOCOMPLETE */}
          <div className="mp-search-container" ref={searchContainerRef}>
            <form onSubmit={handleSearchSubmit} className="mp-search-form">
              <FaSearch className="mp-search-input-icon" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder={t("header.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                onKeyDown={handleKeyDown}
                className="mp-search-input"
                aria-label="Search catalog"
              />
              <button
                type="button"
                className="mp-visual-search-btn"
                onClick={() => setShowVisualSearchModal(true)}
                title="Search by image (Visual Search)"
                aria-label="Search by image"
              >
                <FaCamera />
              </button>
              {searchQuery && (
                <button
                  type="button"
                  className="mp-search-clear"
                  onClick={() => {
                    setSearchQuery("");
                    searchInputRef.current?.focus();
                  }}
                  title="Clear search"
                  aria-label="Clear search"
                >
                  <FaTimes />
                </button>
              )}
              <button type="submit" className="mp-search-btn" title={t("header.search")} aria-label="Search">
                <span>{t("header.search")}</span>
              </button>
            </form>

            {/* AUTOCOMPLETE POPUP DROPDOWN */}
            {showSearchDropdown && (
              <div className="mp-autocomplete-dropdown">
                {/* 1. Live Product Suggestions */}
                {suggestions.length > 0 && (
                  <div className="mp-dropdown-section">
                    <span className="mp-section-header">⚡ {t("smartSearch.suggestions")}</span>
                    <div className="mp-suggestions-list">
                      {suggestions.map((item, idx) => (
                        <div
                          key={item._id}
                          className={`mp-suggestion-row ${
                            idx === activeSuggestionIndex ? "keyboard-active" : ""
                          }`}
                          onClick={() => handleSuggestionClick(item)}
                        >
                          <img
                            src={
                              item.images?.length
                                ? item.images[0]
                                : `https://picsum.photos/seed/${item._id}/100/100`
                            }
                            alt=""
                            className="mp-suggestion-thumb"
                          />
                          <div className="mp-suggestion-info">
                            <span className="mp-suggestion-title">
                              <ProductTransText text={item.title} />
                            </span>
                            <span className="mp-suggestion-price">₹{Number(item.price).toLocaleString()}</span>
                          </div>
                          <span className="mp-suggestion-arrow">↗</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="mp-dropdown-section">
                    <div className="mp-section-header-row">
                      <span className="mp-section-header">🕒 {t("smartSearch.recentSearches")}</span>
                      <button
                        type="button"
                        className="mp-clear-recents-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          localStorage.removeItem(RECENT_SEARCHES_KEY);
                          setRecentSearches([]);
                        }}
                      >
                        {t("smartSearch.clearAll")}
                      </button>
                    </div>
                    <div className="mp-recent-chips">
                      {recentSearches.map((term, i) => (
                        <span
                          key={i}
                          className="mp-recent-chip"
                          onClick={() => handleRecentClick(term)}
                        >
                          <span>{term}</span>
                          <button
                            type="button"
                            className="mp-chip-remove"
                            onClick={(e) => removeRecentSearch(e, term)}
                            aria-label="Remove search term"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Trending Searches */}
                <div className="mp-dropdown-section">
                  <span className="mp-section-header">🔥 {t("smartSearch.popularSearches")}</span>
                  <div className="mp-trending-chips">
                    {TRENDING_SEARCHES.map((term, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className="mp-trending-chip"
                        onClick={() => handleRecentClick(term)}
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mp-dropdown-footer">
                  <span>{t("smartSearch.naturalHint")}</span>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT UTILITY ACTIONS */}
          <div className="mp-right-actions">
            {/* COMPARE SHORTCUT */}
            {compareItems.length > 0 && (
              <button
                type="button"
                className="mp-action-icon-btn"
                onClick={() => dispatch(openCompareModal())}
                title={t("compare.title")}
                aria-label="Compare"
              >
                <FaBalanceScale className="mp-icon" />
                <span className="mp-badge mp-badge-blue">{compareItems.length}</span>
              </button>
            )}

            {/* WISHLIST BUTTON */}
            <Link
              to="/wishlist"
              className="mp-action-icon-btn"
              title={t("header.wishlist")}
              aria-label="Wishlist"
            >
              <img src="/menu-wishlist-icon.png" alt="Wishlist" style={{ width: "24px", height: "24px", objectFit: "contain" }} />
              {wishlistItems.length > 0 && (
                <span className="mp-badge mp-badge-red">{wishlistItems.length}</span>
              )}
            </Link>

            {/* CART BUTTON */}
            <Link
              to="/cart"
              className="mp-action-icon-btn mp-cart-btn"
              title={t("header.shoppingCart")}
              aria-label="Cart"
            >
              <FaCartPlus className="mp-icon" />
              {totalCartCount > 0 && (
                <span className="mp-badge mp-badge-blue">{totalCartCount}</span>
              )}
            </Link>

            {/* THEME TOGGLE BUTTON */}
            <button
              type="button"
              className="mp-action-icon-btn mp-theme-toggle-btn"
              onClick={toggleTheme}
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === "dark" ? <FaSun className="mp-theme-sun" /> : <FaMoon className="mp-theme-moon" />}
            </button>

            {/* LANGUAGE DROPDOWN */}
            <div className="mp-lang-dropdown-wrap" ref={langRef}>
              <button
                type="button"
                className={`mp-action-icon-btn mp-lang-toggle-btn ${showLangMenu ? "active" : ""}`}
                onClick={() => setShowLangMenu((prev) => !prev)}
                title="Language / भाषा"
                aria-label="Language options"
                aria-expanded={showLangMenu}
              >
                <FaGlobe className="mp-icon mp-lang-globe-icon" />
              </button>

              {showLangMenu && (
                <div className="mp-lang-dropdown-menu">
                  <div className="mp-lang-menu-header">Language / भाषा</div>
                  <button
                    type="button"
                    className={`mp-lang-menu-item ${i18n.language === "en" ? "active" : ""}`}
                    onClick={() => {
                      i18n.changeLanguage("en");
                      setShowLangMenu(false);
                    }}
                  >
                    <span className="mp-lang-flag">🇺🇸</span>
                    <span className="mp-lang-label">English</span>
                    {i18n.language === "en" && <span className="mp-lang-check">✓</span>}
                  </button>
                  <button
                    type="button"
                    className={`mp-lang-menu-item ${i18n.language === "hi" ? "active" : ""}`}
                    onClick={() => {
                      i18n.changeLanguage("hi");
                      setShowLangMenu(false);
                    }}
                  >
                    <span className="mp-lang-flag">🇮🇳</span>
                    <span className="mp-lang-label">Hindi (हिंदी)</span>
                    {i18n.language === "hi" && <span className="mp-lang-check">✓</span>}
                  </button>
                </div>
              )}
            </div>

            {/* ACCOUNT MENU */}
            {loggedIn ? (
              <div
                className="mp-account-dropdown"
                ref={accountRef}
                onMouseEnter={() => setShowAccountMenu(true)}
              >
                <button
                  type="button"
                  className="mp-account-avatar-btn"
                  onClick={() => setShowAccountMenu((prev) => !prev)}
                  title={t("header.accountSettings")}
                  aria-label="Account Settings"
                >
                  <FaUser />
                </button>

                {showAccountMenu && (
                  <div className="mp-account-menu">
                    <Link
                      to="/profile"
                      className="mp-menu-item"
                      onClick={() => setShowAccountMenu(false)}
                    >
                      <img src="/menu-profile-icon.png" alt="Profile" className="mp-menu-icon-img" />
                      {t("header.profile")}
                    </Link>
                    <Link
                      to="/orders"
                      className="mp-menu-item"
                      onClick={() => setShowAccountMenu(false)}
                    >
                      <img src="/menu-orders-icon.png" alt="Orders" className="mp-menu-icon-img" />
                      {t("header.orders")}
                    </Link>
                    <Link
                      to="/wishlist"
                      className="mp-menu-item"
                      onClick={() => setShowAccountMenu(false)}
                    >
                      <img src="/menu-wishlist-icon.png" alt="Wishlist" className="mp-menu-icon-img" />
                      {t("header.wishlist")}
                    </Link>
                    <Link
                      to="/address"
                      className="mp-menu-item"
                      onClick={() => setShowAccountMenu(false)}
                    >
                      <img src="/menu-address-icon.png" alt="Address" className="mp-menu-icon-img" />
                      {t("header.address")}
                    </Link>
                    <div className="mp-menu-divider"></div>
                    <button
                      type="button"
                      className="mp-menu-item mp-menu-logout"
                      onClick={() => {
                        setShowAccountMenu(false);
                        handleLogout();
                      }}
                    >
                      <img src="/menu-logout-icon.png" alt="Logout" className="mp-menu-icon-img" />
                      {t("header.logout")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="mp-login-btn">
                {t("header.login")}
              </Link>
            )}
          </div>
        </div>
      </div>

      {showVisualSearchModal && (
        <VisualSearchModal
          isOpen={showVisualSearchModal}
          onClose={() => setShowVisualSearchModal(false)}
        />
      )}
    </header>
  );
}
