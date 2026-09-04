import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope, Dancing_Script } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

/* Editorial serif for headings -- high contrast, travel-magazine feel. */
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

/* Modern geometric sans for body copy -- deliberate contrast to the serif. */
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

/* Expressive accent, used on a handful of hero words and nowhere else. */
const script = Dancing_Script({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-dancing",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wayfare | Authentic journeys, timeless memories",
  description:
    "Handcrafted tours built around Sri Lanka's most breathtaking places. Every trip is read and matched by a real person to one of our trusted local guides.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${manrope.variable} ${script.variable}`}>
      <body className="antialiased">
        <NextTopLoader color="#c89b3c" showSpinner={false} height={3} />
        <QueryProvider>
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
