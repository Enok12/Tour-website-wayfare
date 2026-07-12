import Link from "next/link";
import { Logo } from "@/components/shared/logo";

export function Footer() {
  return (
    <footer className="border-t border-black/5 bg-pine-950 text-linen">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo dark className="mb-3" />
            <p className="max-w-xs text-sm text-pine-100/80">
              Every trip is reviewed and matched by hand to one of our trusted local guides --
              never an algorithm.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-brass-400">Explore</h3>
            <ul className="space-y-2 text-sm text-pine-100/80">
              <li><Link href="/packages" className="hover:text-linen">Tour Packages</Link></li>
              <li><Link href="/customize" className="hover:text-linen">Customize Your Tour</Link></li>
              <li><Link href="/about" className="hover:text-linen">About Us</Link></li>
              <li><Link href="/faq" className="hover:text-linen">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-brass-400">Support</h3>
            <ul className="space-y-2 text-sm text-pine-100/80">
              <li><Link href="/contact" className="hover:text-linen">Contact Us</Link></li>
              <li><Link href="/track" className="hover:text-linen">Track a Booking</Link></li>
              <li><Link href="/login" className="hover:text-linen">Guide &amp; Admin Sign In</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-brass-400">Reach us</h3>
            <ul className="space-y-2 text-sm text-pine-100/80">
              <li>hello@wayfare-tours.example</li>
              <li>+1 (555) 010-2938</li>
              <li>Mon-Sat, 9am-6pm</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-pine-100/60">
          &copy; {new Date().getFullYear()} Wayfare Tours. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
