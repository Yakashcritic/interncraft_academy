"use client";

import { motion } from "framer-motion";
import MagicBento from "@/components/effects/MagicBento";

export default function MagicBentoSection() {
  return (
    <section
      id="experience-bento"
      className="relative scroll-mt-28 border-t border-white/[0.06] py-20 sm:scroll-mt-32 sm:py-28"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-400/90"
          >
            Highlights
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="font-display mt-3 text-3xl font-bold tracking-tight text-white md:text-5xl"
          >
            The internship,{" "}
            <span className="text-slate-500">in one glance.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base"
          >
            Hover the tiles — subtle motion, spotlight, and click ripples are
            tuned for desktop; mobile stays calm for readability.
          </motion.p>
        </div>

        <div className="flex justify-center">
          <MagicBento
            textAutoHide
            enableStars
            enableSpotlight
            enableBorderGlow
            enableTilt={false}
            enableMagnetism={false}
            clickEffect
            spotlightRadius={400}
            particleCount={12}
            glowColor="56, 189, 248"
            disableAnimations={false}
          />
        </div>
      </div>
    </section>
  );
}
