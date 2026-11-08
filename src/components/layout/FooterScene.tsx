import React from "react";
import { cn } from "@/lib/cn";

export function FooterScene({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden select-none pt-12 sm:pt-20 border-t border-white/10",
        className
      )}
      aria-hidden="true"
    >
      {/* Background Soft Arch Glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

      {/* Oversized Cropped Wordmark */}
      <div className="w-full flex justify-center leading-none">
        <span
          className={cn(
            "font-display font-black tracking-tighter uppercase text-white/95",
            "text-[18vw] sm:text-[19vw] lg:text-[20vw] leading-[0.78]",
            "translate-y-[12%] select-none pointer-events-none"
          )}
        >
          CODESYNC
        </span>
      </div>
    </div>
  );
}
