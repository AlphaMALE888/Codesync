import React from "react";
import { MediaSlot } from "@/components/ui/MediaSlot";
import { cn } from "@/lib/cn";

export interface HeroMediaProps {
  src?: string | null;
  poster?: string;
  className?: string;
}

export function HeroMedia({ src, poster, className }: HeroMediaProps) {
  if (!src) return null;

  return (
    <div
      className={cn(
        "absolute inset-0 w-full h-full -z-10 overflow-hidden rounded-lg select-none",
        className
      )}
      aria-hidden="true"
    >
      <MediaSlot
        src={src}
        poster={poster}
        aspect="auto"
        className="w-full h-full object-cover"
        rounded="lg"
        priority
      />
      {/* 40% Contrast Guard Overlay */}
      <div className="absolute inset-0 bg-surface-dark/40" />
    </div>
  );
}
