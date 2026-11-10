"use client";

import React from "react";

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

export function CategoryFilter({
  categories,
  activeCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  const allCategories = ["All Articles", ...categories];

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
      {allCategories.map((category) => {
        const isActive = activeCategory === category;
        return (
          <button
            key={category}
            type="button"
            onClick={() => onSelectCategory(category)}
            className={`px-4 py-2 rounded-full text-xs font-mono tracking-wide transition-all duration-200 ${
              isActive
                ? "bg-brand-darkest text-white shadow-sm font-semibold"
                : "bg-surface-subtle text-text-secondary hover:text-text-primary hover:bg-surface-muted border border-border-light"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
