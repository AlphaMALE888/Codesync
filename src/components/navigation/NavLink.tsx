"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { motion } from "@/lib/motion";

interface NavLinkProps {
  href: string;
  label: string;
  onClick?: () => void;
  className?: string;
  hasSubmenu?: boolean;
  isOpen?: boolean;
}

export function NavLink({
  href,
  label,
  onClick,
  className,
  hasSubmenu,
  isOpen,
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive = href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "relative px-4 py-2 text-sm font-medium transition-colors duration-fast select-none rounded-pill",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2",
        isActive || isOpen ? "text-ink" : "text-text-secondary hover:text-ink",
        className
      )}
      aria-current={isActive ? "page" : undefined}
      aria-haspopup={hasSubmenu ? "true" : undefined}
      aria-expanded={hasSubmenu ? isOpen : undefined}
    >
      {/* Active layout sliding pill */}
      {isActive && (
        <motion.span
          layoutId="activeNavPill"
          className="absolute inset-0 bg-surface-muted rounded-pill -z-10"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
      <span className="relative z-10 flex items-center gap-1">
        {label}
        {hasSubmenu && (
          <span
            className={cn(
              "text-[10px] transition-transform duration-fast inline-block ml-0.5 opacity-60",
              isOpen && "rotate-180"
            )}
            aria-hidden="true"
          >
            ▼
          </span>
        )}
      </span>
    </Link>
  );
}
