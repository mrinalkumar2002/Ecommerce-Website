import React from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaFacebookF, FaTwitter } from "react-icons/fa";
import "./Footer.css";

function Footer() {
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
            A better way to discover the things you love. Thoughtfully designed shopping, without the noise.
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
            <h4 className="footer-col-title">SHOP</h4>
            <ul className="footer-link-list">
              <li><Link to="/productlist">All products</Link></li>
              <li><Link to="/productlist?category=clothes">Fashion</Link></li>
              <li><Link to="/productlist?category=electronics">Electronics</Link></li>
              <li><Link to="/productlist?category=shoes">Footwear</Link></li>
              <li><Link to="/productlist?category=sports">Sports</Link></li>
            </ul>
          </div>

          {/* COL 2: DISCOVER */}
          <div className="footer-col">
            <h4 className="footer-col-title">DISCOVER</h4>
            <ul className="footer-link-list">
              <li><Link to="/productlist">Trending</Link></li>
              <li><Link to="/productlist">New arrivals</Link></li>
              <li><Link to="/productlist">Festive edit</Link></li>
              <li><Link to="/productlist">Best sellers</Link></li>
            </ul>
          </div>

          {/* COL 3: HELP */}
          <div className="footer-col">
            <h4 className="footer-col-title">HELP</h4>
            <ul className="footer-link-list">
              <li><Link to="/cart">Your cart</Link></li>
              <li><Link to="/wishlist">Wishlist</Link></li>
              <li><Link to="/checkout">Checkout</Link></li>
              <li><Link to="/orders">Track shopping</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* BOTTOM LEGAL BAR */}
      <div className="footer-bottom-bar">
        <div className="footer-bottom-container">
          <span className="copy-text">© 2026 ShoppyGlobe. All rights reserved.</span>
          <div className="legal-links">
            <Link to="#">Privacy</Link>
            <span className="dot">•</span>
            <Link to="#">Terms</Link>
            <span className="dot">•</span>
            <Link to="#">Contact</Link>
          </div>
          <span className="credit-text">Designed for better shopping</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
