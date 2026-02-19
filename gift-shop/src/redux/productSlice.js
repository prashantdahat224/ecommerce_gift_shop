 import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedProductIds: [],
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSelectedProductIds: (state, action) => {
      state.selectedProductIds = action.payload;
    },
    addProductId: (state, action) => {
      state.selectedProductIds.push(action.payload);
    },
    clearProductIds: (state) => {
      state.selectedProductIds = [];
    },
  },
});

export const {
  setSelectedProductIds,
  addProductId,
  clearProductIds,
} = productSlice.actions;

export default productSlice.reducer;
