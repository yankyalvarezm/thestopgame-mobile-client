import { Pressable, Text } from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { me } from "../services/auth.service";

export default function PlayNow() {
  const [loading, setLoading] = useState(false);

  const handlePlayNow = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await me();

      if (response?.success) {
        router.push("/gameModes");
      } else {
        router.push("/Login"); 
      }
    } catch (err) {
      router.push("/"); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pressable
      onPress={handlePlayNow}
      disabled={loading}
      style={{ width: "100%" }}
      className={`w-full bg-white px-4 py-2 rounded-md border border-black min-h-[40] items-center justify-center ${
        loading ? "opacity-50" : "active:opacity-70"
      }`}
    >
      <Text className="text-black font-light">
        {loading ? "Loading..." : "Play Now"}
      </Text>
    </Pressable>
  );
}
