export default function WhatYouWillGet() {
  const benefits = [
    { title: "Live Interactive Classes", desc: "Direct mentor interaction with structured weekly learning." },
    { title: "Recorded Session Access", desc: "Never miss a concept, revisit lessons anytime." },
    { title: "Internship Certificate", desc: "Completion certificate that strengthens your profile." },
    { title: "Project-Based Learning", desc: "Real-world assignments with guided execution." },
    { title: "Practical Exposure", desc: "Industry-relevant tools and implementation mindset." },
    { title: "Community Support", desc: "Peer + mentor support for doubts and progress." },
  ];

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="fade-up mb-10 text-center">
          <h2 className="text-3xl font-bold text-white">What You Will Get</h2>
          <p className="mt-3 text-slate-300">
            Designed to provide clarity, confidence, and real value.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((item) => (
            <div
              key={item.title}
              className="surface-card hover-glow premium-transition p-5 hover:-translate-y-1"
            >
              <p className="font-semibold text-white">{item.title}</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}