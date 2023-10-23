import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useDispatch } from "react-redux";
import { removeUser } from "../../redux/slices/UserSlice";
import { fireabseAuth } from "../../../config/firebase.config";
import { signOut } from "firebase/auth";

const Settings = () => {
  const dispatch = useDispatch();
  const handleLogout = () => {
    signOut(fireabseAuth)
      .then(() => {
        dispatch(removeUser());
      })
      .catch((e) => {
        console.log("Error while logout", e);
      });
  };
  return (
    <View>
      <Text>Settings</Text>
      <TouchableOpacity
        onPress={handleLogout}
        className="w-16 items-center bg-lightBlue35 py-2 px-2"
      >
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Settings;
