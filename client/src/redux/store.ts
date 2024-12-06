import { configureStore } from "@reduxjs/toolkit";
import stepSlice from "./slice/stepSlice";
import tokenSlice from "./slice/tokenSlice";

export const store = configureStore({
  reducer: {
    stepReducer: stepSlice,
    tokenReducer: tokenSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
