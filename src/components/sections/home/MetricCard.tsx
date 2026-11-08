import React from "react";
import { cn } from "@/lib/cn";

export interface MetricCardProps {
  children: React.ReactNode;
  tone?: "dark" | "light" | "muted";
  className?: string;
}

export function MetricCard({ children, tone = "light", className }: MetricCardProps) {
  const toneClass = {
    dark: "bg-surface-dark text-on-dark border-white/10 shadow-lg",
    light: "bg-white text-ink border-hairline shadow-sm",
    muted: "bg-surface-muted text-ink border-hairline shadow-sm",
  }[tone];

  return (
    <div
      className={cn(
        "rounded-md p-6 sm:p-7 border flex flex-col justify-between transition-all duration-base",
        toneClass,
        className
      )}
    >
      {children}
    </div>
  );
}
