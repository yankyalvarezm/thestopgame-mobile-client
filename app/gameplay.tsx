import {
  Text,
  View,
  SafeAreaView,
  Pressable,
  Animated,
  ScrollView,
  Alert,
  BackHandler,
} from "react-native";
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import TheStopGameTitle from "@/components/TheStopGameTitle";
import CarruselValidation from "@/components/CarruselValidation";
import { finishRound, startRound } from "@/services/round.service";
import { abandonMatch, createNextRound } from "@/services/match.service";
import { Ionicons } from "@expo/vector-icons";

const POINTS_PER_CORRECT_ANSWER = 10;

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
  matchRoundsSummary?: MatchRoundSummary[];
  result: {
    didWin: boolean | null;
    isFinalRound: boolean;
    roundPoints: number;
    totalPoints: number;
    winningPoints: number;
    roundWinningPoints: number;
    matchWinningPoints: number;
    maxPossiblePoints: number;
    winRule?: {
      difficulty: string;
      threshold: number;
      percent: number;
    };
  };
};
type MatchRoundSummary = {
  roundId: string;
  roundNumber: number;
  letter: string;
  status: string;
  points: number;
  correctAnswers: number;
  totalAnswers: number;
  answerResults: RoundSummary["answerResults"];
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
  const [latestResult, setLatestResult] = useState<RoundSummary["result"] | null>(
    null
  );
  const [validation, setValidation] = useState<Record<string, ValidationState>>(
    {}
  );
  const summaryAnim = useRef(new Animated.Value(0)).current;
  const resultIconAnim = useRef(new Animated.Value(0)).current;
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
  const initialWinRule = getClientWinRule(
    (difficulty || "medium").toString(),
    roundState.maxDuration
  );
  const maxPossiblePoints =
    totalRounds * Math.max(categories.length, 1) * POINTS_PER_CORRECT_ANSWER;
  const pointsNeeded =
    latestResult?.matchWinningPoints ||
    Math.ceil(maxPossiblePoints * initialWinRule.threshold);
  const currentTotalPoints = latestResult?.totalPoints || 0;
  const progressPercent = Math.min(
    100,
    Math.round((currentTotalPoints / pointsNeeded) * 100)
  );
  const isTimeUp =
    phase === "playing" && roundState.maxDuration > 0 && remainingSeconds <= 0;
  const isFinalRound = roundState.roundNumber >= totalRounds;

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

  const handleExitGame = useCallback(() => {
    if (phase === "summary" && isFinalRound) {
      router.replace("/gameModes");
      return;
    }

    Alert.alert(
      "Leave this game?",
      "If you leave now, this match will be cancelled and your round progress will be lost.",
      [
        { text: "Stay", style: "cancel" },
        {
          text: "Leave",
          style: "destructive",
          onPress: async () => {
            setRoundFinished(true);

            if (matchId) {
              const response = await abandonMatch(matchId);
              if (!response?.success) {
                console.warn("abandonMatch failed:", response?.message);
              }
            }

            router.replace("/gameModes");
          },
        },
      ]
    );
  }, [isFinalRound, matchId, phase, router]);

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          handleExitGame();
          return true;
        }
      );

      return () => subscription.remove();
    }, [handleExitGame])
  );

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
    finishRound(
      roundState.id,
      "completed",
      buildAnswersPayload(answers, categories)
    ).then((response) => {
      if (!response?.success) {
        console.warn("finishRound failed:", response?.message);
      }
      if (response?.data) {
        setSummary({
          answerResults: response.data.answerResults || [],
          matchRoundsSummary: response.data.matchRoundsSummary || [],
          result: response.data.result,
        });
        setLatestResult(response.data.result);
      }
      setPhase("summary");
    });
  }, [answers, categories, isTimeUp, roundFinished, roundState.id]);

  const handleStopRound = async () => {
    if (!roundState.id || roundFinished || phase !== "playing") return;

    setRoundFinished(true);
    const response = await finishRound(
      roundState.id,
      "stopped",
      buildAnswersPayload(answers, categories)
    );

    if (!response?.success) {
      console.warn("stopRound failed:", response?.message);
      setRoundFinished(false);
      return;
    }

    if (response?.data) {
      setSummary({
        answerResults: response.data.answerResults || [],
        matchRoundsSummary: response.data.matchRoundsSummary || [],
        result: response.data.result,
      });
      setLatestResult(response.data.result);
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
      resultIconAnim.setValue(0);
      return;
    }

    Animated.parallel([
      Animated.spring(summaryAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 8,
        tension: 60,
      }),
      Animated.sequence([
        Animated.timing(resultIconAnim, {
          toValue: 0.35,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.spring(resultIconAnim, {
          toValue: 1,
          useNativeDriver: true,
          friction: 4,
          tension: 90,
        }),
      ]),
    ]).start();
  }, [phase, resultIconAnim, summaryAnim]);

  if (phase === "summary") {
    const answerResults = summary?.answerResults || [];
    const result = summary?.result;
    const matchRoundsSummary = summary?.matchRoundsSummary || [];
    const finalDidWin = result?.isFinalRound ? !!result.didWin : null;
    const summaryTitle = result?.isFinalRound
      ? finalDidWin
        ? "You won!"
        : "You lost"
      : `Round ${roundState.roundNumber} complete`;
    const summarySubtitle = result?.isFinalRound
      ? finalDidWin
        ? "You reached the final target."
        : "You needed a few more points."
      : "Your points are saved. Keep going.";
    const accentColor =
      finalDidWin === null
      ? "#111827"
      : finalDidWin
      ? "#16A34A"
      : "#E81D1D";
    const panelBackground =
      finalDidWin === null
        ? "#FFFFFF"
        : finalDidWin
        ? "#DCFCE7"
        : "#FEE2E2";
    const panelBorder =
      finalDidWin === null
        ? "#E5E7EB"
        : finalDidWin
        ? "#86EFAC"
        : "#FCA5A5";
    const finalProgressPercent = result
      ? Math.min(
          100,
          Math.round((result.totalPoints / result.matchWinningPoints) * 100)
        )
      : 0;

    return (
      <SafeAreaView
        className="flex-1"
        style={{ backgroundColor: result?.isFinalRound ? panelBackground : "#F7F7F4" }}
      >
        <View className="flex-1 px-6">
          <View className="items-center pt-4">
            <TheStopGameTitle />
          </View>

          <ScrollView
            className="flex-1"
            contentContainerClassName="pb-4"
            showsVerticalScrollIndicator={false}
          >
            <Animated.View
              className="mt-8 rounded-2xl bg-white p-5"
              style={{
                opacity: summaryAnim,
                borderWidth: result?.isFinalRound ? 1.5 : 1,
                borderColor: result?.isFinalRound ? panelBorder : "#E5E7EB",
                backgroundColor: result?.isFinalRound ? panelBackground : "#FFFFFF",
                shadowColor: accentColor,
                shadowOffset: { width: 0, height: 18 },
                shadowOpacity: result?.isFinalRound ? 0.2 : 0.08,
                shadowRadius: 26,
                elevation: result?.isFinalRound ? 6 : 3,
                transform: [
                  {
                    translateY: summaryAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [28, 0],
                    }),
                  },
                  {
                    scale: summaryAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.92, 1],
                    }),
                  },
                ],
              }}
            >
              <View className="flex-row items-center gap-4">
                <Animated.View
                  className="h-16 w-16 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: `${accentColor}18`,
                    transform: [
                      {
                        scale: resultIconAnim.interpolate({
                          inputRange: [0, 0.35, 1],
                          outputRange: [0.4, 1.25, 1],
                        }),
                      },
                      {
                        rotate: resultIconAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ["-12deg", "0deg"],
                        }),
                      },
                    ],
                  }}
                >
                  <Ionicons
                    name={
                      finalDidWin === null
                        ? "flag-outline"
                        : finalDidWin
                        ? "trophy"
                        : "close-circle"
                    }
                    size={34}
                    color={accentColor}
                  />
                </Animated.View>
                <View className="flex-1">
                  <Text className="text-xs font-light uppercase text-gray-500">
                    {result?.isFinalRound
                      ? "Final result"
                      : `Round ${roundState.roundNumber} summary`}
                  </Text>
                  <Text
                    className="mt-1 text-3xl font-light"
                    style={{ color: accentColor }}
                  >
                    {summaryTitle}
                  </Text>
                  <Text className="mt-1 text-sm font-light text-gray-500">
                    {summarySubtitle}
                  </Text>
                </View>
              </View>

              <View className="mt-6 rounded-2xl bg-[#F7F7F4] p-4">
                <View className="flex-row justify-between">
                  <View>
                    <Text className="text-xs font-light uppercase text-gray-500">
                      Round points
                    </Text>
                    <Text className="mt-1 text-2xl font-light text-black">
                      +{result?.roundPoints || 0}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-xs font-light uppercase text-gray-500">
                      Total target
                    </Text>
                    <Text className="mt-1 text-2xl font-light text-black">
                      {result
                        ? `${result.totalPoints}/${result.matchWinningPoints}`
                        : "--"}
                    </Text>
                  </View>
                </View>
                {result && (
                  <View className="mt-4 h-2 overflow-hidden rounded-full bg-white">
                    <View
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round(
                            (result.totalPoints / result.matchWinningPoints) *
                              100
                          )
                        )}%`,
                        backgroundColor: accentColor,
                      }}
                    />
                  </View>
                )}
                {result?.winRule && (
                  <Text className="mt-3 text-xs font-light text-gray-500">
                    You need {result.matchWinningPoints} points to win.{" "}
                    {capitalize(result.winRule.difficulty)} target is{" "}
                    {result.winRule.percent}% of the possible points.
                  </Text>
                )}
              </View>

              {result?.isFinalRound && (
                <View className="mt-5 rounded-2xl bg-white/80 p-4">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-xs font-light uppercase text-gray-500">
                      Match progress
                    </Text>
                    <Text className="text-sm font-semibold text-black">
                      {finalProgressPercent}%
                    </Text>
                  </View>
                  <View className="mt-3 h-3 overflow-hidden rounded-full bg-white">
                    <View
                      className="h-full rounded-full"
                      style={{
                        width: `${finalProgressPercent}%`,
                        backgroundColor: accentColor,
                      }}
                    />
                  </View>
                  <View className="mt-4 flex-row justify-between">
                    <View>
                      <Text className="text-xs font-light uppercase text-gray-500">
                        Your points
                      </Text>
                      <Text className="text-2xl font-light text-black">
                        {result.totalPoints}
                      </Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-xs font-light uppercase text-gray-500">
                        Needed
                      </Text>
                      <Text className="text-2xl font-light text-black">
                        {result.matchWinningPoints}
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {result?.isFinalRound && matchRoundsSummary.length > 0 && (
                <View className="mt-5 gap-3">
                  <Text className="text-xs font-light uppercase text-gray-500">
                    Rounds recap
                  </Text>
                  {matchRoundsSummary.map((round) => {
                    const roundPercent = round.totalAnswers
                      ? Math.round(
                          (round.correctAnswers / round.totalAnswers) * 100
                        )
                      : 0;
                    const roundGood = round.correctAnswers > 0;

                    return (
                      <View
                        key={round.roundId}
                        className={`rounded-xl border px-4 py-3 ${
                          roundGood
                            ? "border-green-200 bg-green-50"
                            : "border-red/30 bg-red-50"
                        }`}
                      >
                        <View className="flex-row items-center justify-between gap-3">
                          <View>
                            <Text className="text-xs font-light uppercase text-gray-500">
                              Round {round.roundNumber} · Letter{" "}
                              {round.letter.toUpperCase()}
                            </Text>
                            <Text className="mt-1 text-lg font-light text-black">
                              {round.correctAnswers} correct of{" "}
                              {round.totalAnswers}
                            </Text>
                          </View>
                          <Text
                            className={`text-base font-semibold ${
                              roundGood ? "text-green-700" : "text-red"
                            }`}
                          >
                            +{round.points}
                          </Text>
                        </View>
                        <View className="mt-3 h-2 overflow-hidden rounded-full bg-white">
                          <View
                            className="h-full rounded-full"
                            style={{
                              width: `${roundPercent}%`,
                              backgroundColor: roundGood
                                ? "#16A34A"
                                : "#E81D1D",
                            }}
                          />
                        </View>
                      </View>
                    );
                  })}
                </View>
              )}

              {!result?.isFinalRound && (
                <View className="mt-5 gap-3">
                  {(answerResults.length ? answerResults : categories).map((category) => {
                    const categoryName =
                      "categoryName" in category
                        ? category.categoryName
                        : category.name;
                    const answer =
                      "answer" in category
                        ? category.answer?.trim() || "No answer"
                        : answers[category.name]?.trim() || "No answer";
                    const isCorrect =
                      "isCorrect" in category
                        ? category.isCorrect
                        : validation[category.name] === "correct";
                    const points = "points" in category ? category.points : 0;
                    const cardClasses = isCorrect
                      ? "border-green-300 bg-green-50"
                      : "border-red/30 bg-red-50";
                    const pointsClasses = isCorrect
                      ? "text-green-700"
                      : "text-red";

                    return (
                      <View
                        key={categoryName}
                        className={`rounded-xl border px-4 py-3 ${cardClasses}`}
                      >
                        <View className="flex-row items-center justify-between gap-3">
                          <Text className="text-xs font-light uppercase text-gray-500">
                            {category.label}
                          </Text>
                          <Text
                            className={`text-sm font-semibold ${pointsClasses}`}
                          >
                            {isCorrect ? `+${points}` : "+0"}
                          </Text>
                        </View>
                        <Text className="mt-1 text-lg font-light text-black">
                          {answer}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              )}
            </Animated.View>
          </ScrollView>

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
        <Pressable
          onPress={handleExitGame}
          className="absolute right-5 top-16 z-10 rounded-full bg-black/5 px-4 py-2"
        >
          <Text className="text-xs font-light uppercase text-gray-500">
            Exit
          </Text>
        </Pressable>
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
      <Pressable
        onPress={handleExitGame}
        className="absolute right-5 top-16 z-10 rounded-full bg-black/5 px-4 py-2"
      >
        <Text className="text-xs font-light uppercase text-gray-500">Exit</Text>
      </Pressable>

      {/* CONTENT */}
      <View className="flex-1 w-full">
        <View className="flex-row justify-between w-full px-6 mt-10">
          <Text className="text-black font-roboto text-3xl">{timerLabel}</Text>
          <Text className="text-black font-roboto text-3xl">
            {roundState.roundNumber} | {totalRounds}
          </Text>
        </View>

        <View className="mx-6 mt-4 rounded-2xl bg-[#F7F7F4] px-4 py-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-xs font-light uppercase text-gray-500">
              Points needed
            </Text>
            <Text className="text-sm font-semibold text-black">
              {currentTotalPoints}/{pointsNeeded} · {progressPercent}%
            </Text>
          </View>
          <View className="mt-2 h-2 overflow-hidden rounded-full bg-white">
            <View
              className="h-full rounded-full bg-black"
              style={{ width: `${progressPercent}%` }}
            />
          </View>
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

function buildAnswersPayload(
  answers: Record<string, string>,
  categories: { name: string }[]
) {
  return categories.map((category) => ({
    categoryName: category.name,
    answer: answers[category.name] || "",
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

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function getClientWinRule(difficulty: string, maxDuration: number) {
  const rules = {
    easy: { baseThreshold: 0.5, minThreshold: 0.4, maxThreshold: 0.65 },
    medium: { baseThreshold: 0.7, minThreshold: 0.55, maxThreshold: 0.8 },
    hard: { baseThreshold: 0.85, minThreshold: 0.7, maxThreshold: 0.9 },
  };
  const rule = rules[difficulty as keyof typeof rules] || rules.medium;
  const threshold = clamp(
    rule.baseThreshold + getTimerThresholdModifier(maxDuration),
    rule.minThreshold,
    rule.maxThreshold
  );

  return {
    threshold,
    percent: Math.round(threshold * 100),
  };
}

function getTimerThresholdModifier(maxDuration: number) {
  if (!maxDuration || maxDuration > 1000000) return 0.1;
  if (maxDuration >= 90) return 0.05;
  if (maxDuration >= 60) return 0;
  if (maxDuration >= 30) return -0.05;
  if (maxDuration >= 20) return -0.1;
  return -0.15;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
