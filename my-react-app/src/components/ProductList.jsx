import React, { useEffect, useState } from "react";
import { GoSearch } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./ProductList.css";

function ProductList() {
  const [data, setData] = useState([]);       // full product list
  const [filtered, setFiltered] = useState([]); // filtered list
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  function handleDetail(id) {
    navigate(`/productdetail/${id}`);
  }

  // ✅ FETCH PRODUCTS FROM RENDER BACKEND
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        setData(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ✅ SEARCH (REMOVED category — not in schema)
  function handleSearch(e) {
    const q = e.target.value.toLowerCase();

    setFiltered(
      data.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      )
    );
  }

  // ✅ LOADING STATE
  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "40px" }}>Loading products...</p>;
  }

  // ✅ EMPTY STATE (IMPORTANT FIX)
  if (!filtered || filtered.length === 0) {
    return (
      <>
        <div className="search">
          <GoSearch />
          <input placeholder="Search products..." onChange={handleSearch} />
        </div>
        <p style={{ textAlign: "center", marginTop: "40px" }}>
          No products found
        </p>
      </>
    );
  }

  // ✅ NORMAL RENDER
  return (
    <>
      <div className="search">
        <GoSearch />
        <input placeholder="Search products..." onChange={handleSearch} />
      </div>

      <div className="product-list"   >
        {filtered.map((product, i) => (
          <div
            className="product-card"
            key={product._id}
            style={{ animationDelay: `${i * 0.08}s` }}
             onClick={() => handleDetail(product._id)}

          >
            <div className="product-inner">

              {/* FRONT */}
              <div className="product-front">
                <img
                  src={
                    product.images && product.images.length > 0
                      ? product.images[0]
                      : "/placeholder.jpg"
                  }
                  alt={product.title}
                />
                <h3>{product.title}</h3>
                <span className="price">₹{product.price}</span>
              </div>

              {/* BACK */}
              <div className="product-back">
                <p>{product.description}</p>
              
              </div>

            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default ProductList;


