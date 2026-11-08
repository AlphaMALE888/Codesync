import React from "react";
import { cn } from "@/lib/cn";

interface ArchMotifProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ArchMotif({ size = "md", className }: ArchMotifProps) {
  const sizeMap = {
    sm: "w-4 h-6",
    md: "w-6 h-9",
    lg: "w-10 h-15",
  };

  return (
    <svg
      viewBox="0 0 24 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("inline-block shrink-0", sizeMap[size], className)}
      aria-hidden="true"
    >
      {/* Awadhi Pointed Arch Outline */}
      <path
        d="M2 34V18C2 10.5 7.5 4.5 12 2C16.5 4.5 22 10.5 22 18V34H2Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Inner Accent Line */}
      <path
        d="M6 34V20C6 14.5 9.5 9.5 12 7.5C14.5 9.5 18 14.5 18 20V34"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.5"
      />
    </svg>
  );
}
