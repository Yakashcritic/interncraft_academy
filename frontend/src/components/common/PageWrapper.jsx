export default function PageWrapper({ children }) {
  return (
    <main className="relative min-h-screen overflow-x-hidden px-4 py-10 sm:px-6 lg:px-8">
      <div
        className="pointer-events-none fixed inset-0 -z-10 noise-soft opacity-40"
        aria-hidden
      />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-slate-950 via-slate-900/95 to-slate-950" />
      <div className="relative mx-auto max-w-7xl">{children}</div>
    </main>
  );
}
