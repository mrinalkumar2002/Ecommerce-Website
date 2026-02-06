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
        console.error(err);
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
    return <div className="lux-loader">Curating products…</div>;
  }

  return (
    <section className="lux-page">
      {/* HEADER */}
      <header className="lux-header">
        <h1>Discover Products</h1>
        <p>Hand-picked items with premium quality</p>

        <div className="lux-search">
          <GoSearch />
          <input
            type="text"
            placeholder="Search by name or description"
            onChange={handleSearch}
          />
        </div>
      </header>

      {/* EMPTY */}
      {filtered.length === 0 ? (
        <p className="lux-empty">No products match your search</p>
      ) : (
        <div className="lux-grid">
          {filtered.map((product) => (
            <article
              key={product._id}
              className="lux-card"
              onClick={() => handleDetail(product._id)}
            >
              <div className="lux-media">
                <img
                  src={
                    product.images?.length
                      ? product.images[0]
                      : "/placeholder.jpg"
                  }
                  alt={product.title}
                />
              </div>

              <div className="lux-body">
                <h3>{product.title}</h3>

                <p>
                  {product.description?.length > 90
                    ? product.description.slice(0, 90) + "…"
                    : product.description}
                </p>
              </div>

              <footer className="lux-footer">
                <span className="lux-price">₹{product.price}</span>
                <span className="lux-link">Explore</span>
              </footer>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default ProductList;




