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
      <div className="lg:hidden mb-8 border border-hairline bg-surface-dark-2/85 rounded-md overflow-hidden">
        <button
          type="button"
          onClick={() => setIsOpenMobile(!isOpenMobile)}
          className="w-full min-h-[48px] flex items-center justify-between p-4 text-left font-display font-medium text-ink hover:text-accent-soft transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft"
          aria-expanded={isOpenMobile}
        >
          <span className="flex items-center gap-2 text-sm">
            <AlignLeft className="w-4 h-4 text-accent-soft" />
            Table of Contents
          </span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${isOpenMobile ? "rotate-180" : ""}`}
          />
        </button>

        {isOpenMobile && (
          <ul className="px-4 pb-4 pt-1 space-y-1.5 border-t border-hairline text-sm">
            {sections.map((sec) => {
              const isActive = activeId === sec.id;
              return (
                <li key={sec.id}>
                  <a
                    href={`#${sec.id}`}
                    onClick={(e) => handleScrollTo(e, sec.id)}
                    className={`flex items-center min-h-[44px] py-2 px-2.5 rounded transition-colors duration-200 ${
                      isActive
                        ? "text-accent-soft font-medium bg-accent-deep/30"
                        : "text-text-secondary hover:text-ink hover:bg-white/5"
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
        <div className="text-[11px] font-mono tracking-wider uppercase text-text-secondary mb-4 font-semibold flex items-center gap-2">
          <AlignLeft className="w-3.5 h-3.5 text-accent-soft" />
          Contents & Sections
        </div>
        <ul className="space-y-1 text-xs border-l border-hairline pl-3">
          {sections.map((sec) => {
            const isActive = activeId === sec.id;
            return (
              <li key={sec.id}>
                <a
                  href={`#${sec.id}`}
                  onClick={(e) => handleScrollTo(e, sec.id)}
                  className={`block py-1.5 transition-all duration-200 -ml-[13px] pl-3 border-l-2 ${
                    isActive
                      ? "border-accent-soft text-accent-soft font-semibold"
                      : "border-transparent text-text-secondary hover:text-ink hover:border-white/25"
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
