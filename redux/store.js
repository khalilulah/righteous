import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import rootReducer from "./rootReducer";
import { setupListeners } from "@reduxjs/toolkit/query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi } from "./actions/auth/authApi";
import { chatsApi } from "./actions/chat/chatsApi";
import { requestApi } from "./actions/request/requestApi";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["auth", "chat", "chatList"], // Only persist items in this array
};
const middlewares = [
  authApi.middleware,
  chatsApi.middleware,
  requestApi.middleware,
];

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Avoid warnings with non-serializable data
    }).concat(...middlewares), // Add any custom middleware here
});

setupListeners(store.dispatch); // Enables RTK Query's refetchOnFocus/refetchOnReconnect

export const persistor = persistStore(store);
