import { ShieldCheck, Compass, HeartHandshake } from "lucide-react";

const values = [
  {
    icon: Compass,
    title: "Every trip, read by a person",
    body: "No request goes through an algorithm. Each one is read, considered, and matched by our team.",
  },
  {
    icon: ShieldCheck,
    title: "Guides we already trust",
    body: "Every guide we work with has been personally vetted -- we only assign people we'd send our own family to.",
  },
  {
    icon: HeartHandshake,
    title: "Matched to fit, not to queue",
    body: "We pick the guide who's the best fit for your trip and your dates -- not whoever happens to be next.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <p className="mb-3 font-display italic text-brass-600">About us</p>
      <h1 className="max-w-2xl font-sans text-4xl font-bold tracking-tight text-pine-950 sm:text-5xl">
        We started this because trip planning shouldn&apos;t feel automated.
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
        Wayfare began as one person personally organizing tours for friends, then friends of
        friends. As requests grew past what any one person could run alone, we built a small
        team of trusted guides -- but kept the part that mattered: every request is still read
        and matched by hand, never handed off to a matching algorithm.
      </p>

      <div className="mt-14 grid gap-8 sm:grid-cols-3">
        {values.map((value) => (
          <div key={value.title}>
            <value.icon className="h-6 w-6 text-brass-600" />
            <h3 className="mt-3 font-display text-lg text-pine-900">{value.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">{value.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
