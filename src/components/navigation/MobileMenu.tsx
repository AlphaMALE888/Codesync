"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, ChevronDown, Phone, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "@/lib/motion";
import { SplitArrowButton } from "@/components/ui/SplitArrowButton";
import { siteConfig } from "@/data/site";
import { navigationItems } from "@/data/navigation";
import { features } from "@/data/features";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();
  const [servicesOpen, setServicesOpen] = useState(false);

  // Close on route change
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  // Lock body scroll and handle Escape
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  const filteredNav = navigationItems.filter(
    (item) => !item.flag || features[item.flag]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          data-lenis-prevent
          initial={{ opacity: 0, y: "-8%" }}
          animate={{ opacity: 1, y: "0%" }}
          exit={{ opacity: 0, y: "-8%" }}
          transition={{ duration: 0.38, ease: [0.65, 0, 0.35, 1] }}
          className="fixed inset-0 z-50 bg-surface-dark text-on-dark flex flex-col justify-between p-6 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] pl-[max(1.5rem,env(safe-area-inset-left))] pr-[max(1.5rem,env(safe-area-inset-right))] overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
        >
          {/* Top Bar: Brand & Close */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <span className="font-display font-bold tracking-tight text-lg text-white">
              CODESYNC
            </span>
            <button
              type="button"
              onClick={onClose}
              className="w-11 h-11 rounded-pill flex items-center justify-center bg-white/10 hover:bg-white/20 text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Links Area */}
          <div className="py-8 space-y-6 flex-1 flex flex-col justify-center">
            {filteredNav.map((item, idx) => {
              if (item.children) {
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12 + idx * 0.04, duration: 0.3 }}
                    className="border-b border-white/10 pb-4"
                  >
                    <button
                      type="button"
                      onClick={() => setServicesOpen(!servicesOpen)}
                      className="w-full flex items-center justify-between min-h-[48px] text-2xl sm:text-3xl font-display font-semibold text-white tracking-tight text-left"
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        className={`w-6 h-6 transition-transform duration-base ${
                          servicesOpen ? "rotate-180 text-accent-soft" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {servicesOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.28, ease: "easeInOut" }}
                          className="overflow-hidden pl-2 pt-4 space-y-6"
                        >
                          {item.children.map((group) => (
                            <div key={group.category} className="space-y-2">
                              <span className="type-label text-accent-soft tracking-wider block font-bold text-[11px]">
                                {group.category}
                              </span>
                              <div className="space-y-1 pl-2 border-l border-white/10">
                                {group.items.map((subItem) => (
                                  <Link
                                    key={subItem.href}
                                    href={subItem.href}
                                    onClick={onClose}
                                    className="flex items-center min-h-[44px] text-sm text-text-secondary-on-dark hover:text-white py-2 px-1 transition-colors"
                                  >
                                    {subItem.label}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              }

              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + idx * 0.04, duration: 0.3 }}
                  className="border-b border-white/10 pb-4"
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center min-h-[48px] text-2xl sm:text-3xl font-display font-semibold text-white tracking-tight hover:text-accent-soft transition-colors"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Quick Actions & CTA Bottom */}
          <div className="pt-6 border-t border-white/10 space-y-4">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <a
                href={`tel:${siteConfig.contact.phones[0]}`}
                className="flex items-center justify-center min-h-[44px] gap-2 p-3 rounded-md bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10"
              >
                <Phone className="w-4 h-4 text-accent-soft" />
                <span>Call Now</span>
              </a>
              <a
                href={siteConfig.contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center min-h-[44px] gap-2 p-3 rounded-md bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10"
              >
                <MessageSquare className="w-4 h-4 text-accent-soft" />
                <span>WhatsApp</span>
              </a>
            </div>

            <Link href="/contact#book-a-call" onClick={onClose} className="block w-full">
              <SplitArrowButton variant="solid-light" size="lg" className="w-full">
                Book a free call
              </SplitArrowButton>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
