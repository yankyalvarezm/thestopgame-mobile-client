import { Text, View, SafeAreaView, Pressable, Animated } from "react-native";
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import TheStopGameTitle from "@/components/TheStopGameTitle";
import CarruselValidation from "@/components/CarruselValidation";
import { finishRound, startRound } from "@/services/round.service";
import { createNextRound } from "@/services/match.service";

type GameplayPhase = "countdown" | "shuffle" | "playing" | "summary";
type ValidationState = "idle" | "checking" | "correct" | "incorrect";
type RoundState = {
  id: string;
  roundNumber: number;
  letter: string;
  maxDuration: number;
  startedAt?: string;
};
type RoundSummary = {
  answerResults: {
    categoryName: string;
    label: string;
    answer: string;
    isCorrect: boolean;
    points: number;
  }[];
  result: {
    didWin: boolean;
    isFinalRound: boolean;
    roundPoints: number;
    totalPoints: number;
    winningPoints: number;
    roundWinningPoints: number;
    matchWinningPoints: number;
    maxPossiblePoints: number;
  };
};

export default function Gameplay() {
  const router = useRouter();
  const {
    matchId,
    roundId,
    currentRound,
    currentLetter,
    roundStartedAt,
    roundMaxDuration,
    language,
    setlistCategories,
    gameMode,
    selistName,
    setlistId,
    difficulty,
    rounds,
    timer,
  } =
    useLocalSearchParams<{
      matchId?: string;
      roundId?: string;
      currentRound?: string;
      currentLetter?: string;
      roundStartedAt?: string;
      roundMaxDuration?: string;
      language?: string;
      setlistCategories?: string;
      gameMode?: string;
      selistName?: string;
      setlistId?: string;
      difficulty?: string;
      rounds?: string;
      timer?: string;
    }>();
  const [activeIndex, setActiveIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState<GameplayPhase>("countdown");
  const [countdown, setCountdown] = useState(3);
  const [displayedLetter, setDisplayedLetter] = useState("?");
  const [roundFinished, setRoundFinished] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [summary, setSummary] = useState<RoundSummary | null>(null);
  const [validation, setValidation] = useState<Record<string, ValidationState>>(
    {}
  );
  const summaryAnim = useRef(new Animated.Value(0)).current;
  const [roundState, setRoundState] = useState<RoundState>({
    id: roundId || "",
    roundNumber: Number(currentRound || 1),
    letter: currentLetter || "l",
    maxDuration: Number(roundMaxDuration || timer || 0),
    startedAt: roundStartedAt,
  });
  const categories = useMemo(
    () =>
      parseJsonArray<{ name: string; label?: string }>(setlistCategories).map((category) => ({
        name: category.name,
        label: category.label || formatCategoryName(category.name),
      })),
    [setlistCategories]
  );
  const totalRounds = Number(rounds || 3);
  const remainingSeconds = useRoundTimer(
    phase === "playing" ? roundState.startedAt : undefined,
    roundState.maxDuration
  );
  const timerLabel = formatTimer(remainingSeconds);
  const isTimeUp =
    phase === "playing" && roundState.maxDuration > 0 && remainingSeconds <= 0;
  const isFinalRound = roundState.roundNumber >= totalRounds;

  useEffect(() => {
    console.log("matchId--->>>>", matchId);
    console.log("roundId--->>>>", roundId);
    console.log("setlistId--->>>>", setlistId);
    console.log("selistName--->>>>", selistName);
    console.log("gameMode--->>>>", gameMode);
    console.log("difficulty--->>>>", difficulty);
    console.log("language--->>>>", language);
    console.log("rounds--->>>>", rounds);
    console.log("timer--->>>>", timer);
  }, [matchId, roundId, setlistId, selistName, gameMode, difficulty, language, rounds, timer]);

  const resetRoundUi = useCallback((nextRound: RoundState) => {
    setRoundState(nextRound);
    setPhase("countdown");
    setCountdown(3);
    setDisplayedLetter("?");
    setRoundFinished(false);
    setAnswers({});
    setSummary(null);
    setValidation({});
    setActiveIndex(0);
  }, []);

  useEffect(() => {
    if (phase !== "countdown") return;

    setCountdown(3);
    const timers = [3, 2, 1].map((value, index) =>
      setTimeout(() => {
        setCountdown(value);
      }, index * 900)
    );

    const shuffleTimer = setTimeout(() => {
      setPhase("shuffle");
    }, 2700);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(shuffleTimer);
    };
  }, [phase, roundState.id]);

  useEffect(() => {
    if (phase !== "shuffle") return;

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    let index = 0;

    const interval = setInterval(() => {
      setDisplayedLetter(alphabet[index % alphabet.length]);
      index += 1;
    }, 55);

    const revealTimer = setTimeout(async () => {
      clearInterval(interval);
      setDisplayedLetter(roundState.letter.toUpperCase());

      if (!roundState.id) return;

      const response = await startRound(roundState.id);

      if (response?.success) {
        setRoundState((current) => ({
          ...current,
          startedAt: response.data.round.started_at,
        }));
        setPhase("playing");
      } else {
        console.warn("startRound failed:", response?.message);
      }
    }, 1700);

    return () => {
      clearInterval(interval);
      clearTimeout(revealTimer);
    };
  }, [phase, roundState.id, roundState.letter]);

  useEffect(() => {
    if (!roundState.id || !isTimeUp || roundFinished) return;

    setRoundFinished(true);
    finishRound(roundState.id, "completed", buildAnswersPayload(answers)).then((response) => {
      if (!response?.success) {
        console.warn("finishRound failed:", response?.message);
      }
      if (response?.data) {
        setSummary({
          answerResults: response.data.answerResults || [],
          result: response.data.result,
        });
      }
      setPhase("summary");
    });
  }, [answers, isTimeUp, roundFinished, roundState.id]);

  const handleStopRound = async () => {
    if (!roundState.id || roundFinished || phase !== "playing") return;

    setRoundFinished(true);
    const response = await finishRound(
      roundState.id,
      "stopped",
      buildAnswersPayload(answers)
    );

    if (!response?.success) {
      console.warn("stopRound failed:", response?.message);
      setRoundFinished(false);
      return;
    }

    if (response?.data) {
      setSummary({
        answerResults: response.data.answerResults || [],
        result: response.data.result,
      });
    }
    setPhase("summary");
  };

  const handleStartNextRound = async () => {
    if (!matchId || isFinalRound) return;

    const response = await createNextRound(matchId, roundState.maxDuration);

    if (!response?.success) {
      console.warn("createNextRound failed:", response?.message);
      return;
    }

    const nextRound = response.data.currentRound;

    resetRoundUi({
      id: nextRound.id,
      roundNumber: nextRound.round_number,
      letter: nextRound.letter,
      maxDuration: nextRound.round_duration.max_duration,
      startedAt: nextRound.started_at,
    });
  };

  useEffect(() => {
    if (phase !== "summary") {
      summaryAnim.setValue(0);
      return;
    }

    Animated.spring(summaryAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
      tension: 60,
    }).start();
  }, [phase, summaryAnim]);

  if (phase === "summary") {
    const answerResults = summary?.answerResults || [];
    const result = summary?.result;

    return (
      <SafeAreaView className="flex-1 bg-[#F7F7F4]">
        <View className="flex-1 px-6">
          <View className="items-center pt-4">
            <TheStopGameTitle />
          </View>

          <Animated.View
            className="mt-10 rounded-2xl bg-white p-5"
            style={{
              opacity: summaryAnim,
              transform: [
                {
                  translateY: summaryAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [24, 0],
                  }),
                },
                {
                  scale: summaryAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.96, 1],
                  }),
                },
              ],
            }}
          >
            <Text className="text-xs font-light uppercase text-gray-500">
              Round {roundState.roundNumber} summary
            </Text>
            <Text
              className={`mt-1 text-3xl font-light ${
                result?.didWin ? "text-green-600" : "text-red"
              }`}
            >
              {result?.didWin ? "You won" : "You lost"}
            </Text>
            <Text className="mt-2 text-base font-light text-gray-600">
              {result
                ? `${result.totalPoints} total pts · ${result.winningPoints} needed`
                : "Calculating points..."}
            </Text>

            <View className="mt-5 gap-3">
              {(answerResults.length ? answerResults : categories).map((category) => {
                const categoryName = "categoryName" in category ? category.categoryName : category.name;
                const answer =
                  "answer" in category
                    ? category.answer?.trim() || "No answer"
                    : answers[category.name]?.trim() || "No answer";
                const isCorrect =
                  "isCorrect" in category
                    ? category.isCorrect
                    : validation[category.name] === "correct";
                const points = "points" in category ? category.points : 0;
                return (
                  <View
                    key={categoryName}
                    className="rounded-xl border border-gray-200 bg-[#F7F7F4] px-4 py-3"
                  >
                    <Text className="text-xs font-light uppercase text-gray-500">
                      {category.label}
                    </Text>
                    <View className="mt-1 flex-row items-center justify-between gap-3">
                      <Text className="flex-1 text-lg font-light text-black">
                        {answer}
                      </Text>
                      <Text
                        className={`text-sm font-medium ${
                          isCorrect
                            ? "text-green-600"
                            : "text-red"
                        }`}
                      >
                        {isCorrect ? `+${points}` : "+0"}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </Animated.View>

          <View className="mt-auto pb-6 pt-4">
            {!isFinalRound ? (
              <Pressable
                onPress={handleStartNextRound}
                className="rounded-lg bg-black py-4 active:opacity-80"
              >
                <Text className="text-center text-lg font-medium text-white">
                  Start Next Round
                </Text>
              </Pressable>
            ) : (
              <View className="gap-3">
                <Pressable
                  onPress={() => router.replace("/gameModes")}
                  className="rounded-lg bg-black py-4 active:opacity-80"
                >
                  <Text className="text-center text-lg font-medium text-white">
                    Game Modes
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() =>
                    router.replace({
                      pathname: "/categories",
                      params: { gameMode: gameMode || "solo" },
                    })
                  }
                  className="rounded-lg border border-black py-4 active:opacity-80"
                >
                  <Text className="text-center text-lg font-medium text-black">
                    Play Again
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (phase === "countdown" || phase === "shuffle") {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-xl font-light text-gray-600">
            Round {roundState.roundNumber} starts in
          </Text>
          <Text className="mt-4 text-7xl font-light text-black">
            {phase === "countdown" ? countdown : "Go"}
          </Text>

          <View className="mt-10 w-full rounded-xl bg-red p-8">
            <Text className="text-center text-6xl font-bold text-white">
              {displayedLetter}
            </Text>
          </View>

          {phase === "shuffle" && (
            <Text className="mt-6 text-center text-base font-light text-gray-500">
              Choosing your letter...
            </Text>
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* HEADER */}
      <View className="items-center pt-4">
        <TheStopGameTitle />
      </View>

      {/* CONTENT */}
      <View className="flex-1 w-full">
        <View className="flex-row justify-between w-full px-6 mt-10">
          <Text className="text-black font-roboto text-3xl">{timerLabel}</Text>
          <Text className="text-black font-roboto text-3xl">
            {roundState.roundNumber} | {totalRounds}
          </Text>
        </View>

        <View className="bg-red rounded-lg mt-4 w-[90%] self-center items-center justify-center">
          <Text className="text-white font-montserrat-extrabold text-3xl p-4">
            {displayedLetter}
          </Text>
        </View>

        <View className="h-[3px] bg-black w-[80%] mt-4 rounded-full self-center" />

        <Text className="text-black font-roboto-normal text-1xl text-center my-4">
          Prompt Message
        </Text>

        <View className="flex-1 w-full">
          <CarruselValidation
            items={categories}
            letter={roundState.letter}
            language={language}
            disabled={roundFinished}
            onAnswersChange={(nextAnswers, nextValidation) => {
              setAnswers(nextAnswers);
              setValidation(nextValidation);
            }}
            onIndexChange={setActiveIndex}
            onCount={setCount}
          />
          <View className="flex-row justify-center items-center mt-3">
            {Array.from({ length: count }).map((_, i) => (
              <View
                key={i}
                style={{
                  width: i === activeIndex ? 8 : 8,
                  height: i === activeIndex ? 8 : 8,
                  borderRadius: 999,
                  borderWidth: 0.5,
                  marginHorizontal: 4,
                  borderColor: "black",
                  backgroundColor: i === activeIndex ? "black" : "white",
                }}
              />
            ))}
          </View>
        </View>
      </View>

      {/* FOOTER */}
      <View className="pb-4 items-center">
        <Pressable
          onPress={handleStopRound}
          disabled={roundFinished}
          className={`bg-red rounded-lg p-4 w-[90%] items-center justify-center ${
            roundFinished ? "opacity-60" : ""
          }`}
        >
          <Text className="text-white font-montserrat-bold text-2xl">
            {isTimeUp ? "Time's Up" : "Stop"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function buildAnswersPayload(answers: Record<string, string>) {
  return Object.entries(answers).map(([categoryName, answer]) => ({
    categoryName,
    answer,
  }));
}

function useRoundTimer(startedAt?: string, maxDuration = 0) {
  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    getRemainingSeconds(startedAt, maxDuration)
  );

  useEffect(() => {
    setRemainingSeconds(getRemainingSeconds(startedAt, maxDuration));

    if (!startedAt || maxDuration <= 0) return;

    const interval = setInterval(() => {
      setRemainingSeconds(getRemainingSeconds(startedAt, maxDuration));
    }, 1000);

    return () => clearInterval(interval);
  }, [startedAt, maxDuration]);

  return remainingSeconds;
}

function getRemainingSeconds(startedAt?: string, maxDuration = 0) {
  if (!startedAt || maxDuration <= 0) return maxDuration;

  const startedTime = new Date(startedAt).getTime();
  if (Number.isNaN(startedTime)) return maxDuration;

  const elapsed = Math.floor((Date.now() - startedTime) / 1000);
  return Math.max(0, maxDuration - elapsed);
}

function formatTimer(seconds: number) {
  if (seconds > 1000000) return "No limit";

  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60);
  const remaining = safeSeconds % 60;

  return `${minutes}:${remaining.toString().padStart(2, "0")}`;
}

function parseJsonArray<T>(value?: string): T[] {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function formatCategoryName(name: string) {
  const cleaned = name.replace(/s$/, "");
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}
