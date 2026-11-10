"use client";

import React, { useEffect, useState } from "react";
import { ChevronDown, AlignLeft } from "lucide-react";

interface TocSection {
  id: string;
  title: string;
}

interface TableOfContentsProps {
  sections: TocSection[];
}

export function TableOfContents({ sections }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id || "");
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-80px 0px -60% 0px",
        threshold: 0,
      }
    );

    sections.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      const navOffset = 96;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveId(id);
      setIsOpenMobile(false);
    }
  };

  return (
    <nav aria-label="Legal document table of contents">
      {/* Mobile Collapsible Disclosure */}
      <div className="lg:hidden mb-8 border border-border-light bg-surface-subtle rounded-card overflow-hidden">
        <button
          type="button"
          onClick={() => setIsOpenMobile(!isOpenMobile)}
          className="w-full flex items-center justify-between p-4 text-left font-display font-medium text-text-primary hover:text-accent-default transition-colors"
          aria-expanded={isOpenMobile}
        >
          <span className="flex items-center gap-2 text-sm">
            <AlignLeft className="w-4 h-4 text-accent-default" />
            Table of Contents
          </span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${isOpenMobile ? "rotate-180" : ""}`}
          />
        </button>

        {isOpenMobile && (
          <ul className="px-4 pb-4 pt-1 space-y-2 border-t border-border-light text-sm">
            {sections.map((sec) => {
              const isActive = activeId === sec.id;
              return (
                <li key={sec.id}>
                  <a
                    href={`#${sec.id}`}
                    onClick={(e) => handleScrollTo(e, sec.id)}
                    className={`block py-1.5 px-2 rounded transition-colors duration-200 ${
                      isActive
                        ? "text-accent-default font-medium bg-accent-soft/20"
                        : "text-text-secondary hover:text-text-primary hover:bg-surface-muted"
                    }`}
                  >
                    {sec.title}
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Desktop Sticky Sidebar */}
      <div className="hidden lg:block sticky top-28 max-h-[calc(100vh-140px)] overflow-y-auto pr-4 scrollbar-thin">
        <div className="text-[11px] font-mono tracking-wider uppercase text-text-muted mb-4 font-semibold flex items-center gap-2">
          <AlignLeft className="w-3.5 h-3.5 text-accent-default" />
          Contents & Sections
        </div>
        <ul className="space-y-1 text-xs border-l border-border-light pl-3">
          {sections.map((sec) => {
            const isActive = activeId === sec.id;
            return (
              <li key={sec.id}>
                <a
                  href={`#${sec.id}`}
                  onClick={(e) => handleScrollTo(e, sec.id)}
                  className={`block py-1.5 transition-all duration-200 -ml-[13px] pl-3 border-l-2 ${
                    isActive
                      ? "border-accent-default text-accent-default font-semibold"
                      : "border-transparent text-text-secondary hover:text-text-primary hover:border-border-medium"
                  }`}
                >
                  {sec.title}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
