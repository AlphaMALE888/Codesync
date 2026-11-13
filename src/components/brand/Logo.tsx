import React from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

interface LogoProps {
  tone?: "light" | "dark" | "auto";
  className?: string;
  showWordmark?: boolean;
}

export function Logo({ tone = "auto", className, showWordmark = true }: LogoProps) {
  const isDark = tone === "dark";
  const isLight = tone === "light";

  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2.5 group select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 rounded-sm",
        className
      )}
      aria-label="CODESYNC Digi Marketing Home"
    >
      {/* Brand Icon Capsule / Loop Silhouette */}
      <span
        className={cn(
          "w-8 h-8 rounded-pill flex items-center justify-center transition-colors duration-fast border",
          isDark
            ? "bg-surface-dark-2 border-white/20 text-white"
            : isLight
            ? "bg-white border-hairline text-ink"
            : "bg-white/10 border-white/12 text-white group-hover:bg-accent group-hover:text-white"
        )}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
        >
          {/* Synchronized dynamic loop / code brackets motif */}
          <path
            d="M8 7L3 12L8 17"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 7L21 12L16 17"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13 5L11 19"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            opacity="0.6"
          />
        </svg>
      </span>

      {/* Wordmark */}
      {showWordmark && (
        <span
          className={cn(
            "font-display font-bold text-sm tracking-tight uppercase transition-colors duration-fast",
            isDark ? "text-white" : isLight ? "text-ink" : "text-white"
          )}
        >
          CODESYNC
        </span>
      )}
    </Link>
  );
}
