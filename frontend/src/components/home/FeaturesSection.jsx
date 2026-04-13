"use client";

import { SITE_IMAGES } from "@/lib/siteImages";
import { motion } from "framer-motion";
import { Video, BookOpen, Award, FolderGit2, MessageCircle } from "lucide-react";
import Image from "next/image";

const features = [
  {
    title: "Live masterclasses",
    desc: "Weekend intensives with mentors who ship in industry — cameras on, live polls, breakout prompts, and a shared Figma / sheet for every lab.",
    icon: Video,
    accent: "from-sky-500/30 to-blue-600/10",
    span: "md:col-span-2 md:row-span-2",
    image: SITE_IMAGES.features.liveMasterclass,
  },
  {
    title: "Recorded library",
    desc: "Revisit every session on your schedule. Replays land within ~12 hours with chapter markers and downloadable resource packs.",
    icon: BookOpen,
    accent: "from-violet-500/20 to-transparent",
    span: "md:col-span-1",
  },
  {
    title: "Verified certificate",
    desc: "PDF certificate with cohort name + completion date. Includes suggested LinkedIn headline and “featured” project copy you can paste.",
    icon: Award,
    accent: "from-emerald-500/20 to-transparent",
    span: "md:col-span-1",
  },
  {
    title: "Real-world projects",
    desc: "Two portfolio-grade deliverables with mentor rubrics, revision windows, and a final demo day-style showcase thread in your cohort.",
    icon: FolderGit2,
    accent: "from-amber-500/15 to-transparent",
    span: "md:col-span-1",
  },
  {
    title: "WhatsApp support",
    desc: "Peer + mentor help when you are stuck. Separate channels for #wins, #blocked, and #resources so signal stays high.",
    icon: MessageCircle,
    accent: "from-green-500/20 to-transparent",
    span: "md:col-span-1",
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative scroll-mt-28 py-20 sm:scroll-mt-32 sm:py-28"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-semibold uppercase tracking-[0.25em] text-violet-300/90"
          >
            Experience
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="font-display mt-3 text-3xl font-bold tracking-tight text-white md:text-5xl"
          >
            Everything you need.{" "}
            <span className="text-slate-500">Nothing you don&apos;t.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base"
          >
            Built like a lightweight accelerator: live teaching, async build
            weeks, visible accountability, and artifacts you can show in
            interviews — not endless theory slides.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-2 md:auto-rows-fr">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-32px" }}
                transition={{
                  delay: idx * 0.06,
                  duration: 0.55,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ scale: 1.01 }}
                className={`group relative overflow-hidden rounded-3xl border border-white/[0.07] bg-slate-900/40 p-8 premium-transition hover:border-white/15 ${item.span}`}
              >
                {item.image ? (
                  <div className="absolute inset-0 z-[1]">
                    <Image
                      src={item.image}
                      alt="Live mentor-led classroom"
                      fill
                      className="object-cover opacity-45 transition duration-500 group-hover:scale-[1.02] group-hover:opacity-55"
                      sizes="(max-width: 768px) 100vw, 66vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-950/70 to-slate-900/40" />
                  </div>
                ) : null}
                <div
                  className={`absolute inset-0 z-[2] bg-gradient-to-br ${item.accent} opacity-60`}
                />
                <div className="absolute inset-0 z-[2] bg-gradient-to-br from-white/[0.07] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative z-10 flex h-full min-h-[200px] flex-col justify-between gap-6 md:min-h-0">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] shadow-inner backdrop-blur-sm">
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
