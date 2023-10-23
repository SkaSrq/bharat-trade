import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import SplashScreen from "../screens/SplashScreen";
import HomeScreen from "../screens/HomeScreen";
const Stacks = createStackNavigator();
const AuthStack = () => {
  return (
    <Stacks.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* <Stacks.Screen name="Splash" component={SplashScreen} /> */}
      <Stacks.Screen name="Login" component={LoginScreen} />
      <Stacks.Screen name="Signup" component={RegisterScreen} />
    </Stacks.Navigator>
  );
};

export default AuthStack;
