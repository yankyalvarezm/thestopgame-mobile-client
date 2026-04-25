import React, { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TheStopGameTitle from "../components/TheStopGameTitle";
import GameModeContainer from "../components/GameModeContainer";
import CopyRight from "../components/CopyRight";
import ModalJoinCreate from "@/components/ModalJoinCreate";

export default function GameModes() {
  const [showModal, setShowModal] = useState(false);
  const [, setGameMode] = useState<string | null>(null);

  return (
    <SafeAreaView className="flex-1 bg-[#F7F7F4]">
      <View className="flex-1 flex-col px-0">
        {/* 🔝 Title arriba */}
        <View className="items-center pt-5 pb-3">
          <TheStopGameTitle />
        </View>
        {/* Content en el medio */}
        <ModalJoinCreate
          visible={showModal}
          onJoin={() => console.log("Join")}
          onCreate={() => console.log("Create")}
          onClose={() => setShowModal(false)}
        />
        <View className="flex-1 justify-center gap-3">
          <GameModeContainer
            title="Play with Friends"
            href="/categories"
            gameMode="friends"
            imageSrc={require("../assets/images/game-modes/friends-card.png")}
            onSelectGameMode={(mode) => setGameMode(mode)}
            onPress={() => setShowModal(true)}
          />
          <GameModeContainer
            title="Play Solo"
            href="/categories"
            gameMode="solo"
            imageSrc={require("../assets/images/game-modes/solo-card.png")}
            onSelectGameMode={(mode) => setGameMode(mode)}
          />
          <GameModeContainer
            title="Play Online"
            href="/categories"
            gameMode="online"
            imageSrc={require("../assets/images/game-modes/online-card.png")}
            onSelectGameMode={(mode) => setGameMode(mode)}
          />
        </View>

        {/* ⬇️ Copyright abajo */}
        <View className="items-center pb-4 pt-3">
          <CopyRight />
        </View>
      </View>
    </SafeAreaView>
  );
}
