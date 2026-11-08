import React from "react";

export interface AnnouncementTickerProps {
  announcement?: string | null;
  className?: string;
}

export function AnnouncementTicker({ announcement }: AnnouncementTickerProps) {
  // Renders null when no verified announcement exists
  if (!announcement) {
    return null;
  }

  return (
    <div className="w-full bg-surface-dark-2 text-text-secondary-on-dark py-2.5 px-4 text-xs font-mono border-b border-white/10 flex items-center justify-between">
      <span className="truncate">{announcement}</span>
      <span className="uppercase text-[10px] tracking-widest text-accent-soft shrink-0 ml-4">
        {"// CODESYNC"}
      </span>
    </div>
  );
}
