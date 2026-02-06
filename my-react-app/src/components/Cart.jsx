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
    api.get("/cart").then((res) => {
      dispatch(setCart(res.data.cart.items));
    }).catch(() => navigate("/login"));
  }, []);

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

      <h1 className="cart-title">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <p className="cart-empty">Your cart is empty 🛒</p>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div className="cart-item" key={item.productId}>
                <img src={item.images?.[0]} alt={item.title} />

                <div className="item-info">
                  <h3>{item.title}</h3>
                  <p className="item-price">₹{item.price}</p>
                </div>

                <div className="qty">
                  <button onClick={() => decrease(item)}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increase(item)}>+</button>
                </div>

                <button className="remove" onClick={() => remove(item)}>
                  Remove
                </button>
              </div>
            ))}
          </div>

          <aside className="summary">
            <h2>Order Summary</h2>

            <div className="row">
              <span>Subtotal</span>
              <span className="dark">₹{total.toFixed(2)}</span>
            </div>

            <div className="divider" />

            <div className="total">
              <span>Total</span>
              <strong>₹{total.toFixed(2)}</strong>
            </div>

            <button className="checkout" onClick={() => navigate("/checkout")}>
              Proceed to Checkout →
            </button>
          </aside>
        </div>
      )}
    </section>
  );
}

export default Cart;












