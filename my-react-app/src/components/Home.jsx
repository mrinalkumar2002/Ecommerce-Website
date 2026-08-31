import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";
import { useTranslation } from "react-i18next";

function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="home-page">
      {/* 1. TICKER ANNOUNCEMENT BAR */}
      <div className="ticker-bar">
        <div className="ticker-track">
          <span>{t('home.tickerFestive')}</span>
          <span>•</span>
          <span>{t('home.tickerIndependence')}</span>
          <span>•</span>
          <span>{t('home.tickerDiscount')}</span>
          <span>•</span>
          <span>{t('home.tickerFreeShipping')}</span>
          <span>•</span>
          <span>{t('home.tickerFestive')}</span>
          <span>•</span>
          <span>{t('home.tickerIndependence')}</span>
          <span>•</span>
          <span>{t('home.tickerDiscount')}</span>
          <span>•</span>
          <span>{t('home.tickerFreeShipping')}</span>
        </div>
      </div>

      {/* 2. HERO FEATURE BANNER ("The freedom to shop better.") */}
      <section className="home-hero-banner">
        <div className="home-hero-content">
          <span className="hero-sub-tag">{t('home.heroSubTag')}</span>
          <h1 className="home-hero-title">
            {t('home.heroTitle1')}<br />
            {t('home.heroTitle2')} <span className="blue-gradient-text">{t('home.heroTitle3')}</span>
          </h1>
          <p className="home-hero-desc">
            {t('home.heroDesc')}
          </p>
          <div className="home-hero-btns">
            <button className="btn-primary-blue" onClick={() => navigate('/productlist')}>
              {t('home.exploreProducts')}
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
              <span>{t('home.independenceDayBadge')}</span>
              <strong>{t('home.upTo60Off')}</strong>
            </div>
          </div>
        </div>
      </section>



      {/* 4. SHOP BY DEPARTMENT SECTION */}
      <section className="dept-section">
        <div className="dept-header">
          <div className="dept-title-meta">
            <span className="dept-sub-tag">{t('home.deptSubTag')}</span>
            <h2>{t('home.deptTitle1')} <span className="gold-accent-text">{t('home.deptTitle2')}</span></h2>
            <p>{t('home.deptDesc')}</p>
          </div>
          <Link to="/productlist" className="view-all-dept-btn">{t('home.viewAll')}</Link>
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
              <h3>{t('home.fashion')}</h3>
              <p>{t('home.fashionDesc')}</p>
              <span className="dept-explore-link">{t('home.explore')}</span>
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
              <h3>{t('home.electronics')}</h3>
              <p>{t('home.electronicsDesc')}</p>
              <span className="dept-explore-link">{t('home.explore')}</span>
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
              <h3>{t('home.footwear')}</h3>
              <p>{t('home.footwearDesc')}</p>
              <span className="dept-explore-link">{t('home.explore')}</span>
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
              <h3>{t('home.sports')}</h3>
              <p>{t('home.sportsDesc')}</p>
              <span className="dept-explore-link">{t('home.explore')}</span>
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
            <span className="standard-bottom-label">{t('home.standardLabel')}</span>
          </div>
          <div className="standard-content">
            <span className="standard-eyebrow">{t('home.standardEyebrow')}</span>
            <h2 className="standard-title">{t('home.standardTitle1')}<br />{t('home.standardTitle2')}</h2>
            <p className="standard-desc">
              {t('home.standardDesc')}
            </p>
            <button className="standard-explore-btn" onClick={() => navigate('/productlist')}>
              {t('home.exploreCollection')} <span>↗</span>
            </button>
            <div className="standard-meta-row">
              <div className="standard-meta-item">
                <strong>208+</strong>
                <span>{t('home.productsCount')}</span>
              </div>
              <div className="standard-meta-item">
                <strong>4</strong>
                <span>{t('home.categoriesCount')}</span>
              </div>
              <div className="standard-meta-item">
                <strong>60%</strong>
                <span>{t('home.maxDiscount')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHY SHOPPYGLOBE — TRUST FEATURES */}
      <section className="why-section">
        <div className="why-inner">
          <div className="why-header">
            <span className="why-sub-tag">{t('home.whySubTag')}</span>
            <h2>{t('home.whyTitle1')} <span className="blue-gradient-text">{t('home.whyTitle2')}</span></h2>
            <p>{t('home.whyDesc')}</p>
          </div>
          <div className="why-grid">
            <div className="why-card">
              <div className="why-icon">🚀</div>
              <h3>{t('home.fastDelivery')}</h3>
              <p>{t('home.fastDeliveryDesc')}</p>
            </div>
            <div className="why-card">
              <div className="why-icon">🔒</div>
              <h3>{t('home.securePayments')}</h3>
              <p>{t('home.securePaymentsDesc')}</p>
            </div>
            <div className="why-card">
              <div className="why-icon">↩️</div>
              <h3>{t('home.hassleFreeReturns')}</h3>
              <p>{t('home.hassleFreeReturnsDesc')}</p>
            </div>
            <div className="why-card">
              <div className="why-icon">🎁</div>
              <h3>{t('home.exclusiveDeals')}</h3>
              <p>{t('home.exclusiveDealsDesc')}</p>
            </div>
            <div className="why-card">
              <div className="why-icon">⭐</div>
              <h3>{t('home.verifiedReviews')}</h3>
              <p>{t('home.verifiedReviewsDesc')}</p>
            </div>
            <div className="why-card">
              <div className="why-icon">🛡️</div>
              <h3>{t('home.buyerProtection')}</h3>
              <p>{t('home.buyerProtectionDesc')}</p>
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
              <span className="deals-eyebrow">{t('home.limitedTimeOffer')}</span>
              <h2 className="deals-title">{t('home.independenceDay')}<br /><span className="deals-highlight">{t('home.megaSale')}</span></h2>
              <p className="deals-desc" dangerouslySetInnerHTML={{ __html: t('home.dealsDesc') }} />
              <button className="deals-cta-btn" onClick={() => navigate('/productlist?banner=true')}>{t('home.shopTheSale')}</button>
            </div>
          </div>
          <div className="deals-right">
            <div className="deal-pill">
              <span className="deal-pill-cat">{t('home.fashion')}</span>
              <span className="deal-pill-off">{t('home.upTo50Off')}</span>
            </div>
            <div className="deal-pill">
              <span className="deal-pill-cat">{t('home.electronics')}</span>
              <span className="deal-pill-off">{t('home.upTo40Off')}</span>
            </div>
            <div className="deal-pill">
              <span className="deal-pill-cat">{t('home.footwear')}</span>
              <span className="deal-pill-off">{t('home.upTo60Off')}</span>
            </div>
            <div className="deal-pill">
              <span className="deal-pill-cat">{t('home.sports')}</span>
              <span className="deal-pill-off">{t('home.upTo35Off')}</span>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}

export default Home;
