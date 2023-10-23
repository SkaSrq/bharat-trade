import { getApp, getApps, initializeApp } from "firebase/app";
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyB-7Lz2pKo0IRqUjj6fVGV21t8BSLrok5A",
  authDomain: "bharat-trade-70e24.firebaseapp.com",
  projectId: "bharat-trade-70e24",
  storageBucket: "bharat-trade-70e24.appspot.com",
  messagingSenderId: "1096484444717",
  appId: "1:1096484444717:web:06486a3d47924194e9b6a4",
};

// const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig);
// console.log(getApps.length);
// const fireabseAuth = getAuth(app);
const fireabseAuth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
const fireStoreDB = getFirestore(app);
export { app, fireabseAuth, fireStoreDB };
