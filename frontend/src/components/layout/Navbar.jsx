"use client";

import { PROGRAM_DETAILS } from "@/lib/constants";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

const links = [
  { label: "Program", href: "#program" },
  { label: "Features", href: "#features" },
  { label: "Highlights", href: "#experience-bento" },
  { label: "Pricing", href: "#pricing" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 z-50 w-full transition-[padding] duration-500 ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div
          className={`relative flex items-center justify-between gap-4 rounded-2xl border px-4 py-3 sm:px-6 sm:py-3.5 premium-transition ${
            scrolled
              ? "border-white/[0.12] bg-slate-950/75 shadow-[0_24px_48px_-24px_rgba(0,0,0,0.85)] ring-1 ring-white/[0.06] backdrop-blur-2xl"
              : "border-white/[0.08] bg-slate-950/45 backdrop-blur-xl"
          }`}
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent opacity-80" />

          <Link href="/" className="group flex flex-col gap-0.5">
            <span className="flex items-center gap-2 font-display text-lg font-bold tracking-tight text-white sm:text-xl">
              <Sparkles className="h-5 w-5 text-sky-400 transition-transform duration-300 group-hover:rotate-12" />
              {PROGRAM_DETAILS.brandName}
            </span>
            <span className="hidden text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500 sm:block">
              Premium internship
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {links.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="group relative px-4 py-2 text-sm font-medium text-slate-400 transition-colors hover:text-white"
              >
                {item.label}
                <span className="absolute inset-x-3 -bottom-0.5 h-px scale-x-0 bg-gradient-to-r from-sky-400 to-violet-400 transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="group relative hidden overflow-hidden rounded-full bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/30 transition-transform duration-300 hover:scale-[1.03] sm:inline-flex sm:items-center sm:justify-center"
            >
              <span className="absolute inset-0 translate-y-full bg-white/15 transition-transform duration-300 group-hover:translate-y-0" />
              <span className="relative">Enroll Now</span>
            </Link>

            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((o) => !o)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10 md:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm md:hidden"
            onClick={() => setOpen(false)}
          >
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-0 flex h-full w-[min(100%,320px)] flex-col border-l border-white/10 bg-slate-950/95 p-6 pt-24 shadow-2xl"
            >
              {links.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                  onClick={() => setOpen(false)}
                  className="border-b border-white/5 py-4 text-lg font-medium text-slate-200"
                >
                  {item.label}
                </motion.a>
              ))}
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="mt-6 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 py-3.5 text-center text-sm font-semibold text-white"
              >
                Enroll Now
              </Link>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
