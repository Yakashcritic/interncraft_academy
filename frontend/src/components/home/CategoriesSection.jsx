"use client";

import { motion } from "framer-motion";
import { Brain, TrendingUp, Scissors, Briefcase } from "lucide-react";

export default function CategoriesSection() {
  const categories = [
    { name: "Artificial Intelligence", icon: <Brain className="h-8 w-8 text-blue-400" />, desc: "Build smart applications and master neural networks." },
    { name: "Digital Marketing", icon: <TrendingUp className="h-8 w-8 text-purple-400" />, desc: "Master SEO, Ads, and viral content strategies." },
    { name: "Video Editing", icon: <Scissors className="h-8 w-8 text-pink-400" />, desc: "Learn Premiere Pro and craft cinematic visuals." },
    { name: "Business & Strategy", icon: <Briefcase className="h-8 w-8 text-emerald-400" />, desc: "Understand operations, growth, and team scaling." },
  ];

  return (
    <section className="relative py-24 bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold tracking-tight text-white md:text-5xl"
          >
            Choose Your Track.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-slate-400"
          >
            Specialized curriculum designed for high-demand skills.
          </motion.p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-colors"
            >
              <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-slate-900/50 p-4">
                {cat.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{cat.name}</h3>
              <p className="text-sm text-slate-400">{cat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}