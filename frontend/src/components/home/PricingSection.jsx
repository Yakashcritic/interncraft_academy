"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Crown } from "lucide-react";
import Link from "next/link";
import { PROGRAM_DETAILS } from "@/lib/constants";

const extraBullets = (pd) => [
  `${pd.duration} structured runway · ${pd.totalClasses}`,
  `${pd.projectHours} with milestone rubrics`,
  `Optional mentor window: ${pd.mentorOfficeHours}`,
  "Lifetime access to recordings for this cohort curriculum version",
  "Verified PDF certificate + LinkedIn copy pack",
  "2 portfolio-grade projects with mentor review cycles",
  "Dedicated WhatsApp cohort + peer accountability pods (4–5 students)",
  "Coupon / referral codes applied securely before payment (Cashfree)",
];

export default function PricingSection() {
  const bullets = extraBullets(PROGRAM_DETAILS);

  return (
    <section
      id="pricing"
      className="relative scroll-mt-28 py-20 sm:scroll-mt-32 sm:py-28"
    >
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[min(100vw,560px)] w-[min(100vw,560px)] -translate-x-1/2 rounded-full bg-blue-600/12 blur-[100px]" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/[0.08] px-4 py-2 text-sm font-medium text-amber-100/95"
          >
            <Crown className="h-4 w-4 text-amber-400" />
            Limited enrollment window
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.06 }}
            className="font-display mt-6 text-3xl font-bold tracking-tight text-white md:text-5xl"
          >
            One investment. Full access.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-3 max-w-lg text-slate-400"
          >
            Transparent pricing — one-time fee covers the full {PROGRAM_DETAILS.duration}{" "}
            runway for the track you pick. {PROGRAM_DETAILS.cohortLabel}:{" "}
            {PROGRAM_DETAILS.kickoffWindow}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto max-w-xl"
        >
          <div className="absolute -inset-px rounded-[2rem] bg-gradient-to-b from-sky-400/40 via-violet-500/25 to-blue-600/30 opacity-70 blur-sm" />
          <div className="relative overflow-hidden rounded-[1.85rem] border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-black/50 backdrop-blur-2xl sm:p-12">
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-sky-500/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-16 h-48 w-48 rounded-full bg-violet-600/15 blur-3xl" />

            <div className="relative z-10 flex flex-col items-center text-center">
              <p className="text-sm font-medium uppercase tracking-widest text-slate-500">
                Masterclass internship
              </p>
              <div className="mt-5 flex items-baseline justify-center gap-2">
                <span className="font-display text-6xl font-extrabold tracking-tight text-white sm:text-7xl">
                  {PROGRAM_DETAILS.price}
                </span>
                <span className="text-base text-slate-500">one-time</span>
              </div>

              <ul className="mt-10 w-full space-y-4 text-left">
                {bullets.map((line) => (
                  <li
                    key={line}
                    className="flex items-start gap-3 text-sm font-medium text-slate-200"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-sky-400" />
                    {line}
                  </li>
                ))}
              </ul>

              <Link
                href="/login"
                className="group relative mt-11 flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 px-8 py-4 text-base font-semibold text-white shadow-[0_20px_50px_-15px_rgba(37,99,235,0.55)] transition-transform duration-300 hover:scale-[1.02]"
              >
                <span className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
                <span className="relative">Enroll now</span>
                <ArrowRight className="relative h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>

              <p className="mt-5 text-xs font-medium text-slate-500">
                Have a code? You&apos;ll apply it at checkout before payment.
              </p>
              <p className="mt-4 max-w-sm text-[11px] leading-relaxed text-slate-600">
                Demo storefront: amounts shown are illustrative. Refund / support
                policies linked in the footer apply to real purchases once live.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
