import React, { forwardRef } from "react";
import { cn } from "@/lib/cn";

export const StatementArt = forwardRef<SVGSVGElement, { className?: string }>(
  function StatementArt({ className }, ref) {
    return (
      <svg
        ref={ref}
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("w-full h-auto select-none opacity-40 will-change-transform", className)}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="statementGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#49735A" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#162B20" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Outer Concentric Arch 1 */}
        <path
          d="M40 380 V220 C40 120 120 40 200 10 C280 40 360 120 360 220 V380"
          stroke="url(#statementGrad)"
          strokeWidth="1.5"
        />

        {/* Concentric Arch 2 */}
        <path
          d="M80 380 V240 C80 155 140 85 200 60 C260 85 320 155 320 240 V380"
          stroke="url(#statementGrad)"
          strokeWidth="1.25"
          strokeOpacity="0.7"
        />

        {/* Concentric Arch 3 */}
        <path
          d="M120 380 V260 C120 190 160 135 200 115 C240 135 280 190 280 260 V380"
          stroke="url(#statementGrad)"
          strokeWidth="1"
          strokeOpacity="0.5"
        />

        {/* Innermost Arch Core 4 */}
        <path
          d="M160 380 V280 C160 230 180 190 200 175 C220 190 240 230 240 280 V380"
          stroke="#68A081"
          strokeWidth="2"
          strokeOpacity="0.9"
        />
      </svg>
    );
  }
);
