import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Newsletter } from "@/components/landing/newsletter";
import { BRAND } from "@/content/site-content";

const columns = [
  {
    heading: "Explore",
    links: [
      { href: "/", label: "Home" },
      { href: "/packages", label: "Tour packages" },
      { href: "/destinations", label: "Destinations" },
      { href: "/experiences", label: "Experiences" },
      { href: "/travel-guide", label: "Travel guide" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/about", label: "About us" },
      { href: "/customize", label: "Customize your tour" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    heading: "Support",
    links: [
      { href: "/faq", label: "FAQs" },
      { href: "/track", label: "Track a booking" },
      { href: "/login", label: "Guide & admin sign in" },
    ],
  },
];

/**
 * Brand marks are drawn inline: lucide-react dropped its brand icon set, and
 * pulling in a second icon package for three glyphs is not worth the weight.
 */
const socials = [
  {
    href: "https://facebook.com",
    label: "Facebook",
    path: "M14 8.5h2.2V5.6c-.4 0-1.6-.1-3.1-.1-3 0-5.1 1.9-5.1 5.3v2.4H5.4v3.3H8V25h3.4v-8.5h2.6l.4-3.3h-3v-2.1c0-1 .3-1.6 1.6-1.6Z",
  },
  {
    href: "https://instagram.com",
    label: "Instagram",
    path: "M15 6.6c2.7 0 3.1 0 4.2.1 2.8.1 4.1 1.5 4.2 4.2.1 1.1.1 1.4.1 4.1s0 3.1-.1 4.1c-.1 2.7-1.4 4.1-4.2 4.2-1.1.1-1.4.1-4.2.1s-3.1 0-4.2-.1c-2.8-.1-4.1-1.5-4.2-4.2C6.6 18 6.6 17.7 6.6 15s0-3.1.1-4.1c.1-2.7 1.4-4.1 4.2-4.2 1.1-.1 1.4-.1 4.1-.1Zm0 4.7a3.7 3.7 0 1 0 0 7.4 3.7 3.7 0 0 0 0-7.4Zm0 6.1a2.4 2.4 0 1 1 0-4.8 2.4 2.4 0 0 1 0 4.8Zm4.7-6.2a.9.9 0 1 1-1.7 0 .9.9 0 0 1 1.7 0Z",
  },
  {
    href: "https://youtube.com",
    label: "YouTube",
    path: "M24.4 10.6a2.5 2.5 0 0 0-1.7-1.8C21.2 8.4 15 8.4 15 8.4s-6.2 0-7.7.4a2.5 2.5 0 0 0-1.7 1.8C5.2 12.1 5.2 15 5.2 15s0 2.9.4 4.4a2.5 2.5 0 0 0 1.7 1.8c1.5.4 7.7.4 7.7.4s6.2 0 7.7-.4a2.5 2.5 0 0 0 1.7-1.8c.4-1.5.4-4.4.4-4.4s0-2.9-.4-4.4ZM13.1 18v-6l5.1 3-5.1 3Z",
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-pine-950 text-linen">
      {/* Horizon wash -- keeps the largest dark block on the page from
          reading as a flat rectangle. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-64 opacity-[0.09]"
        style={{
          backgroundImage:
            "radial-gradient(70% 100% at 20% 0%, var(--brass-400) 0, transparent 60%), radial-gradient(60% 100% at 85% 10%, var(--pine-500) 0, transparent 55%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-16 sm:px-6 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,0.8fr)_1.2fr]">
          <div>
            <Logo dark showTagline className="mb-5" />
            <p className="max-w-xs text-sm leading-relaxed text-linen/70">
              Handcrafted journeys through Sri Lanka. Every request is read and matched by a
              person on our team to a guide we already trust — never by an algorithm.
            </p>

            <div className="mt-6 flex items-center gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-linen/70 transition-colors hover:border-brass-400 hover:text-brass-400"
                >
                  <svg viewBox="0 0 30 30" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {columns.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <h3 className="mb-4 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-brass-400">
                {column.heading}
              </h3>
              <ul className="space-y-2.5 text-sm text-linen/70">
                {column.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link href={link.href} className="transition-colors hover:text-linen">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <Newsletter variant="compact" />
        </div>

        <div className="mt-14 grid gap-6 border-t border-white/10 pt-8 sm:grid-cols-3">
          <a
            href={BRAND.phoneHref}
            className="flex items-start gap-3 text-sm text-linen/70 transition-colors hover:text-linen"
          >
            <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brass-400" />
            <span>
              {BRAND.phone}
              <span className="block text-[0.75rem] text-linen/45">{BRAND.hours}</span>
            </span>
          </a>
          <a
            href={`mailto:${BRAND.email}`}
            className="flex items-start gap-3 text-sm text-linen/70 transition-colors hover:text-linen"
          >
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brass-400" />
            <span>
              {BRAND.email}
              <span className="block text-[0.75rem] text-linen/45">We reply in person</span>
            </span>
          </a>
          <p className="flex items-start gap-3 text-sm text-linen/70">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brass-400" />
            <span>{BRAND.office}</span>
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-[0.75rem] text-linen/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {BRAND.name}. All rights reserved.
          </p>
          <p className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/faq" className="transition-colors hover:text-linen/80">
              Terms &amp; conditions
            </Link>
            <Link href="/faq" className="transition-colors hover:text-linen/80">
              Privacy policy
            </Link>
            <Link href="/contact" className="transition-colors hover:text-linen/80">
              Booking information
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
