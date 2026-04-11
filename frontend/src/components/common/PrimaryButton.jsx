export default function PrimaryButton({
  children,
  href = "#",
  className = "",
}) {
  return (
    <a
      href={href}
      className={`premium-transition inline-block rounded-full bg-gradient-to-r from-slate-900 to-blue-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 hover:-translate-y-0.5 ${className}`}
    >
      {children}
    </a>
  );
}