import {
  View,
  Text,
  Pressable,
  SafeAreaView,
  Modal,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import TheStopGameTitle from "../components/TheStopGameTitle";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";

export default function SetupSolo() {
  const { gameMode } = useLocalSearchParams<{ gameMode?: string }>();
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "medium"
  );
  const [rounds, setRounds] = useState<3 | 4 | 5 | 6>(3);
  const [timer, setTimer] = useState<number>(20);
  const [showRoundsDropdown, setShowRoundsDropdown] = useState(false);
  const [showTimerDropdown, setShowTimerDropdown] = useState(false);

  const roundsOptions: (3 | 4 | 5 | 6)[] = [3, 4, 5, 6];
  const timerOptions = [10, 15, 20, 30, 45, 60, 90, 120, 9999999999999];

  const handleStart = () => {
    // TODO: Implementar lógica de inicio del juego
    console.log("Start game:", { gameMode, difficulty, rounds, timer });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Barras verticales negras en los lados */}
      <View className="flex-1 flex-row">
        <View className="w-1 bg-black" />
        <View className="flex-1 px-6 flex-col justify-between">
          {/* Título */}
          <View className="items-center pt-6">
            <TheStopGameTitle />
          </View>

          {/* Tarjeta roja con configuraciones - Centrada */}
          <View className="bg-red rounded-lg p-6">
            {/* Select Difficulty */}
            <Text className="text-white text-lg font-medium mb-4">
              Select Difficulty
            </Text>
            <View className="flex-row gap-3 mb-6">
              <Pressable
                onPress={() => setDifficulty("easy")}
                className={`flex-1 rounded-lg py-3 ${
                  difficulty === "easy" ? "bg-black" : "bg-gray-200"
                }`}
              >
                <Text
                  className={`text-center text-base font-medium ${
                    difficulty === "easy" ? "text-white" : "text-black"
                  }`}
                >
                  Easy
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setDifficulty("medium")}
                className={`flex-1 rounded-lg py-3 ${
                  difficulty === "medium" ? "bg-black" : "bg-gray-200"
                }`}
              >
                <Text
                  className={`text-center text-base font-medium ${
                    difficulty === "medium" ? "text-white" : "text-black"
                  }`}
                >
                  Medium
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setDifficulty("hard")}
                className={`flex-1 rounded-lg py-3 ${
                  difficulty === "hard" ? "bg-black" : "bg-gray-200"
                }`}
              >
                <Text
                  className={`text-center text-base font-medium ${
                    difficulty === "hard" ? "text-white" : "text-black"
                  }`}
                >
                  Hard
                </Text>
              </Pressable>
            </View>

            {/* Rounds Dropdown */}
            <Text className="text-white text-lg font-medium mb-2">Rounds</Text>
            <Pressable
              onPress={() => setShowRoundsDropdown(true)}
              className="bg-white rounded-lg px-4 py-3 mb-4 border border-black flex-row items-center justify-between"
            >
              <Text className="text-base font-medium text-black">{rounds}</Text>
              <Ionicons name="chevron-down" size={20} color="black" />
            </Pressable>

            {/* Timer Dropdown */}
            <Text className="text-white text-lg font-medium mb-2">
              Timer (seconds)
            </Text>
            <Pressable
              onPress={() => setShowTimerDropdown(true)}
              className="bg-white rounded-lg px-4 py-3 border border-black flex-row items-center justify-between"
            >
              <Text className="text-base font-medium text-black">{timer}</Text>
              <Ionicons name="chevron-down" size={20} color="black" />
            </Pressable>
          </View>

          {/* Botón Start - Abajo */}
          <View className="pb-6 pt-4">
            <Pressable
              onPress={handleStart}
              className="bg-black rounded-lg py-4 active:opacity-80"
            >
              <Text className="text-white text-lg font-medium text-center">
                Start
              </Text>
            </Pressable>
          </View>
        </View>
        <View className="w-1 bg-black" />
      </View>

      {/* Modal para Rounds Dropdown */}
      <Modal
        visible={showRoundsDropdown}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowRoundsDropdown(false)}
      >
        <Pressable
          className="flex-1 bg-black/50 justify-end"
          onPress={() => setShowRoundsDropdown(false)}
        >
          <View className="bg-white rounded-t-3xl">
            <View className="w-12 h-1 bg-gray-300 rounded-full self-center mt-3 mb-2" />
            <Text className="text-lg font-semibold text-center mb-4 px-4">
              Select Rounds
            </Text>
            <ScrollView className="max-h-64">
              {roundsOptions.map((option) => (
                <Pressable
                  key={option}
                  onPress={() => {
                    setRounds(option);
                    setShowRoundsDropdown(false);
                  }}
                  className={`px-6 py-4 border-b border-gray-100 ${
                    rounds === option ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <View className="flex-row items-center justify-between">
                    <Text className="text-base font-medium text-black">
                      {option}
                    </Text>
                    {rounds === option && (
                      <Ionicons name="checkmark" size={24} color="black" />
                    )}
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>

      {/* Modal para Timer Dropdown */}
      <Modal
        visible={showTimerDropdown}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTimerDropdown(false)}
      >
        <Pressable
          className="flex-1 bg-black/50 justify-end"
          onPress={() => setShowTimerDropdown(false)}
        >
          <View className="bg-white rounded-t-3xl">
            <View className="w-12 h-1 bg-gray-300 rounded-full self-center mt-3 mb-2" />
            <Text className="text-lg font-semibold text-center mb-4 px-4">
              Select Timer (seconds)
            </Text>
            <ScrollView className="max-h-64">
              {timerOptions.map((option) => (
                <Pressable
                  key={option}
                  onPress={() => {
                    setTimer(option);
                    setShowTimerDropdown(false);
                  }}
                  className={`px-6 py-4 border-b border-gray-100 ${
                    timer === option ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <View className="flex-row items-center justify-between">
                    <Text className="text-base font-medium text-black">
                      {option}
                    </Text>
                    {timer === option && (
                      <Ionicons name="checkmark" size={24} color="black" />
                    )}
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
