import React from "react";
import { cn } from "@/lib/cn";

export function GrowArt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-full h-auto select-none", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="growGrad" x1="0" y1="240" x2="320" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2F5A44" stopOpacity="0.8" />
          <stop offset="1" stopColor="#68A081" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      {/* Background Grid Lines */}
      <path d="M40 200 H280 M40 140 H280 M40 80 H280" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="3 3" />
      {/* Upward Growth Trend Curve */}
      <path
        d="M50 190 C110 170 140 110 200 85 C240 70 260 45 280 40"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Pointed Arch Growth Node */}
      <path
        d="M200 85 V60 C200 48 210 40 220 32 C230 40 240 48 240 60 V85 Z"
        stroke="#68A081"
        strokeWidth="1.5"
        fill="url(#growGrad)"
      />
      {/* Data Pulse Points */}
      <circle cx="50" cy="190" r="4" fill="currentColor" />
      <circle cx="125" cy="148" r="4" fill="currentColor" />
      <circle cx="200" cy="85" r="5" fill="#68A081" />
      <circle cx="280" cy="40" r="4" fill="currentColor" />
    </svg>
  );
}
