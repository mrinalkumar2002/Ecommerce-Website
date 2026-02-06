import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home">

      {/* FLOATING SYSTEM MESSAGE */}
      <div className="floating-msg">
        🔥 127 people shopping right now
      </div>

      <section className="hero">
        {/* FLOATING SHAPES */}
        <div className="blob blob-1" />
        <div className="blob blob-2" />

        <div className="hero-frame">

          {/* LEFT STRIP */}
          <div className="side-strip">
            <span>EST. 2026</span>
            <span>GLOBAL</span>
            <span>ECOM</span>
          </div>

          {/* MAIN */}
          <div className="hero-main">
            <h1 className="reveal">
              FUTURE<br />
              READY<br />
              SHOPPING
            </h1>

            <p className="fade-in">
              ShoppyGlobe is a precision-built commerce platform
              where speed, clarity, and confidence come first.
            </p>

            <Link to="/productlist" className="cta pop">
              SHOP NOW
            </Link>
          </div>

          {/* INFO */}
          <div className="hero-info">
            <div className="stat">
              <strong>10K+</strong>
              <span>Users</span>
            </div>
            <div className="stat">
              <strong>5K+</strong>
              <span>Products</span>
            </div>
            <div className="stat">
              <strong>99.9%</strong>
              <span>Uptime</span>
            </div>
          </div>

        </div>
      </section>

      {/* MANIFESTO */}
      <section className="manifesto">
        <h2 className="float-text">
          Built for speed.<br />
          Designed to move.
        </h2>
      </section>

    </div>
  );
}

export default Home;









