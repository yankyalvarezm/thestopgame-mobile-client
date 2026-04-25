import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { API_URL } from "./config.service";

export async function finishRound(roundId, status = "completed", answers = []) {
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
      `${API_URL}/rounds/${roundId}/finish`,
      { status, answers },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.data;
  } catch (err) {
    console.error("finishRound error:", err?.response || err);

    return {
      success: false,
      status: err?.response?.status || 0,
      message:
        err?.response?.data?.message || err?.message || "FINISH_ROUND_ERROR",
    };
  }
}

export async function startRound(roundId) {
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
      `${API_URL}/rounds/${roundId}/start`,
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
    console.error("startRound error:", err?.response || err);

    return {
      success: false,
      status: err?.response?.status || 0,
      message:
        err?.response?.data?.message || err?.message || "START_ROUND_ERROR",
    };
  }
}
