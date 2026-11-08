# Route Migration & Sitemap Specification
**Date:** 8 November 2026  
**Auditor:** Antigravity  
**Phase:** Phase 0 (Repository Audit and Project Foundation)  

---

## 1. Approved New Website Sitemap

The new site is structured around 3 distinct pillars: **GROW** (Digital Marketing), **BUILD** (Websites & Apps), and **RUN** (Business Software), alongside trust, company, and conversion routes.

| URL Path | Page Name / Purpose | Phase | Condition / Feature Flag |
|---|---|---|---|
| `/` | Homepage (Full editorial layout) | Phases 3, 4, 8 | Always active |
| `/services` | Services Hub (Grow / Build / Run) | Phase 5 | Always active |
| `/services/local-seo-google-business-profile` | Local SEO & Google Business Profile | Phase 5 | Always active |
| `/services/seo` | Search Engine Optimization (Core) | Phase 5 | Always active |
| `/services/google-ads-ppc` | Google Ads & PPC Performance | Phase 5 | Always active |
| `/services/meta-ads-lead-generation` | Meta Ads & Lead Generation | Phase 5 | Always active |
| `/services/social-content-email-sms` | Social, Content, Email & Bulk SMS | Phase 5 | Always active |
| `/services/business-websites` | Business Websites (WordPress / Custom) | Phase 5 | Always active |
| `/services/ecommerce-websites` | E-commerce Websites & Stores | Phase 5 | Always active |
| `/services/mobile-apps` | Mobile Applications (Android & iOS) | Phase 5 | Always active |
| `/services/ui-ux-graphic-design` | UI/UX & Graphic Design | Phase 5 | Always active |
| `/services/domain-hosting-maintenance` | Domain, Hosting & Maintenance | Phase 5 | Always active |
| `/services/crm` | Customer Relationship Management (CRM) | Phase 5 | Always active |
| `/services/erp-billing-gst` | ERP, GST Billing & POS Software | Phase 5 | Always active |
| `/services/hrms-payroll` | HRMS & Payroll Management | Phase 5 | Always active |
| `/services/custom-software` | Custom Software & API Integrations | Phase 5 | Always active |
| `/industries` | Solutions by Industry Directory | Phase 5 | `features.industries` (default: false) |
| `/work` | Portfolio & Selected Projects Index | Phase 6 | `features.work` (default: false) |
| `/work/[slug]` | Case Study Detail Template | Phase 6 | `features.work` (default: false) |
| `/pricing` | Transparent Pricing (Quote-first) | Phase 8 | Always active |
| `/about` | Company: Story, Leadership, Trust, Careers | Phase 7 | Always active |
| `/insights` | Editorial Insights / Thought Leadership | Phase 9 | `features.insights` (default: false) |
| `/insights/[slug]` | Article Detail Template | Phase 9 | `features.insights` (default: false) |
| `/contact` | Direct Contact & Inquiry Form | Phase 8 | Always active |
| `/legal/privacy` | Privacy Policy (Preserved exact text) | Phase 9 | Always active |
| `/legal/terms` | Terms of Service | Phase 9 | Awaiting client legal text (returns 404 until text supplied) |
| `/legal/refund-cancellation` | Refund & Cancellation Policy | Phase 9 | Awaiting client legal text (returns 404 until text supplied) |
| `/404` | Custom Editorial Not Found Page | Phase 9 | Always active |
| `/sitemap.xml` | Dynamic XML Sitemap | Phase 12 | Always active |
| `/robots.txt` | Crawler Directives | Phase 12 | Always active |

*Excluded routes:* `/login` and `/signup` are excluded from the rebuild unless the client confirms active client portal infrastructure.

---

## 2. Legacy Route Migration & 301 Redirect Map

Every URL identified on the old site (`cdmlko.com`) must be permanently redirected (HTTP 301) to protect SEO equity and prevent broken links.

| Legacy URL | Target New URL | Redirect Type | Strategic Rationale |
|---|---|---|---|
| `/` | `/` | 200 OK | Home page root |
| `/about` | `/about` | 200 OK | Direct match |
| `/services` | `/services` | 200 OK | Direct match |
| `/services/website-development` | `/services/business-websites` | 301 Permanent | Direct equivalent for web development |
| `/seo-services-lucknow` | `/services/seo` (or alias) | 301 Permanent / Rewrite | Highly valuable localized SEO page. Recommended default: 301 redirect to `/services/seo` while incorporating Lucknow locality content on that page; or maintain as an alias route. |
| `/portfolio` | `/work` (or `/services` if work is flagged off) | 301 Permanent | Portfolio was empty stubs; maps cleanly to `/work` |
| `/pricing` | `/pricing` | 200 OK | Direct match |
| `/contact` | `/contact` | 200 OK | Direct match |
| `/blog` | `/insights` (or `/` if insights flagged off) | 301 Permanent | Blog had 3 empty stubs; maps to `/insights` |
| `/career` | `/about#careers` | 301 Permanent | Consolidated into the About page careers band |
| `/privacy-policy` | `/legal/privacy` | 301 Permanent | Standardized legal path |

### Migration of ~120 Templated Legacy Services
The legacy site created roughly 120 near-identical service URLs. These are mapped to the 14 core Pillar Service slugs:

| Legacy Service Group | Target 301 Canonical Path |
|---|---|
| E-Governance, NGO, Matrimonial, Restaurant, Real Estate, School, MSME, Startup, Company Profile, Corporate, B2B/B2C Websites | `/services/business-websites` |
| Dropshipping, Multi-vendor Marketplace, E-commerce Portal | `/services/ecommerce-websites` |
| 32 App types (Taxi, Food, Grocery, Booking, Delivery, Logistics, Chat, Fitness, etc.) | `/services/mobile-apps` |
| Franchise Management, Office Management, Project Management, SaaS, Document Management | `/services/custom-software` |
| POS, Inventory & Order, Billing & GST, Accounting | `/services/erp-billing-gst` |
| HRMS & Payroll Software | `/services/hrms-payroll` |
| CRM Software, CRM for Marketing | `/services/crm` |
| Hospital, Clinic, Pharmacy, LMS, Tour, Logistics, Hotel Booking Software | `/services/custom-software` |
| Domain & Hosting, Maintenance Services | `/services/domain-hosting-maintenance` |
| Graphics Design, UI/UX Designing | `/services/ui-ux-graphic-design` |
| Google Ads, PPC, Advertisement Management | `/services/google-ads-ppc` |
| Meta Ads, Lead Generation | `/services/meta-ads-lead-generation` |
| On-Page SEO, Off-Page SEO, Technical SEO, Keyword Research, Ranking Monitoring, SEO Tools | `/services/seo` |
| GMB Management, Local SEO Lucknow | `/services/local-seo-google-business-profile` |
| Social Media, YouTube, LinkedIn, X, Email Marketing, Bulk SMS, Content Marketing | `/services/social-content-email-sms` |
