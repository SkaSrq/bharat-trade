import React from "react";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import SearchFriend from "../screens/SearchFriend";
import { Easing } from "react-native";
import CreateGroupScreen from "../screens/CreateGroupScreen";
import ChatScreen from "../screens/ChatScreen";
const Stacks = createStackNavigator();
const AppStack = () => {
  const openConfig = {
    animation: "spring",
    config: {
      stiffness: 1000,
      damping: 50,
      mass: 3,
      overshootClamping: false,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    },
  };
  const closeConfig = {
    animation: "timing",
    config: {
      duration: 200,
      easing: Easing.linear,
    },
  };
  return (
    <Stacks.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        // animationEnabled: true,
        gestureEnabled: true,
        gestureDirection: "horizontal",
        transitionSpec: {
          open: openConfig,
          close: closeConfig,
        },
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Stacks.Screen name="Home" component={HomeScreen} />
      <Stacks.Screen name="SearchFriend" component={SearchFriend} />
      <Stacks.Screen name="CreateGroup" component={CreateGroupScreen} />
      <Stacks.Screen name="Chat" component={ChatScreen} />
    </Stacks.Navigator>
  );
};

export default AppStack;
