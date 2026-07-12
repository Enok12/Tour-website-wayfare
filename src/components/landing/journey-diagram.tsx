const steps = [
  {
    n: "1",
    title: "You tell us your trip",
    body: "Share your dates, destinations, and the kind of trip you're after -- as little or as much detail as you like.",
  },
  {
    n: "2",
    title: "We personally review it",
    body: "A real person on our team reads every request. No queue, no bot triage.",
  },
  {
    n: "3",
    title: "We match you with a guide",
    body: "We hand-pick one of our trusted guides based on who's free and who fits your trip best.",
  },
  {
    n: "4",
    title: "You travel, guided",
    body: "Your guide takes it from there, in touch with you the whole way through.",
  },
];

export function JourneyDiagram() {
  return (
    <div className="relative">
      {/* Dotted route line connecting the waypoints -- desktop only */}
      <svg
        className="pointer-events-none absolute left-0 top-8 hidden w-full lg:block"
        height="4"
        viewBox="0 0 1000 4"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <line
          x1="60"
          y1="2"
          x2="940"
          y2="2"
          stroke="var(--pine-700)"
          strokeWidth="2"
          strokeDasharray="1 10"
          strokeLinecap="round"
        />
      </svg>

      <ol className="grid gap-8 lg:grid-cols-4">
        {steps.map((step) => (
          <li key={step.n} className="relative flex flex-col items-start gap-3">
            <span className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border-2 border-pine-700 bg-linen font-display text-xl text-pine-900">
              {step.n}
            </span>
            <h3 className="font-display text-lg text-pine-900">{step.title}</h3>
            <p className="text-sm leading-relaxed text-ink-muted">{step.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
