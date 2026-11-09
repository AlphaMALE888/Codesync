"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface WorkFiltersProps {
  categories: string[];
  activeCategory: string;
  totalCount: number;
}

export function WorkFilters({
  categories,
  activeCategory,
  totalCount,
}: WorkFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSelect = (category: string) => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : "");
    if (category === "All") {
      params.delete("category");
    } else {
      params.set("category", category.toLowerCase());
    }
    const queryString = params.toString();
    router.push(queryString ? `/work?${queryString}` : "/work", { scroll: false });
  };

  return (
    <div className="w-full">
      {/* Accessible Polite Live Region */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Showing {totalCount} {totalCount === 1 ? "project" : "projects"} for{" "}
        {activeCategory}
      </div>

      {/* Filter Chips: Horizontal Scroll on Mobile, Flex on Desktop */}
      <nav
        aria-label="Filter case studies by category"
        className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none"
      >
        {categories.map((cat) => {
          const isSelected =
            cat === "All"
              ? !activeCategory || activeCategory === "All"
              : activeCategory.toLowerCase() === cat.toLowerCase();

          return (
            <button
              key={cat}
              type="button"
              onClick={() => handleSelect(cat)}
              aria-pressed={isSelected}
              className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-200 whitespace-nowrap min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                isSelected
                  ? "bg-accent text-white font-medium shadow-sm"
                  : "bg-surface-muted text-text-secondary hover:text-ink hover:bg-[#E2E2DF]"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
