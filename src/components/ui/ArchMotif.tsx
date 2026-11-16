import React from "react";
import { Orbit } from "lucide-react";
import { cn } from "@/lib/cn";

interface ArchMotifProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ArchMotif({ size = "md", className }: ArchMotifProps) {
  const dims = {
    sm: "w-3.5 h-3.5",
    md: "w-5 h-5",
    lg: "w-7 h-7",
  }[size];

  return (
    <Orbit
      className={cn("inline-block shrink-0 text-accent-soft", dims, className)}
      aria-hidden="true"
    />
  );
}
