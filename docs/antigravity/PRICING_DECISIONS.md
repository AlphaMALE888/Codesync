# CODESYNC Pricing Decisions & Conflicts Analysis (`PRICING_DECISIONS.md`)

This document records the exact pricing discrepancies discovered on the legacy website (`cdmlko.com`). Per the Content Status Rule, all public-facing pricing is gated as **quote-first** until the client confirms canonical figures.

---

## 1. Discrepancies by Service Category

### A. Business Websites
1. **Homepage Banner Claim:** "Website Starter from 13,999 INR" (Includes: 1-year domain, 1-year hosting, dynamic website, 5 official emails, basic SEO).
2. **Service Page Packages:**
   - Starter: ₹8,000 + GST
   - Growth: ₹16,000 + GST
   - Enterprise: ₹32,000 + GST  
   *(Conflict: All three tiers list virtually identical feature sets with no technical delineation).*
3. **Homepage Comparison Table:** Displays range of "₹8,000 to ₹25,000+".
4. **FAQ Section:** States standard website cost is "₹8,000 to ₹15,000".
- **Resolution Status:** UNAPPROVED. Stored in `candidatePrice` as developer fixtures only. Public website renders scope-based quotation.

### B. Mobile Applications (Android & iOS)
1. **Homepage Offer:** "From ₹29,999".
2. **Service Listing Page:** "From ₹25,000 + GST".
3. **Package Table Range:** "₹25,000 to ₹80,000+".
- **Resolution Status:** UNAPPROVED. Public display shows "Scoped according to target operating systems, API integrations, and feature sets."

### C. Business Software (CRM, ERP, Billing, HRMS)
1. **Homepage Offer:** "From ₹19,999".
2. **Service Listing Page:** "From ₹15,000 + GST".
3. **Package Table Range:** "₹15,000 to ₹60,000+".
- **Resolution Status:** UNAPPROVED. Public display shows quote-first pricing block.

### D. Digital Marketing (Google Ads & Meta Ads)
1. **Starter Tier:** Advertised as "₹1,499 per month" (Includes: 1 campaign, 1-2 ad sets, 2 creatives, audience research, lead-generation strategy, optimization, monthly report; client ad spend excluded).
2. **Service Page Standard Rate:** Advertised as "₹4,999 per month + GST".
- **Resolution Status:** UNAPPROVED. Retainers must clarify agency management fee vs third-party ad spend.

### E. Promotional Claims & Add-ons
1. **"6 Months Free Maintenance":** Highlighted across multiple pages for IT services, but no service level agreement (SLA) or scope exclusions are defined.
2. **Unverified Add-on Fees:**
   - Advanced integration: +₹1,500
   - Data migration: +₹1,200
   - Custom reports: +₹1,000
   - Team training: +₹700
   - Priority support: +₹800
3. **Recurring Consent Defect:** The legacy site had recurring payment agreement checkboxes on one-time website project checkout forms. Excluded from this rebuild.

---

## 2. Production Policy
- Public website displays transparent scope-first quoting: **"Pricing depends on your goals and scope. Tell us what you need and we will send a clear quote."**
- Number display is activated only when:
  1. Client confirms canonical price sheet.
  2. `features.pricingNumbers` is toggled to `true`.
  3. Individual plan has `approved: true` in `src/data/pricing.ts`.
