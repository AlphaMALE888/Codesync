import React from "react";
import { cn } from "@/lib/cn";

export function RunArt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-full h-auto select-none", className)}
      aria-hidden="true"
    >
      {/* Central Database / Software Core Node */}
      <rect x="120" y="80" width="80" height="80" rx="16" stroke="#68A081" strokeWidth="2" fill="currentColor" fillOpacity="0.08" />
      <circle cx="160" cy="120" r="14" stroke="currentColor" strokeWidth="1.5" />
      {/* Surrounding Connected Ecosystem Nodes */}
      {/* CRM Node */}
      <rect x="40" y="40" width="55" height="40" rx="8" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" />
      <path d="M95 60 H120 V85" stroke="currentColor" strokeWidth="1.25" strokeDasharray="3 3" strokeOpacity="0.5" />
      {/* ERP / Billing Node */}
      <rect x="225" y="40" width="55" height="40" rx="8" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" />
      <path d="M225 60 H200 V85" stroke="currentColor" strokeWidth="1.25" strokeDasharray="3 3" strokeOpacity="0.5" />
      {/* HRMS Node */}
      <rect x="40" y="160" width="55" height="40" rx="8" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" />
      <path d="M95 180 H120 V155" stroke="currentColor" strokeWidth="1.25" strokeDasharray="3 3" strokeOpacity="0.5" />
      {/* API Gateway Node */}
      <rect x="225" y="160" width="55" height="40" rx="8" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" />
      <path d="M225 180 H200 V155" stroke="currentColor" strokeWidth="1.25" strokeDasharray="3 3" strokeOpacity="0.5" />
    </svg>
  );
}
