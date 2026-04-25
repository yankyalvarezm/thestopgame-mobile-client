import { View, Text, ScrollView, Pressable } from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { getSetlistsByStatus } from "../services/setlist.service";

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
    const categories = sl.categories || [];
    const languages = sl.availableLanguages || [];

    return (
      <Pressable
        key={sl._id}
        onPress={() => handleSelectSetlist(sl)}
        className={`rounded-xl p-4 ${
          isSelected
            ? "bg-black"
            : isCustom
            ? "bg-yellow"
            : "bg-white border border-gray-200"
        }`}
      >
        <View className="flex-row items-center">
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
            <Text
              className={`text-sm ${
                isSelected ? "text-gray-300" : isCustom ? "text-gray-700" : "text-gray-600"
              }`}
            >
              {sl.subtitle ||
                `${categories.length || 0} categories${
                  languages.length ? ` · ${languages.join(", ").toUpperCase()}` : ""
                }`}
            </Text>
          </View>
          {isSelected && <Ionicons name="checkmark" size={24} color="white" />}
          {isCustom && !isSelected && (
            <Ionicons name="chevron-forward" size={24} color="black" />
          )}
        </View>

        {isSelected && categories.length > 0 && (
          <View className="mt-4 border-t border-white/20 pt-4">
            <Text className="mb-2 text-xs font-light uppercase text-gray-300">
              Categories
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {categories.map((category) => (
                <View
                  key={`${sl._id}-${category.name}`}
                  className="rounded-full bg-white/15 px-3 py-1"
                >
                  <Text className="text-sm text-white">
                    {category.label || category.name}
                  </Text>
                </View>
              ))}
            </View>
          </View>
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
