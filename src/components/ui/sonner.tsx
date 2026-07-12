"use client";

import { Toaster as Sonner } from "sonner";

function Toaster(props: React.ComponentProps<typeof Sonner>) {
  return (
    <Sonner
      className="toaster group"
      position="top-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast bg-surface text-text-primary border border-border-subtle shadow-lg rounded-lg",
          description: "text-text-secondary",
          actionButton: "bg-accent text-accent-foreground",
          cancelButton: "bg-surface-muted text-text-secondary",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
