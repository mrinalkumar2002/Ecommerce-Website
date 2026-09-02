import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE || "http://localhost:1900/api",
  withCredentials: true, // 🔥 REQUIRED FOR AUTH COOKIES
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

// Optional helper matching backend router.patch('/:productId')
export const updateCartQuantity = (productId, qty) =>
  api.patch(`/cart/${productId}`, { quantity: qty });










