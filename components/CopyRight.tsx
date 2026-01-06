import { StyleSheet, Text, View } from "react-native";
import React from "react";

export default function CopyRight() {
  return (
    <View className="items-center">
      <Text className="text-xs text-gray-500">
        © {new Date().getFullYear()} the Stop Game. All Rights Reserved.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({});
