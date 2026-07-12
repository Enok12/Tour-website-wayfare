import { PackageForm } from "@/components/admin/package-form";

export default function NewPackagePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">New Package</h1>
        <p className="text-sm text-text-secondary">Add a new tour package for customers to browse.</p>
      </div>
      <PackageForm />
    </div>
  );
}
