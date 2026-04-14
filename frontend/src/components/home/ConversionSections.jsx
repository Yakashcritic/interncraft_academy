"use client";

import Image from "next/image";

const testimonials = [
  {
    quote:
      "This internship helped me gain real confidence and practical skills. Highly recommended!",
    author: "Rahul S.",
    photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80",
  },
  {
    quote:
      "I finally built projects that I can show in interviews. Worth every rupee!",
    author: "Priya K.",
    photo:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80",
  },
  {
    quote:
      "Simple, beginner-friendly, and very useful for career growth.",
    author: "Arjun M.",
    photo:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&q=80",
  },
];

export default function ConversionSections() {
  return (
    <section className="space-y-10 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-8 backdrop-blur-xl">
          <h2 className="font-display text-3xl font-bold text-white">
            Feeling Stuck Without Real Skills or Internship Experience?
          </h2>
          <p className="mt-4 text-slate-300">
            Most students struggle because colleges focus on theory — not real-world skills.
          </p>
          <div className="mt-4 space-y-1 text-slate-300">
            <p>❌ No practical experience</p>
            <p>❌ No real projects to show</p>
            <p>❌ No internships → No job opportunities</p>
            <p>❌ Confused about where to start</p>
          </div>
          <p className="mt-4 text-sky-200">
            You&apos;re not alone. And this is exactly why Learn Mythos exists.
          </p>
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.05] p-8 backdrop-blur-xl">
          <h2 className="font-display text-3xl font-bold text-white">
            A Smarter Way to Learn, Build & Get Ahead
          </h2>
          <p className="mt-4 text-slate-300">
            At Learn Mythos, we don&apos;t just teach — we prepare you for the real world.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <p className="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-slate-200">
              🎓 Structured, beginner-friendly learning
            </p>
            <p className="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-slate-200">
              🧑‍💻 Hands-on real-world projects
            </p>
            <p className="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-slate-200">
              👨‍🏫 Guidance & mentorship support
            </p>
            <p className="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-slate-200">
              📜 Internship Certificate on completion
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.05] p-8 backdrop-blur-xl">
          <h2 className="font-display text-3xl font-bold text-white">How It Works</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <p className="rounded-xl border border-white/10 bg-white/[0.04] p-4 text-slate-200">
              1. 📥 Enroll in your preferred internship
            </p>
            <p className="rounded-xl border border-white/10 bg-white/[0.04] p-4 text-slate-200">
              2. 🎓 Access structured learning modules
            </p>
            <p className="rounded-xl border border-white/10 bg-white/[0.04] p-4 text-slate-200">
              3. 🧑‍💻 Work on real-world projects
            </p>
            <p className="rounded-xl border border-white/10 bg-white/[0.04] p-4 text-slate-200">
              4. 📜 Receive your internship certificate
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.05] p-8 backdrop-blur-xl">
          <h2 className="font-display text-3xl font-bold text-white">What You&apos;ll Achieve</h2>
          <p className="mt-3 text-slate-300">By the end of your internship, you will:</p>
          <div className="mt-4 space-y-2 text-slate-200">
            <p>✅ Gain job-ready skills</p>
            <p>✅ Build a strong project portfolio</p>
            <p>✅ Get real internship experience</p>
            <p>✅ Improve confidence for interviews</p>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.05] p-8 backdrop-blur-xl">
          <h2 className="font-display text-3xl font-bold text-white">What Our Students Say</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.author}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-lg shadow-black/20"
              >
                <div className="relative h-12 w-12 overflow-hidden rounded-full">
                  <Image src={t.photo} alt={t.author} fill className="object-cover" />
                </div>
                <p className="mt-3 text-sm text-slate-200">&quot;{t.quote}&quot;</p>
                <p className="mt-3 text-xs font-semibold text-sky-300">— {t.author}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-8 backdrop-blur-xl">
            <h2 className="font-display text-3xl font-bold text-white">
              Built to Bridge the Gap Between Learning & Real Skills
            </h2>
            <p className="mt-4 text-slate-300">
              Learn Mythos was created with one mission — to help students move beyond
              theory and gain real-world skills that actually matter in today&apos;s job market.
            </p>
            <p className="mt-3 text-slate-300">
              We believe practical learning + real projects = real success.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-8 backdrop-blur-xl">
            <h3 className="font-display text-2xl font-bold text-white">Certificate Preview</h3>
            <div className="mt-4 rounded-2xl border border-dashed border-sky-300/40 bg-sky-500/10 p-6 text-center text-sky-100">
              Internship Completion Certificate
            </div>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-block rounded-full bg-green-600 px-6 py-2.5 text-sm font-semibold text-white"
            >
              WhatsApp Support
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
