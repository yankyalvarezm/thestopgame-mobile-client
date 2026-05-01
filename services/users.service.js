import axios from "axios";
import { API_URL } from "./config.service.js";
import { login } from "./auth.service.js";

export async function signup(email, password, nickname) {
  try {
    const normalizedEmail = String(email || "").trim().toLowerCase();

    await axios.post(`${API_URL}/users/signup`, {
      email: normalizedEmail,
      password,
      nickname,
    });

    return await login(normalizedEmail, password);
  } catch (err) {
    console.error("signup error:", err);
    return {
      success: false,
      status: err?.response?.status || 0,
      message:
        err?.response?.data?.message ||
        "No se pudo registrar el usuario. Inténtalo de nuevo.",
    };
  }
}
