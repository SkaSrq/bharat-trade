import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import Stack from "./src/Stacks/Stack";
import FlashMessage from "react-native-flash-message";
import { Colors } from "./GlobalStyles";
import { persistor, store } from "./src/redux";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const removeLocalStorage = async () => {
    console.log("removing local storages");
    const keys = await AsyncStorage.getAllKeys();
    console.log("keys", keys);
    await AsyncStorage.multiRemove(keys);
  };
  useEffect(() => {
    // console.log("app userEffect");
    // removeLocalStorage();
  }, []);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {/* <StatusBar backgroundColor={Colors.white} barStyle="lite-content" /> */}
        <Stack />
        <FlashMessage position="top" />
      </PersistGate>
    </Provider>
  );
}
