import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [] },

  reducers: {
    // ✅ ONLY way to update cart
    setCart(state, action) {
      const raw = action.payload?.items || action.payload;
      if (!Array.isArray(raw)) return;

      state.items = raw.map((i) => ({
        // 🔥 ALWAYS store productId as STRING
        productId:
          typeof i.productId === "object"
            ? i.productId._id
            : i.productId,

        title:
          typeof i.productId === "object"
            ? i.productId.title
            : i.title,

        price:
          typeof i.productId === "object"
            ? i.productId.price
            : i.price,

        images:
          typeof i.productId === "object"
            ? i.productId.images
            : i.images,

        quantity: Number(i.quantity),
      }));
    },

    // ✅ Clear on logout
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { setCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;





