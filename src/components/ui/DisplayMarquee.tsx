import React from "react";
import { ArchMotif } from "./ArchMotif";
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
  separator = <ArchMotif size="lg" className="mx-8 sm:mx-16 opacity-60 text-current" />,
  speed = 32,
  direction = "left",
  tone = "light",
  className,
  asHeading = true,
}: DisplayMarqueeProps) {
  const isDark = tone === "dark";

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden select-none py-4 sm:py-8",
        isDark ? "bg-surface-dark text-on-dark" : "bg-canvas text-ink",
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
