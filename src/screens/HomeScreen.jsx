import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import chatImage from "../../assets/images/chat.png";
import chartImage from "../../assets/images/growth.png";
import callPutImage from "../../assets/images/line-chart.png";
import settingsImage from "../../assets/images/settings.png";
import * as Animatable from "react-native-animatable";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { CallPutRatio, Charts, Chats, Settings } from "../components/Tabs";
import { StatusBar } from "expo-status-bar";
import { BlurView } from "expo-blur";
import { Colors } from "../../GlobalStyles";

const TabButton = (props) => {
  const { item, onPress, accessibilityState } = props;
  const focused = accessibilityState.selected;
  const viewRef = useRef(null);
  useEffect(() => {
    if (focused) {
      viewRef.current.animate({ 0: { scale: 1 }, 1: { scale: 1.5 } });
    } else {
      viewRef.current.animate({ 0: { scale: 1.5 }, 1: { scale: 1 } });
    }
  }, [focused]);
  return (
    <TouchableOpacity
      style={{
        flex: 1,

        alignItems: "center",
        // flexDirection: "column",
        justifyContent: "center",
      }}
      onPress={onPress}
    >
      <Animatable.View ref={viewRef} duration={800}>
        <Image style={{ height: 24, width: 24 }} source={item.image} />
      </Animatable.View>
      <View
        style={{
          marginTop: 6,
          height: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {focused ? (
          <Text style={{ color: Colors.lightBlue50, fontWeight: "bold" }}>
            {item.label}
          </Text>
        ) : (
          <Text style={{ color: "#66b3ff" }}>{item.label}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const HomeScreen = () => {
  const user = useSelector((state) => state.user);
  // console.log("USer", user);
  const Tab = createBottomTabNavigator();
  return (
    <SafeAreaView
      style={{
        // paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        flex: 1,
      }}
    >
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            height: 70,
            position: "absolute",
            left: 16,
            right: 16,
            bottom: 16,
            borderRadius: 16,
          },

          // header: ({ navigation, route, options }) => {
          //   const title = getHeaderTitle(options, route.name);

          //   return (
          //     <TabHeader
          //       title={title}
          //       headerStyle={options.headerStyle}
          //       navigation={navigation}
          //       routeName={route.name}
          //     />
          //   );
          // },
        }}
      >
        {TabArray.map((item, index) => {
          return (
            <Tab.Screen
              key={item.route}
              name={item.route}
              component={item.component}
              options={{
                tabBarShowLabel: true,
                // tabBarIcon: ({ color, focused }) => (
                //   <Image style={styles.icon} source={item.image} />
                // ),
                tabBarButton: (props) => <TabButton {...props} item={item} />,
              }}
            />
          );
        })}
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default HomeScreen;

const TabArray = [
  {
    route: "Chats",
    label: "Chats",
    component: Chats,
    image: chatImage,
  },
  {
    route: "CallPut",
    label: "Call Put",
    component: CallPutRatio,
    image: callPutImage,
  },
  {
    route: "Charts",
    label: "Charts",
    component: Charts,
    image: chartImage,
  },
  {
    route: "Settings",
    label: "Settings",
    component: Settings,
    image: settingsImage,
  },
];
