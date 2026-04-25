import {
  View,
  Text,
  Pressable,
  SafeAreaView,
  Modal,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState } from "react";
import TheStopGameTitle from "../components/TheStopGameTitle";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useStartMatchSession } from "@/hooks/useCreateMatch";

type Language = "en" | "es";

function parseJsonArray<T>(value?: string): T[] {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function SetupSolo() {
  const { gameMode, selistName, setlistId, availableLanguages, setlistCategories } = useLocalSearchParams<{
    gameMode?: string;
    selistName?: string;
    setlistId?: string;
    availableLanguages?: string;
    setlistCategories?: string;
  }>();
  const router = useRouter();
  const parsedLanguages = parseJsonArray<string>(availableLanguages).filter(
    (language): language is Language => language === "en" || language === "es"
  );
  const parsedCategories = parseJsonArray<{
    name: string;
    label?: string;
    index: number;
    level: string;
    language: string;
  }>(setlistCategories);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "medium"
  );
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(
    parsedLanguages[0] || "en"
  );
  const [rounds, setRounds] = useState<3 | 4 | 5 | 6>(3);
  const [timer, setTimer] = useState<number>(20);
  const [showRoundsDropdown, setShowRoundsDropdown] = useState(false);
  const [showTimerDropdown, setShowTimerDropdown] = useState(false);
  const [starting, setStarting] = useState(false);
  const { startSession } = useStartMatchSession();

  const roundsOptions: (3 | 4 | 5 | 6)[] = [3, 4, 5, 6];
  const timerOptions = [10, 15, 20, 30, 45, 60, 90, 120, 9999999999999];
  const difficultyOptions = [
    { value: "easy", label: "Easy", icon: "leaf", color: "#57C96B" },
    { value: "medium", label: "Medium", icon: "flash", color: "#F5C125" },
    { value: "hard", label: "Hard", icon: "flame", color: "#E81D1D" },
  ] as const;

  const languageOptions: { value: Language; label: string }[] = ([
    { value: "en", label: "English" },
    { value: "es", label: "Español" },
  ] as const).filter((option) => parsedLanguages.includes(option.value));

  const formatTimer = (value: number) =>
    value > 1000000 ? "No limit" : `${value}s`;

  const handleStart = async () => {
    if (starting) return;

    setStarting(true);
    const response = await startSession({
      rounds,
      gameMode: (gameMode || "solo") as "solo" | "friends" | "online",
      setlistId: setlistId || "",
      timer,
      difficulty,
      language: selectedLanguage,
      allowJoiningWhilePlaying: false,
      allowStopButton: true,
    });
    setStarting(false);

    if (!response?.success) {
      Alert.alert("Error", response?.message || "Could not start match");
      return;
    }

    const match = response.data.match;
    const currentRound = response.data.currentRound;

    router.push({
      pathname: "/gameplay",
      params: {
        matchId: match.id,
        roundId: currentRound.id,
        currentRound: currentRound.round_number.toString(),
        currentLetter: currentRound.letter,
        roundStartedAt: currentRound.started_at,
        roundMaxDuration: currentRound.round_duration.max_duration.toString(),
        gameMode: gameMode || "",
        selistName: selistName || "",
        setlistId: setlistId || "",
        difficulty,
        language: selectedLanguage,
        setlistCategories: JSON.stringify(parsedCategories),
        rounds: rounds.toString(),
        timer: timer.toString(),
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F7F7F4]">
      {/* Barras verticales negras en los lados */}
      <View className="flex-1 flex-row">
        <View className="w-1 bg-black" />
        <View className="flex-1 px-5 flex-col justify-between">
          {/* Título */}
          <View className="items-center pt-6">
            <TheStopGameTitle />
          </View>

          {/* Setup card */}
          <View
            className="rounded-2xl border border-black/10 bg-white p-5"
            style={{
              shadowColor: "#111827",
              shadowOffset: { width: 0, height: 12 },
              shadowOpacity: 0.1,
              shadowRadius: 24,
              elevation: 4,
            }}
          >
            <View className="mb-5 flex-row items-center justify-between">
              <View>
                <Text className="text-xs font-light uppercase text-gray-500">
                  Solo setup
                </Text>
                <Text className="mt-1 text-3xl font-light text-black">
                  Tune the round
                </Text>
              </View>
              <View className="h-12 w-12 items-center justify-center rounded-full bg-black">
                <Ionicons name="settings-outline" size={24} color="white" />
              </View>
            </View>

            <Text className="mb-3 text-base font-medium text-black">
              Language
            </Text>
            <View className="mb-6 flex-row gap-3">
              {languageOptions.map((option) => {
                const selected = selectedLanguage === option.value;

                return (
                  <Pressable
                    key={option.value}
                    onPress={() => setSelectedLanguage(option.value)}
                    className={`flex-1 rounded-xl border px-4 py-3 ${
                      selected ? "bg-black" : "bg-[#F7F7F4]"
                    }`}
                    style={{ borderColor: selected ? "#111827" : "#E5E7EB" }}
                  >
                    <Text
                      className={`text-center text-base font-medium ${
                        selected ? "text-white" : "text-black"
                      }`}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Select Difficulty */}
            <Text className="mb-3 text-base font-medium text-black">
              Select Difficulty
            </Text>
            <View className="flex-row gap-3 mb-6">
              {difficultyOptions.map((option) => {
                const selected = difficulty === option.value;

                return (
                  <Pressable
                    key={option.value}
                    onPress={() => setDifficulty(option.value)}
                    className={`flex-1 items-center rounded-xl border px-2 py-3 ${
                      selected ? "bg-black" : "bg-[#F7F7F4]"
                    }`}
                    style={{ borderColor: selected ? "#111827" : "#E5E7EB" }}
                  >
                    <View
                      className="mb-2 h-8 w-8 items-center justify-center rounded-full"
                      style={{
                        backgroundColor: selected ? option.color : "white",
                      }}
                    >
                      <Ionicons
                        name={option.icon}
                        size={17}
                        color={selected ? "white" : option.color}
                      />
                    </View>
                    <Text
                      className={`text-center text-sm font-medium ${
                        selected ? "text-white" : "text-black"
                      }`}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Rounds Dropdown */}
            <Pressable
              onPress={() => setShowRoundsDropdown(true)}
              className="mb-3 flex-row items-center justify-between rounded-xl border border-gray-200 bg-[#F7F7F4] px-4 py-4"
            >
              <View className="flex-row items-center gap-3">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-yellow">
                  <Ionicons name="repeat" size={20} color="black" />
                </View>
                <View>
                  <Text className="text-xs font-light uppercase text-gray-500">
                    Rounds
                  </Text>
                  <Text className="text-xl font-light text-black">
                    {rounds} rounds
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-down" size={20} color="#111827" />
            </Pressable>

            {/* Timer Dropdown */}
            <Pressable
              onPress={() => setShowTimerDropdown(true)}
              className="flex-row items-center justify-between rounded-xl border border-gray-200 bg-[#F7F7F4] px-4 py-4"
            >
              <View className="flex-row items-center gap-3">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-red">
                  <Ionicons name="timer-outline" size={20} color="white" />
                </View>
                <View>
                  <Text className="text-xs font-light uppercase text-gray-500">
                    Timer
                  </Text>
                  <Text className="text-xl font-light text-black">
                    {formatTimer(timer)}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-down" size={20} color="#111827" />
            </Pressable>
          </View>

          {/* Botón Start - Abajo */}
          <View className="pb-6 pt-4">
            <Pressable
              onPress={handleStart}
              disabled={starting}
              className={`bg-black rounded-lg py-4 active:opacity-80 ${
                starting ? "opacity-60" : ""
              }`}
            >
              <Text className="text-white text-lg font-medium text-center">
                {starting ? "Starting..." : "Start"}
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
                      {formatTimer(option)}
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
