export function PageHeader({
  eyebrow,
  title,
  subtitle,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="mb-3 font-display text-base italic text-brass-600">{eyebrow}</p>
      <h1 className="font-sans text-4xl font-bold leading-[1.05] tracking-tight text-pine-950 sm:text-5xl">
        {title}
      </h1>
      {subtitle && <p className="mt-5 text-lg leading-relaxed text-ink-muted">{subtitle}</p>}
    </div>
  );
}
