import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";

export interface SplitArrowButtonProps {
  href?: string;
  onClick?: () => void;
  variant?: "solid-light" | "solid-dark" | "outline";
  size?: "md" | "lg";
  children: React.ReactNode;
  className?: string;
  "aria-label"?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export function SplitArrowButton({
  href,
  onClick,
  variant = "solid-light",
  size = "md",
  children,
  className,
  "aria-label": ariaLabel,
  disabled,
  type = "button",
}: SplitArrowButtonProps) {
  const baseClasses = cn(
    "group inline-flex items-center justify-between rounded-pill font-medium transition-all duration-fast ease-out-custom select-none",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2",
    "active:scale-[0.98] motion-reduce:active:scale-100",
    size === "md" ? "min-h-[44px] pl-5 pr-2 py-1.5 text-sm gap-3" : "min-h-[52px] pl-6 pr-2.5 py-2 text-base gap-4",
    variant === "solid-light" && "bg-white text-ink border border-hairline hover:bg-surface-muted shadow-sm",
    variant === "solid-dark" && "bg-surface-dark text-on-dark border border-white/10 hover:bg-surface-dark-2 shadow-sm",
    variant === "outline" && "bg-transparent text-current border border-current hover:bg-current/5",
    disabled && "opacity-50 pointer-events-none cursor-not-allowed",
    className
  );

  const iconTileClasses = cn(
    "flex items-center justify-center rounded-pill transition-all duration-fast ease-out-custom shrink-0",
    size === "md" ? "w-8 h-8" : "w-9 h-9",
    variant === "solid-light" && "bg-ink text-white group-hover:bg-accent",
    variant === "solid-dark" && "bg-white/10 text-white group-hover:bg-accent group-hover:text-white",
    variant === "outline" && "bg-current/10 text-current group-hover:bg-current group-hover:text-white"
  );

  const content = (
    <>
      <span className="tracking-tight whitespace-nowrap">{children}</span>
      <span className={iconTileClasses} aria-hidden="true">
        <ArrowUpRight
          className={cn(
            "w-4 h-4 transition-transform duration-fast ease-out-custom",
            "group-hover:translate-x-[2px] group-hover:-translate-y-[2px] motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0"
          )}
        />
      </span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={baseClasses} aria-label={ariaLabel}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
      aria-label={ariaLabel}
    >
      {content}
    </button>
  );
}
