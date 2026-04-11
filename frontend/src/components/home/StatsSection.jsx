import Container from "@/components/common/Container";

export default function StatsSection() {
  const stats = [
    { label: "Batch Completion", value: "92% Program Completion" },
    { label: "Mentor Reply Time", value: "Within 30 Minutes" },
    { label: "Career Support", value: "Weekly Resume Reviews" },
  ];

  return (
    <section className="py-8">
      <Container>
        <div className="surface-card grid gap-4 p-6 md:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="premium-transition rounded-2xl p-4 text-center hover:bg-slate-900/35">
              <p className="text-sm font-medium text-slate-400">{stat.label}</p>
              <p className="mt-2 text-lg font-semibold text-white">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}