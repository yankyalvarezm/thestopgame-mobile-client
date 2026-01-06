import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import TheStopGameTitle from "../components/TheStopGameTitle";

type Category = {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  isCustom?: boolean;
};

const categories: Category[] = [
  {
    id: "default",
    title: "Default",
    subtitle: "Mix de categorías populares",
    icon: "globe-outline",
  },
  {
    id: "sports",
    title: "Sports",
    subtitle: "Todos los deportes",
    icon: "trophy-outline",
  },
  {
    id: "f1",
    title: "F1",
    subtitle: "Fórmula 1",
    icon: "speedometer-outline",
  },
  {
    id: "nba",
    title: "NBA",
    subtitle: "Baloncesto profesional",
    icon: "basketball-outline",
  },
  {
    id: "clothing",
    title: "Clothing Brands",
    subtitle: "Marcas de ropa",
    icon: "shirt-outline",
  },
  {
    id: "custom",
    title: "Custom",
    subtitle: "Personaliza tu juego completo",
    icon: "flash-outline",
    isCustom: true,
  },
];

export default function Categories() {
  const [selectedCategory, setSelectedCategory] = useState("default");

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6">
        {/* Título */}
        <View className="items-center pt-6 mb-2">
          <TheStopGameTitle />
        </View>

        {/* Subtítulo */}
        <Text className="text-base text-gray-600 text-center mb-6">
          Elige tu categoría favorita
        </Text>

        {/* Lista de categorías */}
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="gap-3">
            {categories.map((category) => {
              const isSelected = selectedCategory === category.id;
              const isCustom = category.isCustom;

              return (
                <Pressable
                  key={category.id}
                  onPress={() => setSelectedCategory(category.id)}
                  className={`rounded-lg p-4 flex-row items-center ${
                    isSelected
                      ? "bg-black"
                      : isCustom
                      ? "bg-yellow"
                      : "bg-white border border-gray-200"
                  }`}
                >
                  <Ionicons
                    name={category.icon}
                    size={24}
                    color={isSelected ? "white" : isCustom ? "black" : "black"}
                  />
                  <View className="ml-4 flex-1">
                    <Text
                      className={`text-lg font-medium ${
                        isSelected
                          ? "text-white"
                          : isCustom
                          ? "text-black"
                          : "text-black"
                      }`}
                    >
                      {category.title}
                    </Text>
                    <Text
                      className={`text-sm ${
                        isSelected
                          ? "text-gray-300"
                          : isCustom
                          ? "text-gray-700"
                          : "text-gray-600"
                      }`}
                    >
                      {category.subtitle}
                    </Text>
                  </View>
                  {isSelected && (
                    <Ionicons name="checkmark" size={24} color="white" />
                  )}
                  {isCustom && !isSelected && (
                    <Ionicons name="chevron-forward" size={24} color="black" />
                  )}
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        {/* Botón Continue */}
        <View className="pb-6 pt-4">
          <Pressable className="bg-black rounded-lg py-4 active:opacity-80">
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
