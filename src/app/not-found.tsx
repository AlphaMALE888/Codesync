"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { siteConfig } from "@/data/site";
import { MessageSquare, Compass, CreditCard, Mail, Orbit } from "lucide-react";

export default function NotFound() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col justify-between relative overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* Subtle Crimson Radial Horizon Glow */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 40%, rgba(165, 31, 61, 0.25) 0%, transparent 65%)`,
        }}
      />

      <div className="pt-24" />

      {/* Main Content Area */}
      <div className="relative z-10 max-w-3xl mx-auto w-full text-center py-12">
        {/* Particle Orbit Icon */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center mb-6 text-accent-soft"
        >
          <div className="p-4 rounded-full bg-surface-dark-2 border border-white/15">
            <Orbit className="w-8 h-8" />
          </div>
        </motion.div>

        {/* Display 404 */}
        <h1
          className="font-display font-bold tracking-tighter leading-none text-white select-none mb-6"
          style={{ fontSize: "clamp(5rem, 16vw, 11rem)" }}
        >
          404
        </h1>

        {/* Brand One-Sentence */}
        <p className="text-lg sm:text-xl text-white/80 max-w-xl mx-auto font-body leading-relaxed mb-10">
          The requested page has been relocated, retired, or does not exist in our active directory.
        </p>

        {/* Primary Quick Links */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-xl mx-auto">
          <Link
            href="/services"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-pill bg-accent text-white font-medium text-sm hover:bg-accent-soft transition-colors"
          >
            <Compass className="w-4 h-4" />
            Explore Services
          </Link>

          <Link
            href="/pricing"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-pill bg-surface-dark-2 hover:bg-white/15 text-white border border-white/15 font-medium text-sm transition-colors"
          >
            <CreditCard className="w-4 h-4" />
            View Pricing
          </Link>

          <Link
            href="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-pill bg-surface-dark-2 hover:bg-white/15 text-white border border-white/15 font-medium text-sm transition-colors"
          >
            <Mail className="w-4 h-4" />
            Contact Team
          </Link>

          <a
            href={siteConfig.contact.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-pill bg-surface-dark-2 hover:bg-accent/20 text-accent-soft border border-accent-soft/35 font-medium text-sm transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            WhatsApp
          </a>
        </div>
      </div>

      {/* Clean Bottom Bar */}
      <div className="relative z-10 py-8 border-t border-white/10 text-center text-xs font-mono text-white/50">
        <span>CODESYNC Digi Marketing Pvt. Ltd. &bull; Lucknow, Uttar Pradesh</span>
      </div>
    </div>
  );
}
