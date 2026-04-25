import { useCallback } from "react";
import { createMatch, startMatchSession } from "@/services/match.service";

type MatchType = "solo" | "friends" | "online";

type StartMatchParams = {
  rounds: number | string;
  gameMode: MatchType;
  setlistId: string;
  timer?: number | string;
  difficulty?: "easy" | "medium" | "hard";
  language?: string;
  allowJoiningWhilePlaying?: boolean;
  allowStopButton?: boolean;
  status?: "waiting" | "playing" | "finished";
  joinCode?: string;
};

export function useCreateMatch() {
  const startMatch = useCallback(
    async ({
      rounds,
      gameMode,
      setlistId,
      allowJoiningWhilePlaying = false,
      allowStopButton = true,
      status = "waiting",
      joinCode,
    }: StartMatchParams) => {
      if (!rounds || !gameMode || !setlistId) {
        return {
          success: false,
          message: "MISSING_REQUIRED_PARAMS",
        };
      }

      return await createMatch(
        Number(rounds),
        gameMode,
        setlistId,
        allowJoiningWhilePlaying,
        allowStopButton,
        status,
        joinCode
      );
    },
    []
  );

  return { startMatch };
}

export function useStartMatchSession() {
  const startSession = useCallback(
    async ({
      rounds,
      gameMode,
      setlistId,
      timer,
      difficulty,
      language,
      allowJoiningWhilePlaying = false,
      allowStopButton = true,
      joinCode,
    }: StartMatchParams) => {
      if (!rounds || !gameMode || !setlistId || !timer || !difficulty || !language) {
        return {
          success: false,
          message: "MISSING_REQUIRED_PARAMS",
        };
      }

      return await startMatchSession({
        rounds,
        matchType: gameMode,
        setlistId,
        timer,
        difficulty,
        language,
        allowJoiningWhilePlaying,
        allowStopButton,
        joinCode,
      });
    },
    []
  );

  return { startSession };
}
