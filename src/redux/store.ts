import { configureStore } from "@reduxjs/toolkit";
import stepSlice from "./slice/stepSlice";

export const store = configureStore({
  reducer: {
    stepReducer: stepSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
