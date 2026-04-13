import { PROGRAM_DETAILS } from "@/lib/constants";

export default function ProgramOverview() {
  const items = [
    { label: "Duration", value: PROGRAM_DETAILS.duration, hint: "Structured sprints + demo week" },
    { label: "Live sessions", value: PROGRAM_DETAILS.totalClasses, hint: PROGRAM_DETAILS.liveHours },
    { label: "Build time", value: PROGRAM_DETAILS.projectHours, hint: "Mentor-reviewed milestones" },
    { label: "Format", value: PROGRAM_DETAILS.mode, hint: PROGRAM_DETAILS.mentorOfficeHours },
    { label: "Typical cohort", value: PROGRAM_DETAILS.avgCohortSize, hint: PROGRAM_DETAILS.cohortLabel },
    { label: "After you pay", value: "48h pre-kickoff pack", hint: PROGRAM_DETAILS.startInfo },
  ];

  return (
    <section className="border-y border-white/[0.06] bg-slate-950/40 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="fade-up mb-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400/90">
            At a glance
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
            Program overview
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-400">
            Snapshot numbers before you dive into tracks, features, and pricing —
            useful for sharing with parents or placement cells.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.label}
              className="surface-card hover-glow premium-transition flex flex-col p-6 text-left hover:-translate-y-1"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {item.label}
              </p>
              <p className="font-display mt-2 text-xl font-bold text-white md:text-2xl">
                {item.value}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.hint}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
