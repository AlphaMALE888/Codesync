import React from "react";
import { VisuallyHidden } from "./VisuallyHidden";
import { cn } from "@/lib/cn";

export interface DisplayMarqueeProps {
  text: string;
  separator?: React.ReactNode;
  speed?: number; // duration in seconds (default 32)
  direction?: "left" | "right";
  tone?: "light" | "dark";
  className?: string;
  asHeading?: boolean;
}

export function DisplayMarquee({
  text,
  separator = (
    <span className="mx-8 sm:mx-14 inline-flex items-center justify-center" aria-hidden="true">
      <span className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-accent-soft/85 ring-4 ring-accent/25" />
    </span>
  ),
  speed = 32,
  direction = "left",
  tone = "dark",
  className,
  asHeading = true,
}: DisplayMarqueeProps) {
  const isDark = tone === "dark";

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden select-none py-4 sm:py-8",
        isDark ? "bg-transparent text-on-dark" : "bg-transparent text-ink",
        className
      )}
    >
      {/* Accessible Title for Screen Readers */}
      {asHeading && (
        <VisuallyHidden>
          <h2>{text}</h2>
        </VisuallyHidden>
      )}

      {/* Marquee Track Container */}
      <div
        className={cn(
          "flex whitespace-nowrap w-max hover:[animation-play-state:paused] motion-reduce:hover:[animation-play-state:initial]",
          direction === "left" ? "animate-marquee-left" : "animate-marquee-right"
        )}
        style={{
          animationDuration: `${speed}s`,
        }}
        aria-hidden="true"
      >
        {/* Track 1 */}
        <div className="flex items-center shrink-0">
          <span className="type-display-xl tracking-tighter uppercase">{text}</span>
          {separator}
          <span className="type-display-xl tracking-tighter uppercase">{text}</span>
          {separator}
        </div>

        {/* Track 2 (Duplicate for Seamless Infinite Loop) */}
        <div className="flex items-center shrink-0">
          <span className="type-display-xl tracking-tighter uppercase">{text}</span>
          {separator}
          <span className="type-display-xl tracking-tighter uppercase">{text}</span>
          {separator}
        </div>
      </div>
    </div>
  );
}
