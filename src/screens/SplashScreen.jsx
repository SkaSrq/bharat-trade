import { View, Text, Image, ActivityIndicator } from "react-native";
import React, { useLayoutEffect } from "react";
import { Dimensions } from "react-native";
import Logo from "../../assets/images/icon_transparent.png";
import { Colors } from "../../GlobalStyles";
import { fireStoreDB, fireabseAuth } from "../../config/firebase.config";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { addUser } from "../redux/slices/UserSlice";
import { doc, getDoc } from "firebase/firestore";

const SplashScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  useLayoutEffect(() => {
    checkLoggedUser();
  }, []);
  const checkLoggedUser = async () => {
    fireabseAuth.onAuthStateChanged((userCred) => {
      if (userCred?.uid) {
        getDoc(doc(fireStoreDB, "users", userCred?.uid))
          .then((docSnap) => {
            if (docSnap.exists()) {
              dispatch(addUser(docSnap.data()));
            }
          })
          .then(() => {
            setTimeout(() => {
              navigation.replace("Home");
            }, 2000);
          });
      } else {
        navigation.replace("Login");
      }
    });
  };
  return (
    <View className="flex-1 items-center justify-center space-y-24 bg-brand">
      <Image source={Logo} className="w-24 h-24" resizeMode="contain" />
      <ActivityIndicator size={"large"} color={Colors.white} />
    </View>
  );
};

export default SplashScreen;
