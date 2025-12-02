import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, createTransform } from "redux-persist";
import storage from "redux-persist/lib/storage";
import rootReducer from "./reducer";

const saveRefreshOnly = createTransform(
  (inboundState, key) => ({ refreshToken: inboundState.refreshToken }),
  (outboundState, key) => ({ ...inboundState, ...outboundState }) 
);

const persistConfig = {
  key: "auth",
  storage,
  whitelist: ["auth"], 
  transforms: [saveRefreshOnly], 
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
});

export const persistor = persistStore(store);
