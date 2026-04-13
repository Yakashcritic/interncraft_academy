export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://learnmythos.app/api";

export async function fetchAPI(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      credentials: "include",
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Error:", error);
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}