"use client";

import { useRef } from "react";
import VariableProximity from "@/components/common/VariableProximity";

export default function CTASection() {
  const containerRef = useRef(null);

  return (
    <section className="py-16">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <div ref={containerRef} className="surface-card rounded-3xl px-6 py-12 text-white">
          <h2 className="text-3xl font-bold">
            <VariableProximity
              label="Start Your Career Journey Today 🚀"
              className="text-white"
              fromFontVariationSettings="'wght' 500, 'opsz' 12"
              toFontVariationSettings="'wght' 980, 'opsz' 36"
              containerRef={containerRef}
              radius={95}
              falloff="linear"
            />
          </h2>
          <p className="mt-4 text-slate-300">
            Don&apos;t wait. Take the first step towards building real skills and
            real opportunities.
          </p>
          <div className="mx-auto mt-5 flex max-w-xl flex-wrap items-center justify-center gap-2 text-xs text-cyan-200">
            <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1">Live Mentor Rooms</span>
            <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1">Portfolio Proof</span>
            <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1">Career Guidance</span>
          </div>
          <a
            href="/login"
            className="premium-transition mt-8 inline-block rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-700/40 hover:-translate-y-0.5"
          >
            Join Internship Now
          </a>

          <p className="mt-4 text-xs text-slate-400">
            Need help? Use the chatbot or official support channels for quick answers.
          </p>
        </div>
      </div>
    </section>
  );
}