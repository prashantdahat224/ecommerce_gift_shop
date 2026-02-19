import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import userDataReducer from "./userDataSlice"; //added
import productReducer  from "./productSlice"; //added
import whislistReducer  from "./wishlistSlice"; //added
 
export const store = configureStore({
  reducer: {
    auth: authReducer,
    userData: userDataReducer, //added
    products: productReducer,
    wishlist: whislistReducer,
 
  },
});