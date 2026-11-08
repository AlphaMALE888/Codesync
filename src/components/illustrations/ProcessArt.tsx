import React from "react";
import { cn } from "@/lib/cn";

export interface ProcessArtProps {
  activeStep?: number;
  className?: string;
}

export function ProcessArt({ activeStep = 1, className }: ProcessArtProps) {
  const steps = [
    { num: 1, label: "Discover", cx: 60, cy: 120 },
    { num: 2, label: "Plan", cx: 140, cy: 120 },
    { num: 3, label: "Build", cx: 220, cy: 120 },
    { num: 4, label: "Launch", cx: 300, cy: 120 },
  ];

  return (
    <svg
      viewBox="0 0 360 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-full h-auto select-none", className)}
      aria-hidden="true"
    >
      {/* Connecting Pipeline Trail */}
      <path
        d="M60 120 C100 120 100 120 140 120 C180 120 180 120 220 120 C260 120 260 120 300 120"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="4 4"
        strokeOpacity="0.3"
      />

      {/* 4 Connected Awadhi Arch Nodes */}
      {steps.map((s) => {
        const isActive = s.num === activeStep;
        return (
          <g key={s.num} className="transition-all duration-300">
            {/* Arch Silhouette */}
            <path
              d={`M${s.cx - 24} 150 V110 C${s.cx - 24} 95 ${s.cx - 12} 80 ${s.cx} 70 C${s.cx + 12} 80 ${s.cx + 24} 95 ${s.cx + 24} 150 Z`}
              fill={isActive ? "#2F5A44" : "currentColor"}
              fillOpacity={isActive ? 0.35 : 0.05}
              stroke={isActive ? "#68A081" : "currentColor"}
              strokeWidth={isActive ? 2 : 1}
              strokeOpacity={isActive ? 1 : 0.25}
            />
            {/* Center Indicator Pin */}
            <circle
              cx={s.cx}
              cy={120}
              r={isActive ? 6 : 4}
              fill={isActive ? "#68A081" : "currentColor"}
              fillOpacity={isActive ? 1 : 0.4}
            />
            {/* Step Number */}
            <text
              x={s.cx}
              y={175}
              textAnchor="middle"
              className="text-[11px] font-mono font-bold fill-current opacity-70"
            >
              0{s.num}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
