"use client";

import React, { useEffect, useState } from "react";

interface PillarRailProps {
  activePillar: "grow" | "build" | "run";
  onSelectPillar?: (pillar: "grow" | "build" | "run") => void;
}

const PILLARS: { id: "grow" | "build" | "run"; num: string; label: string; desc: string }[] = [
  { id: "grow", num: "01", label: "GROW", desc: "Digital Marketing" },
  { id: "build", num: "02", label: "BUILD", desc: "Websites & Apps" },
  { id: "run", num: "03", label: "RUN", desc: "Business Software" },
];

export function PillarRail({ activePillar, onSelectPillar }: PillarRailProps) {
  const [current, setCurrent] = useState<"grow" | "build" | "run">(activePillar);

  useEffect(() => {
    setCurrent(activePillar);
  }, [activePillar]);

  // Handle click scroll
  const handleClick = (id: "grow" | "build" | "run", e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(`pillar-${id}`);
    if (element) {
      const topOffset = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
    }
    setCurrent(id);
    onSelectPillar?.(id);
  };

  return (
    <>
      {/* Mobile Horizontal Chip Bar (scrolls with page, does not stick) */}
      <nav
        aria-label="Services Mobile Filter"
        className="lg:hidden flex items-center gap-2 overflow-x-auto pb-4 pt-2 -mx-4 px-4 scrollbar-none"
      >
        {PILLARS.map((p) => {
          const isActive = current === p.id;
          return (
            <button
              key={p.id}
              onClick={(e) => handleClick(p.id, e)}
              aria-current={isActive ? "true" : undefined}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono tracking-wider transition-colors whitespace-nowrap min-h-[44px] ${
                isActive
                  ? "bg-accent text-white font-medium"
                  : "bg-surface-muted text-text-secondary hover:text-ink"
              }`}
            >
              <span>{p.num}</span>
              <span className="font-sans font-semibold tracking-normal">{p.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Desktop Sticky Left Rail */}
      <nav
        aria-label="Services Navigation"
        className="hidden lg:block sticky top-32 space-y-4 pr-8"
      >
        <span className="text-xs font-mono uppercase tracking-widest text-text-secondary block mb-6">
          Service Pillars
        </span>
        <div className="relative border-l border-hairline pl-4 space-y-6">
          {PILLARS.map((p) => {
            const isActive = current === p.id;
            return (
              <a
                key={p.id}
                href={`#pillar-${p.id}`}
                onClick={(e) => handleClick(p.id, e)}
                aria-current={isActive ? "true" : undefined}
                className={`group flex items-start gap-4 transition-all duration-300 block ${
                  isActive ? "text-ink" : "text-text-secondary hover:text-ink"
                }`}
              >
                <span
                  className={`font-mono text-xs pt-1 transition-colors duration-300 ${
                    isActive ? "text-accent-soft font-semibold" : "text-white/40 group-hover:text-white/75"
                  }`}
                >
                  {p.num}
                </span>
                <div>
                  <div
                    className={`font-display text-lg tracking-tight font-medium transition-colors duration-300 ${
                      isActive ? "text-accent-soft" : ""
                    }`}
                  >
                    {p.label}
                  </div>
                  <div className="text-xs text-text-secondary mt-0.5">{p.desc}</div>
                </div>
              </a>
            );
          })}
        </div>
      </nav>
    </>
  );
}
