"use client";

import { PROGRAM_DETAILS } from "@/lib/constants";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "py-4" : "py-6"
      }`}
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div
          className={`relative flex items-center justify-between rounded-full border border-white/10 bg-slate-950/50 px-6 py-3 backdrop-blur-md transition-shadow duration-300 ${
            scrolled ? "shadow-2xl shadow-blue-900/20" : ""
          }`}
        >
          {/* Logo Section */}
          <div className="flex flex-col">
            <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight text-white">
              <Sparkles className="h-5 w-5 text-blue-400" />
              {PROGRAM_DETAILS.brandName}
            </h1>
          </div>

          {/* Nav Links */}
          <nav className="hidden items-center gap-8 md:flex">
            {["Program", "Features", "Pricing"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
              >
                {item}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <Link
            href="/login"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-blue-600 px-6 py-2.5 font-medium text-white transition-all hover:scale-105 hover:bg-blue-500"
          >
            <span className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] bg-[position:200%_0,0_0] bg-no-repeat transition-[background-position_0s_ease] hover:bg-[position:-200%_0,0_0] duration-[1500ms]" />
            <span className="relative text-sm">Enroll Now</span>
          </Link>
        </div>
      </div>
    </motion.header>
  );
}