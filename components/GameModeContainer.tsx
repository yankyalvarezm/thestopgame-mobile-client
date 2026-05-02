import React from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  ImageSourcePropType,
  ImageResizeMode,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  title: string;
  href: string;
  imageSrc: ImageSourcePropType;
  gameMode: "solo" | "online" | "friends";
  onSelectGameMode?: (mode: string) => void;
  onPress?: () => void;
  disabled?: boolean;
  badgeText?: string;
};

const modeStyles = {
  friends: {
    icon: "people",
    eyebrow: "Crew mode",
    description: "Create a room and invite your people.",
    accent: "#F5C125",
    resizeMode: "cover",
    imageScale: 1,
  },
  solo: {
    icon: "sparkles",
    eyebrow: "Solo run",
    description: "Practice categories at your pace.",
    accent: "#57C96B",
    resizeMode: "cover",
    imageScale: 1,
  },
  online: {
    icon: "globe-outline",
    eyebrow: "Online table",
    description: "Find a match and jump into a round.",
    accent: "#E81D1D",
    resizeMode: "contain",
    imageScale: 0.92,
  },
} satisfies Record<
  Props["gameMode"],
  {
    icon: keyof typeof Ionicons.glyphMap;
    eyebrow: string;
    description: string;
    accent: string;
    resizeMode: ImageResizeMode;
    imageScale: number;
  }
>;

export default function GameModeContainer({
  title,
  href,
  imageSrc,
  onPress,
  gameMode,
  onSelectGameMode,
  disabled = false,
  badgeText = "Coming soon",
}: Props) {
  const router = useRouter();
  const { height, width } = useWindowDimensions();
  const style = modeStyles[gameMode];
  const cardHeight = Math.min(240, Math.max(178, height * 0.22));
  const titleSize = width > 390 ? 30 : 27;

  const handlePress = () => {
    if (disabled) return;

    onSelectGameMode?.(gameMode);

    if (onPress) return onPress();

    if (href) {
      return router.push({
        pathname: href as any,
        params: { gameMode },
      } as any);
    }

    return null;
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      className={`w-full ${disabled ? "" : "active:opacity-90"}`}
    >
      <View
        className="mx-4 overflow-hidden rounded-xl bg-white"
        style={{
          height: cardHeight,
          shadowColor: "#111827",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.14,
          shadowRadius: 20,
          elevation: 5,
        }}
      >
        <View className="absolute inset-0 bg-black">
          <Image
            source={imageSrc}
            className="h-full w-full"
            style={{ transform: [{ scale: style.imageScale }] }}
            resizeMode={style.resizeMode}
          />
        </View>

        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: disabled ? "rgba(0,0,0,0.66)" : "rgba(0,0,0,0.46)" },
          ]}
        />
        {disabled && (
          <View className="absolute right-4 top-4 rounded-full bg-white/95 px-3 py-1.5">
            <Text className="text-xs font-medium uppercase text-black">
              {badgeText}
            </Text>
          </View>
        )}
        <View className="absolute bottom-0 left-0 right-0 px-4 py-4">
          <View className="flex-row items-end justify-between gap-3">
            <View className="flex-1">
              <View
                className="mb-2 self-start rounded-full px-2.5 py-1"
                style={{ backgroundColor: style.accent }}
              >
                <Text className="text-[11px] font-light uppercase text-white">
                  {style.eyebrow}
                </Text>
              </View>
              <Text
                className="font-light text-white"
                style={{ fontSize: titleSize, lineHeight: titleSize + 4 }}
              >
                {title}
              </Text>
              <Text className="mt-1 max-w-[260px] text-sm font-light leading-5 text-white/95">
                {disabled ? "This mode is almost ready." : style.description}
              </Text>
            </View>

            <View
              className="h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-white/95"
              style={{
                shadowColor: "#000",
                shadowOpacity: 0.12,
                shadowRadius: 8,
              }}
            >
              <Ionicons
                name={disabled ? "lock-closed-outline" : style.icon}
                size={22}
                color={disabled ? "#111827" : style.accent}
              />
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
