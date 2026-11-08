import React from "react";
import { cn } from "@/lib/cn";

export function SkipLink({ targetId = "main", label = "Skip to main content" }: { targetId?: string; label?: string }) {
  return (
    <a
      href={`#${targetId}`}
      className={cn(
        "sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50",
        "px-4 py-2 bg-ink text-white font-medium rounded-sm border border-hairline shadow-lg",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
      )}
    >
      {label}
    </a>
  );
}
