import React from "react";
import { cn } from "@/lib/cn";

export function BuildArt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-full h-auto select-none", className)}
      aria-hidden="true"
    >
      {/* Outer Browser/App Window Frame */}
      <rect x="40" y="30" width="240" height="175" rx="12" stroke="currentColor" strokeWidth="2" strokeOpacity="0.4" />
      {/* Browser Header Bar */}
      <line x1="40" y1="65" x2="280" y2="65" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.2" />
      <circle cx="58" cy="48" r="3.5" fill="currentColor" fillOpacity="0.4" />
      <circle cx="70" cy="48" r="3.5" fill="currentColor" fillOpacity="0.4" />
      <circle cx="82" cy="48" r="3.5" fill="currentColor" fillOpacity="0.4" />
      {/* Hero Container Wireframe Inside */}
      <rect x="60" y="80" width="200" height="55" rx="6" stroke="#68A081" strokeWidth="1.5" strokeOpacity="0.6" fill="currentColor" fillOpacity="0.05" />
      {/* Grid Columns Below */}
      <rect x="60" y="145" width="60" height="42" rx="4" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
      <rect x="130" y="145" width="60" height="42" rx="4" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
      <rect x="200" y="145" width="60" height="42" rx="4" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
      {/* Mobile Device Offset Wireframe */}
      <rect x="230" y="90" width="55" height="105" rx="8" fill="#1A1B1C" stroke="currentColor" strokeWidth="1.5" />
      <rect x="240" y="105" width="35" height="70" rx="3" stroke="#68A081" strokeWidth="1" strokeOpacity="0.8" />
    </svg>
  );
}
