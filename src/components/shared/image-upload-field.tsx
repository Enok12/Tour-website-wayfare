"use client";

import { CldUploadButton } from "next-cloudinary";
import { ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadFieldProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
}

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

/**
 * Wraps next-cloudinary's unsigned upload widget. Requires
 * NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
 * to be configured (see .env.example) — until then it falls back to a plain
 * URL input so the rest of the form still works in local dev.
 */
export function ImageUploadField({ value, onChange, label, className }: ImageUploadFieldProps) {
  if (!cloudName || !uploadPreset) {
    return (
      <div className={className}>
        <input
          type="text"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste an image URL (configure Cloudinary to enable uploads)"
          className="flex h-9 w-full rounded-md border border-border-subtle bg-surface px-3 py-1 text-sm text-text-primary shadow-sm"
        />
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {value ? (
        <div className="relative h-16 w-16 overflow-hidden rounded-md border border-border-subtle">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt={label ?? "Uploaded image"} className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-0 top-0 rounded-bl-md bg-black/60 p-0.5 text-white"
            aria-label="Remove image"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <div className="flex h-16 w-16 items-center justify-center rounded-md border border-dashed border-border-subtle text-text-secondary">
          <ImagePlus className="h-5 w-5" />
        </div>
      )}

      <CldUploadButton
        uploadPreset={uploadPreset}
        options={{ maxFiles: 1, sources: ["local", "url", "camera"] }}
        className="inline-flex h-8 items-center justify-center rounded-md border border-border-subtle bg-surface px-3 text-xs font-medium text-text-primary shadow-sm transition-colors hover:bg-surface-muted"
        onSuccess={(result) => {
          if (result?.info && typeof result.info === "object" && "secure_url" in result.info) {
            onChange(result.info.secure_url as string);
          }
        }}
      >
        {value ? "Replace image" : "Upload image"}
      </CldUploadButton>
    </div>
  );
}
