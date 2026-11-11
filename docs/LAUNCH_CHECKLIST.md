# CODESYNC Rebuild — Production Launch Checklist (`LAUNCH_CHECKLIST.md`)

**Target Domain:** `cdmlko.com` & `www.cdmlko.com`  
**Client:** CODESYNC Digi Marketing Pvt. Ltd.  
**Date:** 11 November 2026  
**Status:** Pre-Launch Preparation (Phase 13 Deliverable)

This checklist restates and operationalizes the Deployment Checklist from Section 18 of the project playbook.

---

## 1. Hosting & Server Infrastructure

| # | Step | Detail | Status | Responsible |
|---|---|---|---|---|
| 1.1 | **Hosting Target Confirmed** | Ensure target host supports Node.js runtime (Vercel, Railway, or Node VPS). Confirm that PHP shared hosting is **not** used. | **READY** | Client + Developer |
| 1.2 | **Node.js Environment** | Node.js version `20.x LTS` verified. | **READY** | Developer |
| 1.3 | **Production Environment Variables** | Set in host settings: `NEXT_PUBLIC_SITE_URL`, `INQUIRY_PROVIDER`, `RESEND_API_KEY`, `INQUIRY_TO_EMAIL`, `INQUIRY_FROM_EMAIL`, `NEXT_PUBLIC_GA_ID`. | **PENDING HOST SETUP** | Developer |
| 1.4 | **SSL / TLS Certificate** | Verify automatic HTTPS renewal via Let's Encrypt or Vercel Edge SSL. | **PENDING DNS SWITCH** | Developer |

---

## 2. Forms, Lead Delivery & Integrations

| # | Step | Detail | Status | Responsible |
|---|---|---|---|---|
| 2.1 | **Domain Verification for Email** | Verify sending domain (e.g. `cdmlko.com`) in Resend dashboard (DKIM, SPF, DMARC records). | **PENDING CLIENT ACCESS** | Client + Developer |
| 2.2 | **Live Inquiry End-to-End Test** | Submit a test lead via `/contact` and Book Call modal; verify receipt in `support@cdmlko.com`. | **TESTED MOCK / READY** | Developer |
| 2.3 | **Anti-Spam Controls Active** | Honeypot field and 2.5s minimum submission timing verified. | **VERIFIED PASS** | Developer |
| 2.4 | **Rate Limiting Active** | Max 5 requests per minute per IP limit enforced on `/api/inquiry`. | **VERIFIED PASS** | Developer |
| 2.5 | **Google Analytics 4** | GA4 measurement ID added to `NEXT_PUBLIC_GA_ID` once created by client. | **OPTIONAL / READY** | Client |

---

## 3. Content Accuracy & Client Sign-Off (Content Status Rule)

| # | Step | Detail | Status | Responsible |
|---|---|---|---|---|
| 3.1 | **Company Identity & Registration** | Confirm legal name: `Codesync Digi Marketing (OPC) Pvt Ltd`. | **VERIFIED** | Client |
| 3.2 | **Contact Numbers & Channels** | Verify phones `8948040913`, `9616530280`, email `support@cdmlko.com`, WhatsApp `https://wa.me/918948040913`. | **VERIFIED** | Client |
| 3.3 | **Physical Address & Hours** | Keep address city-level (`Lucknow, UP`) unless client provides exact canonical street address. | **VERIFIED ACCURATE** | Client |
| 3.4 | **14 Core Services Content** | Review 14 service descriptions, deliverables, and local Lucknow positioning. | **VERIFIED** | Client |
| 3.5 | **Pricing Policy** | Keep `features.pricingNumbers: false` (Quote-First) unless client confirms fixed pricing tiers. | **CONFIGURED SECURELY**| Client |
| 3.6 | **Client Testimonials** | Only approved testimonials rendered. Zero fake or unpermissioned reviews. | **VERIFIED PASS** | Client |
| 3.7 | **Legal Policies** | Privacy policy published; Terms and Refund policies set to `noindex` until client supplies legal text. | **VERIFIED PASS** | Client |
| 3.8 | **Feature Flags Gate** | Unverified sections (`work`, `insights`, `industries`, `vision`, `credentials`) kept `false` until approved. | **CONFIGURED SECURELY**| Developer |

---

## 4. SEO, Redirects & Crawlability

| # | Step | Detail | Status | Responsible |
|---|---|---|---|---|
| 4.1 | **301 Legacy Redirects** | 26/26 permanent redirect rules tested and passing (`scripts/test-redirects.js`). | **VERIFIED PASS** | Developer |
| 4.2 | **XML Sitemap** | Dynamic `/sitemap.xml` generated with priority and modification timestamps. | **VERIFIED PASS** | Developer |
| 4.3 | **Robots.txt** | `/robots.txt` active, disallowing `/api/`, `/design-system`, and pointing to sitemap. | **VERIFIED PASS** | Developer |
| 4.4 | **Structured Data (JSON-LD)** | `Organization`, `LocalBusiness`, `Service`, `BreadcrumbList`, `FAQPage` active. Zero `Review` markup. | **VERIFIED PASS** | Developer |
| 4.5 | **Canonical URLs** | Standard canonical tags present across all 30 routes. | **VERIFIED PASS** | Developer |
| 4.6 | **OpenGraph Social Preview** | Edge dynamic 1200×630 OG image and 32×32 / 180×180 icons verified. | **VERIFIED PASS** | Developer |
| 4.7 | **Search Console Submission** | Submit `https://www.cdmlko.com/sitemap.xml` in Google Search Console post-launch. | **POST-LAUNCH** | Developer |

---

## 5. DNS Cutover & Fallback Execution

| # | Step | Detail | Status | Responsible |
|---|---|---|---|---|
| 5.1 | **Lower DNS TTL** | Reduce TTL on `cdmlko.com` to 300 seconds (5 min) 24 hours prior to launch. | **PRE-LAUNCH** | Client / Registrar |
| 5.2 | **Legacy Site Backup** | Create `legacy.cdmlko.com` DNS record pointing to old server for emergency archive. | **PRE-LAUNCH** | Client / Developer |
| 5.3 | **DNS Cutover** | Update A and CNAME records to point to production Next.js host. | **LAUNCH DAY** | Client / Developer |
| 5.4 | **Immediate Live Verification** | Click through all 14 service routes, submit live test form, check redirects. | **LAUNCH DAY** | Developer |
| 5.5 | **Rollback Ready** | In case of host failure, switch DNS back to old server IP within 5 minutes. | **PREPARED** | Developer |
| 5.6 | **Restore DNS TTL** | Increase TTL back to `86400` (24h) 48 hours after stable operation. | **POST-LAUNCH** | Developer |
