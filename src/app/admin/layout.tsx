import { AdminSidebar } from "@/components/admin/sidebar";
import { DashboardTopbar } from "@/components/admin/topbar";
import { PageTransition } from "@/components/providers/page-transition";

const navLinks = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/requests", label: "Requests" },
  { href: "/admin/packages", label: "Packages" },
  { href: "/admin/members", label: "Members" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <DashboardTopbar links={navLinks} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </div>
  );
}
