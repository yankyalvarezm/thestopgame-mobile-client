import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  ImageSourcePropType,
} from "react-native";
import { useRouter } from "expo-router";

type Props = {
  title: string;
  imageSrc: ImageSourcePropType;
  href: string;
  gameMode: "solo" | "online" | "friends";
  onSelectGameMode?: (mode: string) => void;
  onPress?: () => void;
  labelSide?: "left" | "right";
  heightClassName?: string;
};

export default function GameModeContainer({
  title,
  imageSrc,
  href,
  onPress,
  gameMode,
  onSelectGameMode,
  labelSide = "left",
  heightClassName = "h-52",
}: Props) {
  const router = useRouter();

  const handlePress = () => {
    onSelectGameMode?.(gameMode);

    if (onPress) return onPress();

    if (href) {
      return router.push({
        pathname: href as any,
        params: { gameMode },
      } as any);
    }

    console.log("Pressed:", title);
  };

  return (
    <Pressable onPress={handlePress} className="w-full active:opacity-90">
      <View className=" w-full overflow-hidden relative">
        <Image
          source={imageSrc}
          className={`w-full ${heightClassName}  mb-0`}
          resizeMode="cover"
        />

        <View className={`absolute bottom-10 ${labelSide}-0`}>
          <Text className="bg-red text-white text-2xl font-light px-4 py-2">
            {title}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
