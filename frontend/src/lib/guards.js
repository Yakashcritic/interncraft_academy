export async function getCurrentUser() {
  try {
    const res = await fetch("https://learnmythos.app/api/auth/me", {
      credentials: "include",
    });

    const data = await res.json();
    return data;
  } catch (error) {
    return { success: false };
  }
}

export async function getPaymentStatus() {
  try {
    const res = await fetch("https://learnmythos.app/api/payments/status", {
      credentials: "include",
    });

    const data = await res.json();
    return data;
  } catch (error) {
    return { success: false };
  }
}