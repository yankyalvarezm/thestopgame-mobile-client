import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import ModalHowToPlay from "../components/ModalHowToPlay";
import PlayNow from "../components/PlayNow";
import HowToPlay from "../components/HowToPlay";
import LogOut from "../components/LogOut";

export default function Index() {
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Padre flex-col */}
      <View className="flex-1 flex-col justify-between px-4 py-4">
        {/* Centro */}
        <View className="flex-1 items-center justify-center">
          <Text className="text-5xl font-light">
            the <Text className="text-red font-bold">STOP</Text> Game
          </Text>

          <Text className="text-lg font-light mt-2">
            Un juego dominicano, hecho por dominicanos 🇩🇴
          </Text>

          <View className="mt-6 flex-col gap-3">
            <View className="flex-row gap-3">
              <PlayNow />
              <HowToPlay onPress={() => setShowHowToPlay(true)} />
            </View>
            <View className="flex-row w-full gap-3">
              <LogOut />
            </View>
          </View>
          <View className="mt-6">
            <Text className="text-xs text-gray-500 text-center">
              By playing this game, you agree to our{" "}
              <Text className="text-blue-500">Terms of Service</Text> and{" "}
              <Text className="text-blue-500">Privacy Policy</Text>. Learn more
              about us or contact us at{" "}
              <Text className="text-blue-500">info@thestopgame.com</Text>.
            </Text>
          </View>
        </View>

        {/* Footer abajo */}
        <View className="items-center">
          <Text className="text-xs text-gray-500">
            © {new Date().getFullYear()} the Stop Game. All Rights Reserved.
          </Text>
        </View>
      </View>

      {/* Modal How To Play */}
      <ModalHowToPlay
        visible={showHowToPlay}
        onClose={() => setShowHowToPlay(false)}
      />
    </SafeAreaView>
  );
}
