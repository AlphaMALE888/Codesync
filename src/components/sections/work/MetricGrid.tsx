import React from "react";
import { ProjectItem } from "@/data/types";
import { Check } from "lucide-react";

interface MetricGridProps {
  metrics: ProjectItem["metrics"];
  deliverables?: string[];
  theme?: "light" | "dark";
}

export function MetricGrid({ metrics, deliverables = [], theme = "light" }: MetricGridProps) {
  const isDark = theme === "dark";
  const verifiedMetrics = metrics.filter((m) => m.verified);

  // If verified metrics exist, show the 2x2 KPI grid
  if (verifiedMetrics.length > 0) {
    const displayMetrics = verifiedMetrics.slice(0, 4);
    return (
      <div className={`grid grid-cols-2 gap-3 pt-4 border-t ${isDark ? "border-white/10" : "border-hairline"}`}>
        {displayMetrics.map((m, idx) => (
          <div key={idx} className="flex flex-col">
            <span
              className={`font-mono font-medium text-lg sm:text-xl tracking-tight tabular-nums ${
                isDark ? "text-white" : "text-ink"
              }`}
            >
              {m.value}
            </span>
            <span
              className={`text-xs sm:text-sm font-sans tracking-tight truncate ${
                isDark ? "text-text-secondary-on-dark" : "text-text-secondary"
              }`}
            >
              {m.label}
            </span>
          </div>
        ))}
      </div>
    );
  }

  // Fallback: If no verified metrics exist, show a clean row of scope deliverables
  if (deliverables.length > 0) {
    const displayDeliverables = deliverables.slice(0, 3);
    return (
      <div className={`pt-4 border-t ${isDark ? "border-white/10" : "border-hairline"}`}>
        <span className={`block text-[11px] font-mono uppercase tracking-wider mb-2 ${
          isDark ? "text-white/40" : "text-text-secondary"
        }`}>
          Key Scope
        </span>
        <div className="flex flex-wrap gap-1.5">
          {displayDeliverables.map((item, idx) => (
            <span
              key={idx}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-sm text-xs ${
                isDark
                  ? "bg-white/5 text-white/80 border border-white/10"
                  : "bg-surface-dark-2 text-ink/85 border border-hairline"
              }`}
            >
              <Check className="w-3 h-3 text-accent-soft" />
              <span className="truncate max-w-[140px]">{item}</span>
            </span>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
