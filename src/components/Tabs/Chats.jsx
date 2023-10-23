import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ViewToken,
} from "react-native";
import React, { useRef, useState } from "react";
import { Colors } from "../../../GlobalStyles";
import MessageCard from "../MessageCard";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");
import { LinearGradient } from "expo-linear-gradient";
import { useSharedValue } from "react-native-reanimated";
import { useSelector } from "react-redux";

const Chats = () => {
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.user);
  const [data, setdata] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  const navigation = useNavigation();
  const searchBarClickHandler = () => {
    navigation.navigate("SearchFriend");
  };

  const viewableItems = useSharedValue([]);
  const onViewableItemsChanged = ({ viewableItems: vItems }) => {
    viewableItems.value = vItems;
  };

  const viewabilityConfigCallbackPairs = useRef([{ onViewableItemsChanged }]);

  return (
    <View className="flex-1 bg-slate-50">
      <SafeAreaView>
        {/* header */}
        <LinearGradient
          style={{ height: 60 }}
          colors={[Colors.lightBlue50, Colors.lightBlue35]}
          className="flex flex-row items-center justify-between px-4 rounded-b-[16px]"
        >
          <Text className="font-extrabold text-white text-2xl">Chats</Text>
          <View className="flex flex-row">
            {user.info.role === "USER" && (
              <TouchableOpacity
                onPress={() => navigation.navigate("CreateGroup")}
                className="items-center justify-center mr-4 "
              >
                <Ionicons
                  name="add-circle-outline"
                  size={32}
                  color={Colors.white}
                />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              className="items-center justify-center"
              onPress={() => navigation.navigate("SearchFriend")}
            >
              <FontAwesome5 name="search" size={32} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </LinearGradient>
        <View className="w-full">
          {isLoading ? (
            <>
              <View
                style={{
                  width: width,
                  height: height,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ActivityIndicator size={"large"} color={Colors.brand} />
              </View>
            </>
          ) : (
            <>
              <FlatList
                data={data}
                // onViewableItemsChanged={({ viewableItems: vItems }) => {
                //   viewableItems.value = vItems;
                // }}
                viewabilityConfigCallbackPairs={
                  viewabilityConfigCallbackPairs.current
                }
                renderItem={({ item, index }) => {
                  return (
                    <MessageCard
                      item={item}
                      index={index}
                      lastElement={index === data.length - 1}
                      viewableItems={viewableItems}
                    />
                  );
                }}
                className="flex"
              />
            </>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Chats;
