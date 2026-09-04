import { BENEFITS } from "@/content/site-content";
import { Reveal } from "@/components/landing/reveal";
import { cn } from "@/lib/utils";

/**
 * The benefits card. On the homepage it is pulled up to straddle the hero
 * edge (`float`), which is what gives the fold its layered, premium feel;
 * elsewhere it sits inline as a plain band.
 */
export function TrustBenefits({ float = false }: { float?: boolean }) {
  return (
    <div className={cn("relative z-10 mx-auto max-w-7xl px-5 sm:px-6", float && "-mt-16 lg:-mt-20")}>
      <Reveal
        className={cn(
          "grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-pine-900/8 sm:grid-cols-2 lg:grid-cols-4",
          float && "shadow-float"
        )}
      >
        {BENEFITS.map((benefit) => (
          <div
            key={benefit.title}
            className="group flex items-center gap-4 bg-linen px-6 py-7 transition-colors duration-300 hover:bg-white"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-pine-50 text-pine-700 transition-colors duration-300 group-hover:bg-brass-100 group-hover:text-brass-700">
              <benefit.icon className="h-5 w-5" strokeWidth={1.5} />
            </span>
            <div className="min-w-0">
              <h3 className="font-display text-[1.0625rem] font-semibold leading-tight text-pine-900">
                {benefit.title}
              </h3>
              <p className="mt-1 text-[0.8125rem] leading-snug text-ink-muted">{benefit.body}</p>
            </div>
          </div>
        ))}
      </Reveal>
    </div>
  );
}
