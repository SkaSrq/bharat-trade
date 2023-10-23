import React, { useRef, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import SplashScreen from "../screens/SplashScreen";
import HomeScreen from "../screens/HomeScreen";
import AppStack from "./AppStack";
import AuthStack from "./AuthStack";
import { ActivityIndicator, Image, View } from "react-native";
import Logo from "../../assets/images/icon_transparent.png";
import { useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fireStoreDB, fireabseAuth } from "../../config/firebase.config";
import { doc, getDoc } from "firebase/firestore";
import { addUser } from "../redux/slices/UserSlice";
import { Colors } from "../../GlobalStyles";

const Stacks = createStackNavigator();

const Stack = () => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  useLayoutEffect(() => {
    if (!user.info) {
      setIsChecked(true);
    }
    checkLoggedUser();
  }, []);
  const checkLoggedUser = async () => {
    fireabseAuth.onAuthStateChanged((userCred) => {
      if (userCred?.uid) {
        getDoc(doc(fireStoreDB, "users", userCred?.uid))
          .then((docSnap) => {
            if (docSnap.data()) {
              dispatch(addUser(docSnap.data()));
              setTimeout(() => {
                setIsChecked(true);
              }, 2000);
            } else {
              setTimeout(() => {
                setIsChecked(true);
              }, 2000);
            }
          })
          .then(() => {});
      } else {
        // navigation.replace("Login");
        setIsChecked(true);
      }
    });
  };
  if (!isChecked) {
    return (
      <View className="flex-1 items-center justify-center space-y-24 bg-brand">
        <Image source={Logo} className="w-24 h-24" resizeMode="contain" />
        <ActivityIndicator size={"large"} color={Colors.white} />
      </View>
    );
  }
  return (
    <NavigationContainer>
      {user.info ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default Stack;
