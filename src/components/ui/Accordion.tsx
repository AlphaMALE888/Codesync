"use client";

import React, { useState, createContext, useContext } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/cn";
import { motion, AnimatePresence } from "@/lib/motion";

interface AccordionContextValue {
  openItems: string[];
  toggleItem: (id: string) => void;
  tone: "light" | "dark";
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

export interface AccordionProps {
  type?: "single" | "multiple";
  defaultOpen?: string | string[];
  tone?: "light" | "dark";
  children: React.ReactNode;
  className?: string;
}

export function Accordion({
  type = "single",
  defaultOpen,
  tone = "dark",
  children,
  className,
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>(() => {
    if (!defaultOpen) return [];
    return Array.isArray(defaultOpen) ? defaultOpen : [defaultOpen];
  });

  const toggleItem = (id: string) => {
    if (type === "single") {
      setOpenItems((prev) => (prev.includes(id) ? [] : [id]));
    } else {
      setOpenItems((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    }
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, tone }}>
      <div className={cn("space-y-3 w-full", className)}>{children}</div>
    </AccordionContext.Provider>
  );
}

export interface AccordionItemProps {
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function AccordionItem({ id, title, children, className }: AccordionItemProps) {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("AccordionItem must be used within an Accordion");
  }

  const { openItems, toggleItem, tone } = context;
  const isOpen = openItems.includes(id);
  const isDark = tone === "dark";

  return (
    <div
      className={cn(
        "rounded-md transition-colors duration-base border overflow-hidden",
        isDark
          ? "bg-surface-dark-2/85 text-on-dark border-white/10 hover:border-white/20"
          : "bg-surface-dark/85 text-ink border-hairline hover:border-accent-soft/35",
        className
      )}
    >
      <h3>
        <button
          type="button"
          onClick={() => toggleItem(id)}
          aria-expanded={isOpen}
          aria-controls={`accordion-panel-${id}`}
          id={`accordion-btn-${id}`}
          className="w-full py-5 px-6 sm:px-7 flex items-center justify-between gap-4 text-left font-display font-medium text-base sm:text-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft"
        >
          <span className="tracking-tight text-ink">{title}</span>
          <span
            className={cn(
              "w-8 h-8 rounded-pill flex items-center justify-center shrink-0 transition-all duration-200",
              isOpen
                ? "bg-accent text-white rotate-45"
                : "bg-white/10 text-ink rotate-0"
            )}
            aria-hidden="true"
          >
            <Plus className="w-4 h-4" />
          </span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`accordion-panel-${id}`}
            role="region"
            aria-labelledby={`accordion-btn-${id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className={cn(
              "px-6 sm:px-7 pb-6 pt-1 text-sm sm:text-base leading-relaxed",
              isDark ? "text-text-secondary-on-dark" : "text-text-secondary"
            )}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
