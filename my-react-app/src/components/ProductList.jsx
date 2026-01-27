import React, { useEffect, useState } from "react";
import { GoSearch } from "react-icons/go";
import "./ProductList.css";
import { useNavigate } from "react-router-dom";

function ProductList() {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const navigate = useNavigate();

  function handleDetail(id) {
    navigate(`/productdetail/${id}`);
  }

  useEffect(() => {
    (async () => {
      const res = await fetch("http://localhost:1900/api/products");
      const json = await res.json();
      setData(json);
      setFiltered(json);
    })();
  }, []);

  function handleSearch(e) {
    const q = e.target.value.toLowerCase();
    setFiltered(
      data.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      )
    );
  }

  return (
    <>
      <div className="search">
        <GoSearch />
        <input placeholder="Search products..." onChange={handleSearch} />
      </div>

      <div className="product-list">
        {filtered.map((product, i) => (
          <div
            className="product-card"
            key={product._id}
            style={{ animationDelay: `${i * 0.08}s` }}
           
          >
            <div className="product-inner">

              {/* FRONT */}
              <div className="product-front">
             
                <img src={product.images?.[0] || "/placeholder.jpg"} />
                <h3>{product.title}</h3>
                <span className="price">₹{product.price || "999"}</span>
              </div>

              {/* BACK */}
              <div className="product-back">
                <p>{product.description}</p>
                <button className="view-btn"    onClick={() => handleDetail(product._id)}>View Details</button>
              </div>

            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default ProductList;

