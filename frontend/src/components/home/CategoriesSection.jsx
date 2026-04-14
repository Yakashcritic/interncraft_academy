"use client";

import { motion } from "framer-motion";

const categories = [
  {
    name: "Machine Learning Basics 🤖",
    desc: "Learn how machines think and build intelligent models from scratch.",
  },
  {
    name: "Data Structures & Algorithms 💻",
    desc: "Master problem-solving and crack technical interviews with confidence.",
  },
  {
    name: "Python Programming 🐍",
    desc: "Build a strong programming foundation with one of the most in-demand languages.",
  },
  {
    name: "Accounting 📊",
    desc: "Understand financial systems, tools, and real-world business accounting.",
  },
  {
    name: "Backend Development 🌐",
    desc: "Learn to build powerful server-side applications and APIs.",
  },
  {
    name: "Video Editing 🎬",
    desc: "Create professional content using modern editing tools and techniques.",
  },
  {
    name: "Digital Marketing 📱",
    desc: "Master social media, ads, and strategies to grow any business online.",
  },
];

export default function CategoriesSection() {
  return (
    <section id="program" className="relative scroll-mt-28 py-20 sm:scroll-mt-32 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-400/90">
            Internship Programs
          </p>
          <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-white md:text-5xl">
            Choose Your Career Path
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="rounded-2xl border border-white/15 bg-white/[0.06] p-6 shadow-[0_16px_40px_-20px_rgba(0,0,0,0.65)] backdrop-blur-xl premium-transition hover:-translate-y-1 hover:border-sky-400/35"
            >
              <h3 className="font-display text-xl font-semibold text-white">{cat.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">{cat.desc}</p>
              <a
                href="/login"
                className="mt-5 inline-block text-sm font-semibold text-sky-300 hover:text-sky-200"
              >
                Enroll Now →
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
