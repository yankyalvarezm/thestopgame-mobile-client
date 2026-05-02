import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import TheStopGameTitle from "../components/TheStopGameTitle";
import Setlist from "../components/Setlist";

type SetlistItem = {
  _id: string;
  name: string;
  categories?: {
    name: string;
    label?: string;
    index: number;
    level: string;
    language: string;
  }[];
  availableLanguages?: string[];
  icon?: string;
  isCustom?: boolean;
  subtitle?: string;
};

export default function Categories() {
  const { gameMode } = useLocalSearchParams<{ gameMode?: string }>();
  const router = useRouter();
  const [selectedSetlist, setSelectedSetlist] = useState<SetlistItem | null>(
    null
  );

  const handleContinue = () => {
    if (!gameMode) {
      return;
    }

    if (!selectedSetlist || selectedSetlist.isCustom) {
      return;
    }

    const setupParams = {
      gameMode,
      selistName: selectedSetlist.name,
      setlistId: selectedSetlist._id,
      availableLanguages: JSON.stringify(selectedSetlist.availableLanguages || []),
      setlistCategories: JSON.stringify(selectedSetlist.categories || []),
    };

    switch (gameMode) {
      case "solo":
        router.push({
          pathname: "/setupsolo",
          params: setupParams,
        });
        break;
      case "friends":
        router.push("/playWithFriends");
        break;
      case "online":
        router.push({
          pathname: "/setupsolo",
          params: setupParams,
        });
        break;
      default:
        return;
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

        <Setlist gameMode={gameMode} onSetlistChange={setSelectedSetlist} />

        <View className="pb-6 pt-4">
          <Pressable
            onPress={handleContinue}
            disabled={!selectedSetlist || selectedSetlist.isCustom}
            className={`rounded-lg py-4 active:opacity-80 ${
              selectedSetlist && !selectedSetlist.isCustom
                ? "bg-black"
                : "bg-gray-300"
            }`}
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
