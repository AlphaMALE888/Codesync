"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArticleItem } from "@/data/types";
import { InsightCard } from "./InsightCard";
import { CategoryFilter } from "./CategoryFilter";

interface InsightsGridProps {
  articles: ArticleItem[];
}

export function InsightsGrid({ articles }: InsightsGridProps) {
  const [activeCategory, setActiveCategory] = useState("All Articles");
  const shouldReduceMotion = useReducedMotion();

  // Extract unique categories
  const categories = Array.from(new Set(articles.map((a) => a.category)));

  const filteredArticles =
    activeCategory === "All Articles"
      ? articles
      : articles.filter((a) => a.category === activeCategory);

  // Deterministic 5-card repeating pattern for spans and variants:
  // 0: span 6, image-led
  // 1: span 3, text-led-pale
  // 2: span 3, text-led-dark
  // 3: span 4, text-led-pale
  // 4: span 4, text-led-dark
  // 5 (if any): span 4, image-led
  const getLayoutProps = (index: number) => {
    const patternIndex = index % 5;
    switch (patternIndex) {
      case 0:
        return { span: "lg:col-span-6", variant: "image-led" as const };
      case 1:
        return { span: "lg:col-span-3", variant: "text-led-pale" as const };
      case 2:
        return { span: "lg:col-span-3", variant: "text-led-dark" as const };
      case 3:
        return { span: "lg:col-span-4", variant: "text-led-pale" as const };
      case 4:
        return { span: "lg:col-span-4", variant: "text-led-dark" as const };
      default:
        return { span: "lg:col-span-4", variant: "image-led" as const };
    }
  };

  return (
    <div>
      {/* Category Pills */}
      <CategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      {/* Grid Container with Cross-Fade Filter Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0 }}
          transition={{
            duration: shouldReduceMotion ? 0.05 : 0.35,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch"
        >
          {filteredArticles.map((article, index) => {
            const { span, variant } = getLayoutProps(index);
            // Allow explicit article.variant override if provided
            const effectiveVariant = article.variant || variant;

            return (
              <div
                key={article.id}
                className={`col-span-1 md:col-span-1 ${span} flex flex-col`}
              >
                <InsightCard article={article} variant={effectiveVariant} />
              </div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
