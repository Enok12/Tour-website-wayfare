import { ShieldCheck, Users, BadgePercent } from "lucide-react";

const badges = [
  {
    icon: ShieldCheck,
    title: "Reviewed by a person",
    body: "Every request is read and considered by our team -- never sorted by an algorithm.",
  },
  {
    icon: Users,
    title: "Vetted local guides",
    body: "We only work with guides we'd personally send our own family to.",
  },
  {
    icon: BadgePercent,
    title: "No booking fees, ever",
    body: "What you agree with your guide is what you pay -- nothing added on top.",
  },
];

export function TrustBadges() {
  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:grid-cols-3 sm:px-6">
      {badges.map((badge) => (
        <div key={badge.title} className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-pine-50 text-pine-800">
            <badge.icon className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-display text-base text-pine-900">{badge.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-ink-muted">{badge.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
