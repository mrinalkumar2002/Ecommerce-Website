import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCart } from "../redux/cartSlice";
import "./Productdetail.css";
import api from "../api";

function ProductDetail() {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${productId}`);
        setData(res.data);
      } catch (err) {
        setError("Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  async function handleCart() {
    if (!data?._id) return;

    try {
      setAdding(true);
      await api.get("/auth/me");

      const res = await api.post("/cart/add", {
        productId: data._id,
        quantity: 1,
      });

      dispatch(setCart(res.data.cart.items));
      navigate("/cart");
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      } else {
        alert("Failed to add to cart");
        console.error(err);
      }
    } finally {
      setAdding(false);
    }
  }

  if (loading) return <div className="pd-status">Loading product…</div>;
  if (error) return <div className="pd-status">{error}</div>;
  if (!data) return <div className="pd-status">Product not found</div>;

  return (
    <section className="pd-page">
      <Link to="/productlist" className="pd-back">
        ← Back to products
      </Link>

      <div className="pd-card">
        {/* IMAGE */}
        <div className="pd-media">
          <img
            src={data.images?.[0] || "/placeholder.jpg"}
            alt={data.title}
          />
        </div>

        {/* INFO */}
        <div className="pd-info">
          <h1>{data.title}</h1>

          <p className="pd-desc">{data.description}</p>

          <div className="pd-price-box">
            <span>Price</span>
            <strong>₹{data.price}</strong>
          </div>

          <button
            className="pd-cart-btn"
            onClick={handleCart}
            disabled={adding}
          >
            {adding ? "Adding to cart…" : "Add to Cart"}
          </button>
        </div>
      </div>
    </section>
  );
}

export default ProductDetail;








