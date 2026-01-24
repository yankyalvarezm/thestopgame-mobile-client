import React, { useMemo, useEffect } from "react";
import { View, Text, TextInput, ScrollView, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = Math.round(width * 0.86);
const GAP = 12;
const SIDE_PEEK = (width - CARD_WIDTH) / 2;
const SNAP = CARD_WIDTH + GAP;

type Props = {
  onIndexChange?: (i: number) => void;
  onCount?: (n: number) => void;
};

export default function CarruselValidation({ onIndexChange, onCount }: Props) {
  const items = useMemo(() => ["Country", "Sport", "City", "Profession"], []);

  useEffect(() => {
    onCount?.(items.length);
  }, [items.length, onCount]);

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        disableIntervalMomentum
        snapToInterval={SNAP}
        snapToAlignment="start"
        bounces={false}
        contentContainerStyle={{ paddingHorizontal: SIDE_PEEK }}
        onMomentumScrollEnd={(e) => {
          const x = e.nativeEvent.contentOffset.x;
          const index = Math.round(x / SNAP);
          onIndexChange?.(Math.max(0, Math.min(index, items.length - 1)));
        }}
      >
        {items.map((item, index) => (
          <View
            key={`${item}-${index}`}
            style={{
              width: CARD_WIDTH,
              marginRight: index === items.length - 1 ? 0 : GAP,
            }}
          >
            <View
              className="bg-grey rounded-lg"
              style={{ borderWidth: 1, borderColor: "black" }}
            >
              <Text className="text-black text-center p-4 text-lg">{item}</Text>
            </View>

            <TextInput
              placeholder="Enter your answer"
              placeholderTextColor="#9CA3AF"
              className="text-black text-center p-4 rounded-lg h-[80px] mt-4"
              style={{ borderWidth: 1, borderColor: "black" }}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}