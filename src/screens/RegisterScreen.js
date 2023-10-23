import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  StatusBar,
  Platform,
} from "react-native";
import React from "react";
import IconTransparent from "../../assets/images/icon_transparent.png";
import { Colors } from "../../GlobalStyles";
import { UserTextInput } from "../components";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { avatars } from "../../utils/supports";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { fireStoreDB, fireabseAuth } from "../../config/firebase.config";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { showMessage } from "react-native-flash-message";

const RegisterScreen = () => {
  const screenWidth = Math.round(Dimensions.get("window").width);
  const screenHeight = Math.round(Dimensions.get("window").height);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const [avatar, setAvatar] = useState(avatars[0]?.image.asset.url);
  const [isAvatar, setIsAvatar] = useState(false);
  const [getEmailValidationStatus, setGetEmailValidationStatus] =
    useState(false);

  const handleAvatar = (item) => {
    setAvatar(item?.image.asset.url);
    setIsAvatar(false);
  };

  const handleSignup = async () => {
    if (fullName === "" || fullName.split(" ").length > 1) {
      showMessage({
        message: "invalid username",
        type: "success",
        statusBarHeight: 50,
      });
    }
    const usernameQuery = query(
      collection(fireStoreDB, "users"),
      where("username", "==", fullName)
    );
    const usernameSnapshot = await getDocs(usernameQuery);

    if (!usernameSnapshot.empty) {
      showMessage({
        message: "Username already exists.",
        description: "Try a different username.",
        type: "danger",
      });
      return;
    }
    if (!getEmailValidationStatus || email === "") {
      showMessage({
        message: "Invalid email address.",
        description: "Try a different email address.",
        type: "danger",
      });
      return;
    }
    await createUserWithEmailAndPassword(fireabseAuth, email, password)
      .then((userCred) => {
        const data = {
          _id: userCred?.user.uid,
          username: fullName,
          profilePic: avatar,
          role: "USER",
          providerData: userCred.user.providerData[0],
        };
        setDoc(doc(fireStoreDB, "users", userCred?.user.uid), data).then(() => {
          showMessage({
            message: "Thanks for joining us.",
            description: "You are redirecting to Home Page",
            type: "success",
          });
          // navigation.navigate("Login");
        });
      })
      .catch((err) => {
        console.log(err.message);
        if (err.message.includes("email-already-in-use")) {
          showMessage({
            message: "Email already exists.",
            description: "Try different email address",
            type: "danger",
          });
        }
      });
  };
  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <View className="flex-1 items-center justify-start">
        <View
          style={{
            backgroundColor: Colors.brand35,
            width: screenWidth,
            height: 350,
          }}
          className="items-center"
        >
          <Image
            source={IconTransparent}
            resizeMode="cover"
            //   className="h-96"
            style={{
              width: 120,
              height: 120,
            }}
            className="mt-10"
          />
        </View>
        {isAvatar && (
          <>
            {/* list of avatars section */}

            <View
              className="absolute inset-0 z-10 "
              style={{ width: screenWidth, height: screenHeight }}
            >
              <ScrollView>
                <BlurView
                  className="w-full h-full px-4 py-16 flex-grow flex-wrap items-center justify-evenly"
                  tint="light"
                  intensity={40}
                  style={{ width: screenWidth, height: screenHeight }}
                >
                  {avatars?.map((item) => (
                    <TouchableOpacity
                      onPress={() => handleAvatar(item)}
                      key={item._id}
                      className="w-20 h-20 m-3 p-1 rounded-full border-2 border-brand relative"
                    >
                      <Image
                        source={{ uri: item?.image.asset.url }}
                        className="w-full h-full"
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  ))}
                </BlurView>
              </ScrollView>
            </View>
          </>
        )}

        {/* Main View */}
        <View className="w-full h-full bg-white rounded-t-[70px] -mt-44 flex items-center justify-start py-4 px-6 space-y-6">
          {/* <Image
          source={IconTransparent}
          className="w-16 h-16"
          resizeMode="contain"
        /> */}
          <Text className=" text-primaryText text-xl font-semibold">
            Join with us!
          </Text>
          <View className="w-full flex items-center justify-center relative -my-4">
            <TouchableOpacity
              onPress={() => setIsAvatar(!isAvatar)}
              className="w-20 h-20 p-1 rounded-full border-2 border-brand relative"
            >
              <Image
                source={{ uri: avatar }}
                className="w-full h-full"
                resizeMode="contain"
              />
              <View className="w-6 h-6 bg-brand rounded-full absolute top-0 right-0 flex items-center justify-center">
                <MaterialIcons name="edit" size={18} color={"#fff"} />
              </View>
            </TouchableOpacity>
          </View>
          <KeyboardAvoidingView className="w-full flex items-center justify-center">
            {/* Alert */}

            <UserTextInput
              placeholder="Username"
              isPass={false}
              stateValue={fullName}
              setStateFunction={setFullName}
            />

            {/* email */}
            <UserTextInput
              placeholder="Email"
              isPass={false}
              stateValue={email}
              setStateFunction={setEmail}
              setGetEmailValidationStatus={setGetEmailValidationStatus}
            />
            {/* password */}
            <UserTextInput
              placeholder="Password"
              isPass={true}
              stateValue={password}
              setStateFunction={setPassword}
            />
            {/* signup Button */}
            <TouchableOpacity
              className="w-full px-4 py-2 rounded-xl my-3 flex items-center justify-center"
              style={{ backgroundColor: Colors.brand }}
              onPress={handleSignup}
            >
              <Text className="py-2 text-white text-xl font-semibold">
                Sign Up
              </Text>
            </TouchableOpacity>
            <View className="w-full py-2 flex-row items-center justify-center space-x-2">
              <Text className="text-base text-grey ">
                Already have an account?
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text className="text-base font-semibold text-brand">
                  Click Here
                </Text>
              </TouchableOpacity>
            </View>
            {/* google Button */}
          </KeyboardAvoidingView>
        </View>
      </View>
    </ScrollView>
  );
};

export default RegisterScreen;
