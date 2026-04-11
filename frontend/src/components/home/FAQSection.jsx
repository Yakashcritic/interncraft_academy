export default function FAQSection() {
  const faqs = [
    {
      question: "Is this program beginner friendly?",
      answer: "Yes, the internship is designed in a simple and structured way for students who are just getting started.",
    },
    {
      question: "Will I get recorded sessions?",
      answer: "Yes, both live and recorded learning access are included in the program.",
    },
    {
      question: "Will I receive a certificate?",
      answer: "Yes, students will receive a certificate after successful completion.",
    },
    {
      question: "Will I get project review support?",
      answer: "Yes, mentors review projects in checkpoints and suggest improvements for quality and presentation.",
    },
    {
      question: "How will classes be shared?",
      answer: "Google Meet links and recorded resources will be shared through official communication channels like WhatsApp.",
    },
  ];

  return (
    <section className="py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="fade-up mb-10 text-center">
          <h2 className="text-3xl font-bold text-white">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-slate-300">
            Clear answers to common student questions.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.question}
              className="surface-card premium-transition p-6 hover:-translate-y-1"
            >
              <h3 className="text-lg font-semibold text-white">
                {faq.question}
              </h3>
              <p className="mt-2 leading-7 text-slate-300">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}