import { DashboardTopbar } from "@/components/admin/topbar";
import { PageTransition } from "@/components/providers/page-transition";

const navLinks = [{ href: "/member", label: "My Tours", exact: true }];

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <DashboardTopbar links={navLinks} />
      <main className="mx-auto w-full max-w-4xl flex-1 p-4 sm:p-6 lg:p-8">
        <PageTransition>{children}</PageTransition>
      </main>
    </div>
  );
}
