"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { Eyebrow } from "@/components/ui/Typography";
import { motion, AnimatePresence } from "@/lib/motion";
import { ArrowRight } from "lucide-react";

interface ServicesMenuProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | HTMLAnchorElement>;
}

export function ServicesMenu({ isOpen, onClose, triggerRef }: ServicesMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on Escape & return focus
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
        triggerRef.current?.focus();
      }
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, triggerRef]);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose, triggerRef]);

  const columns = [
    {
      pillar: "GROW",
      title: "Digital Marketing",
      items: [
        { label: "Local SEO & Google Business Profile", href: "/services/local-seo-google-business-profile" },
        { label: "SEO (Search Engine Optimization)", href: "/services/seo" },
        { label: "Google Ads & PPC", href: "/services/google-ads-ppc" },
        { label: "Meta Ads & Lead Generation", href: "/services/meta-ads-lead-generation" },
        { label: "Social, Content, Email & SMS", href: "/services/social-content-email-sms" },
      ],
    },
    {
      pillar: "BUILD",
      title: "Websites & Apps",
      items: [
        { label: "Business Websites", href: "/services/business-websites" },
        { label: "E-commerce Websites", href: "/services/ecommerce-websites" },
        { label: "Mobile Apps (Android & iOS)", href: "/services/mobile-apps" },
        { label: "UI/UX & Graphic Design", href: "/services/ui-ux-graphic-design" },
        { label: "Domain, Hosting & Maintenance", href: "/services/domain-hosting-maintenance" },
      ],
    },
    {
      pillar: "RUN",
      title: "Business Software",
      items: [
        { label: "CRM Solutions", href: "/services/crm" },
        { label: "ERP, Billing & GST Software", href: "/services/erp-billing-gst" },
        { label: "HRMS & Payroll Management", href: "/services/hrms-payroll" },
        { label: "Custom Software & APIs", href: "/services/custom-software" },
      ],
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[740px] max-w-[calc(100vw-32px)] bg-[#060608]/88 backdrop-blur-2xl backdrop-saturate-150 rounded-md border border-white/18 shadow-[0_24px_64px_rgba(0,0,0,0.92),inset_0_1px_0_rgba(255,255,255,0.14)] p-6 z-50 overflow-hidden"
          role="region"
          aria-label="Services Submenu"
        >
          {/* Subtle Top Glass Specular Sheen */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/[0.06] via-transparent to-black/25"
          />

          <div className="relative grid grid-cols-3 gap-6">
            {columns.map((col, idx) => (
              <div key={col.pillar} className="flex flex-col space-y-3">
                <div className="pb-2 border-b border-white/12">
                  <Eyebrow withRule={false} className="text-accent-soft font-bold text-[10px] tracking-wider mb-1">
                    {col.pillar}
                  </Eyebrow>
                  <div className="font-display font-semibold text-xs text-white">
                    {col.title}
                  </div>
                </div>

                <div className="space-y-1">
                  {col.items.map((item, itemIdx) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.02 * (idx * 5 + itemIdx), duration: 0.18 }}
                    >
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className="block py-1.5 px-2.5 -mx-2.5 rounded-sm text-xs font-medium text-white/90 hover:text-white hover:bg-white/12 transition-colors duration-fast"
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer Bar */}
          <div className="relative mt-6 pt-4 border-t border-white/14 flex items-center justify-between text-xs text-white/80">
            <span>Looking for custom end-to-end agency execution?</span>
            <Link
              href="/services"
              onClick={onClose}
              className="font-medium text-white hover:text-accent-soft inline-flex items-center gap-1 transition-colors duration-fast"
            >
              All services overview <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
