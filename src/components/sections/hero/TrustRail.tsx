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
        <div className="w-full flex items-center justify-between text-[11px] sm:text-xs tracking-wider uppercase font-medium">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-pill bg-accent-soft inline-block animate-pulse" />
            <span>Lucknow Digital Marketing & Software Company</span>
          </div>
          <span className="text-white/60">Based in Lucknow, Uttar Pradesh</span>
        </div>
      ) : (
        <div className="w-full flex items-center justify-between">
          <span className="type-label text-[11px] text-white/70">Trusted Local Execution</span>
          {/* Client logos rail when permission is granted */}
          <div className="flex items-center gap-6 overflow-x-auto">
            {permittedClients.map((client) => (
              <span key={client.name} className="font-medium text-white/80">
                {client.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
