export default function AnimatedGridBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(34,211,238,0.25),transparent_36%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.22),transparent_34%),linear-gradient(180deg,#020617_0%,#0b1120_48%,#111827_100%)]" />
      <div className="grid-scan absolute inset-0 opacity-60" />
      <div className="scan-beam absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-cyan-300/10 to-transparent" />
      <div className="absolute left-1/2 top-[-22rem] h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-cyan-400/12 blur-3xl" />
    </div>
  );
}
