import axios from "axios";
import { API_URL } from "./config.service";
import * as SecureStore from "expo-secure-store";

export async function createMatch(
  rounds,
  matchType,
  setlistId,
  allowJoiningWhilePlaying,
  allowStopButton,
  status,
  joinCode
) {
  try {
    const token = await SecureStore.getItemAsync("accessToken");

    if (!token) {
      return {
        success: false,
        status: 401,
        message: "NO_AUTH_TOKEN",
      };
    }

    const res = await axios.post(
      `${API_URL}/matches/create-match`,
      {
        max_rounds: rounds,
        matchType,
        setlist_id: setlistId,
        allow_joining_while_playing: allowJoiningWhilePlaying,
        allow_stop_button: allowStopButton,
        status,
        join_code: joinCode,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.data; // 👈 importante
  } catch (err) {
    console.error("createMatch error:", err?.response || err);

    return {
      success: false,
      status: err?.response?.status || 0,
      message:
        err?.response?.data?.message || err?.message || "CREATE_MATCH_ERROR",
    };
  }
}

export async function startMatchSession({
  rounds,
  matchType,
  setlistId,
  timer,
  difficulty,
  language,
  allowJoiningWhilePlaying = false,
  allowStopButton = true,
  joinCode,
}) {
  try {
    const token = await SecureStore.getItemAsync("accessToken");

    if (!token) {
      return {
        success: false,
        status: 401,
        message: "NO_AUTH_TOKEN",
      };
    }

    const res = await axios.post(
      `${API_URL}/matches/start-match`,
      {
        max_rounds: Number(rounds),
        matchType,
        setlist_id: setlistId,
        timer: Number(timer),
        difficulty,
        language,
        allow_joining_while_playing: allowJoiningWhilePlaying,
        allow_stop_button: allowStopButton,
        join_code: joinCode,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.data;
  } catch (err) {
    console.error("startMatchSession error:", err?.response || err);

    return {
      success: false,
      status: err?.response?.status || 0,
      message:
        err?.response?.data?.message ||
        err?.message ||
        "START_MATCH_SESSION_ERROR",
    };
  }
}

export async function createNextRound(matchId, timer) {
  try {
    const token = await SecureStore.getItemAsync("accessToken");

    if (!token) {
      return {
        success: false,
        status: 401,
        message: "NO_AUTH_TOKEN",
      };
    }

    const res = await axios.post(
      `${API_URL}/matches/${matchId}/rounds/next`,
      { timer: Number(timer) },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.data;
  } catch (err) {
    console.error("createNextRound error:", err?.response || err);

    return {
      success: false,
      status: err?.response?.status || 0,
      message:
        err?.response?.data?.message || err?.message || "CREATE_NEXT_ROUND_ERROR",
    };
  }
}

export async function abandonMatch(matchId) {
  try {
    const token = await SecureStore.getItemAsync("accessToken");

    if (!token) {
      return {
        success: false,
        status: 401,
        message: "NO_AUTH_TOKEN",
      };
    }

    const res = await axios.patch(
      `${API_URL}/matches/${matchId}/abandon`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.data;
  } catch (err) {
    console.error("abandonMatch error:", err?.response || err);

    return {
      success: false,
      status: err?.response?.status || 0,
      message:
        err?.response?.data?.message || err?.message || "ABANDON_MATCH_ERROR",
    };
  }
}
