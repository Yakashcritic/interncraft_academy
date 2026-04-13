"use client";

import { SITE_IMAGES } from "@/lib/siteImages";
import { motion } from "framer-motion";
import { Brain, TrendingUp, Scissors, Briefcase } from "lucide-react";
import Image from "next/image";

const categories = [
  {
    name: "Artificial Intelligence",
    image: SITE_IMAGES.categories.ai,
    icon: Brain,
    accent: "from-sky-400 to-blue-500",
    desc: "Build smart workflows and understand how modern AI tools fit real work — from prompt systems to lightweight automation.",
    highlights: "Capstone: workflow one-pager + Loom walkthrough of a real use case.",
  },
  {
    name: "Digital Marketing",
    image: SITE_IMAGES.categories.marketing,
    icon: TrendingUp,
    accent: "from-violet-400 to-fuchsia-500",
    desc: "SEO, paid social, analytics, and content systems that brands actually use, taught with live teardowns and mock briefs.",
    highlights: "Capstone: 2-week growth plan + channel mix with a modest mock budget.",
  },
  {
    name: "Video Editing",
    image: SITE_IMAGES.categories.video,
    icon: Scissors,
    accent: "from-pink-400 to-rose-500",
    desc: "Story-first editing, pacing, sound basics, and portfolio cuts that feel cinematic — beginner-friendly timelines and shortcuts.",
    highlights: "Capstone: 60–90s brand-style reel + shot list & storyboard PDF.",
  },
  {
    name: "Business & strategy",
    image: SITE_IMAGES.categories.business,
    icon: Briefcase,
    accent: "from-emerald-400 to-teal-500",
    desc: "Growth thinking, positioning, ops basics, and how teams ship under pressure — frameworks you can reuse in interviews.",
    highlights: "Capstone: 5-slide narrative deck + 1-page memo with mentor rubric.",
  },
];

export default function CategoriesSection() {
  return (
    <section id="program" className="relative scroll-mt-28 py-20 sm:scroll-mt-32 sm:py-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-400/90"
          >
            Tracks
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="font-display mt-3 text-3xl font-bold tracking-tight text-white md:text-5xl"
          >
            Choose your focus.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-4 max-w-xl text-slate-400"
          >
            Four internship-style tracks. Pick one at checkout — same core cadence,
            track-specific mentors, and cohort channels so you never learn in a
            vacuum.
          </motion.p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-24px" }}
                transition={{
                  delay: idx * 0.07,
                  duration: 0.55,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -10, transition: { duration: 0.35 } }}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.07] to-white/[0.02] shadow-xl shadow-black/20 premium-transition hover:border-white/20 hover:shadow-blue-950/30"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/55 to-slate-950/15" />
                </div>
                <div className="p-6 pt-5">
                <div
                  className={`mb-5 inline-flex rounded-2xl bg-gradient-to-br ${cat.accent} p-[1px]`}
                >
                  <div className="rounded-2xl bg-slate-950/90 p-4">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="font-display text-xl font-bold text-white">
                  {cat.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {cat.desc}
                </p>
                <p className="mt-4 border-t border-white/[0.06] pt-4 text-xs font-medium leading-relaxed text-sky-200/80">
                  {cat.highlights}
                </p>
                </div>
                <div className="pointer-events-none absolute -right-8 bottom-0 h-32 w-32 rounded-full bg-gradient-to-br from-white/[0.06] to-transparent opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
