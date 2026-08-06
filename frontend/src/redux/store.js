import { combineReducers, configureStore } from "@reduxjs/toolkit"
import userReducer from "./user/userSlice"
import languageReducer from "./language/languageSlice"
import postsReducer from "./posts/postsSlice"
import { persistReducer, persistStore } from "redux-persist"
import storage from "redux-persist/lib/storage"

const rootReducer = combineReducers({
  user: userReducer,
  language: languageReducer,
  posts: postsReducer,
})

const persistConfig = {
  key: "root",
  storage,
  version: 1,
  // Only persist auth + language preference — never the posts slice (large arrays)
  whitelist: ["user", "language"],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
})

export const persistor = persistStore(store)
