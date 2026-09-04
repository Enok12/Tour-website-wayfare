"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Fade + rise on scroll into view. Deliberately CSS/IntersectionObserver
 * rather than framer-motion's `whileInView` so that stacking dozens of these
 * down a long marketing page costs one observer each and no animation loop.
 *
 * Honours prefers-reduced-motion by rendering already-visible.
 */
export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  className,
}: {
  children: ReactNode;
  as?: ElementType;
  /** Stagger, in milliseconds. */
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: shown ? `${delay}ms` : undefined }}
      className={cn(
        "transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none",
        shown ? "translate-y-0 opacity-100" : "translate-y-3.5 opacity-0",
        className
      )}
    >
      {children}
    </Tag>
  );
}
