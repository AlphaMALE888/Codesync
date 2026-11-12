"use client";

import React, { forwardRef, useRef, useEffect } from "react";
import { cn } from "@/lib/cn";

export const StatementArt = forwardRef<SVGSVGElement, { className?: string }>(
  function StatementArt({ className }, ref) {
    const pathRef1 = useRef<SVGPathElement>(null);
    const pathRef2 = useRef<SVGPathElement>(null);
    const pathRef3 = useRef<SVGPathElement>(null);

    useEffect(() => {
      // Animate the ascending analytics line drawing in
      const paths = [pathRef1.current, pathRef2.current, pathRef3.current];
      paths.forEach((path) => {
        if (!path) return;
        const len = path.getTotalLength?.() ?? 300;
        path.style.strokeDasharray = `${len}`;
        path.style.strokeDashoffset = `${len}`;
        path.style.transition = "stroke-dashoffset 1.8s cubic-bezier(0.22, 1, 0.36, 1)";
      });

      const timer = setTimeout(() => {
        paths.forEach((path) => {
          if (path) path.style.strokeDashoffset = "0";
        });
      }, 300);

      return () => clearTimeout(timer);
    }, []);

    return (
      <svg
        ref={ref}
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("w-full h-auto select-none opacity-45 will-change-transform", className)}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="dmGrad1" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2F5A44" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#68A081" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="dmGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#49735A" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#162B20" stopOpacity="0.1" />
          </linearGradient>
          <filter id="nodeGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── Conversion Funnel (top-right) ── */}
        <path
          d="M280 40 L340 40 L320 90 L300 90 Z"
          stroke="#49735A"
          strokeWidth="1"
          strokeOpacity="0.5"
          fill="#2F5A44"
          fillOpacity="0.08"
        />
        <path
          d="M295 90 L325 90 L315 130 L305 130 Z"
          stroke="#49735A"
          strokeWidth="1"
          strokeOpacity="0.4"
          fill="#2F5A44"
          fillOpacity="0.08"
        />
        <path
          d="M302 130 L318 130 L314 160 L306 160 Z"
          stroke="#68A081"
          strokeWidth="1.25"
          strokeOpacity="0.6"
          fill="#2F5A44"
          fillOpacity="0.12"
        />

        {/* ── Ascending Analytics Line Chart ── */}
        <path
          ref={pathRef1}
          d="M40 320 L80 300 L120 280 L160 240 L200 200 L240 165 L280 130 L320 90 L360 55"
          stroke="url(#dmGrad1)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Shaded area under the line */}
        <path
          d="M40 320 L80 300 L120 280 L160 240 L200 200 L240 165 L280 130 L320 90 L360 55 L360 360 L40 360 Z"
          fill="#2F5A44"
          fillOpacity="0.07"
        />

        {/* ── Secondary trend line (slower growth) ── */}
        <path
          ref={pathRef2}
          d="M40 350 L80 345 L120 335 L160 318 L200 300 L240 278 L280 250 L320 220 L360 190"
          stroke="#2F5A44"
          strokeWidth="1.25"
          strokeOpacity="0.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="5 4"
        />

        {/* ── Data points on main line ── */}
        {[
          [80, 300], [120, 280], [160, 240],
          [200, 200], [240, 165], [280, 130], [320, 90],
        ].map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={i === 3 || i === 6 ? 4 : 2.5}
            fill="#68A081"
            fillOpacity={i === 3 || i === 6 ? 0.9 : 0.5}
            filter={i === 6 ? "url(#nodeGlow)" : undefined}
          />
        ))}

        {/* ── SEO Search signal ring ── */}
        <circle cx="80" cy="80" r="28" stroke="#49735A" strokeWidth="1" strokeOpacity="0.35" fill="none" />
        <circle cx="80" cy="80" r="18" stroke="#49735A" strokeWidth="1" strokeOpacity="0.25" fill="none" />
        <circle cx="80" cy="80" r="8" fill="#2F5A44" fillOpacity="0.3" />
        <line x1="100" y1="100" x2="116" y2="116" stroke="#68A081" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.6" />

        {/* ── Campaign network nodes ── */}
        {/* Node 1 */}
        <circle cx="200" cy="340" r="5" fill="#49735A" fillOpacity="0.7" filter="url(#nodeGlow)" />
        <circle cx="200" cy="340" r="10" stroke="#49735A" strokeWidth="0.75" strokeOpacity="0.3" fill="none" />
        {/* Node 2 */}
        <circle cx="300" cy="300" r="4" fill="#49735A" fillOpacity="0.5" />
        {/* Node 3 */}
        <circle cx="360" cy="260" r="3.5" fill="#68A081" fillOpacity="0.6" />

        {/* Connecting lines between nodes */}
        <path
          ref={pathRef3}
          d="M200 340 L300 300 L360 260"
          stroke="#49735A"
          strokeWidth="1"
          strokeOpacity="0.4"
          strokeLinecap="round"
          strokeDasharray="4 3"
        />

        {/* ── Traffic growth bar chart ── */}
        {[
          [42, 360, 42, 20],
          [52, 360, 52, 35],
          [62, 360, 62, 50],
          [72, 360, 72, 38],
          [82, 360, 82, 60],
          [92, 360, 92, 75],
          [102, 360, 102, 90],
        ].map(([x1, y1, x2, y2], i) => (
          <line
            key={`bar-${i}`}
            x1={x1} y1={y1}
            x2={x2} y2={Number(y1) - Number(y2)}
            stroke={i >= 5 ? "#68A081" : "#2F5A44"}
            strokeWidth="6"
            strokeOpacity={i >= 5 ? 0.6 : 0.3}
            strokeLinecap="round"
          />
        ))}

        {/* ── Subtle grid reference lines ── */}
        {[200, 280, 360].map((y) => (
          <line
            key={`grid-${y}`}
            x1="40" y1={y}
            x2="380" y2={y}
            stroke="#2F5A44"
            strokeWidth="0.5"
            strokeOpacity="0.15"
            strokeDasharray="3 6"
          />
        ))}

        {/* ── Axis lines ── */}
        <line x1="40" y1="40" x2="40" y2="370" stroke="#2F5A44" strokeWidth="0.75" strokeOpacity="0.3" />
        <line x1="40" y1="370" x2="380" y2="370" stroke="#2F5A44" strokeWidth="0.75" strokeOpacity="0.3" />
      </svg>
    );
  }
);
