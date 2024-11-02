import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserSchema } from "../../../../backend/src/Models/user.model";

export interface UserReduxSchema {
  _id: string | undefined;
  username: string;
  email: string;
}

interface UserState {
  currentUser: UserSchema | null;
  error: string | null;
  loading: boolean;
}

const initialState: UserState = {
  currentUser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signinStart: (state) => {
      state.loading = true;
    },
    signinSuccess: (state, action) => {
      state.currentUser = action.payload;
      (state.loading = false), (state.error = null);
    },
    signinFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateUserStart: (state) => {
      state.loading = true;
    },
    updateUserSuccess: (state, action) => {
      state.loading = false;
      state.currentUser = action.payload;
      state.error = null;
    },
    updateUserFilure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    deleteUserStart: (state) => {
      state.loading = true;
    },
    deleteUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    deleteUserFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    signoutUserStart: (state) => {
      state.loading = true;
    },
    signoutUserSuccess: (state) => {
      state.loading = false;
      state.currentUser = null;
      state.error = null;
    },
    signoutUserFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  signinStart,
  signinSuccess,
  signinFailure,
  updateUserFilure,
  updateUserStart,
  updateUserSuccess,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutUserStart,
  signoutUserSuccess,
  signoutUserFailure,
} = userSlice.actions;

export default userSlice.reducer;
