"use client";

import { PROGRAM_DETAILS } from "@/lib/constants";
import { motion } from "framer-motion";
import { ArrowRight, PlayCircle, Star } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-slate-950 pt-32 lg:pt-40">
      {/* Background Glow */}
      <div className="absolute left-1/2 top-0 -z-10 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-blue-600/20 opacity-50 blur-[120px]" />
      <div className="absolute right-0 top-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-purple-600/10 blur-[100px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-slate-300 backdrop-blur-md"
          >
            <span className="flex h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
            Admissions Open for 2026 Batch
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-4xl text-5xl font-extrabold tracking-tight text-white md:text-7xl"
          >
            Master Real Skills. <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Build Your Future.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 max-w-2xl text-lg text-slate-400 md:text-xl"
          >
            Join the elite internship program designed for ambitious students. Gain practical experience, mentorship, and a premium certification.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <Link
              href="/login"
              className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-white px-8 py-4 font-semibold text-slate-950 transition-all hover:scale-105"
            >
              Start Enrollment
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#program-details"
              className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10"
            >
              <PlayCircle className="h-5 w-5 text-blue-400" />
              View Curriculum
            </a>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-16 flex flex-col items-center gap-4 border-t border-white/10 pt-8"
          >
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 w-12 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center">
                  <Star className="h-4 w-4 text-slate-500" />
                </div>
              ))}
              <div className="z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-slate-950 bg-blue-600 text-xs font-bold text-white">
                500+
              </div>
            </div>
            <p className="text-sm text-slate-400">Trusted by over 500+ students from top colleges</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}