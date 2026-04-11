"use client";

import { motion } from "framer-motion";
import { Video, BookOpen, Award, FolderGit2, MessageCircle } from "lucide-react";

const features = [
  {
    title: "Live Masterclasses",
    desc: "Interactive weekend sessions with industry experts.",
    icon: <Video className="h-6 w-6 text-blue-400" />,
    className: "md:col-span-2 md:row-span-2 bg-gradient-to-br from-slate-900 to-slate-950",
  },
  {
    title: "Recorded Library",
    desc: "Lifetime access to all session recordings.",
    icon: <BookOpen className="h-6 w-6 text-purple-400" />,
    className: "md:col-span-1 bg-slate-900/50",
  },
  {
    title: "Verified Certificate",
    desc: "ISO Certified & globally recognized.",
    icon: <Award className="h-6 w-6 text-emerald-400" />,
    className: "md:col-span-1 bg-slate-900/50",
  },
  {
    title: "Real-world Projects",
    desc: "Build a portfolio that gets you hired.",
    icon: <FolderGit2 className="h-6 w-6 text-orange-400" />,
    className: "md:col-span-1 bg-slate-800/40",
  },
  {
    title: "24/7 WhatsApp Support",
    desc: "Get your doubts resolved instantly.",
    icon: <MessageCircle className="h-6 w-6 text-green-400" />,
    className: "md:col-span-1 bg-slate-800/40",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold tracking-tight text-white md:text-5xl"
          >
            Everything You Need. <br />
            <span className="text-slate-500">Nothing You Don't.</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-2">
          {features.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`group relative overflow-hidden rounded-3xl border border-white/5 p-8 transition-all hover:border-white/10 ${item.className}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              
              <div className="relative z-10 flex h-full flex-col justify-between gap-6">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 backdrop-blur-md">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-400">{item.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}