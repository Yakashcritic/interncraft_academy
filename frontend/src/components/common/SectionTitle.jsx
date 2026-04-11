export default function SectionTitle({ title, subtitle, center = true }) {
  return (
    <div className={center ? "fade-up-soft mb-10 text-center" : "fade-up-soft mb-10"}>
      <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mx-auto mt-3 max-w-3xl text-base leading-7 text-slate-300 md:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}