"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import PageWrapper from "@/components/common/PageWrapper";
import Loader from "@/components/common/Loader";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://learnmythos.app/api";

export default function ThankYouPage() {
  const router = useRouter();

  useEffect(() => {
    const redirect = async () => {
      try {
        const res = await fetch(`${apiUrl}/auth/me`, {
          credentials: "include",
        });
        const data = await res.json();
        if (!data.success) {
          router.replace("/login");
          return;
        }
        if (!data.user.profileCompleted) {
          router.replace("/complete-profile");
          return;
        }
        if (data.user.paymentStatus !== "paid") {
          router.replace("/checkout");
          return;
        }
        router.replace("/dashboard");
      } catch {
        router.replace("/login");
      }
    };
    redirect();
  }, [router]);

  return (
    <PageWrapper>
      <Loader text="Taking you to your dashboard…" />
    </PageWrapper>
  );
}