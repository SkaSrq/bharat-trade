import {
  View,
  Text,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  TextInput,
  FlatList,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import EmojiPicker from "rn-emoji-keyboard";
import {
  Entypo,
  FontAwesome,
  FontAwesome5,
  MaterialIcons,
} from "@expo/vector-icons";
import { Colors } from "../../GlobalStyles";
import { useDispatch, useSelector } from "react-redux";
import {
  addMessageToConversation,
  fetchAndStoreNewMessages,
  fetchMessages,
} from "../redux/slices/ConversationSlice";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { fireStoreDB } from "../../config/firebase.config";

const { width } = Dimensions.get("window");

const ChatScreen = ({ route }) => {
  const navigation = useNavigation();
  const { conversationId, chatInfo } = route.params;
  cId = conversationId.payload;

  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [latestMessages, setLatestMessages] = useState([]);
  //   const latestMessages = useSelector((state) => state.conversation);

  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const handlePick = (e) => {
    setMessage((prev) => prev + e.emoji);
  };
  const handleSendMessage = () => {
    if (message.trim() === "") {
      return;
    }
    const senderId = user.info._id;
    dispatch(
      addMessageToConversation({
        conversationId: conversationId.payload,
        senderId,
        messageText: message,
      })
    );
    setMessage("");
  };

  useLayoutEffect(() => {
    const msgQuery = query(
      collection(fireStoreDB, "conversations", cId, "messages"),
      orderBy("timestamp", "asc")
    );
    const unsubscribe = onSnapshot(msgQuery, (querySnap) => {
      const upMsg = querySnap.docs.map((doc) => doc.data());
      setLatestMessages(upMsg);
      setIsLoading(false);
    });
    return unsubscribe;
    function fetchLatestMessages() {
      dispatch(fetchMessages({ conversationId: cId }));
      setIsLoading(false);
    }
    // return fetchLatestMessages();
  }, []);

  return (
    <View className="flex-1">
      <View className="w-full h-32 bg-lightBlue60 px-4 py-6">
        <View className="flex-row items-center justify-between w-full px-4">
          <View className="flex-row items-center justify-center space-x-3">
            <TouchableOpacity className="" onPress={() => navigation.goBack()}>
              <MaterialIcons name="chevron-left" size={32} color={"#fbfbfb"} />
            </TouchableOpacity>
            <View className="w-12 h-12 rounded-full border border-lightBlue35 flex items-center justify-center">
              <FontAwesome5 name="users" size={24} color="#fbfbfb" />
            </View>
            <View>
              <Text className="text-gray-50 text-base font-semibold capitalize">
                {chatInfo.chatName.length > 16
                  ? `{${chatInfo.chatName.slice(0, 16)}..}`
                  : chatInfo.chatName}
              </Text>
              <Text className="text-gray-100 text-sm font-semibold capitalize">
                Online
              </Text>
            </View>
          </View>

          <View className="flex-row items-center justify-center space-x-3">
            <TouchableOpacity>
              <FontAwesome5 name="video" size={24} color="#fbfbfb" />
            </TouchableOpacity>
            <TouchableOpacity>
              <FontAwesome name="phone" size={24} color="#fbfbfb" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Entypo name="dots-three-vertical" size={24} color="#fbfbfb" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View className="w-full bg-white px-4 py-6 flex-1 rounded-t-[50px] -mt-10">
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={160}
        >
          <>
            <View>
              {isLoading ? (
                <>
                  <View className="w-full flex items-center justify-center ">
                    <ActivityIndicator
                      size={"large"}
                      color={Colors.lightBlue35}
                    />
                  </View>
                </>
              ) : (
                <>
                  {/* messages */}
                  <FlatList
                    data={latestMessages}
                    keyExtractor={(item) => item.timestamp}
                    renderItem={({ item }) => (
                      <ChatMessage item={item} userId={user.info._id} />
                    )}
                    // onEndReached={handleLoadMoreMessages}
                    // onEndReachedThreshold={0.1}
                    // ref={flatListRef}
                  />
                </>
              )}
            </View>
            <View className="absolute bottom-0 w-full flex-row  items-center justify-center px-8">
              <View className="bg-gray-200 rounded-2xl px-4 space-x-4 py-2 flex-row items-center justify-center">
                <TouchableOpacity onPress={() => setIsOpen(!isOpen)}>
                  <Entypo
                    name="emoji-happy"
                    size={24}
                    color={Colors.lightBlue60}
                  />
                  <EmojiPicker
                    onEmojiSelected={handlePick}
                    open={isOpen}
                    onClose={() => setIsOpen(false)}
                    enableSearchBar
                    categoryPosition="top"
                  />
                </TouchableOpacity>
                <TextInput
                  placeholder="Type here..."
                  className="flex-1 h-8 text-base text-lightBlue35 font-semibold"
                  placeholderTextColor={"#999"}
                  value={message}
                  onChangeText={(text) => setMessage(text)}
                />
                <TouchableOpacity>
                  <Entypo name="mic" size={24} color={Colors.lightBlue60} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={handleSendMessage} className="pl-4">
                <FontAwesome name="send" size={24} color={Colors.lightBlue60} />
              </TouchableOpacity>
            </View>
          </>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

export default ChatScreen;

const ChatMessage = ({ item, userId }) => {
  console.log("timestamp", item);
  return (
    <>
      {item.senderId === userId ? (
        <>
          <View className="m-1">
            <LinearGradient
              colors={[Colors.lightBlue35, Colors.lightBlue60]}
              start={{ x: -1, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ alignSelf: "flex-end" }}
              className="px-4 py-2 bg-lightBlue60 rounded-bl-xl rounded-tl-xl rounded-tr-xl relative"
            >
              <Text
                style={{ maxWidth: width * 0.7 }}
                className="text-base font-semibold text-white"
              >
                {item.text}
              </Text>
            </LinearGradient>
            <View style={{ alignSelf: "flex-end" }}>
              {item?.timestamp && (
                <Text className="text-black text-[12px] font-semibold ">
                  {new Date(
                    parseInt(item.timestamp.seconds) * 1000
                  ).toLocaleTimeString("en-IN", {
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                    hour12: true,
                  })}
                </Text>
              )}
            </View>
          </View>
        </>
      ) : (
        <>
          <View className="m-1">
            <LinearGradient
              colors={[Colors.brand80, Colors.brand35]}
              start={{ x: -1, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ alignSelf: "flex-start" }}
              className="px-4 py-2 rounded-br-xl rounded-tl-xl rounded-tr-xl relative"
            >
              <Text
                style={{ maxWidth: width * 0.7 }}
                className="text-base font-semibold text-white"
              >
                {item.text}
              </Text>
            </LinearGradient>
            <View style={{ alignSelf: "flex-start" }}>
              {item?.timestamp && (
                <Text className="text-black text-[12px] font-semibold ">
                  {new Date(
                    parseInt(item.timestamp.seconds) * 1000
                  ).toLocaleTimeString("en-IN", {
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                    hour12: true,
                  })}
                </Text>
              )}
            </View>
          </View>
        </>
      )}
    </>
  );
};

{
  /* <View
      style={{
        display: "flex",
        alignSelf: item.senderId === userId ? "flex-end" : "flex-start",
        backgroundColor:
          item.senderId === userId ? Colors.lightBlue60 : "lightgreen",
        padding: 8,
        margin: 8,
        maxWidth: "70%", // Adjust as needed
        borderRadius: 8,
      }}
    >
      <Text>{item.text}</Text>
    </View> */
}
