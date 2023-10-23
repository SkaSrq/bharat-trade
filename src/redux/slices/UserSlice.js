// userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const UserSlice = createSlice({
  name: "user",
  initialState: {
    token: undefined,
    info: undefined,
  },
  reducers: {
    addToken: (state, action) => {
      state.token = action.payload;
    },
    addUser: (state, action) => {
      state.info = action.payload;
    },
    removeUser: (state, action) => {
      state.info = null;
      state.token = null;
    },
  },
});

export const { addToken, addUser, removeUser } = UserSlice.actions;
export default UserSlice.reducer;
