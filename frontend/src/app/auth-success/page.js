"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/common/Loader";

export default function AuthSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "https://learnmythos.app/api";
        const res = await fetch(`${apiUrl}/auth/me`, {
          credentials: "include",
        });

        const data = await res.json();

        if (!data.success) {
          router.push("/login");
          return;
        }

        let storedRedirect = null;
        try {
          storedRedirect = sessionStorage.getItem("postLoginRedirect");
          if (storedRedirect) sessionStorage.removeItem("postLoginRedirect");
        } catch {
          /* ignore */
        }

        if (storedRedirect && storedRedirect.startsWith("/")) {
          router.push(storedRedirect);
          return;
        }

        if (data.user.role === "admin") {
          router.push("/admin/coupons");
          return;
        }

        if (!data.user.profileCompleted) {
          router.push("/complete-profile");
          return;
        }

        if (data.user.paymentStatus === "paid") {
          router.push("/dashboard");
          return;
        }

        router.push("/checkout");
      } catch (error) {
        router.push("/login");
      }
    };

    checkUser();
  }, [router]);

  return <Loader text="Redirecting you securely..." />;
}