import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/landing/page-header";
import { Reveal } from "@/components/landing/reveal";
import { BRAND } from "@/content/site-content";

const channels = [
  { icon: Mail, label: "Email", value: BRAND.email, href: `mailto:${BRAND.email}`, note: "We reply in person" },
  { icon: Phone, label: "Phone", value: BRAND.phone, href: BRAND.phoneHref, note: BRAND.hours },
  { icon: MapPin, label: "Office", value: BRAND.office, href: undefined, note: "By appointment" },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 pt-36 sm:px-6 lg:pb-28 lg:pt-40">
      <PageHeader
        eyebrow="Get in touch"
        title="We'd love to"
        accent="hear from you"
        subtitle="Have a question before you book, or already travelling and need help? Reach out directly — a person will get back to you, not a ticketing queue."
      />

      <div className="mt-14 grid gap-5 sm:grid-cols-3">
        {channels.map((channel, i) => (
          <Reveal key={channel.label} delay={i * 80}>
            <div className="h-full rounded-2xl bg-white p-7 shadow-card transition-shadow duration-300 hover:shadow-card-hover">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-pine-50 text-pine-700">
                <channel.icon className="h-5 w-5" strokeWidth={1.5} />
              </span>
              <p className="mt-5 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-ink-subtle">
                {channel.label}
              </p>
              {channel.href ? (
                <a
                  href={channel.href}
                  className="mt-1.5 block font-display text-[1.25rem] font-semibold leading-tight text-pine-900 transition-colors hover:text-brass-600"
                >
                  {channel.value}
                </a>
              ) : (
                <p className="mt-1.5 font-display text-[1.25rem] font-semibold leading-tight text-pine-900">
                  {channel.value}
                </p>
              )}
              <p className="mt-2 text-[0.8125rem] text-ink-muted">{channel.note}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <Reveal className="rounded-2xl bg-pine-900 p-9 sm:p-11">
          <MessageCircle className="h-8 w-8 text-brass-400" strokeWidth={1.4} />
          <h2 className="mt-5 font-display text-[1.75rem] font-semibold leading-tight text-linen">
            Already know what trip you want?
          </h2>
          <p className="mt-3 max-w-sm text-[0.9375rem] leading-relaxed text-linen/70">
            Skip the back-and-forth and send us the details directly. You will get a booking
            reference straight away.
          </p>
          <Button asChild variant="brassSolid" size="pill" className="mt-7">
            <Link href="/customize">Customize your tour</Link>
          </Button>
        </Reveal>

        <Reveal delay={100} className="rounded-2xl border border-brass-500/20 bg-linen-dark/50 p-9 sm:p-11">
          <Search className="h-8 w-8 text-brass-600" strokeWidth={1.4} />
          <h2 className="mt-5 font-display text-[1.75rem] font-semibold leading-tight text-pine-900">
            Already sent a request?
          </h2>
          <p className="mt-3 max-w-sm text-[0.9375rem] leading-relaxed text-ink-muted">
            Check where your trip has got to with the booking reference we sent you — no account
            needed.
          </p>
          <Button asChild variant="quiet" size="pill" className="mt-7">
            <Link href="/track">Track your booking</Link>
          </Button>
        </Reveal>
      </div>
    </div>
  );
}
