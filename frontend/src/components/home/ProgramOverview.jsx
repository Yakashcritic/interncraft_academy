import { PROGRAM_DETAILS } from "@/lib/constants";

export default function ProgramOverview() {
  const items = [
    { label: "Duration", value: PROGRAM_DETAILS.duration, icon: "DU" },
    { label: "Total Classes", value: PROGRAM_DETAILS.totalClasses, icon: "CL" },
    { label: "Mode", value: PROGRAM_DETAILS.mode, icon: "MO" },
  ];

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="fade-up mb-10 text-center">
          <h2 className="text-3xl font-bold text-white">Program Overview</h2>
          <p className="mt-3 text-slate-300">
            Everything students need to know before getting started.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.label}
              className="surface-card hover-glow premium-transition p-6 text-center hover:-translate-y-1"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/15 text-xs font-bold text-cyan-200">
                {item.icon}
              </span>
              <p className="text-sm text-slate-400">{item.label}</p>
              <p className="mt-2 text-xl font-semibold text-white">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}