import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: null,
  number: null,
};

const userDataSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.name = action.payload.name;
      state.number = action.payload.number;
    },
    clearUserData: () => initialState,
  },
});

export const { setUserData, clearUserData } = userDataSlice.actions;
export default userDataSlice.reducer;