import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      {/* 1. TICKER ANNOUNCEMENT BAR */}
      <div className="ticker-bar">
        <div className="ticker-track">
          <span>⚡ SHOPPYGLOBE FESTIVE EDIT 2026</span>
          <span>•</span>
          <span>INDEPENDENCE DAY EDIT 2026</span>
          <span>•</span>
          <span>UP TO 60% OFF</span>
          <span>•</span>
          <span>FREE SHIPPING ON SELECT ORDERS</span>
          <span>•</span>
          <span>⚡ SHOPPYGLOBE FESTIVE EDIT 2026</span>
          <span>•</span>
          <span>INDEPENDENCE DAY EDIT 2026</span>
          <span>•</span>
          <span>UP TO 60% OFF</span>
          <span>•</span>
          <span>FREE SHIPPING ON SELECT ORDERS</span>
        </div>
      </div>

      {/* 2. HERO FEATURE BANNER ("The freedom to shop better.") */}
      <section className="home-hero-banner">
        <div className="home-hero-content">
          <span className="hero-sub-tag">SHOPPYGLOBE</span>
          <h1 className="home-hero-title">
            The freedom<br />
            to <span className="blue-gradient-text">shop better.</span>
          </h1>
          <p className="home-hero-desc">
            Discover fashion, technology, footwear and everyday essentials curated for your next upgrade.
          </p>
          <div className="home-hero-btns">
            <button className="btn-primary-blue" onClick={() => navigate('/productlist')}>
              Explore Products
            </button>
          </div>
        </div>

        <div className="home-hero-media">
          <div className="media-card-wrapper">
            <img 
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80" 
              alt="Festive Showcase" 
              className="hero-media-img"
            />
            <div className="hero-media-overlay-badge">
              <span>INDEPENDENCE DAY</span>
              <strong>UP TO 60% OFF</strong>
            </div>
          </div>
        </div>
      </section>



      {/* 4. SHOP BY DEPARTMENT SECTION */}
      <section className="dept-section">
        <div className="dept-header">
          <div className="dept-title-meta">
            <span className="dept-sub-tag">DISCOVER YOUR NEXT</span>
            <h2>Shop by <span className="gold-accent-text">department</span></h2>
            <p>Everything you want, all in one place.</p>
          </div>
          <Link to="/productlist" className="view-all-dept-btn">VIEW ALL →</Link>
        </div>

        <div className="dept-cards-grid">
          {/* FASHION */}
          <div 
            className="dept-card dept-fashion"
            onClick={() => navigate('/productlist?category=clothes')}
          >
            <img 
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80" 
              alt="Fashion" 
            />
            <div className="dept-card-content">
              <span className="dept-num">01</span>
              <h3>Fashion</h3>
              <p>Fresh styles, everyday essentials.</p>
              <span className="dept-explore-link">EXPLORE ↗</span>
            </div>
          </div>

          {/* ELECTRONICS */}
          <div 
            className="dept-card dept-electronics"
            onClick={() => navigate('/productlist?category=electronics')}
          >
            <img 
              src="https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=600&q=80" 
              alt="Electronics" 
            />
            <div className="dept-card-content">
              <span className="dept-num">02</span>
              <h3>Electronics</h3>
              <p>Smart tech for modern life.</p>
              <span className="dept-explore-link">EXPLORE ↗</span>
            </div>
          </div>

          {/* FOOTWEAR */}
          <div 
            className="dept-card dept-footwear"
            onClick={() => navigate('/productlist?category=shoes')}
          >
            <img 
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80" 
              alt="Footwear" 
            />
            <div className="dept-card-content">
              <span className="dept-num">03</span>
              <h3>Footwear</h3>
              <p>Step into something better.</p>
              <span className="dept-explore-link">EXPLORE ↗</span>
            </div>
          </div>

          {/* SPORTS */}
          <div 
            className="dept-card dept-sports"
            onClick={() => navigate('/productlist?category=sports')}
          >
            <img 
              src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80" 
              alt="Sports" 
            />
            <div className="dept-card-content">
              <span className="dept-num">04</span>
              <h3>Sports</h3>
              <p>Gear up, move more.</p>
              <span className="dept-explore-link">EXPLORE ↗</span>
            </div>
          </div>
        </div>
      </section>

      {/* THE STANDARD — Brand Showcase */}
      <section className="standard-section">
        <div className="standard-inner">
          <div className="standard-image-wrap">
            <img
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"
              alt="The Standard — ShoppyGlobe"
              className="standard-img"
            />
            <span className="standard-bottom-label">THE STANDARD</span>
          </div>
          <div className="standard-content">
            <span className="standard-eyebrow">THE SHOPPYGLOBE STANDARD</span>
            <h2 className="standard-title">Good design.<br />Better choices.</h2>
            <p className="standard-desc">
              From things you need to things you didn't know you needed — ShoppyGlobe brings together products that fit beautifully into everyday life.
            </p>
            <button className="standard-explore-btn" onClick={() => navigate('/productlist')}>
              Explore the collection <span>↗</span>
            </button>
            <div className="standard-meta-row">
              <div className="standard-meta-item">
                <strong>208+</strong>
                <span>Products</span>
              </div>
              <div className="standard-meta-item">
                <strong>4</strong>
                <span>Categories</span>
              </div>
              <div className="standard-meta-item">
                <strong>60%</strong>
                <span>Max Discount</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHY SHOPPYGLOBE — TRUST FEATURES */}
      <section className="why-section">
        <div className="why-inner">
          <div className="why-header">
            <span className="why-sub-tag">WHY CHOOSE US</span>
            <h2>Shopping, <span className="blue-gradient-text">reimagined.</span></h2>
            <p>Everything we do is built around making your experience better.</p>
          </div>
          <div className="why-grid">
            <div className="why-card">
              <div className="why-icon">🚀</div>
              <h3>Lightning Fast Delivery</h3>
              <p>Get your orders in 24–48 hours with our express delivery network across India.</p>
            </div>
            <div className="why-card">
              <div className="why-icon">🔒</div>
              <h3>Secure Payments</h3>
              <p>Bank-grade encryption and multiple payment options including UPI, cards & wallets.</p>
            </div>
            <div className="why-card">
              <div className="why-icon">↩️</div>
              <h3>Hassle-Free Returns</h3>
              <p>Not happy? Return it within 30 days — no questions asked, full refund guaranteed.</p>
            </div>
            <div className="why-card">
              <div className="why-icon">🎁</div>
              <h3>Exclusive Deals Daily</h3>
              <p>Members get early access to flash sales, limited drops and seasonal mega-offers.</p>
            </div>
            <div className="why-card">
              <div className="why-icon">⭐</div>
              <h3>Verified Reviews</h3>
              <p>Every review is from a real buyer. Transparent ratings you can actually trust.</p>
            </div>
            <div className="why-card">
              <div className="why-icon">🛡️</div>
              <h3>Buyer Protection</h3>
              <p>Your purchase is protected end-to-end. We've got you covered at every step.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FLASH DEALS BANNER */}
      <section className="deals-banner-section">
        <div className="deals-banner-inner">
          <div className="deals-left">
            <span className="deals-fire">🔥</span>
            <div>
              <span className="deals-eyebrow">LIMITED TIME OFFER</span>
              <h2 className="deals-title">Independence Day<br /><span className="deals-highlight">Mega Sale</span></h2>
              <p className="deals-desc">Up to <strong>60% off</strong> on Fashion, Electronics, Footwear & more. Sale ends soon!</p>
              <button className="deals-cta-btn" onClick={() => navigate('/productlist?banner=true')}>Shop the Sale →</button>
            </div>
          </div>
          <div className="deals-right">
            <div className="deal-pill">
              <span className="deal-pill-cat">Fashion</span>
              <span className="deal-pill-off">UP TO 50% OFF</span>
            </div>
            <div className="deal-pill">
              <span className="deal-pill-cat">Electronics</span>
              <span className="deal-pill-off">UP TO 40% OFF</span>
            </div>
            <div className="deal-pill">
              <span className="deal-pill-cat">Footwear</span>
              <span className="deal-pill-off">UP TO 60% OFF</span>
            </div>
            <div className="deal-pill">
              <span className="deal-pill-cat">Sports</span>
              <span className="deal-pill-off">UP TO 35% OFF</span>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}

export default Home;
