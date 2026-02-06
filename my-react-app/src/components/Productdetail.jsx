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
      } catch {
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
      if (err.response?.status === 401) navigate("/login");
      else alert("Failed to add to cart");
    } finally {
      setAdding(false);
    }
  }

  if (loading) return <div className="p3d-status">Loading…</div>;
  if (error) return <div className="p3d-status">{error}</div>;
  if (!data) return <div className="p3d-status">Not found</div>;

  return (
    <section className="p3d-page">
      <Link to="/productlist" className="p3d-back">
        ← Back
      </Link>

      <div className="p3d-stage">
        <div className="p3d-card">
          {/* IMAGE */}
          <div className="p3d-image">
            <img
              src={data.images?.[0] || "/placeholder.jpg"}
              alt={data.title}
            />
          </div>

          {/* CONTENT */}
          <div className="p3d-content">
            <h1>{data.title}</h1>

            <p className="p3d-desc">{data.description}</p>

            <div className="p3d-price">
              <span>Price</span>
              <strong>₹{data.price}</strong>
            </div>

            <button
              className="p3d-btn"
              onClick={handleCart}
              disabled={adding}
            >
              {adding ? "Adding…" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetail;









