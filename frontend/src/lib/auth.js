export function getUserRedirectPath(user) {
  if (!user) return "/login";
  if (!user.profileCompleted) return "/complete-profile";
  if (user.paymentStatus !== "paid") return "/checkout";
  return "/dashboard";
}