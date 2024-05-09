import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface VerifyEmailState {
  email: string;
}

const initialState: VerifyEmailState = {
  email: "",
};

export const verifyEmailSlice = createSlice({
  name: "verifyEmail",
  initialState,
  reducers: {
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
  },
});

export const { setEmail } = verifyEmailSlice.actions;
export default verifyEmailSlice.reducer;
