"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { NavLink } from "./NavLink";
import { ServicesMenu } from "./ServicesMenu";
import { MobileMenu } from "./MobileMenu";
import { BookCallTrigger } from "@/components/forms/BookCallTrigger";
import { navigationItems } from "@/data/navigation";
import { features } from "@/data/features";
import { motion, LayoutGroup } from "@/lib/motion";
import { cn } from "@/lib/cn";

export function FloatingNav() {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const servicesTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredNav = navigationItems.filter(
    (item) => !item.flag || features[item.flag]
  );

  // Desktop hover intent for dropdown
  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setServicesOpen(true);
    }, 80);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setServicesOpen(false);
    }, 160);
  };

  const capsuleClass = cn(
    "pointer-events-auto bg-[#121214]/95 rounded-pill transition-all duration-200",
    scrolled
      ? "border border-white/15 shadow-lg shadow-black/40"
      : "border border-white/10 shadow-sm"
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-[max(0.75rem,env(safe-area-inset-top))] left-0 right-0 z-40 pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))] sm:px-6 pointer-events-none"
      >
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-3">
          {/* Left: Brand Capsule */}
          <div className={cn(capsuleClass, "h-11 px-3.5 flex items-center")}>
            <Logo />
          </div>

          {/* Centre: Nav Capsule (Desktop lg and up) */}
          <nav
            aria-label="Main Navigation"
            className={cn(
              capsuleClass,
              "hidden lg:flex h-11 px-2 items-center relative"
            )}
          >
            <LayoutGroup id="desktopNav">
              {filteredNav.map((item) => {
                if (item.children) {
                  return (
                    <div
                      key={item.label}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      className="relative"
                    >
                      <button
                        ref={servicesTriggerRef}
                        type="button"
                        onClick={() => setServicesOpen(!servicesOpen)}
                        aria-expanded={servicesOpen}
                        className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors duration-fast select-none rounded-pill flex items-center gap-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                      >
                        <span>{item.label}</span>
                        <span
                          className={`text-[10px] transition-transform duration-fast inline-block ml-0.5 opacity-60 ${
                            servicesOpen ? "rotate-180" : ""
                          }`}
                          aria-hidden="true"
                        >
                          ▼
                        </span>
                      </button>

                      <ServicesMenu
                        isOpen={servicesOpen}
                        onClose={() => setServicesOpen(false)}
                        triggerRef={servicesTriggerRef}
                      />
                    </div>
                  );
                }

                return (
                  <NavLink
                    key={item.href}
                    href={item.href}
                    label={item.label}
                  />
                );
              })}
            </LayoutGroup>
          </nav>

          {/* Right: CTA & Mobile Hamburger */}
          <div className="pointer-events-auto flex items-center gap-2">
            {/* Primary CTA (Desktop and tablet >= 480px) */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.45 }}
              className="hidden sm:block"
            >
              <BookCallTrigger variant="solid-light" size="md">
                Book a free call
              </BookCallTrigger>
            </motion.div>

            {/* Mobile Menu Trigger (< lg) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className={cn(
                capsuleClass,
                "lg:hidden w-11 h-11 text-white flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
              )}
              aria-label="Open mobile navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Mobile Drawer */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}
