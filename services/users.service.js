import axios from "axios";
import { API_URL } from "./config.service.js";

export async function signup(email, password, nickname) {
  try {
    const res = await axios.post(`${API_URL}/users/signup`, {
      email,
      password,
      nickname,
    });
    return res.data;
  } catch (err) {
    console.error("signup error:", err);
    return { success: false, message: "Error al registrar usuario" };
  }
}
