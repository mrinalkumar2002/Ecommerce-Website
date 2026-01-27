import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCart } from "../redux/cartSlice";
import "./Productdetail.css";

function ProductDetail() {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adding, setAdding] = useState(false);

  // Fetch product
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `http://localhost:1900/api/products/${productId}`
        );

        if (!res.ok) throw new Error("Failed to fetch product");

        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [productId]);

  // ✅ Add to cart (BACKEND)
  async function handleCart() {
    if (!data?._id) {
      alert("Product not loaded");
      return;
    }

    try {
      setAdding(true);

      const res = await fetch("http://localhost:1900/api/cart/add", {
        method: "POST",
        credentials: "include", // 🔥 REQUIRED
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: data._id,
          quantity: 1,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Add to cart failed");
      }

      const json = await res.json();

      // 🔥 Redux mirrors backend
      dispatch(setCart(json.cart.items));

      navigate("/cart");
    } catch (err) {
      console.error(err);
      alert(err.message || "Please login to add items to cart");
    } finally {
      setAdding(false);
    }
  }

  if (loading) return <p className="status">Loading product...</p>;
  if (error) return <p className="status">Error: {error}</p>;
  if (!data) return <p className="status">Product not found</p>;

  return (
    <>
      <Link to="/productlist" className="back-link">
        ← Back to products
      </Link>

      <div className="detail-wrapper">
        <div className="detail-image">
          <img
            src={data.images?.[0] || "/placeholder.jpg"}
            alt={data.title}
          />
        </div>

        <div className="detail-info">
          <h1>{data.title}</h1>

          <p className="detail-description">{data.description}</p>

          <div className="price-box">
            <span className="price-label">Price</span>
            <span className="price-value">₹{data.price}</span>
          </div>

          <button
            className="cart-btn"
            type="button"
            onClick={handleCart}
            disabled={adding}
          >
            {adding ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </>
  );
}

export default ProductDetail;







