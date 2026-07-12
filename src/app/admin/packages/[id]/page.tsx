"use client";

import { use } from "react";
import { PackageForm } from "@/components/admin/package-form";
import { usePackageById } from "@/hooks/use-packages";

export default function EditPackagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: pkg, isLoading } = usePackageById(id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Edit Package</h1>
        <p className="text-sm text-text-secondary">Update this package&apos;s details.</p>
      </div>
      {isLoading || !pkg ? (
        <p className="text-sm text-text-secondary">Loading package...</p>
      ) : (
        <PackageForm initial={pkg} />
      )}
    </div>
  );
}
