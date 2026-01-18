import axios from "axios";
import { API_URL } from "./config.service";
import * as SecureStore from "expo-secure-store";

export async function getSetlistsByStatus(status) {
  try {
    if (!status) {
      return { success: false, status: 0, message: "STATUS_REQUIRED" };
    }

    // (Opcional) si la ruta fuera privada, manda Authorization.
    // Si tu endpoint es público, puedes quitar esto.
    const token = await SecureStore.getItemAsync("accessToken");

    const res = await axios.get(`${API_URL}/setlists/get-setlists`, {
      params: { status },
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const setlists = res.data?.data?.setlists || [];
    const count = res.data?.data?.count ?? setlists.length;

    return { success: true, status: res.status, count, setlists };
  } catch (err) {
    const statusCode = err?.response?.status || 0;
    const message =
      err?.response?.data?.message || err?.message || "GET_SETLISTS_ERROR";

    return { success: false, status: statusCode, message };
  }
}