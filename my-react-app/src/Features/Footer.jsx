import React from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaFacebookF, FaTwitter } from "react-icons/fa";
import "./Footer.css";
import { useTranslation } from "react-i18next";

function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="shoppy-footer">
      <div className="footer-main-container">
        {/* LEFT BRAND SECTION */}
        <div className="footer-brand-col">
          <Link to="/" className="footer-logo">
            <span className="logo-white">Shoppy</span>
            <span className="logo-blue">Globe</span>
          </Link>
          <p className="footer-tagline">
            {t('footer.tagline')}
          </p>
          <div className="footer-social-row">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-btn" title="Instagram">
              <FaInstagram />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-btn" title="Facebook">
              <FaFacebookF />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-btn" title="Twitter">
              <FaTwitter />
            </a>
          </div>
        </div>

        {/* RIGHT LINKS COLUMNS */}
        <div className="footer-links-grid">
          {/* COL 1: SHOP */}
          <div className="footer-col">
            <h4 className="footer-col-title">{t('footer.shopTitle')}</h4>
            <ul className="footer-link-list">
              <li><Link to="/productlist">{t('footer.allProducts')}</Link></li>
              <li><Link to="/productlist?category=clothes">{t('footer.fashion')}</Link></li>
              <li><Link to="/productlist?category=electronics">{t('footer.electronics')}</Link></li>
              <li><Link to="/productlist?category=shoes">{t('footer.footwear')}</Link></li>
              <li><Link to="/productlist?category=sports">{t('footer.sports')}</Link></li>
            </ul>
          </div>

          {/* COL 2: DISCOVER */}
          <div className="footer-col">
            <h4 className="footer-col-title">{t('footer.discoverTitle')}</h4>
            <ul className="footer-link-list">
              <li><Link to="/productlist">{t('footer.trending')}</Link></li>
              <li><Link to="/productlist">{t('footer.newArrivals')}</Link></li>
              <li><Link to="/productlist">{t('footer.festiveEdit')}</Link></li>
              <li><Link to="/productlist">{t('footer.bestSellers')}</Link></li>
            </ul>
          </div>

          {/* COL 3: HELP */}
          <div className="footer-col">
            <h4 className="footer-col-title">{t('footer.helpTitle')}</h4>
            <ul className="footer-link-list">
              <li><Link to="/cart">{t('footer.yourCart')}</Link></li>
              <li><Link to="/wishlist">{t('footer.wishlist')}</Link></li>
              <li><Link to="/checkout">{t('footer.checkout')}</Link></li>
              <li><Link to="/orders">{t('footer.trackShopping')}</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* BOTTOM LEGAL BAR */}
      <div className="footer-bottom-bar">
        <div className="footer-bottom-container">
          <span className="copy-text">{t('footer.copyright')}</span>
          <div className="legal-links">
            <Link to="#">{t('footer.privacy')}</Link>
            <span className="dot">•</span>
            <Link to="#">{t('footer.terms')}</Link>
            <span className="dot">•</span>
            <Link to="#">{t('footer.contact')}</Link>
          </div>
          <span className="credit-text">{t('footer.designedFor')}</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
