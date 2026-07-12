import { cn } from "@/lib/utils";

export function Logo({ className, dark = false }: { className?: string; dark?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-display text-lg", className)}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <path
          d="M12 2 3 8.5 12 22 21 8.5 12 2Z"
          stroke={dark ? "#F1F4EE" : "#16302A"}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M12 2v20M3 8.5h18"
          stroke={dark ? "#CC9D47" : "#B8862E"}
          strokeWidth="1.2"
        />
      </svg>
      <span className={dark ? "text-linen" : "text-pine-900"}>Wayfare</span>
    </span>
  );
}
