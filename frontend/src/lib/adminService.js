const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://learnmythos.app/api";

async function adminRequest(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  let data = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    const err = new Error(data.message || `Request failed (${res.status})`);
    err.response = { data, status: res.status };
    throw err;
  }

  return data;
}

export const adminService = {
  getUsers: (params = {}) => {
    const q = new URLSearchParams();
    if (params.page != null) q.set("page", String(params.page));
    if (params.limit != null) q.set("limit", String(params.limit));
    if (params.search) q.set("search", params.search);
    const qs = q.toString();
    return adminRequest(`/admin/users${qs ? `?${qs}` : ""}`, { method: "GET" });
  },

  updateUser: (userId, payload) =>
    adminRequest(`/admin/users/${userId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  getCoupons: () => adminRequest("/admin/coupons", { method: "GET" }),

  createCoupon: (couponData) =>
    adminRequest("/admin/coupons", {
      method: "POST",
      body: JSON.stringify(couponData),
    }),

  toggleCouponActive: (couponId) =>
    adminRequest(`/admin/coupons/${couponId}`, { method: "PUT" }),

  deleteCoupon: (couponId) =>
    adminRequest(`/admin/coupons/${couponId}`, { method: "DELETE" }),
};
