"use client";

import { motion } from "framer-motion";
import { ArrowRight, Crown } from "lucide-react";
import Link from "next/link";

const priceCards = [
  { title: "Machine Learning", price: 149, strike: 5999 },
  { title: "DSA", price: 129, strike: 5499 },
  { title: "Python", price: 99, strike: 3999 },
  { title: "Backend Development", price: 129, strike: 5499 },
  { title: "Accounting", price: 99, strike: 3999 },
  { title: "Video Editing", price: 99, strike: 4499 },
  { title: "Digital Marketing", price: 119, strike: 4999 },
];

export default function PricingSection() {
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
            Limited Time Offer 🚀
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-3 max-w-lg text-slate-400"
          >
            Get access to internship programs at a special discounted price.
          </motion.p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {priceCards.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl premium-transition hover:-translate-y-1 hover:border-sky-400/35"
            >
              <p className="text-sm text-slate-300">{card.title}</p>
              <p className="mt-2 text-xs text-slate-500 line-through">₹{card.strike}</p>
              <p className="font-display text-3xl font-bold text-white">₹{card.price}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-3xl rounded-3xl border border-amber-300/20 bg-amber-500/[0.08] p-8 text-center backdrop-blur-xl">
          <p className="text-slate-300">~~₹4999~~</p>
          <p className="font-display text-5xl font-bold text-white">₹999 Only</p>
          <p className="mt-3 text-sm text-amber-100">
            ⚠️ Limited seats available per batch
          </p>
          <Link
            href="/login"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-red-600 px-7 py-3 text-sm font-semibold text-white"
          >
            Enroll Now Before Price Increases
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
