import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: null,     
  refreshToken: null,     
  user: null,             
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.accessToken = action.payload.token;      
      state.refreshToken = action.payload.refreshToken; 
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.isAuthenticated = false;
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
  },
});

export const { loginSuccess, logout, setAccessToken } = authSlice.actions;
export default authSlice.reducer;
