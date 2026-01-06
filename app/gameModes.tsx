import React, { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TheStopGameTitle from "../components/TheStopGameTitle";
import GameModeContainer from "../components/GameModeContainer";
import CopyRight from "../components/CopyRight";
import ModalJoinCreate from "@/components/ModalJoinCreate";

export default function GameModes() {
  const [showModal, setShowModal] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 flex-col justify-between px-0">
        {/* 🔝 Title arriba */}
        <View className="items-center pt-6">
          <TheStopGameTitle />
        </View>
        {/* Content en el medio */}
        <ModalJoinCreate
          visible={showModal}
          onJoin={() => console.log("Join")}
          onCreate={() => console.log("Create")}
          onClose={() => setShowModal(false)}
        />
        <GameModeContainer
          title="Play with Friends"
          imageSrc={require("../assets/images/play-with-friends.png")}
          labelSide="left"
          href="/playWithFriends"
          onPress={() => setShowModal(true)}
        />
        <GameModeContainer
          title="Play Solo"
          imageSrc={require("../assets/images/play-solo.png")}
          labelSide="right"
          href="/"
        />
        <GameModeContainer
          title="Play Online"
          imageSrc={require("../assets/images/play-online-adjusted.png")}
          labelSide="left"
          href="/"
        />

        {/* ⬇️ Copyright abajo */}
        <View className="items-center pb-4">
          <CopyRight />
        </View>
      </View>
    </SafeAreaView>
  );
}
