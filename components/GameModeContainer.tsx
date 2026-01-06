import React from "react";
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
  imageSrc: ImageSourcePropType; // require(...) o { uri: "..." }
  href: string; // a dónde navegar
  labelSide?: "left" | "right"; // default: left
  heightClassName?: string; // default: "h-56"
};

export default function GameModeContainer({
  title,
  imageSrc,
  href,
  labelSide = "left",
  heightClassName = "h-52",
}: Props) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(href as any)}
      className="w-full active:opacity-90"
    >
      <View className=" w-full overflow-hidden relative">
        <Image
          source={imageSrc}
          className={`w-full ${heightClassName}  mb-0`}
          resizeMode="cover"
        //   style={{
        //     transform: [{ translateY: 20 }],
        //   }}
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
