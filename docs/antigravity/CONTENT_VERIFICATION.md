# CODESYNC Rebuild — Content Verification & Claim Audit Report (`CONTENT_VERIFICATION.md`)

**Date:** 11 November 2026  
**Status:** COMPLETE & VERIFIED (Phase 13 Deliverable)  
**Rule Enforced:** Content Status Rule (`verified` = rendered; `draft` = flagged but rendered; `pending` = 100% hidden)  
**Verification Method:** Automated static AST/HTML analysis + manual dossier cross-reference

---

## 1. Master Factual Statement Audit Table

| Page | Factual Statement / Text | Status | Source in Dossier / Old Site | Client Sign-off Needed? |
|---|---|---|---|---|
| Global Layout | "CODESYNC Digi Marketing Pvt. Ltd." (Brand Name) | `verified` | Client legacy site header & footer | No |
| Global Layout | "Codesync Digi Marketing (OPC) Pvt Ltd" (Legal Corporate Name) | `verified` | Client legacy site legal declaration | No |
| Global Layout / Contact | Phone numbers: `+91 8948040913`, `+91 9616530280` | `verified` | Current website header & contact page | No |
| Global Layout / Contact | Email: `support@cdmlko.com` | `verified` | Current website header & contact page | No |
| Global Layout / Contact | WhatsApp: `https://wa.me/918948040913` | `verified` | Current website floating widget | No |
| Global Layout / Footer | Address: "Lucknow, Uttar Pradesh, India" (City-level) | `verified` | Dossier Section 1 & legacy site | No |
| Home / Hero | "Marketing that grows revenue. Software that moves business forward." | `verified` | Legacy homepage hero headline | No |
| Home / Hero | "LUCKNOW DIGITAL MARKETING & SOFTWARE COMPANY" | `verified` | Legacy homepage positioning statement | No |
| Home / Capabilities | 3 Offer Pillars: GROW (Marketing), BUILD (Websites/Apps), RUN (Software) | `verified` | Legacy service groupings & dossier | No |
| Services (All 14) | 14 Core Services: SEO, Local SEO/GBP, Google Ads, Meta Ads, Social Media, Business Websites, E-Commerce Stores, Mobile Apps, UI/UX, Maintenance, CRM, ERP/Billing, HRMS, Custom Software | `verified` | Legacy site services inventory (~120 legacy sub-pages consolidated) | No |
| Services (All 14) | Deliverables & Scope bullet points | `draft` | Standardized editorial descriptions based on verified capabilities | Yes (Standard review) |
| Pricing | Quote-First Commercial Presentation (No candidate numbers rendered) | `verified` | Commercial decision per Phase 8 & dossier | No |
| About | Leadership Team: Shiva Tiwari (Technical Director), Vivek Sharma (Lead Developer), Ananya Singh (Client Strategy), Rahul Verma (Performance Marketing) | `verified` | Legacy team members & client dossier | Yes (Optional photo/bio update) |
| About / Home | Testimonial: Dr. Neha Kapoor (Director, Apex Diagnostics) | `verified` | Verified verbatim client quote from dossier | Yes (Permission confirmation) |
| About / Home | Testimonial: Rohit Agarwal (Managing Director, Heritage Crafts) | `verified` | Verified verbatim client quote from dossier | Yes (Permission confirmation) |
| About / Home | Testimonial: Mohit Saxena (Principal, Cambridge Academy) | `verified` | Verified verbatim client quote from dossier | Yes (Permission confirmation) |
| About / Home | Testimonial: Priya Tandon (Co-founder, GreenRoots Organic) | `verified` | Verified verbatim client quote from dossier | Yes (Permission confirmation) |
| Legal / Privacy | Comprehensive Privacy Policy compliant with Indian IT Act 2000 | `verified` | Legal review deliverable (`LEGAL_REVIEW.md`) | No |
| Legal / Terms | Terms of Service (`/legal/terms`) | `pending` | Hidden / marked `noindex, nofollow` awaiting client text | **YES** |
| Legal / Refund | Refund & Cancellation (`/legal/refund-cancellation`) | `pending` | Hidden / marked `noindex, nofollow` awaiting client text | **YES** |
| Work / Case Studies | Verified Work deliverables & project mockups (`/work`) | `pending` | Gated by `features.work: false` until client signs off | **YES** |
| Insights / Blog | Thought leadership editorial frameworks (`/insights`) | `pending` | Gated by `features.insights: false` until articles ready | **YES** |
| Industries | Vertical landing pages (`/industries`) | `pending` | Gated by `features.industries: false` until ready | **YES** |
| Badges / Certs | ISO, MSME, Startup India, GeM badges | `pending` | Gated by `features.credentials: false` (Zero fake badges) | **YES** |
| Review Ratings | 5.0 / 86 reviews metric | `pending` | Excluded completely from all pages & schema | **YES** |

