"use client";

import React from "react";
import { PricingPlan } from "@/data/types";
import { SplitArrowButton } from "@/components/ui/SplitArrowButton";
import { Check, ShieldCheck } from "lucide-react";
import { features } from "@/data/features";

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
      className={`relative flex flex-col justify-between rounded-md p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 ${
        isRecommended
          ? "bg-surface-dark text-white border-2 border-accent shadow-xl"
          : "bg-white text-ink border border-hairline shadow-sm hover:border-ink/40"
      }`}
    >
      {/* Recommended Tag */}
      {isRecommended && (
        <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-accent text-white text-[11px] font-mono tracking-wider uppercase font-semibold">
          Recommended Plan
        </div>
      )}

      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <span
              className={`text-xs font-mono uppercase tracking-widest block mb-1 ${
                isRecommended ? "text-accent-soft" : "text-text-secondary"
              }`}
            >
              {plan.group.toUpperCase()} · {plan.model.toUpperCase()}
            </span>
            <h3 className="font-display font-medium text-2xl tracking-tight">
              {plan.name}
            </h3>
          </div>
        </div>

        {/* Who it suits */}
        {plan.whoItSuits && (
          <p
            className={`text-xs sm:text-sm leading-relaxed mb-6 ${
              isRecommended ? "text-text-secondary-on-dark" : "text-text-secondary"
            }`}
          >
            {plan.whoItSuits}
          </p>
        )}

        {/* Price Display */}
        <div className={`py-6 border-y ${isRecommended ? "border-white/10" : "border-hairline"}`}>
          {showOfficialNumber ? (
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-mono">From ₹</span>
                <span className="font-mono text-3xl sm:text-4xl font-semibold tabular-nums">
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
              <div className="inline-block px-2 py-0.5 rounded bg-red-100 text-red-700 text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
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
              <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-accent font-semibold mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Scope-First Quotation</span>
              </div>
              <div className="font-display font-medium text-xl sm:text-2xl">
                Clear quote on request
              </div>
              <p
                className={`text-xs mt-1 ${
                  isRecommended ? "text-text-secondary-on-dark" : "text-text-secondary"
                }`}
              >
                Pricing depends on your goals and scope.
              </p>
            </div>
          )}
        </div>

        {/* Features List */}
        <div className="py-6 space-y-3">
          <span
            className={`text-xs font-mono uppercase tracking-wider block mb-2 ${
              isRecommended ? "text-accent-soft" : "text-text-secondary"
            }`}
          >
            What is included:
          </span>
          {plan.features.map((feat, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm">
              <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <span className={isRecommended ? "text-white/90" : "text-ink/80"}>
                {feat}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Action CTA */}
      <div className="pt-6 border-t border-hairline/60">
        <SplitArrowButton
          href={`/contact?service=${encodeURIComponent(plan.name)}`}
          className="w-full"
        >
          Request a quote
        </SplitArrowButton>
        {plan.note && (
          <p
            className={`text-[11px] text-center mt-2.5 font-mono ${
              isRecommended ? "text-white/40" : "text-text-secondary/70"
            }`}
          >
            {plan.note}
          </p>
        )}
      </div>
    </div>
  );
}
