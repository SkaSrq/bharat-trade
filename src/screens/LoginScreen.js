import { View, Text, Image, Dimensions, TouchableOpacity } from "react-native";
import React from "react";
import IconTransparent from "../../assets/images/icon_transparent.png";
import { Colors } from "../../GlobalStyles";
import { UserTextInput } from "../components";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { fireStoreDB, fireabseAuth } from "../../config/firebase.config";
import { doc, getDoc } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../redux/slices/UserSlice";

const LoginScreen = () => {
  const screenWidth = Math.round(Dimensions.get("window").width);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [getEmailValidationStatus, setGetEmailValidationStatus] =
    useState(false);

  const [alert, setAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigation = useNavigation();

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const handleLogin = async () => {
    if (getEmailValidationStatus && email !== "") {
      await signInWithEmailAndPassword(fireabseAuth, email, password)
        .then((userCred) => {
          if (userCred) {
            getDoc(doc(fireStoreDB, "users", userCred?.user.uid)).then(
              (docSnap) => {
                if (docSnap.exists()) {
                  dispatch(addUser(docSnap.data()));
                }
              }
            );
          }
        })
        .catch((err) => {
          console.log("Error: ", err.message);
          if (err.message.includes("invalid-login-credentials")) {
            setAlert(true);
            setErrorMessage("Wrong email or password");
          } else if (err.message.includes("user-not-found")) {
            setAlert(true);
            setErrorMessage("User Not Found");
          } else if (err.message.includes("too-many-requests")) {
            setAlert(true);
            setErrorMessage(
              "Account has been temporarily disabled. Please reset your password and try again."
            );
          } else {
            setAlert(true);
            setErrorMessage("Invalid email Address");
          }
          setInterval(() => {
            setAlert(false);
          }, 2000);
        });
    }
  };
  return (
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
          // className="h-96"
          style={{
            width: 120,
            height: 120,
          }}
          className="mt-10"
        />
      </View>

      {/* Main View */}
      <View className="w-full h-full bg-white rounded-t-[70px] -mt-44 flex items-center justify-start py-6 px-6 space-y-6">
        {/* <Image
          source={IconTransparent}
          className="w-16 h-16"
          resizeMode="contain"
        /> */}
        <Text className="py-2 text-primaryText text-xl font-semibold">
          Welcome Back!
        </Text>
        <View className="w-full flex items-center justify-center">
          {/* Alert */}
          {alert && (
            <Text className="text-base text-red-600 font-semibold ">
              {errorMessage}
            </Text>
          )}

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
          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            className="w-full px-4 py-2 rounded-xl my-3 flex items-center justify-center"
            style={{ backgroundColor: Colors.brand }}
          >
            <Text className="py-2 text-white text-xl font-semibold">
              Sign In
            </Text>
          </TouchableOpacity>
          <View className="w-full py-2 flex-row items-center justify-center space-x-2">
            <Text className="text-base text-grey ">Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
              <Text className="text-base font-semibold text-brand">
                Click Here
              </Text>
            </TouchableOpacity>
          </View>
          {/* google Button */}
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
