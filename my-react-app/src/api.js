import axios from "axios";

const api = axios.create({
  baseURL: "https://ecommerce-website-1-vpux.onrender.com/api",
  withCredentials: true, // 🔥 REQUIRED FOR AUTH COOKIES
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

// Optional helper
export const updateCartQuantity = (productId, qty) =>
  api.put(`/cart/${productId}`, { quantity: qty });










