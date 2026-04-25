import { Pressable, Text } from "react-native";
import React from "react";

export default function HowToPlay({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{ width: "100%" }}
      className="w-full bg-black px-4 py-2 rounded-md border border-black active:opacity-70 min-h-[40] items-center justify-center"
    >
      <Text className="text-white font-light">How To Play</Text>
    </Pressable>
  );
}
