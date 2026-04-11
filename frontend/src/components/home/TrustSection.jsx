import Container from "@/components/common/Container";
import SectionTitle from "@/components/common/SectionTitle";

export default function TrustSection() {
  const items = [
    { title: "Beginner-Friendly Structure", desc: "Step-by-step format with clear guidance from day one." },
    { title: "Premium Live Learning", desc: "Live mentor sessions with practical walkthroughs." },
    { title: "Recorded Access Included", desc: "Rewatch sessions anytime to learn at your pace." },
    { title: "Project-Based Exposure", desc: "Hands-on tasks that build real portfolio confidence." },
    { title: "Certificate on Completion", desc: "Professional proof of your internship learning journey." },
    { title: "Student Support Community", desc: "Fast doubt support and peer collaboration space." },
  ];

  return (
    <section className="py-16">
      <Container>
        <SectionTitle
          title="Why Students Trust InternCraft Academy"
          subtitle="Built to offer clarity, quality learning, and a professional internship experience."
        />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.title}
              className="surface-card hover-glow premium-transition p-5 text-sm text-slate-300 hover:-translate-y-1"
            >
              <p className="font-semibold text-white">{item.title}</p>
              <p className="mt-2 leading-6">{item.desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}