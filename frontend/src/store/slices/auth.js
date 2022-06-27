import { createSlice } from "@reduxjs/toolkit";

const initialState = { token: null, account: null };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthToken(state, action) {
      state.token = action.payload.token;
    },
    setAccount(state, action) {
      state.account = action.payload;
    },
    logout(state) {
      state.account = null;
      state.token = null;
    },
  },
});

export default authSlice;