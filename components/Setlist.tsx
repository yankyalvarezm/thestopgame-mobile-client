import { View, Text, ScrollView, Pressable } from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { getSetlistsByStatus } from "../services/setlist.service";

type SetlistItem = {
  _id: string;
  name: string;
  icon?: string;
  isCustom?: boolean;
  subtitle?: string;
};

type Props = {
  gameMode?: string;
  onSetlistChange?: (setlist: SetlistItem | null) => void;
};

export default function Setlist({ gameMode, onSetlistChange }: Props) {
  const [setlists, setSetlists] = useState<SetlistItem[]>([]);
  const [selectedSetlist, setSelectedSetlist] = useState<SetlistItem | null>(
    null
  );

  const handleSelectSetlist = (setlist: SetlistItem) => {
    setSelectedSetlist(setlist);
    onSetlistChange?.(setlist);
  };

  useEffect(() => {
    getSetlistsByStatus("default").then((response) => {
      const list = Array.isArray(response.setlists) ? response.setlists : [];
      setSetlists(list);
    });
  }, []);

  useEffect(() => {
    console.log("This is the setlist Response:", setlists);
    console.log("Game Mode From Setlist Component:", gameMode);
  }, [setlists]);

  const customSetlist: SetlistItem = {
    _id: "custom-setlist",
    name: "Custom Setlist",
    isCustom: true,
  };

  const setlistIconMap: Record<string, string> = {
    Classic: "globe-outline",
    "Custom Setlist": "add-circle",
  };

  const getSetlistIcon = (setlist: SetlistItem): string => {
    return (
      setlistIconMap[setlist.name] ||
      setlistIconMap[setlist._id] ||
      setlist.icon ||
      "list"
    );
  };

  const renderSetlistItem = (sl: SetlistItem) => {
    const isSelected = selectedSetlist?._id === sl._id;
    const isCustom = sl.isCustom || false;
    const iconName = getSetlistIcon(sl);

    return (
      <Pressable
        key={sl._id}
        onPress={() => handleSelectSetlist(sl)}
        className={`rounded-lg p-4 flex-row items-center ${
          isSelected
            ? "bg-black"
            : isCustom
            ? "bg-yellow"
            : "bg-white border border-gray-200"
        }`}
      >
        <Ionicons
          name={iconName as any}
          size={24}
          color={isSelected ? "white" : isCustom ? "black" : "black"}
        />
        <View className="ml-4 flex-1">
          <Text
            className={`text-lg font-medium ${
              isSelected ? "text-white" : isCustom ? "text-black" : "text-black"
            }`}
          >
            {sl.name}
          </Text>
          {sl.subtitle && (
            <Text
              className={`text-sm ${
                isSelected
                  ? "text-gray-300"
                  : isCustom
                  ? "text-gray-700"
                  : "text-gray-600"
              }`}
            >
              {sl.subtitle}
            </Text>
          )}
        </View>
        {isSelected && <Ionicons name="checkmark" size={24} color="white" />}
        {isCustom && !isSelected && (
          <Ionicons name="chevron-forward" size={24} color="black" />
        )}
      </Pressable>
    );
  };

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="gap-3">
        {/* Setlists del backend */}
        {setlists.map((sl) => renderSetlistItem(sl))}

        {/* Custom Setlist solo aparece si gameMode no es "online" */}
        {gameMode !== "online" && renderSetlistItem(customSetlist)}
      </View>
    </ScrollView>
  );
}
