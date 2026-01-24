import { StyleSheet, Text, View, SafeAreaView, Pressable } from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import TheStopGameTitle from "@/components/TheStopGameTitle";
import CarruselValidation from "@/components/CarruselValidation";

export default function Gameplay() {
  const { gameMode, selistName, difficulty, rounds, timer } =
    useLocalSearchParams<{
      gameMode?: string;
      selistName?: string;
      difficulty?: string;
      rounds?: string;
      timer?: string;
    }>();
  const [activeIndex, setActiveIndex] = useState(0);
  const [count, setCount] = useState(0);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* HEADER */}
      <View className="items-center pt-4">
        <TheStopGameTitle />
      </View>

      {/* CONTENT */}
      <View className="flex-1 w-full">
        <View className="flex-row justify-between w-full px-6 mt-10">
          <Text className="text-black font-roboto text-3xl">
            0:00
          </Text>
          <Text className="text-black font-roboto text-3xl">
            1st Round
          </Text>
        </View>

        <View className="bg-red rounded-lg mt-4 w-[90%] self-center items-center justify-center">
          <Text className="text-white font-montserrat-extrabold text-3xl p-4">
            L
          </Text>
        </View>

        <View className="h-[3px] bg-black w-[80%] mt-4 rounded-full self-center" />

        <Text className="text-black font-roboto-normal text-1xl text-center my-4">
          Prompt Message
        </Text>

        <View className="flex-1 w-full">
          <CarruselValidation
            onIndexChange={setActiveIndex}
            onCount={setCount}
          />
          <View className="flex-row justify-center items-center mt-3">
            {Array.from({ length: count }).map((_, i) => (
              <View
                key={i}
                style={{
                  width: i === activeIndex ? 8 : 8,
                  height: i === activeIndex ? 8 : 8,
                  borderRadius: 999,
                  borderWidth: 0.5,
                  marginHorizontal: 4,
                  borderColor: "black",
                  backgroundColor: i === activeIndex ? "black" : "white",
                }}
              />
            ))}
          </View>
        </View>
      </View>

      {/* FOOTER */}
      <View className="pb-4 items-center">
        <Pressable className="bg-red rounded-lg p-4 w-[90%] items-center justify-center">
          <Text className="text-white font-montserrat-bold text-2xl">Stop</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
