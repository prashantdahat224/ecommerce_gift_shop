import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../supabaseClient";

// Fetch wishlist once (called from App.jsx)
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (userId) => {
    const { data, error } = await supabase
      .from("wish_list_products")
      .select("product_id")
      .eq("user_id", userId);

    if (error) throw error;

    return data.map((item) => item.product_id);
  }
);

// Toggle wishlist (optimistic)
export const toggleWishlist = createAsyncThunk(
  "wishlist/toggleWishlist",
  async ({ userId, productId }) => {
    const { data: existing, error: fetchError } = await supabase
      .from("wish_list_products")
      .select("*")
      .eq("user_id", userId)
      .eq("product_id", productId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") throw fetchError;

    if (existing) {
      const { error } = await supabase
        .from("wish_list_products")
        .delete()
        .eq("user_id", userId)
        .eq("product_id", productId);

      if (error) throw error;
      return { productId, action: "remove" };
    } else {
      const { error } = await supabase
        .from("wish_list_products")
        .insert([{ user_id: userId, product_id: productId }]);

      if (error) throw error;
      return { productId, action: "add" };
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchWishlist.rejected, (state) => {
        state.loading = false;
      })

      // Optimistic toggle
      .addCase(toggleWishlist.pending, (state, action) => {
        const { productId } = action.meta.arg;
        const exists = state.items.includes(productId);

        if (exists) {
          state.items = state.items.filter((id) => id !== productId);
        } else {
          state.items.push(productId);
        }
      })

      // Rollback if error
      .addCase(toggleWishlist.rejected, (state, action) => {
        const { productId } = action.meta.arg;
        const exists = state.items.includes(productId);

        if (exists) {
          state.items = state.items.filter((id) => id !== productId);
        } else {
          state.items.push(productId);
        }
      });
  },
});

export default wishlistSlice.reducer;
