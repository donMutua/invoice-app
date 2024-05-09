import { configureStore } from "@reduxjs/toolkit";
import verifyEmailSlice from "./features/verify-email-slice";

export const store = configureStore({
  reducer: {
    verifyEmail: verifyEmailSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
