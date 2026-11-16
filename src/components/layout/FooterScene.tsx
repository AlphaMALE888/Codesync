import React from "react";
import { cn } from "@/lib/cn";

export function FooterScene({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative w-full select-none pt-10 sm:pt-16 border-t border-white/10",
        className
      )}
      aria-hidden="true"
    >
      {/* Subtle Crimson Bottom Horizon Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#09090B]/75 via-[#641B30]/10 to-transparent pointer-events-none" />

      {/* Oversized Full-Width Wordmark — contained within parent overflow-hidden */}
      <div className="w-full flex justify-center leading-none pb-0">
        <span
          className={cn(
            "font-display font-black uppercase text-white/95 block text-center w-full",
            "leading-[0.82] select-none pointer-events-none"
          )}
          style={{
            fontSize: "clamp(2.5rem, 14vw, 12.5rem)",
            letterSpacing: "-0.025em",
            whiteSpace: "nowrap",
          }}
        >
          CODESYNC
        </span>
      </div>
    </div>
  );
}
