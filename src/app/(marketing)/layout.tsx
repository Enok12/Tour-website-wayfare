import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { PageTransition } from "@/components/providers/page-transition";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </div>
  );
}
