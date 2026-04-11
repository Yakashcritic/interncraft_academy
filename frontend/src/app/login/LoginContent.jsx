"use client";

import { useSearchParams } from "next/navigation";
import PageWrapper from "@/components/common/PageWrapper";

const POST_LOGIN_REDIRECT_KEY = "postLoginRedirect";

export default function LoginContent() {
  const searchParams = useSearchParams();

  const handleGoogleLogin = () => {
    const redirect = searchParams.get("redirect");
    if (redirect && redirect.startsWith("/")) {
      try {
        sessionStorage.setItem(POST_LOGIN_REDIRECT_KEY, redirect);
      } catch {
        /* ignore */
      }
    }
    const apiBase =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    window.location.href = `${apiBase}/auth/google`;
  };

  return (
    <PageWrapper>
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
        <div className="fade-up">
          <span className="inline-block rounded-full border border-blue-200 bg-white/90 px-4 py-1 text-sm font-semibold text-blue-700">
            Student Access Portal
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900">
            Continue with Google to Start Your Enrollment
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Sign in securely using your Google account. After login, you will
            complete your student profile and continue to payment.
          </p>

          <div className="mt-8 space-y-3 text-sm text-slate-600">
            <p>✔ Secure Google Sign-In</p>
            <p>✔ Quick Student Onboarding</p>
            <p>✔ Smooth Payment & Enrollment Flow</p>
          </div>
        </div>

        <div className="surface-card rounded-[28px] p-8">
          <h2 className="text-2xl font-bold text-slate-900">Login</h2>
          <p className="mt-2 text-slate-600">
            Use your Google account to continue.
          </p>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="premium-transition mt-8 flex w-full items-center justify-center rounded-full bg-gradient-to-r from-slate-900 to-blue-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/25 hover:-translate-y-0.5"
          >
            Continue with Google
          </button>
        </div>
      </div>
    </PageWrapper>
  );
}
