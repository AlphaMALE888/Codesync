import React from "react";
import Link from "next/link";
import { siteConfig } from "@/data/site";
import { features } from "@/data/features";
import { SplitArrowButton } from "@/components/ui/SplitArrowButton";
import { Eyebrow } from "@/components/ui/Typography";
import { FooterScene } from "./FooterScene";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full px-[clamp(8px,1.2vw,16px)] pb-[clamp(8px,1.2vw,16px)]">
      <div className="w-full bg-surface-dark text-on-dark rounded-t-lg border-t border-x border-white/10 pt-16 sm:pt-24 pb-0 px-[clamp(20px,4vw,64px)] overflow-hidden">
        <div className="max-w-[1440px] mx-auto">
          {/* Top Row: Talk To Us Callout Block */}
          <div className="pb-16 border-b border-white/10 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <Eyebrow className="text-accent-soft" withRule={false}>
                READY TO SCALE?
              </Eyebrow>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-white">
                Marketing that grows revenue. Software that moves business forward.
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-4 shrink-0">
              <SplitArrowButton
                href="/contact#book-a-call"
                variant="solid-light"
                size="lg"
              >
                Book a free call
              </SplitArrowButton>
              <a
                href={siteConfig.contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-pill bg-white/10 hover:bg-white/20 text-white text-sm font-medium border border-white/10 transition-colors"
              >
                WhatsApp Us
              </a>
            </div>
          </div>

          {/* 12-Column Link Columns Grid */}
          <div className="py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10">
            {/* Column 1: Company (span 3) */}
            <div className="lg:col-span-3 space-y-4">
              <span className="type-label text-text-secondary-on-dark font-mono text-[11px] block">
                COMPANY
              </span>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link href="/about" className="text-white/80 hover:text-white transition-colors">
                    About CODESYNC
                  </Link>
                </li>
                {features.work && (
                  <li>
                    <Link href="/work" className="text-white/80 hover:text-white transition-colors">
                      Selected Works
                    </Link>
                  </li>
                )}
                <li>
                  <Link href="/pricing" className="text-white/80 hover:text-white transition-colors">
                    Pricing & Engagement
                  </Link>
                </li>
                <li>
                  <Link href="/about#careers" className="text-white/80 hover:text-white transition-colors">
                    Careers at CODESYNC
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-white/80 hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Services / GROW (span 3) */}
            <div className="lg:col-span-3 space-y-4">
              <span className="type-label text-text-secondary-on-dark font-mono text-[11px] block">
                GROW &bull; DIGITAL MARKETING
              </span>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link href="/services/local-seo-google-business-profile" className="text-white/80 hover:text-white transition-colors">
                    Local SEO & Google Business
                  </Link>
                </li>
                <li>
                  <Link href="/services/seo" className="text-white/80 hover:text-white transition-colors">
                    Technical SEO
                  </Link>
                </li>
                <li>
                  <Link href="/services/google-ads-ppc" className="text-white/80 hover:text-white transition-colors">
                    Google Ads & PPC
                  </Link>
                </li>
                <li>
                  <Link href="/services/meta-ads-lead-generation" className="text-white/80 hover:text-white transition-colors">
                    Meta Ads Lead Generation
                  </Link>
                </li>
                <li>
                  <Link href="/services/social-content-email-sms" className="text-white/80 hover:text-white transition-colors">
                    Social & Bulk Messaging
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: BUILD & RUN (span 3) */}
            <div className="lg:col-span-3 space-y-4">
              <span className="type-label text-text-secondary-on-dark font-mono text-[11px] block">
                BUILD & RUN &bull; SOFTWARE
              </span>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link href="/services/business-websites" className="text-white/80 hover:text-white transition-colors">
                    Business Websites
                  </Link>
                </li>
                <li>
                  <Link href="/services/ecommerce-websites" className="text-white/80 hover:text-white transition-colors">
                    E-Commerce Stores
                  </Link>
                </li>
                <li>
                  <Link href="/services/mobile-apps" className="text-white/80 hover:text-white transition-colors">
                    Mobile Apps (iOS & Android)
                  </Link>
                </li>
                <li>
                  <Link href="/services/crm" className="text-white/80 hover:text-white transition-colors">
                    Custom CRM Solutions
                  </Link>
                </li>
                <li>
                  <Link href="/services/erp-billing-gst" className="text-white/80 hover:text-white transition-colors">
                    ERP & GST Billing Systems
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Contact & Direct Channels (span 3) */}
            <div className="lg:col-span-3 space-y-4">
              <span className="type-label text-text-secondary-on-dark font-mono text-[11px] block">
                DIRECT INQUIRY
              </span>
              <ul className="space-y-2.5 text-sm text-white/80">
                <li>
                  <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-white transition-colors">
                    {siteConfig.contact.email}
                  </a>
                </li>
                {siteConfig.contact.phones.map((phone) => (
                  <li key={phone}>
                    <a href={`tel:${phone}`} className="hover:text-white transition-colors">
                      +91 {phone}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href={siteConfig.contact.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-soft hover:text-white transition-colors font-medium inline-block mt-1"
                  >
                    Quick WhatsApp Support &rarr;
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar: Copyright & Legal */}
          <div className="pt-8 pb-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-secondary-on-dark">
            <div>
              &copy; {currentYear} {siteConfig.name} All rights reserved. Registered as {siteConfig.legalName}.
            </div>
            <div className="flex items-center gap-6">
              <Link href="/legal/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              {/* Terms and Refund links are added dynamically when approved in Phase 9 */}
            </div>
          </div>
        </div>

        {/* Phase 4 Footer Wordmark Scene — full-bleed, outside padded container */}
        <FooterScene />
      </div>
    </footer>
  );
}
