import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCart } from "../redux/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import "./Cart.css";

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);

  // 🔹 Load cart
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const res = await api.get("/cart");
      dispatch(setCart(res.data.cart.items));
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      } else {
        console.error("Load cart error:", err);
      }
    }
  };

  // 🔹 Increase quantity
  const increase = async (item) => {
    try {
      const res = await api.patch(`/cart/${item.productId}`, {
        quantity: item.quantity + 1,
      });
      dispatch(setCart(res.data.cart.items));
    } catch (err) {
      alert(err.response?.data?.message || "Could not increase quantity");
    }
  };

  // 🔹 Decrease quantity
  const decrease = async (item) => {
    try {
      if (item.quantity <= 1) {
        const res = await api.delete(`/cart/${item.productId}`);
        dispatch(setCart(res.data.cart.items));
        return;
      }

      const res = await api.patch(`/cart/${item.productId}`, {
        quantity: item.quantity - 1,
      });
      dispatch(setCart(res.data.cart.items));
    } catch (err) {
      alert(err.response?.data?.message || "Could not decrease quantity");
    }
  };

  // 🔹 Remove item
  const remove = async (item) => {
    try {
      const res = await api.delete(`/cart/${item.productId}`);
      dispatch(setCart(res.data.cart.items));
    } catch (err) {
      alert(err.response?.data?.message || "Could not remove item");
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="cart-container">
      <Link to="/productlist">← Back</Link>

      <h2>Cart Items</h2>

      {cartItems.length === 0 ? (
        <p className="empty-cart">Your cart is empty 🛒</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div className="cart-item" key={item.productId}>
              {item.images?.[0] && (
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="product-image"
                />
              )}

              <div className="cart-details">
                <p><strong>{item.title}</strong></p>
                <p>₹{item.price}</p>
              </div>

              <div className="qty-controls">
                <button onClick={() => decrease(item)}>−</button>
                <span>{item.quantity}</span>
                <button onClick={() => increase(item)}>+</button>
              </div>

              <button className="remove" onClick={() => remove(item)}>
                Remove
              </button>
            </div>
          ))}

          <div className="cart-total">
            <h3>Total: ₹{total.toFixed(2)}</h3>
          </div>

          <button className="handlenext" onClick={() => navigate("/checkout")}>
            Next
          </button>
        </>
      )}
    </div>
  );
}

export default Cart;









