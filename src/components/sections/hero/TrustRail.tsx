"use client";

import React from "react";
import { clientsData } from "@/data/clients";
import { proofData } from "@/data/proof";
import { renderable } from "@/lib/content";
import { motion } from "@/lib/motion";
import { cn } from "@/lib/cn";

export interface TrustRailProps {
  className?: string;
}

export function TrustRail({ className }: TrustRailProps) {
  // Only logos with permission = true
  const permittedClients = clientsData.filter((c) => c.permission);
  const verifiedProof = renderable(proofData);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.1, duration: 0.6, ease: "easeOut" }}
      className={cn(
        "w-full pt-4 pb-3 border-t border-white/12 flex items-center justify-between text-xs text-text-secondary-on-dark",
        className
      )}
    >
      {/* Fallback Verified Statement when client logos/ratings are pending */}
      {permittedClients.length === 0 && verifiedProof.length === 0 ? (
        <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 sm:gap-4 text-[10px] sm:text-xs tracking-wider uppercase font-medium">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-pill bg-accent-soft inline-block shrink-0" />
            <span className="truncate">Lucknow Digital Marketing & Software</span>
          </div>
          <span className="text-white/60 text-[10px] sm:text-xs shrink-0">Based in Lucknow, UP</span>
        </div>
      ) : (
        <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <span className="type-label text-[11px] text-white/70 shrink-0">Trusted Local Execution</span>
          {/* Client logos rail when permission is granted */}
          <div className="flex items-center gap-6 overflow-x-auto w-full sm:w-auto scrollbar-none">
            {permittedClients.map((client) => (
              <span key={client.name} className="font-medium text-white/80 shrink-0">
                {client.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
