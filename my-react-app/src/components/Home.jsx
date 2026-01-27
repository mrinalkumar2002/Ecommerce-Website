import React from 'react'
import { Link } from 'react-router-dom'
import ProductList from './ProductList'
import "./Home.css";

function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to ShoppyGlobe 🛍️</h1>
      <p>Explore our latest products and add your favorites to the cart!</p>

      <div className="home-buttons">
        <Link to="/productlist" className="btn btn-primary">
         Shop Now
        </Link>
      </div>
    </div>
  );
}

export default Home;


