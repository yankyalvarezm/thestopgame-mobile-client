import axios from "axios";

import * as SecureStore from "expo-secure-store";
import { API_URL } from "./config.service.js";

async function getAccessToken() {
  return await SecureStore.getItemAsync("accessToken");
}

export async function me() {
  try {
    const token = await getAccessToken();

    console.log("token:", token);

    if (!token) {
      return { success: false, status: 0, message: "NO_TOKEN" };
    }

    const res = await axios.get(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // axios ya te da data aquí
    // backend devuelve: { success: true, data: { user } }
    return {
      success: true,
      status: res.status,
      user: res.data?.data?.user,
      raw: res.data,
    };
  } catch (err) {
    // axios mete el status aquí si vino del server
    const status = err?.response?.status || 0;

    if (status === 401 || status === 403) {
      await SecureStore.deleteItemAsync("accessToken");
      return { success: false, status, message: "INVALID_TOKEN" };
    }

    return {
      success: false,
      status,
      message: err?.response?.data?.message || err?.message || "ERROR_ME",
    };
  }
}

export async function login(email, password) {
  try {
    const res = await axios.post(
      `${API_URL}/auth/login`,
      { email, password },
      { headers: { "Content-Type": "application/json" } }
    );

    // backend: { success: true, data: { token, user } }
    const token = res.data?.data?.token;
    const user = res.data?.data?.user;

    if (!token) {
      return {
        success: false,
        status: res.status,
        message: "NO_TOKEN_IN_RESPONSE",
      };
    }

    await SecureStore.setItemAsync("accessToken", token);

    return { success: true, status: res.status, user };
  } catch (err) {
    const status = err?.response?.status || 0;
    const message =
      err?.response?.data?.message || err?.message || "LOGIN_ERROR";

    return { success: false, status, message };
  }
}

export async function logout() {
  try {
    const token = await getAccessToken();

    // intenta avisar al backend (opcional)
    if (token) {
      await axios.post(
        `${API_URL}/auth/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    }
  } catch (err) {
    // no bloquees el logout local por error de red/backend
    console.warn(
      "Backend logout failed (continuing local logout):",
      err?.response?.data || err?.message
    );
  } finally {
    // logout real: borrar token del device
    await SecureStore.deleteItemAsync("accessToken");
  }

  return { success: true };
}

export const googleAuth = async (idToken) => {
  try {
    const res = await axios.post(
      `${API_URL}/auth/google`,
      { idToken },
      { headers: { "Content-Type": "application/json" } }
    );

    // Unifica shapes posibles del backend
    const token = res?.data?.data?.token ?? res?.data?.token ?? null;

    const user = res?.data?.data?.user ?? res?.data?.user ?? null;

    const isNewUser =
      res?.data?.data?.isNewUser ?? res?.data?.isNewUser ?? false;

    // 🔒 Validación fuerte del token
    if (!token || typeof token !== "string") {
      console.error("INVALID TOKEN FROM BACKEND:", token);
      return {
        success: false,
        status: res.status,
        message: "INVALID_TOKEN_FROM_BACKEND",
      };
    }

    await SecureStore.setItemAsync("accessToken", token);

    return {
      success: true,
      status: res.status,
      user,
      isNewUser,
    };
  } catch (err) {
    console.error("GOOGLE AUTH SERVICE ERROR:", err);

    const status = err?.response?.status || 0;
    const message =
      err?.response?.data?.message || err?.message || "GOOGLE_AUTH_ERROR";

    return { success: false, status, message };
  }
};
