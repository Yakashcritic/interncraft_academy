"use client";

import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import PageWrapper from "@/components/common/PageWrapper";
import { Shield } from "lucide-react";

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
      process.env.NEXT_PUBLIC_API_URL || "https://learnmythos.app/api";
    window.location.href = `${apiBase}/auth/google`;
  };

  return (
    <PageWrapper>
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="fade-up"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-sky-200">
            <Shield className="h-3.5 w-3.5" />
            Student access
          </span>
          <h1 className="font-display mt-6 text-4xl font-bold tracking-tight text-white md:text-5xl">
            Sign in with Google to continue enrollment
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-slate-400">
            Secure OAuth. After login you&apos;ll complete your profile and move
            to program selection and payment.
          </p>

          <ul className="mt-10 space-y-3 text-sm text-slate-400">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
              Encrypted Google sign-in
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
              Fast onboarding
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
              Checkout & dashboard in one flow
            </li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="surface-card-premium rounded-[1.75rem] p-8 sm:p-10"
        >
          <h2 className="font-display text-2xl font-bold text-white">Login</h2>
          <p className="mt-2 text-sm text-slate-400">
            Use the Google account you want on your certificate and receipts.
          </p>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="premium-transition mt-10 flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/40 hover:scale-[1.02] hover:shadow-blue-800/50"
          >
            Continue with Google
          </button>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
