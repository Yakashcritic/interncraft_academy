"use client";

import { motion } from "framer-motion";
import { PROGRAM_DETAILS } from "@/lib/constants";

const details = [
  {
    title: "Internship structure",
    description:
      "Week-by-week roadmap: orientation → skill sprints → project milestones → demo week. Every module has a checklist, rubric, and submission slot so you always know what “done” looks like.",
  },
  {
    title: "Outcomes + portfolio",
    description:
      "Two portfolio-grade deliverables per track (case study + build or campaign + edit reel). Mentor feedback loops, revision windows, and LinkedIn headline + project description templates included.",
  },
  {
    title: "Beginner-friendly",
    description:
      "Starter templates, loom recaps, and “office hour” threads so you can catch up fast. No gatekeeping — we assume curiosity, not prior tool mastery.",
  },
  {
    title: "Weekly rhythm",
    description: `${PROGRAM_DETAILS.mentorOfficeHours}. Sat deep-dive labs, Tue–Wed async build blocks with Fri soft deadlines. ~${PROGRAM_DETAILS.liveHours} live; everything else on replay with chapter markers.`,
  },
  {
    title: "Toolkit & demos",
    description: `${PROGRAM_DETAILS.toolsPreview}. Cloud sandboxes where needed — no expensive paid seats required for core exercises.`,
  },
  {
    title: "Credential & cohort",
    description: `Verified PDF certificate + cohort letter. ${PROGRAM_DETAILS.avgCohortSize}; ${PROGRAM_DETAILS.startInfo}`,
  },
];

export default function ProgramDetails() {
  return (
    <section
      id="program-details"
      className="relative scroll-mt-28 py-20 sm:scroll-mt-32 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-400/90">
            Curriculum
          </p>
          <h2 className="font-display mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Program details
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            {PROGRAM_DETAILS.duration}, {PROGRAM_DETAILS.totalClasses},{" "}
            {PROGRAM_DETAILS.projectHours}, and a clear weekly cadence — designed
            for hiring signals, not vanity metrics.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {details.map((detail, idx) => (
            <motion.div
              key={detail.title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                delay: idx * 0.06,
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -6 }}
              className="surface-card-premium premium-transition group flex flex-col p-7 hover:border-sky-500/25"
            >
              <div className="mb-4 h-1 w-10 shrink-0 rounded-full bg-gradient-to-r from-sky-400 to-violet-500 opacity-80 transition-all group-hover:w-14" />
              <h3 className="font-display text-lg font-semibold text-white">
                {detail.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                {detail.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