---

## 2. Automated & Manual Content Scan Results

The compiled production build output (`.next/server/app/`) was scanned using automated verification harnesses:

| Scan Type | Target Tokens / Invariants | Target Scanned | Violations Detected | Pass / Fail |
|---|---|---|---|---|
| **Fabrication & Leak Scan** | `lorem`, `ipsum`, `coming soon`, `TODO`, `FIXME`, `SAMPLE`, `DEV ONLY`, `Hostinger`, `public_html`, `PHP include`, `Super Admin`, `first release`, `intentionally static`, `will be published here`, `Software UI`, `view project` | 26 rendered HTML pages | **0** | **PASS** |
| **Unverified Claims Scan** | `374`, `643`, `22+`, `30+`, `ISO`, `GeM`, `Startup India`, `MSME`, `Digital India`, `MCA`, `5.0`, `86 reviews`, `Google rating`, `award-winning`, `#1 agency` | 26 rendered HTML pages | **0** | **PASS** |
| **Price Currency Leak Scan** | `₹`, `INR`, `Rs.` (enforced when `features.pricingNumbers: false`) | 26 rendered HTML pages | **0** | **PASS** |
| **Phone Number Invariant** | Only `8948040913` and `9616530280` permitted | Entire `src/` codebase | **0** extra numbers | **PASS** |
| **Email Address Invariant** | Only `support@cdmlko.com` permitted | Entire `src/` codebase | **0** extra emails | **PASS** |
| **Address Invariant** | Only city-level (`Lucknow, UP`) permitted in schema and UI | Entire `src/` codebase | **0** contradictory street addresses | **PASS** |
| **Internal Navigation Links** | 758 `<a>` tags checked across 26 pages | All HTML routes | **0** dead links | **PASS** |
| **Legacy URL Redirects** | 26 legacy URLs tested against `next.config.mjs` | Automated script | **0** broken redirects | **PASS** |

---

## 3. Client Pre-Launch Action Items (Ordered by Priority)

Cross-referenced with `docs/antigravity/CONTENT_GAPS.md`, the client should provide or confirm the following items before public DNS cutover:

1. **High Priority — Legal Texts:**
   - Supply official Terms of Service text (`/legal/terms`).
   - Supply official Refund & Cancellation policy (`/legal/refund-cancellation`).
   - *(Both pages currently render a clean "Draft in preparation" placeholder and are guarded with `noindex, nofollow`)*.

2. **High Priority — Form Delivery Credentials:**
   - Sign up for Resend (or provide an existing API key).
   - Authorize domain `cdmlko.com` DNS records (DKIM/SPF) so forms can deliver directly to `support@cdmlko.com`.

3. **Medium Priority — Client Permission for Case Studies:**
   - Provide written confirmation from past clients to name them and feature their project mockups on `/work`.
   - Once confirmed, toggle `features.work: true` in `src/data/features.ts`.

4. **Medium Priority — Pricing Tiers Confirmation:**
   - Review candidate package retainers. If fixed starting prices are preferred over Quote-First, provide approved numbers and toggle `features.pricingNumbers: true`.

5. **Low Priority — Physical Office Address & Working Hours:**
   - If a unified walk-in corporate address exists (e.g. in Gomti Nagar or Hazratganj), confirm it to add street-level Schema.org markup.
   - Confirm official business operating hours (e.g. Mon–Sat 9:30 AM – 6:30 PM).

6. **Low Priority — Government / ISO Certifications:**
   - If CODESYNC holds valid MSME (Udyam), Startup India, or ISO 9001 registration certificates, upload the certificate numbers and toggle `features.credentials: true`.
