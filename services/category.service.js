import axios from "axios";
import { API_URL } from "./config.service";

export async function validateCategoryAnswer({
  categoryName,
  language,
  letter,
  answer,
}) {
  try {
    const res = await axios.post(
      `${API_URL}/categories/validate-answer`,
      {
        categoryName,
        language,
        letter,
        answer,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return res.data;
  } catch (err) {
    console.error("validateCategoryAnswer error:", err?.response || err);

    return {
      success: false,
      status: err?.response?.status || 0,
      message:
        err?.response?.data?.message ||
        err?.message ||
        "VALIDATE_CATEGORY_ANSWER_ERROR",
    };
  }
}
