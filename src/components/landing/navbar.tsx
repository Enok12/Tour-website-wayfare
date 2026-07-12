"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/packages", label: "Packages" },
  { href: "/customize", label: "Customize Your Tour" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-linen/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium text-ink-muted transition-colors hover:text-pine-900",
                pathname === link.href && "text-pine-900"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Button asChild variant="outline" size="sm">
            <Link href="/track">Track Booking</Link>
          </Button>
          <Button asChild variant="brand" size="sm">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>

        <button
          className="rounded-md p-2 text-pine-900 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-black/5 bg-linen px-4 pb-4 lg:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium text-ink hover:bg-linen-dark"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/track"
            onClick={() => setOpen(false)}
            className="rounded-md px-3 py-2 text-sm font-medium text-ink hover:bg-linen-dark"
          >
            Track Booking
          </Link>
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-md bg-pine-900 px-3 py-2 text-center text-sm font-medium text-white"
          >
            Sign In
          </Link>
        </nav>
      )}
    </header>
  );
}
