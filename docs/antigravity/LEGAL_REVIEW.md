# Legal & Compliance Review: CODESYNC Digi Marketing Pvt. Ltd.
**Date:** 9 November 2026  
**Auditor:** Antigravity (Phase 9 Implementation)  
**Governing Entity:** Codesync Digi Marketing (OPC) Pvt Ltd (CIN: U63119UP2024OPC212671)  
**Domain:** cdmlko.com  

---

## 1. Executive Summary

This document audits the legal and compliance footprint of the legacy CODESYNC web presence, identifies critical inconsistencies across contact data and corporate policies, and establishes the operating guardrails enforced in Phase 9.

In accordance with strict content verification rules:
- **Privacy Policy (`/legal/privacy`)**: Retains the complete, unadulterated legal scope from the legacy policy (effective 13 September 2026) while formatting it in a calm, accessible 720px reading layout with desktop sticky table of contents and mobile disclosure navigation.
- **Terms of Service (`/legal/terms`)**: The legacy website had no published Terms of Service. This route is set to status `awaiting-client-text` and returns clean `404 Not Found` until formal text is provided by legal counsel. It is omitted from the footer and sitemap.
- **Refund & Cancellation Policy (`/legal/refund-cancellation`)**: The legacy website had no published Refund Policy despite mentioning online bookings. This route is set to status `awaiting-client-text` and returns clean `404 Not Found` until formal text is provided.
- **Cookie Consent**: No third-party marketing or tracking cookies are set on the new architecture. When analytics are configured in Phase 12, cookie consent requirements will be reviewed.

---

## 2. Identified Inconsistencies & Client Action Items

### Issue A: Third Unconfirmed Phone Number (`9125100206`)
- **Legacy Observation:** The legacy privacy policy footer listed `9125100206`. However, the website's primary contact bar, hero, floating WhatsApp button, and contact cards consistently used only `8948040913` and `9616530280`.
- **Action Required:** Client must clarify whether `9125100206` is an active grievance/compliance contact or an obsolete employee number.
- **Current Production Rule:** Only `8948040913` and `9616530280` are published on public contact surfaces. The legacy number is preserved strictly within the verbatim privacy policy text under Contact & Grievance Redressal.

### Issue B: Physical Address Contradiction ("Awanti Puram")
- **Legacy Observation:** The legacy privacy policy referenced an "Awanti Puram" address, whereas MCA filings and footer text referenced `Oblic Sekhpur Kasalia, Sector 14, Indira Nagar, Lucknow 226016` (and variant `539K OBLIC SHEIKHPURA, KASAILA, Indiranagar Sec-14`).
- **Action Required:** Confirm the single canonical registered office address versus branch/operating locations.
- **Current Production Rule:** Public contact cards display "Lucknow, Uttar Pradesh" without committing to an unverified street line until client sign-off.

### Issue C: Payment Processors & Razorpay References
- **Legacy Observation:** Legacy pages contained Razorpay authorization clauses and references to payment processing. In particular, one legacy form included recurring-charge consent text on one-time packages (a copy-paste error).
- **Action Required:** If online retainer/project billing via Razorpay or payment gateways is reinstated, formal Terms of Service and Refund/Cancellation Policies must be drafted and approved.
- **Current Production Rule:** The new website operates entirely on direct inquiries, custom scope reviews, and zero-payment lead forms. No payment gateway SDK or card processing is loaded.

### Issue D: Absence of Terms of Service & Refund Policy
- **Legacy Observation:** While accepting enquiries and advertising commercial services, the legacy site provided no Terms of Service or clear cancellation/refund framework.
- **Action Required:** Client counsel should draft:
  1. Terms of Service covering intellectual property ownership, source code transfer upon project delivery, hosting/domain management responsibilities, and limitation of liability.
  2. Cancellation & Refund Policy clarifying advance milestone payments, monthly marketing retainer termination notices (e.g., 30-day notice), and non-refundable third-party ad spend (Google/Meta).
- **Current Production Rule:** `/legal/terms` and `/legal/refund-cancellation` are completely shielded behind status `awaiting-client-text` (404).

### Issue E: Cookie Notice & Analytics Tracking
- **Legacy Observation:** Legacy privacy policy mentioned automated cookie tracking and third-party advertising cookies.
- **Action Required:** If Phase 12 enables third-party tracking scripts (such as Google Analytics via `NEXT_PUBLIC_GA_ID`), a compliant, non-intrusive cookie consent banner must be configured before non-essential cookies fire.
- **Current Production Rule:** Zero tracking cookies or third-party pixels are loaded. No banner is rendered.

---

## 3. Legal Route Registry & Enforcement Status

| Route | Title | Target Status | Production Status | Fallback Behavior |
|---|---|---|---|---|
| `/legal/privacy` | Privacy Policy | `published` | Active (200) | Full 16-section legal layout |
| `/legal/terms` | Terms of Service | `awaiting-client-text` | Hidden (404) | Invokes `notFound()`; omitted from footer & sitemap |
| `/legal/refund-cancellation` | Refund & Cancellation | `awaiting-client-text` | Hidden (404) | Invokes `notFound()`; omitted from footer & sitemap |
