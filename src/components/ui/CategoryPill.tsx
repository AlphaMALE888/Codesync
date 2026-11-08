import React from "react";
import { cn } from "@/lib/cn";

export interface CategoryPillProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: "light" | "dark" | "outline";
  className?: string;
}

export function CategoryPill({
  children,
  variant = "light",
  className,
  ...props
}: CategoryPillProps) {
  const variantClass = {
    light: "bg-surface-muted text-ink border border-hairline",
    dark: "bg-surface-dark-2 text-on-dark border border-white/10",
    outline: "bg-transparent text-current border border-hairline",
  }[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-pill type-label text-[11px] font-medium leading-none tracking-wider",
        variantClass,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
