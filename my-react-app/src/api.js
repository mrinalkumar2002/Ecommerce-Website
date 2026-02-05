import axios from "axios";

const api = axios.create({
  baseURL: "hhttps://ecommerce-website-xxxx.onrender.com/api", // OR Render URL, but ONE ONLY
  withCredentials: true,                // 🔥 REQUIRED FOR COOKIES
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

// Example helper (optional)
export const updateCartQuantity = (productId, qty) =>
  api.put(`/cart/${productId}`, { quantity: qty });










