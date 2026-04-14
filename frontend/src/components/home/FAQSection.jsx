export default function FAQSection() {
  const faqs = [
    {
      question: "Is this program beginner friendly?",
      answer: "Yes, all programs are designed for beginners.",
    },
    {
      question: "Will I get a certificate?",
      answer: "Yes, you will receive an internship certificate after completion.",
    },
    {
      question: "How long is the program?",
      answer: "Typically 30 days depending on the course.",
    },
    {
      question: "Do I need prior experience?",
      answer: "No prior experience required.",
    },
  ];

  return (
    <section className="py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="fade-up mb-10 text-center">
          <h2 className="text-3xl font-bold text-white">Frequently Asked Questions</h2>
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