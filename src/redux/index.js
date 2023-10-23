import AsyncStorage from "@react-native-async-storage/async-storage";
import thunk from "redux-thunk";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import UserSlice from "./slices/UserSlice";
import ConversationSlice from "./slices/ConversationSlice";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
};

let reducers = combineReducers({
  user: UserSlice,
  conversation: ConversationSlice,
});
const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
});

export const persistor = persistStore(store);
