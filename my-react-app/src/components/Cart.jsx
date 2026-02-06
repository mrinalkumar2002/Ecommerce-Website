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

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const res = await api.get("/cart");
      dispatch(setCart(res.data.cart.items));
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
    }
  };

  const increase = async (item) => {
    const res = await api.patch(`/cart/${item.productId}`, {
      quantity: item.quantity + 1,
    });
    dispatch(setCart(res.data.cart.items));
  };

  const decrease = async (item) => {
    if (item.quantity <= 1) {
      const res = await api.delete(`/cart/${item.productId}`);
      dispatch(setCart(res.data.cart.items));
      return;
    }

    const res = await api.patch(`/cart/${item.productId}`, {
      quantity: item.quantity - 1,
    });
    dispatch(setCart(res.data.cart.items));
  };

  const remove = async (item) => {
    const res = await api.delete(`/cart/${item.productId}`);
    dispatch(setCart(res.data.cart.items));
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <section className="cart-page">
      <Link to="/productlist" className="cart-back">
        ← Continue shopping
      </Link>

      <h1 className="cart-title">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="cart-empty">Your cart is empty 🛒</p>
      ) : (
        <div className="cart-wrapper">
          {/* ITEMS */}
          <div className="cart-list">
            {cartItems.map((item) => (
              <div className="cart-row" key={item.productId}>
                <img
                  src={item.images?.[0] || "/placeholder.jpg"}
                  alt={item.title}
                />

                <div className="cart-info">
                  <h3>{item.title}</h3>
                  <p>₹{item.price}</p>
                </div>

                <div className="cart-qty">
                  <button onClick={() => decrease(item)}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increase(item)}>+</button>
                </div>

                <button
                  className="cart-remove"
                  onClick={() => remove(item)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* SUMMARY */}
          <aside className="cart-summary">
            <h2>Order Summary</h2>

            <div className="summary-line">
              <span>Subtotal</span>
              <span>₹{total.toFixed(2)}</span>
            </div>

            <div className="summary-line">
              <span>Shipping</span>
              <span>Free</span>
            </div>

            <div className="summary-divider" />

            <div className="summary-total">
              <span>Total</span>
              <strong>₹{total.toFixed(2)}</strong>
            </div>

            <button
              className="checkout-btn"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout →
            </button>

            <p className="summary-note">
              Secure checkout • 7-day returns
            </p>
          </aside>
        </div>
      )}
    </section>
  );
}

export default Cart;











