"use client";

import React from "react";
import { PricingPlan } from "@/data/types";
import { SplitArrowButton } from "@/components/ui/SplitArrowButton";
import { Check, ShieldCheck } from "lucide-react";
import { features } from "@/data/features";
import {
  setParticleFocusFromElement,
  clearParticleFocus,
} from "@/components/particles/particleState";

interface PricingCardProps {
  plan: PricingPlan;
}

export function PricingCard({ plan }: PricingCardProps) {
  const isRecommended = plan.recommended;

  // Dev candidate preview logic (strictly ignored in production builds)
  const isDevPreview =
    process.env.NODE_ENV !== "production" &&
    process.env.NEXT_PUBLIC_SHOW_CANDIDATE_PRICES === "true";

  const showOfficialNumber =
    features.pricingNumbers && plan.approved && plan.displayedPrice !== null;

  return (
    <div
      onMouseEnter={(e) => setParticleFocusFromElement(e.currentTarget, "attract", 0.85)}
      onMouseLeave={() => clearParticleFocus()}
      className={`relative flex flex-col justify-between rounded-md p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 ${
        isRecommended
          ? "bg-surface-dark-2/95 text-white border-2 border-accent-soft/80 shadow-2xl"
          : "bg-surface-dark/85 text-ink border border-white/12 shadow-lg hover:border-accent-soft/45"
      }`}
    >
      {/* Recommended Tag */}
      {isRecommended && (
        <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-accent text-white text-[11px] font-mono tracking-wider uppercase font-semibold border border-accent-soft/50">
          Recommended Plan
        </div>
      )}

      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest block mb-1 text-accent-soft">
              {plan.group.toUpperCase()} · {plan.model.toUpperCase()}
            </span>
            <h3 className="font-display font-medium text-2xl text-white tracking-tight">
              {plan.name}
            </h3>
          </div>
        </div>

        {/* Who it suits */}
        {plan.whoItSuits && (
          <p className="text-xs sm:text-sm leading-relaxed mb-6 text-text-secondary-on-dark">
            {plan.whoItSuits}
          </p>
        )}

        {/* Price Display */}
        <div className="py-6 border-y border-white/10">
          {showOfficialNumber ? (
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-mono text-text-secondary">From ₹</span>
                <span className="font-mono text-3xl sm:text-4xl font-semibold tabular-nums text-white">
                  {plan.displayedPrice?.toLocaleString("en-IN")}
                </span>
                <span className="text-xs font-mono text-text-secondary">
                  / {plan.model === "monthly" ? "mo" : "project"}
                </span>
              </div>
              <span className="text-[11px] font-mono text-text-secondary block mt-1">
                + Applicable GST
              </span>
            </div>
          ) : isDevPreview && plan.candidatePrice ? (
            <div>
              <div className="inline-block px-2 py-0.5 rounded bg-accent/20 text-accent-soft text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
                UNAPPROVED CANDIDATE
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-mono">Candidate: ₹</span>
                <span className="font-mono text-2xl font-semibold line-through opacity-70">
                  {plan.candidatePrice.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-accent-soft font-semibold mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Scope-First Quotation</span>
              </div>
              <div className="font-display font-medium text-xl sm:text-2xl text-white">
                Clear quote on request
              </div>
              <p className="text-xs mt-1 text-text-secondary-on-dark">
                Pricing depends on your goals and scope.
              </p>
            </div>
          )}
        </div>

        {/* Features List */}
        <div className="py-6 space-y-3">
          <span className="text-xs font-mono uppercase tracking-wider block mb-2 text-accent-soft">
            What is included:
          </span>
          {plan.features.map((feat, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm">
              <Check className="w-4 h-4 text-accent-soft shrink-0 mt-0.5" />
              <span className="text-white/90">{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action CTA */}
      <div className="pt-6 border-t border-white/10">
        <SplitArrowButton
          href={`/contact?service=${encodeURIComponent(plan.name)}`}
          variant={isRecommended ? "solid-light" : "solid-dark"}
          className="w-full"
        >
          Request a quote
        </SplitArrowButton>
        {plan.note && (
          <p className="text-[11px] text-center mt-2.5 font-mono text-white/50">
            {plan.note}
          </p>
        )}
      </div>
    </div>
  );
}
