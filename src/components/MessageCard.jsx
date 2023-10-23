import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { Colors } from "../../GlobalStyles";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";

const MessageCard = ({ item, index, lastElement, viewableItems }) => {
  const navigation = useNavigation();
  const rStyle = useAnimatedStyle(() => {
    const isVisible = viewableItems.value
      .filter((item) => item.isViewable)
      .find((viewableItem) => viewableItem.item === item);
    return {
      opacity: withTiming(isVisible ? 1 : 0),
      transform: [
        {
          scale: withTiming(isVisible ? 1 : 0.3),
        },
      ],
    };
  });
  chatInfo = {
    chatName: "sharique",
    status: "online",
    profilePic:
      "https://cdn.sanity.io/images/e3a07iip/production/9962f6fb7ba946ce4e10ddc971bbbf038f852004-1083x1083.png",
  };
  return (
    <>
      <Animated.View className="px-4 w-full" style={rStyle}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Chat", {
              conversationId:
                "VOrF8Jhm2afLMvlVUInAyYrhD4I3_T4dd4jIJhyZphQHP2IaPya3Qe6d2",
              chatInfo: chatInfo,
            })
          }
          className="h-20 w-full rounded-xl justify-start flex-row items-center self-center bg-slate-200 mt-4"
        >
          {/* Image */}
          <View className="w-16 h-16 rounded-full flex items-center border-2 border-lightBlue60 p-1 justify-center ml-4">
            <FontAwesome5 name="users" size={24} color="#555" />
          </View>
          {/* content */}
          <View className="h-full flex-1 ml-4  mr-4 flex flex-col">
            <View className="flex flex-row items-center justify-between">
              <Text
                style={{ fontSize: 18, color: "#0059b3" }}
                className=" font-bold text-lg capitalize"
              >
                Message Title
              </Text>
              {/* time text */}
              <Text
                className="text-base font-semibold"
                style={{ color: "#0059b3" }}
              >
                27 mins
              </Text>
            </View>
            <View className="fles justify-center items-start">
              <Text className="text-black" numberOfLines={2}>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Consectetur quasi inventore ad labore. Eveniet dicta dolorum
                omnis iste tempora temporibus facere nam, in, exercitationem cum
                unde culpa cupiditate ipsa excepturi?
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
      {lastElement && (
        <View
          className=" h-10 flex items-center justify-center flex-row"
          style={{ marginBottom: 208 }}
        >
          <FontAwesome5
            className="justify-center items-center"
            name={"lock"}
            size={12}
            color={Colors.grey}
          />
          <Text className="ml-2 text-base text-grey">
            Your message is secured
          </Text>
        </View>
      )}
    </>
  );
};

export default MessageCard;
