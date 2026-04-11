export default function ProgramDetails() {
  const details = [
    {
      title: "Internship Structure",
      description:
        "A guided learning format with practical sessions, structured modules, and step-by-step support for students.",
    },
    {
      title: "Learning Outcomes + Portfolio",
      description:
        "Students gain tool exposure, execution mindset, and 2-3 portfolio projects to showcase on LinkedIn and resumes.",
    },
    {
      title: "Beginner Friendly Roadmap",
      description:
        "Even absolute beginners can follow the roadmap with simplified modules, recaps, and guided practice.",
    },
  ];

  return (
    <section id="program-details" className="py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="fade-up text-center">
          <h2 className="text-3xl font-bold text-white">Program Details</h2>
          <p className="mt-3 text-slate-300">
            A beginner-friendly internship structure designed for student growth.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {details.map((detail) => (
            <div
              key={detail.title}
              className="surface-card hover-glow premium-transition p-6 hover:-translate-y-1"
            >
              <h3 className="text-lg font-semibold text-white">
                {detail.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                {detail.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}