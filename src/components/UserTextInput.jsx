import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import { Colors } from "../../GlobalStyles";
import { useLayoutEffect } from "react";

const UserTextInput = ({
  placeholder,
  isPass,
  stateValue,
  setStateFunction,
  setGetEmailValidationStatus,
}) => {
  const [showPass, setShowPass] = useState(true);
  const [icon, setIcon] = useState(null);
  const [value, setValue] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const hadndleTextChanged = (text) => {
    setValue(text);
    setStateFunction(text);
    if (placeholder === "Email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const status = emailRegex.test(value);
      setIsEmailValid(status);
      setGetEmailValidationStatus(status);
    }
  };
  useLayoutEffect(() => {
    switch (placeholder) {
      case "Username":
        return setIcon("person");
      case "Email":
        return setIcon("email");
      case "Password":
        return setIcon("lock");
    }
  }, []);
  return (
    <View
      className={`border rounded-2xl px-4 py-5 flex-row items-center justify-between space-x-4 my-2 ${
        !isEmailValid && placeholder == "Email" && value.length > 0
          ? "border-red-500"
          : "border-gray-200"
      }`}
    >
      <MaterialIcons name={icon} size={24} color={Colors.grey} />
      <TextInput
        className="flex-1 text-base text-primaryText font-semibold -mt-1"
        placeholder={placeholder}
        secureTextEntry={isPass && showPass}
        value={stateValue}
        onChangeText={(text) => hadndleTextChanged(text)}
        autoCapitaliz="none"
      />
      {isPass && (
        <TouchableOpacity onPress={() => setShowPass(!showPass)}>
          <Entypo
            name={`${showPass ? "eye" : "eye-with-line"}`}
            size={24}
            color={Colors.grey}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default UserTextInput;
