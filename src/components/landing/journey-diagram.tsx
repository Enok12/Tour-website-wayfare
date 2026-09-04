const steps = [
  {
    n: "01",
    title: "You tell us your trip",
    body: "Share your dates, the places you have in mind, and the kind of trip you are after — as little or as much detail as you like.",
  },
  {
    n: "02",
    title: "We personally review it",
    body: "A real person on our team reads every request. No queue, no bot triage, no automated scoring.",
  },
  {
    n: "03",
    title: "We match you with a guide",
    body: "We hand-pick one of our trusted guides based on who is free and who genuinely fits your trip.",
  },
  {
    n: "04",
    title: "You travel, guided",
    body: "Your guide takes it from there, in touch with you the whole way through the island.",
  },
];

/**
 * Numbered waypoints on a gold rule. Stacks to a single column on mobile and
 * pairs up from `sm`, which keeps it legible inside the narrower homepage
 * column as well as full width on /about.
 */
export function JourneyDiagram() {
  return (
    <ol className="grid gap-x-10 gap-y-9 sm:grid-cols-2">
      {steps.map((step) => (
        <li key={step.n} className="relative border-t border-pine-900/12 pt-5">
          {/* Gold segment marking the start of each waypoint's rule. */}
          <span
            aria-hidden="true"
            className="absolute -top-px left-0 h-px w-10 bg-brass-500"
          />
          <p className="font-display text-[0.9375rem] font-semibold tracking-[0.1em] text-brass-600">
            {step.n}
          </p>
          <h3 className="mt-2 font-display text-[1.3125rem] font-semibold leading-tight text-pine-900">
            {step.title}
          </h3>
          <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-muted">{step.body}</p>
        </li>
      ))}
    </ol>
  );
}
