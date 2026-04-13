"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
const linkGroups = [
  {
    title: "Product",
    links: [
      { label: "Overview", href: "/" },
      { label: "Student login", href: "/login" },
      { label: "Checkout", href: "/checkout" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy-policy" },
      { label: "Terms", href: "/terms" },
      { label: "Refunds", href: "/refund-policy" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] bg-slate-950/80 text-slate-200 backdrop-blur-xl">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-500/30 to-transparent" />
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="col-span-2 lg:col-span-1"
        >
          <h3 className="font-display flex items-center gap-2 text-xl font-bold tracking-tight text-white">
            <Sparkles className="h-5 w-5 text-sky-400" />
            InternCraft Academy
          </h3>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
            Premium internship tracks with live mentorship, recordings, and
            portfolio-ready outcomes for serious students.
          </p>
        </motion.div>

        {linkGroups.map((group, gi) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 * (gi + 1) }}
          >
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              {group.title}
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              {group.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="inline-block transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
        >
          <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Support
          </h4>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            Onboarding help, curriculum questions, and community access through
            your cohort channels after enrollment.
          </p>
          <p className="mt-4 text-xs leading-relaxed text-slate-500">
            Demo inbox:{" "}
            <span className="font-mono text-slate-400">hello@interncraft.demo</span>
            <br />
            Typical reply: same business day (illustrative).
          </p>
        </motion.div>
      </div>

      <div className="border-t border-white/[0.05] py-8 text-center text-xs text-slate-600">
        © {new Date().getFullYear()} InternCraft Academy. All rights reserved.
      </div>
    </footer>
  );
}
