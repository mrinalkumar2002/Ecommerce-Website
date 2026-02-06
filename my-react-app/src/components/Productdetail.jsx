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





  // ✅ FETCH PRODUCT (FIXED)
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

  // ✅ ADD TO CART (FIXED + CLEAN)
  async function handleCart() {
    if (!data?._id) return;

    try {
      setAdding(true);

      // 🔐 CHECK AUTH (cookie-based)
      await api.get("/auth/me");

      // 🛒 ADD TO CART
      const res = await api.post("/cart/add", {
        productId: data._id,
        quantity: 1,
      });

      // 🔄 SYNC REDUX
      dispatch(setCart(res.data.cart.items));

      // ➡️ GO TO CART
      navigate("/cart");

    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login"); // not logged in
      } else {
        alert("Failed to add to cart");
        console.error(err);
      }
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







