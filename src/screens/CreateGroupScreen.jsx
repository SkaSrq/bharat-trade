import { View, Text, TouchableOpacity, Image, TextInput } from "react-native";
import React, { useState } from "react";
import {
  AntDesign,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { Colors } from "../../GlobalStyles";
import { useNavigation } from "@react-navigation/native";

const CreateGroupScreen = () => {
  const navigation = useNavigation();
  const user = useSelector((state) => state.user);
  const [groupName, setGroupName] = useState("");
  const createGroup = () => {};
  return (
    <View className="flex-1">
      <View className="w-full bg-lightBlue60 px-4 py-6 flex-[0.20]">
        <View className="flex-row items-center justify-between w-full px-4">
          <TouchableOpacity className="" onPress={() => navigation.goBack()}>
            <MaterialIcons name="chevron-left" size={32} color={"#fbfbfb"} />
          </TouchableOpacity>

          <View className="flex-row items-center justify-center space-x-3">
            <Image
              source={{ uri: user?.info.profilePic }}
              className="w-12 h-12"
              resizeMode="contain"
            />
          </View>
        </View>
      </View>
      <View className="w-full bg-white px-4 py-6 flex-1 rounded-t-[50px] -mt-10">
        <View className="w-full px-4 py-4">
          <View className="w-full px-4 flex-row items-center justify-between py-3 rounded-xl border border-gray-200 space-x-3">
            <Ionicons name="chatbubbles" size={24} color={Colors.lightBlue35} />
            <TextInput
              className="flex-1 text-lg text-lightBlue35 -mt-2 h-12 w-full"
              placeholder="Enter group name"
              placeholderTextColor={Colors.lightBlue35}
              value={groupName}
              onChangeText={(text) => setGroupName(text)}
            />
            <TouchableOpacity onPress={createGroup}>
              <FontAwesome name="send" size={24} color={Colors.lightBlue35} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CreateGroupScreen;
