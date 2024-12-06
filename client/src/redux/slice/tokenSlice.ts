import { createSlice } from "@reduxjs/toolkit";

interface StepState {
  token: string | null;
}

const initialState: StepState = {
  token: null,
};

const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    setToken: (state) => {
      state.token = localStorage.getItem("token") || null; // Tokenni Reduxga saqlash
    },
  },
});

export const { setToken } = tokenSlice.actions;
export default tokenSlice.reducer;
