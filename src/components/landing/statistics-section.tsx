import { STATS } from "@/content/site-content";
import { Reveal } from "@/components/landing/reveal";

/** Dark pine strip with gold numerals -- the site's one high-contrast band. */
export function StatisticsSection() {
  return (
    <section className="mx-auto max-w-7xl px-5 sm:px-6">
      <Reveal className="relative overflow-hidden rounded-3xl bg-pine-900">
        {/* Faint topographic wash so the band is not a flat rectangle. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 12% 20%, var(--brass-400) 0, transparent 42%), radial-gradient(circle at 88% 85%, var(--pine-500) 0, transparent 45%)",
          }}
        />

        <dl className="relative grid grid-cols-2 gap-y-10 px-8 py-12 sm:px-12 lg:grid-cols-4 lg:gap-y-0">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className="flex items-center gap-4 lg:justify-center lg:border-l lg:border-white/10 lg:first:border-l-0"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <stat.icon className="h-7 w-7 shrink-0 text-brass-500" strokeWidth={1.25} />
              <div>
                <dd className="font-display text-[1.875rem] font-semibold leading-none text-linen sm:text-[2.25rem]">
                  {stat.value}
                </dd>
                <dt className="mt-1.5 text-[0.75rem] tracking-wide text-linen/60">{stat.label}</dt>
              </div>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}
