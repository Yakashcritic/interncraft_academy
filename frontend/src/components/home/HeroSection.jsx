"use client";

import { HERO_QUICK_STATS, PROGRAM_DETAILS } from "@/lib/constants";
import { SITE_IMAGES } from "@/lib/siteImages";
import { motion } from "framer-motion";
import { ArrowRight, PlayCircle, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function HeroSection() {
  return (
    <section className="relative min-h-[92vh] overflow-hidden pt-28 sm:pt-32 lg:pt-40">
      <div className="absolute left-1/2 top-0 -z-10 h-[min(100vw,900px)] w-[min(100vw,900px)] -translate-x-1/2 rounded-full bg-gradient-to-b from-blue-500/25 via-violet-600/12 to-transparent blur-[100px]" />
      <div className="absolute -right-32 top-1/4 -z-10 h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-[90px] float-soft" />
      <div className="absolute -left-24 bottom-1/4 -z-10 h-[360px] w-[360px] rounded-full bg-violet-600/10 blur-[80px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-stretch gap-12 lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-14 xl:gap-16">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-col items-center text-center lg:items-start lg:text-left"
          >
            <motion.div
              variants={item}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-medium text-slate-200 shadow-lg shadow-black/20 backdrop-blur-md"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.9)]" />
              </span>
              Admissions open · 2026 cohort
            </motion.div>

            <motion.h1
              variants={item}
              className="font-display max-w-4xl text-[2.5rem] font-extrabold leading-[1.08] tracking-tight text-white sm:text-6xl md:text-7xl"
            >
              Master real skills.{" "}
              <span className="gradient-text block sm:inline">
                Build your future.
              </span>
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-8 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg md:text-xl"
            >
              {PROGRAM_DETAILS.subheadline}
            </motion.p>

            <motion.div
              variants={item}
              className="mt-8 flex w-full max-w-4xl flex-wrap justify-center gap-3 sm:gap-4 lg:justify-start"
            >
              {HERO_QUICK_STATS.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-center backdrop-blur-sm sm:min-w-[7.5rem]"
                >
                  <p className="font-display text-lg font-bold text-white sm:text-xl">
                    {s.value}
                  </p>
                  <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-slate-500">
                    {s.label}
                  </p>
                </div>
              ))}
            </motion.div>

            <motion.p
              variants={item}
              className="mt-6 max-w-2xl text-sm text-slate-500"
            >
              <span className="text-slate-400">{PROGRAM_DETAILS.cohortLabel}</span>
              {" · "}
              {PROGRAM_DETAILS.kickoffWindow}
            </motion.p>

            <motion.div
              variants={item}
              className="mt-11 flex w-full max-w-md flex-col gap-4 sm:max-w-none sm:flex-row sm:justify-center lg:justify-start"
            >
              <Link
                href="/login"
                className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-full bg-white px-8 py-4 text-base font-semibold text-slate-950 shadow-[0_0_0_1px_rgba(255,255,255,0.08)] transition-transform duration-300 hover:scale-[1.03]"
              >
                <span className="pointer-events-none absolute inset-0 block overflow-hidden rounded-full opacity-0 transition-opacity group-hover:opacity-100 shimmer-sweep" />
                <span className="relative">Start enrollment</span>
                <ArrowRight className="relative h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <a
                href="#program-details"
                className="group flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/25 hover:bg-white/[0.08]"
              >
                <PlayCircle className="h-5 w-5 text-sky-400 transition-transform group-hover:scale-110" />
                View curriculum
              </a>
            </motion.div>

            <motion.div
              variants={item}
              className="mt-16 flex w-full max-w-xl flex-col items-center gap-5 border-t border-white/[0.08] pt-10 lg:items-start"
            >
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                <Sparkles className="h-3.5 w-3.5 text-amber-400/90" />
                Trusted by learners
              </div>
              <div className="flex -space-x-3">
                {SITE_IMAGES.heroAvatars.map((src, i) => (
                  <div
                    key={src}
                    className="relative h-11 w-11 overflow-hidden rounded-full border-2 border-slate-950 ring-1 ring-white/10"
                    style={{ zIndex: 4 - i }}
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="44px"
                    />
                  </div>
                ))}
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-slate-950 bg-gradient-to-br from-sky-500 to-blue-700 text-xs font-bold text-white shadow-lg shadow-blue-900/40"
                  style={{ zIndex: 5 }}
                >
                  500+
                </div>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-slate-500">
                Learners from 120+ colleges and bootcamps have used InternCraft-style
                tracks for structured, mentor-led skill depth — from IITs and NITs to
                regional universities (illustrative reach for demo).
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-lg lg:mx-0 lg:max-w-none"
          >
            <div className="relative aspect-[5/4] w-full overflow-hidden rounded-[1.75rem] border border-white/10 shadow-[0_24px_80px_-20px_rgba(0,0,0,0.65)] sm:aspect-[4/3] sm:rounded-[2rem]">
              <Image
                src={SITE_IMAGES.hero}
                alt="Students collaborating in a modern learning space"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/40 via-transparent to-slate-950/30 lg:from-slate-950/50" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
