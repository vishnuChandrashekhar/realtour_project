import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import { persistStore } from "redux-persist";

const rootReducer = combineReducers({
  user: userReducer,
});

// Using redux-persist package for storing data in local storage
const persistConfig = {
  key: "root",
  storage,
  version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddlewaret) =>
    getDefaultMiddlewaret({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = {
  user: ReturnType<typeof userReducer>;
};
