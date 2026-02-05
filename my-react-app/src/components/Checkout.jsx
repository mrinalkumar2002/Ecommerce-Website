import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../redux/cartSlice';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';
import api from "../api";

function Checkout() {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);



async function handleOrder(e) {
  e.preventDefault();

  if (!form.name || !form.email || !form.address) {
    alert("Please fill all fields before placing the order!");
    return;
  }

  try {
    // 🔥 Clear cart in backend
    await api.delete("/cart/clear");

    // 🔥 Clear cart in Redux
    dispatch(clearCart());

    setOrderPlaced(true);
  } catch (err) {
    alert("Failed to place order");
  }
}


  useEffect(() => {
    let timer;
    if (orderPlaced) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            navigate('/');
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [orderPlaced, navigate]);

  return (
    <div className="checkout-container">
      {!orderPlaced ? (
        <>
          <h2>Checkout</h2>
          <form className="checkout-form" onSubmit={handleOrder}>
            <div className="form-group">
              <label>Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Address</label>
              <textarea name="address" value={form.address} onChange={handleChange}></textarea>
            </div>

            <h3>Order Summary</h3>
            {cartItems.length === 0 ? (
              <p>No items in cart.</p>
            ) : (
              <ul className="summary-list">
                {cartItems.map((item) => (
                  <li key={item.id}>
                    {item.title} × {item.quantity} = ₹{item.price * item.quantity}
                  </li>
                ))}
              </ul>
            )}

            <h3>Total: ₹{total.toFixed(2)}</h3>

            <button type="submit" className="place-order-btn">
              Place Order
            </button>
          </form>
        </>
      ) : (
        <div className="success-message">
          <h2>✅ Order placed successfully!</h2>
          <p>Redirecting to home in {countdown} seconds...</p>
        </div>
      )}
    </div>
  );
}

export default Checkout;


