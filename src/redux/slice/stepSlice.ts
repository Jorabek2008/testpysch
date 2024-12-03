import { createSlice } from "@reduxjs/toolkit";

interface StepState {
  number: number;
}

const initialState: StepState = {
  number: 1,
};

const stepSlice = createSlice({
  name: "step",
  initialState,
  reducers: {
    setStep: (state, action) => {
      state.number = action.payload;
    },
  },
});

export const { setStep } = stepSlice.actions;
export default stepSlice.reducer;
