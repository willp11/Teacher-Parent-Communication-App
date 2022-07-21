import { createSlice } from "@reduxjs/toolkit";

const initialState = { token: null, account: null, accountType: null };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthToken(state, action) {
      state.token = action.payload.token;
    },
    setAccount(state, action) {
      state.account = action.payload.account;
      state.accountType = action.payload.accountType
    },
    logout(state) {
      state.account = null;
      state.token = null;
      state.accountType = null;
    },
  },
});

export default authSlice;