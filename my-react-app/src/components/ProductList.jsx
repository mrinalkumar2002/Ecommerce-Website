import React, { useEffect, useState } from "react";
import { GoSearch } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./ProductList.css";

function ProductList() {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  function handleDetail(id) {
    navigate(`/productdetail/${id}`);
  }

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

  if (loading) {
    return <div className="loader">Loading products…</div>;
  }

  return (
    <div className="page">
      {/* SEARCH */}
      <div className="search-box">
        <GoSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search for products"
          onChange={handleSearch}
        />
      </div>

      {/* EMPTY STATE */}
      {filtered.length === 0 ? (
        <p className="empty">No products found</p>
      ) : (
        <div className="grid">
          {filtered.map((product) => (
            <div
              className="card"
              key={product._id}
              onClick={() => handleDetail(product._id)}
            >
              <div className="image-box">
                <img
                  src={
                    product.images?.length
                      ? product.images[0]
                      : "/placeholder.jpg"
                  }
                  alt={product.title}
                />
              </div>

              <div className="content">
                <h3>{product.title}</h3>
                <p>
                  {product.description?.length > 80
                    ? product.description.slice(0, 80) + "..."
                    : product.description}
                </p>
              </div>

              <div className="footer">
                <span className="price">₹{product.price}</span>
                <span className="cta">View →</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;



