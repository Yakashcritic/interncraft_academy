import Container from "@/components/common/Container";

export default function StatsSection() {
  const stats = [
    { label: "Structured completion", value: "92% finish rate", hint: "Across last 3 demo cohorts (internal benchmark)" },
    { label: "Mentor response", value: "< 30 min avg", hint: "WhatsApp cohort threads · business hours" },
    { label: "Live + replay", value: "24+ touchpoints", hint: "Chaptered recordings within 12 hours" },
    { label: "Career add-ons", value: "Resume lab", hint: "Group teardown + 1:1 slot lottery (20 seats)" },
  ];

  return (
    <section className="py-10 sm:py-12">
      <Container>
        <div className="surface-card grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="premium-transition rounded-2xl border border-white/[0.04] p-4 text-center hover:bg-slate-900/35 sm:text-left"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {stat.label}
              </p>
              <p className="mt-2 font-display text-lg font-bold text-white sm:text-xl">
                {stat.value}
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{stat.hint}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
