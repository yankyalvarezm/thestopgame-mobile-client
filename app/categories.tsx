import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import TheStopGameTitle from "../components/TheStopGameTitle";
import Setlist from "../components/Setlist";

export default function Categories() {
  const { gameMode } = useLocalSearchParams<{ gameMode?: string }>();
  const router = useRouter();
  // console.log("Game Mode:", gameMode);

  const handleContinue = () => {
    if (!gameMode) {
      console.warn("No gameMode provided");
      return;
    }

    switch (gameMode) {
      case "solo":
        router.push({
          pathname: "/setupsolo",
          params: { gameMode },
        });
        break;
      case "friends":
        router.push("/playWithFriends");
        break;
      case "online":
        // TODO: Navegar a la página de online cuando esté disponible
        router.push({
          pathname: "/setupsolo",
          params: { gameMode },
        });
        console.log("/setupsolo");
        break;
      default:
        console.warn(`Unknown gameMode: ${gameMode}`);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6">
        <View className="items-center pt-6 mb-2">
          <TheStopGameTitle />
        </View>

        <Text className="text-base text-gray-600 text-center mb-6">
          Elige tu setlist favorito
        </Text>

        <Setlist gameMode={gameMode} />

        <View className="pb-6 pt-4">
          <Pressable
            onPress={handleContinue}
            className="bg-black rounded-lg py-4 active:opacity-80"
          >
            <Text className="text-white text-lg font-medium text-center">
              Continue
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
