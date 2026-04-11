"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { PROGRAM_DETAILS } from "@/lib/constants";

export default function PricingSection() {
  return (
    <section id="pricing" className="relative py-24 bg-slate-950">
      <div className="absolute left-1/2 top-1/4 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[120px]" />
      
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-300"
          >
            Limited Enrollment Access
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-3xl font-bold tracking-tight text-white md:text-5xl"
          >
            One Price. All Access.
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="relative mx-auto max-w-2xl overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-900/50 p-8 shadow-2xl backdrop-blur-xl sm:p-12"
        >
          {/* Animated border gradient line */}
          <div className="absolute inset-0 border-2 border-transparent [background:linear-gradient(90deg,transparent_20%,#3b82f6_50%,transparent_80%)_border-box] [mask:linear-gradient(#fff_0_0)_padding-box,linear-gradient(#fff_0_0)] [-webkit-mask-composite:xor] [mask-composite:exclude] opacity-50" />

          <div className="relative z-10 flex flex-col items-center text-center">
            <h3 className="text-xl font-medium text-slate-400">Masterclass Internship</h3>
            <div className="mt-4 flex items-baseline justify-center gap-2">
              <span className="text-6xl font-extrabold text-white">{PROGRAM_DETAILS.price}</span>
              <span className="text-lg text-slate-400">/one-time</span>
            </div>

            <div className="mt-8 flex w-full flex-col gap-4">
              {[
                "Live Interactive Mentor Sessions",
                "Lifetime Access to Recordings",
                "Verified Course Certificate",
                "2 Real-world Portfolio Projects",
                "24/7 WhatsApp Community Support"
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3 text-slate-200">
                  <CheckCircle2 className="h-5 w-5 text-blue-500 flex-shrink-0" />
                  <span className="text-left font-medium">{feature}</span>
                </div>
              ))}
            </div>

            <Link
              href="/login"
              className="group relative mt-10 flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white transition-all hover:scale-[1.02] hover:bg-blue-500 shadow-[0_0_40px_rgba(37,99,235,0.3)]"
            >
              Enroll Now
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            
            <p className="mt-4 text-xs font-medium text-slate-500">
              Discounts available! Apply your coupon code securely at checkout.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}