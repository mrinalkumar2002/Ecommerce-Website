import { createSlice } from "@reduxjs/toolkit";

// Helper to reliably extract product ID
const getItemId = (item) => {
  if (!item) return "";
  if (typeof item === "string") return item;
  return String(item._id || item.productId || item.id || "");
};

// Load initial wishlist safely from localStorage
const loadWishlistFromStorage = () => {
  try {
    const stored = localStorage.getItem("pvx_wishlist");
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item && typeof item === "object" && getItemId(item));
  } catch {
    return [];
  }
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: loadWishlistFromStorage(),
  },
  reducers: {
    addToWishlist: (state, action) => {
      if (!action.payload) return;
      const payloadId = getItemId(action.payload);
      if (!payloadId) return;

      if (!Array.isArray(state.items)) {
        state.items = [];
      }

      const exists = state.items.some((item) => getItemId(item) === payloadId);
      if (!exists) {
        const cleanItem = {
          _id: payloadId,
          productId: payloadId,
          title: action.payload.title || "Product",
          price: Number(action.payload.price) || 0,
          images:
            Array.isArray(action.payload.images) && action.payload.images.length > 0
              ? action.payload.images
              : action.payload.image
              ? [action.payload.image]
              : [`https://picsum.photos/seed/${payloadId}/400/300`],
          rating: action.payload.rating || 4.5,
          category: action.payload.category || "",
        };
        state.items.push(cleanItem);
        try {
          localStorage.setItem("pvx_wishlist", JSON.stringify(state.items));
        } catch {}
      }
    },
    removeFromWishlist: (state, action) => {
      const removeId = typeof action.payload === "string" ? action.payload : getItemId(action.payload);
      if (!removeId) return;
      if (!Array.isArray(state.items)) {
        state.items = [];
        return;
      }
      state.items = state.items.filter((item) => getItemId(item) !== removeId);
      try {
        localStorage.setItem("pvx_wishlist", JSON.stringify(state.items));
      } catch {}
    },
    clearWishlist: (state) => {
      state.items = [];
      try {
        localStorage.removeItem("pvx_wishlist");
      } catch {}
    },
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
