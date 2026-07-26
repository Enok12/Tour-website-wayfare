import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/landing/page-header";

const channels = [
  { icon: Mail, label: "Email", value: "hello@wayfare-tours.example", href: "mailto:hello@wayfare-tours.example" },
  { icon: Phone, label: "Phone", value: "+1 (555) 010-2938", href: "tel:+15550102938" },
  { icon: MapPin, label: "Office", value: "Open by appointment", href: undefined },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 pb-16 pt-32 sm:px-6">
      <PageHeader
        eyebrow="Get in touch"
        title="We'd love to hear from you"
        subtitle="Have a question before you book, or already traveling and need help? Reach out directly -- a person will get back to you, not a ticketing queue."
      />

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {channels.map((channel) => (
          <div
            key={channel.label}
            className="rounded-xl border border-black/5 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <channel.icon className="h-6 w-6 text-brass-600" />
            <p className="mt-3 text-xs font-medium uppercase tracking-wide text-ink-muted">
              {channel.label}
            </p>
            {channel.href ? (
              <a href={channel.href} className="mt-1 block font-display text-lg text-pine-900 hover:underline">
                {channel.value}
              </a>
            ) : (
              <p className="mt-1 font-display text-lg text-pine-900">{channel.value}</p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-2xl bg-pine-900 p-8 text-center text-white">
        <MessageCircle className="mx-auto h-8 w-8 text-brass-400" />
        <h2 className="mt-3 font-display text-xl">Already know what trip you want?</h2>
        <p className="mt-2 text-pine-100/80">
          Skip the back-and-forth and submit your trip details directly.
        </p>
        <Button asChild variant="brassOutline" className="mt-5 border-brass-400 text-brass-400 hover:bg-white/5">
          <Link href="/customize">Customize your tour</Link>
        </Button>
      </div>
    </div>
  );
}
