import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
  name: "requests",
  initialState: {
    unreadRequests: 0, // Badge count
  },
  reducers: {
    setUnreadRequests: (state, action) => {
      state.unreadRequests = action.payload;
    },
    incrementUnreadRequests: (state) => {
      state.unreadRequests += 1;
    },
    resetUnreadRequests: (state) => {
      state.unreadRequests = 0;
    },
  },
});

export const {
  setUnreadRequests,
  incrementUnreadRequests,
  resetUnreadRequests,
} = requestSlice.actions;

export default requestSlice.reducer;
