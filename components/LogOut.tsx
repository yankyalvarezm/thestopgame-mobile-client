import { View, Text, Pressable } from "react-native";
import React from "react";
import { logout } from "../services/auth.service";
import { router } from "expo-router";
import { Alert } from "react-native";
const LogOut = () => {
  const handleLogout = async () => {
    const res = await logout();
    console.log("logout res:", res);
    if (res.success) {
      router.replace("/Login");
    } else {
      Alert.alert("Error", "Failed to logout");
    }
  };
  return (
    <Pressable
      onPress={handleLogout}
      className="flex-1 bg-black px-4 py-2 rounded-md border border-black active:opacity-70 min-w-[170] min-h-[40] items-center justify-center"
    >
      <Text className="text-white font-light">Log Out</Text>
    </Pressable>
  );
};

export default LogOut;
