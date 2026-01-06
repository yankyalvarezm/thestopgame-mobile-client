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
  onPress?: () => void;
  labelSide?: "left" | "right";
  heightClassName?: string;
};

export default function GameModeContainer({
  title,
  imageSrc,
  href,
  onPress,
  labelSide = "left",
  heightClassName = "h-52",
}: Props) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) return onPress();
    if (href) return router.push(href as any);
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
