import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React from "react";
import {
  AntDesign,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { Colors } from "../../GlobalStyles";
import { useState } from "react";
import {
  collection,
  collectionGroup,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { fireStoreDB } from "../../config/firebase.config";
import emptyResult from "../../assets/images/money.png";
import { createOneToOneChat } from "../redux/slices/ConversationSlice";

const SearchFriend = () => {
  const navigation = useNavigation();
  const user = useSelector((state) => state.user);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchUsers = async () => {
    setIsLoading(true);
    try {
      const usersCollection = collectionGroup(fireStoreDB, "users");

      const q = query(usersCollection, where("username", ">=", searchText));

      const querySnapshot = await getDocs(q);
      const results = [];

      querySnapshot.forEach((doc) => {
        if (doc.data()._id != user.info._id) {
          results.push(doc.data());
        }
      });

      setSearchResults(results);
      setTimeout(() => {}, 3000);
    } catch (error) {
      console.error("Error searching for users:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
            <AntDesign name="adduser" size={24} color={Colors.lightBlue35} />
            <TextInput
              className="flex-1 text-lg text-lightBlue35 -mt-2 h-12 w-full"
              placeholder="Search for friends..."
              placeholderTextColor={Colors.lightBlue35}
              value={searchText}
              onChangeText={(text) => setSearchText(text)}
            />
            <TouchableOpacity onPress={searchUsers}>
              <FontAwesome name="search" size={24} color={Colors.lightBlue35} />
            </TouchableOpacity>
          </View>
        </View>

        {isLoading ? (
          <>
            <View className="flex-1 flex-col items-center justify-center">
              <ActivityIndicator size={"large"} color={Colors.lightBlue35} />
            </View>
          </>
        ) : (
          <>
            {searchResults.length === 0 ? (
              <>
                <View className="flex-1 flex-col items-center justify-center">
                  <Image
                    source={emptyResult}
                    resizeMode="contain"
                    className="h-28 w-28"
                  />
                  <Text className="font-bold text-lightBlue35 text-3xl">
                    No result Found
                  </Text>
                </View>
              </>
            ) : (
              <>
                <FlatList
                  data={searchResults}
                  keyExtractor={(item) => item._id}
                  renderItem={({ item }) => <SearchCard item={item} />}
                />
              </>
            )}
          </>
        )}
      </View>
    </View>
  );
};

export default SearchFriend;

const SearchCard = ({ item }) => {
  chatInfo = {
    conversationId: "id",
    chatName: "sharique",
    status: "online",
    profilePic:
      "https://cdn.sanity.io/images/e3a07iip/production/9962f6fb7ba946ce4e10ddc971bbbf038f852004-1083x1083.png",
  };

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const user = useSelector((state) => state.user);
  const handleCreateChat = async () => {
    dispatch(createOneToOneChat({ user1Id: user.info._id, user2Id: item._id }))
      .then((conversationId) => {
        navigation.navigate("Chat", {
          conversationId: conversationId,
          chatInfo: chatInfo,
        });
      })
      .catch((error) => {
        // Handle errors
        console.log("getting errors", error);
      });
  };
  return (
    <View
      className="w-full h-20 flex-row items-center justify-between my-1 px-4 rounded-2xl bg-slate-100"
      //   elevation={2}
    >
      <View className="w-16 h-16 rounded-full p-1 flex items-center justify-center border-2 border-lightBlue60">
        <Image
          source={{ uri: item.profilePic }}
          style={{ height: 56, width: 56 }}
          resizeMode="contain"
        />
      </View>

      <Text
        className="ml-2  mr-2 flex-1 font-bold text-xl text-lightBlue35"
        numberOfLines={1}
      >
        {item.username}
      </Text>
      <TouchableOpacity
        onPress={handleCreateChat}
        className="items-center justify-center border-2 p-1 rounded-lg border-lightBlue60"
      >
        <Image
          source={require("../../assets/images/mesage.png")}
          style={{ height: 32, width: 32 }}
          resizeMode="contain"
        />
        <Text className="text-grey font-semibold">Message</Text>
      </TouchableOpacity>
    </View>
  );
};
