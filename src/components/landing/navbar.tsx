"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone, Search, X, LogIn } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/content/site-content";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/destinations", label: "Destinations" },
  { href: "/packages", label: "Packages" },
  { href: "/experiences", label: "Experiences" },
  { href: "/travel-guide", label: "Travel Guide" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

/**
 * Pages that open with a full-bleed dark hero image directly under the nav --
 * the only places the transparent-over-image treatment makes sense.
 * Everywhere else the nav sits on the cream page background from the start.
 */
const HERO_PAGE_PATTERN = /^\/(|destinations|experiences|packages\/[^/]+|travel-guide\/[^/]+)$/;

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const hasHero = HERO_PAGE_PATTERN.test(pathname);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 32);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock the page behind the mobile drawer so the body doesn't scroll under it.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const transparent = hasHero && !scrolled && !open;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Utility strip -- contact details plus the two account entry points
          that used to live in the main nav. Collapses away on scroll so the
          nav itself stays light. */}
      <div
        className={cn(
          "hidden overflow-hidden border-b border-white/10 bg-pine-950 text-linen/75 transition-all duration-300 lg:block",
          scrolled ? "max-h-0 opacity-0" : "max-h-12 opacity-100"
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 text-xs">
          <p className="tracking-wide">
            Every request is read by a person, not an algorithm.
          </p>
          <div className="flex items-center gap-6">
            <a href={`mailto:${BRAND.email}`} className="transition-colors hover:text-brass-400">
              {BRAND.email}
            </a>
            <Link href="/track" className="inline-flex items-center gap-1.5 transition-colors hover:text-brass-400">
              <Search className="h-3.5 w-3.5" /> Track booking
            </Link>
            <Link href="/login" className="inline-flex items-center gap-1.5 transition-colors hover:text-brass-400">
              <LogIn className="h-3.5 w-3.5" /> Guide sign in
            </Link>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div
        className={cn(
          "border-b transition-colors duration-300",
          transparent
            ? "border-transparent bg-gradient-to-b from-pine-950/55 to-transparent"
            : "border-pine-900/8 bg-linen/92 shadow-[0_1px_20px_-14px_rgba(13,38,32,0.5)] backdrop-blur-md"
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-3.5 sm:px-6">
          <Link href="/" aria-label={`${BRAND.name} home`}>
            <Logo dark={transparent} showTagline />
          </Link>

          <nav className="hidden items-center gap-7 xl:flex">
            {links.map((link) => {
              const active =
                link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative py-1 text-[0.8125rem] font-medium tracking-wide transition-colors",
                    transparent
                      ? "text-white/85 hover:text-white"
                      : active
                        ? "text-pine-900"
                        : "text-ink-muted hover:text-pine-900"
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      "absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-brass-500 transition-transform duration-300",
                      active && "scale-x-100"
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-5 lg:flex">
            <a
              href={BRAND.phoneHref}
              className={cn(
                "inline-flex items-center gap-2 text-[0.8125rem] font-medium transition-colors",
                transparent ? "text-white/85 hover:text-white" : "text-pine-900 hover:text-brass-600"
              )}
            >
              <Phone className="h-3.5 w-3.5" />
              {BRAND.phone}
            </a>
            <Button asChild variant={transparent ? "brassSolid" : "brand"} size="pill">
              <Link href="/customize">Plan Your Trip</Link>
            </Button>
          </div>

          <button
            className={cn(
              "-mr-2 rounded-md p-2 transition-colors lg:hidden",
              transparent ? "text-white" : "text-pine-900"
            )}
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 top-[64px] overflow-y-auto bg-linen transition-[opacity,transform] duration-300 lg:hidden",
          open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
        )}
      >
        <nav className="flex flex-col px-5 pb-10 pt-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="border-b border-pine-900/8 py-4 font-display text-2xl text-pine-900"
            >
              {link.label}
            </Link>
          ))}

          <Button asChild variant="brand" size="lg" className="mt-7 w-full">
            <Link href="/customize">Plan Your Trip</Link>
          </Button>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <Button asChild variant="quiet" size="lg">
              <Link href="/track">Track booking</Link>
            </Button>
            <Button asChild variant="quiet" size="lg">
              <Link href="/login">Sign in</Link>
            </Button>
          </div>

          <div className="mt-8 space-y-1 text-sm text-ink-muted">
            <a href={BRAND.phoneHref} className="block hover:text-pine-900">
              {BRAND.phone}
            </a>
            <a href={`mailto:${BRAND.email}`} className="block hover:text-pine-900">
              {BRAND.email}
            </a>
            <p>{BRAND.hours}</p>
          </div>
        </nav>
      </div>
    </header>
  );
}
