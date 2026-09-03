import { createSlice } from "@reduxjs/toolkit";

const loadCompareFromStorage = () => {
  try {
    const raw = localStorage.getItem("pvx_compare_items");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const compareSlice = createSlice({
  name: "compare",
  initialState: {
    items: loadCompareFromStorage(),
    isOpen: false,
  },
  reducers: {
    addToCompare: (state, action) => {
      const product = action.payload;
      const exists = state.items.some((i) => String(i._id) === String(product._id));
      if (!exists && state.items.length < 4) {
        state.items.push(product);
        localStorage.setItem("pvx_compare_items", JSON.stringify(state.items));
      }
    },
    removeFromCompare: (state, action) => {
      state.items = state.items.filter((i) => String(i._id) !== String(action.payload));
      localStorage.setItem("pvx_compare_items", JSON.stringify(state.items));
    },
    clearCompare: (state) => {
      state.items = [];
      localStorage.removeItem("pvx_compare_items");
      state.isOpen = false;
    },
    openCompareModal: (state) => {
      state.isOpen = true;
    },
    closeCompareModal: (state) => {
      state.isOpen = false;
    },
  },
});

export const {
  addToCompare,
  removeFromCompare,
  clearCompare,
  openCompareModal,
  closeCompareModal,
} = compareSlice.actions;

export default compareSlice.reducer;
