import React, { useMemo, useEffect, useState } from "react";
import { View, Text, TextInput, ScrollView, Dimensions } from "react-native";
import { validateCategoryAnswer } from "@/services/category.service";

const { width } = Dimensions.get("window");
const CARD_WIDTH = Math.round(width * 0.86);
const GAP = 12;
const SIDE_PEEK = (width - CARD_WIDTH) / 2;
const SNAP = CARD_WIDTH + GAP;

type Props = {
  items?: { name: string; label: string }[];
  letter?: string;
  language?: string;
  disabled?: boolean;
  onAnswersChange?: (
    answers: Record<string, string>,
    validation: Record<string, ValidationState>
  ) => void;
  onIndexChange?: (i: number) => void;
  onCount?: (n: number) => void;
};

type ValidationState = "idle" | "checking" | "correct" | "incorrect";

export default function CarruselValidation({
  items: providedItems,
  letter,
  language,
  disabled = false,
  onAnswersChange,
  onIndexChange,
  onCount,
}: Props) {
  const items = useMemo(
    () =>
      providedItems?.length
        ? providedItems
        : [
            { name: "countries", label: "Country" },
            { name: "sports", label: "Sport" },
            { name: "cities", label: "City" },
            { name: "professions", label: "Profession" },
          ],
    [providedItems]
  );
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [validation, setValidation] = useState<Record<string, ValidationState>>(
    {}
  );

  useEffect(() => {
    onCount?.(items.length);
  }, [items.length, onCount]);

  useEffect(() => {
    onAnswersChange?.(answers, validation);
  }, [answers, onAnswersChange, validation]);

  useEffect(() => {
    setAnswers({});
    setValidation({});
  }, [letter, language, items]);

  useEffect(() => {
    if (!letter || !language || disabled) return;

    const timers = items.map((item) => {
      const rawAnswer = answers[item.name] || "";
      const normalizedAnswer = normalizeAnswer(rawAnswer);

      if (!normalizedAnswer) {
        setValidation((current) => ({ ...current, [item.name]: "idle" }));
        return null;
      }

      setValidation((current) => ({ ...current, [item.name]: "checking" }));

      return setTimeout(async () => {
        const response = await validateCategoryAnswer({
          categoryName: item.name,
          language,
          letter,
          answer: rawAnswer,
        });

        setValidation((current) => ({
          ...current,
          [item.name]: response?.data?.isCorrect ? "correct" : "incorrect",
        }));
      }, 350);
    });

    return () => {
      timers.forEach((timer) => {
        if (timer) clearTimeout(timer);
      });
    };
  }, [answers, disabled, items, language, letter]);

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
        {items.map((item, index) => {
          const state = validation[item.name] || "idle";
          const inputStyle = getInputStyle(state);

          return (
          <View
            key={`${item.name}-${index}`}
            style={{
              width: CARD_WIDTH,
              marginRight: index === items.length - 1 ? 0 : GAP,
            }}
          >
            <View
              className="bg-grey rounded-lg"
              style={{ borderWidth: 1, borderColor: "black" }}
            >
              <Text className="text-black text-center p-4 text-lg">
                {item.label}
              </Text>
            </View>

            <TextInput
              placeholder="Enter your answer"
              placeholderTextColor="#9CA3AF"
              className="text-black text-center p-4 rounded-lg h-[80px] mt-4"
              editable={!disabled}
              value={answers[item.name] || ""}
              onChangeText={(value) =>
                setAnswers((current) => ({ ...current, [item.name]: value }))
              }
              autoCapitalize="words"
              autoCorrect={false}
              style={inputStyle}
            />
            {state === "checking" && (
              <Text className="mt-2 text-center text-xs text-gray-500">
                Checking...
              </Text>
            )}
          </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

function normalizeAnswer(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

function getInputStyle(state: ValidationState) {
  const palette = {
    idle: { backgroundColor: "white", borderColor: "black" },
    checking: { backgroundColor: "#F9FAFB", borderColor: "#9CA3AF" },
    correct: { backgroundColor: "#EAF8ED", borderColor: "#57C96B" },
    incorrect: { backgroundColor: "#FEE7E7", borderColor: "#E81D1D" },
  }[state];

  return {
    borderWidth: 1,
    borderColor: palette.borderColor,
    backgroundColor: palette.backgroundColor,
  };
}
