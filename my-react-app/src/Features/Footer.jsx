import React from "react";
import { Link } from "react-router-dom";
import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaShieldAlt,
  FaShippingFast,
  FaUndoAlt,
  FaAward,
  FaArrowUp,
} from "react-icons/fa";
import "./Footer.css";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="shoppy-footer">
      {/* 🌟 1. TRUST / VALUE PROPOSITION HIGHLIGHTS BAR */}
      <div className="footer-trust-bar">
        <div className="footer-trust-container">
          <div className="trust-card">
            <div className="trust-icon-box">
              <FaShieldAlt />
            </div>
            <div className="trust-text">
              <strong>{t("footer.trustSecure")}</strong>
              <span>{t("footer.trustSecureSub")}</span>
            </div>
          </div>

          <div className="trust-card">
            <div className="trust-icon-box">
              <FaShippingFast />
            </div>
            <div className="trust-text">
              <strong>{t("footer.trustDelivery")}</strong>
              <span>{t("footer.trustDeliverySub")}</span>
            </div>
          </div>

          <div className="trust-card">
            <div className="trust-icon-box">
              <FaUndoAlt />
            </div>
            <div className="trust-text">
              <strong>{t("footer.trustReturns")}</strong>
              <span>{t("footer.trustReturnsSub")}</span>
            </div>
          </div>

          <div className="trust-card">
            <div className="trust-icon-box">
              <FaAward />
            </div>
            <div className="trust-text">
              <strong>{t("footer.trustAuthentic")}</strong>
              <span>{t("footer.trustAuthenticSub")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 🏛️ 2. MAIN FOOTER NAVIGATION GRID */}
      <div className="footer-main-container">
        {/* BRAND & CONNECT COLUMN */}
        <div className="footer-brand-col">
          <Link to="/" className="footer-logo" onClick={scrollToTop}>
            <span className="logo-white">Shoppy</span>
            <span className="logo-blue">Globe</span>
          </Link>
          <p className="footer-tagline">{t("footer.tagline")}</p>

          <div className="footer-social-section">
            <span className="footer-social-label">{t("footer.connectTitle")}</span>
            <div className="footer-social-row">
              <a
                href="#instagram"
                onClick={(e) => e.preventDefault()}
                className="social-btn"
                title="Instagram"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a
                href="#facebook"
                onClick={(e) => e.preventDefault()}
                className="social-btn"
                title="Facebook"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>
              <a
                href="#twitter"
                onClick={(e) => e.preventDefault()}
                className="social-btn"
                title="Twitter"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>
              <a
                href="#linkedin"
                onClick={(e) => e.preventDefault()}
                className="social-btn"
                title="LinkedIn"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </div>

        {/* 4 LINK COLUMNS */}
        <div className="footer-links-grid">
          {/* COL 1: SHOP */}
          <div className="footer-col">
            <h4 className="footer-col-title">{t("footer.shopTitle")}</h4>
            <ul className="footer-link-list">
              <li>
                <Link to="/productlist">{t("footer.allProducts")}</Link>
              </li>
              <li>
                <Link to="/productlist?category=clothes">{t("footer.fashion")}</Link>
              </li>
              <li>
                <Link to="/productlist?category=electronics">{t("footer.electronics")}</Link>
              </li>
              <li>
                <Link to="/productlist?category=shoes">{t("footer.footwear")}</Link>
              </li>
              <li>
                <Link to="/productlist?category=sports">{t("footer.sports")}</Link>
              </li>
              <li>
                <Link to="/productlist?banner=true">{t("footer.deals")}</Link>
              </li>
            </ul>
          </div>

          {/* COL 2: CUSTOMER SERVICE */}
          <div className="footer-col">
            <h4 className="footer-col-title">{t("footer.customerServiceTitle")}</h4>
            <ul className="footer-link-list">
              <li>
                <Link to="/orders">{t("footer.orderTracking")}</Link>
              </li>
              <li>
                <Link to="/address">{t("footer.shippingDelivery")}</Link>
              </li>
              <li>
                <Link to="/orders">{t("footer.returnsRefunds")}</Link>
              </li>
              <li>
                <Link to="/profile">{t("footer.helpCenter")}</Link>
              </li>
              <li>
                <Link to="/profile">{t("footer.faqs")}</Link>
              </li>
              <li>
                <Link to="/profile">{t("footer.contactSupport")}</Link>
              </li>
            </ul>
          </div>

          {/* COL 3: MY ACCOUNT */}
          <div className="footer-col">
            <h4 className="footer-col-title">{t("footer.accountTitle")}</h4>
            <ul className="footer-link-list">
              <li>
                <Link to="/profile">{t("footer.myProfile")}</Link>
              </li>
              <li>
                <Link to="/orders">{t("footer.myOrders")}</Link>
              </li>
              <li>
                <Link to="/wishlist">{t("footer.wishlist")}</Link>
              </li>
              <li>
                <Link to="/cart">{t("footer.shoppingCart")}</Link>
              </li>
              <li>
                <Link to="/address">{t("footer.savedAddresses")}</Link>
              </li>
            </ul>
          </div>

          {/* COL 4: COMPANY */}
          <div className="footer-col">
            <h4 className="footer-col-title">{t("footer.companyTitle")}</h4>
            <ul className="footer-link-list">
              <li>
                <Link to="/productlist?banner=true">{t("footer.aboutUs")}</Link>
              </li>
              <li>
                <Link to="/">{t("footer.careers")}</Link>
              </li>
              <li>
                <Link to="/profile">{t("footer.privacyPolicy")}</Link>
              </li>
              <li>
                <Link to="/profile">{t("footer.termsConditions")}</Link>
              </li>
              <li>
                <Link to="/profile">{t("footer.security")}</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ⚖️ 3. BOTTOM LEGAL BAR WITH BACK TO TOP */}
      <div className="footer-bottom-bar">
        <div className="footer-bottom-container">
          <span className="copy-text">{t("footer.copyright")}</span>

          <div className="legal-links">
            <Link to="/profile">{t("footer.privacy")}</Link>
            <span className="dot">•</span>
            <Link to="/profile">{t("footer.terms")}</Link>
            <span className="dot">•</span>
            <Link to="/profile">{t("footer.cookies")}</Link>
            <span className="dot">•</span>
            <Link to="/profile">{t("footer.contact")}</Link>
          </div>

          <button
            type="button"
            className="footer-back-to-top"
            onClick={scrollToTop}
            title={t("footer.backToTop")}
            aria-label={t("footer.backToTop")}
          >
            <FaArrowUp />
            <span>{t("footer.backToTop")}</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
