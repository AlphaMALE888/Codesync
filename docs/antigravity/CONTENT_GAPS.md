# Content Gaps & Missing Information Checklist
**Date:** 8 November 2026  
**Auditor:** Antigravity  
**Phase:** Phase 0 (Repository Audit and Project Foundation)  

---

## 1. Content Gaps & Missing Information Table

| Item | Why Needed | Where It Will Appear | Who Supplies It | Status |
|---|---|---|---|---|
| **Founder / Managing Director** | Essential for corporate trust and About story | `/about` (VisionSplit / Leadership) | Client | `Pending` |
| **Authentic Company Story & Mission** | Explains why CODESYNC was founded and its vision | `/about` | Client | `Pending` |
| **Canonical Single Office Address** | Three conflicting address spellings exist on old site | `/contact`, footer, structured data | Client | `Pending` |
| **Standard Business Working Hours** | Customer clarity for support and consultations | `/contact`, footer | Client | `Pending` |
| **Substantiation for 374+ / 643+ / 22+ / 30+** | Unsubstantiated claims violate truth-in-advertising | Hero proof rail, about stats | Client | `Pending` (Omitted until verified) |
| **Certificates for ISO, Startup India, MSME, GeM** | Government logos require certificate numbers | Trust badges, `/about` | Client | `Pending` (Omitted until verified) |
| **One Unified Approved Price List** | Old site has 4 conflicting price points per service | `/pricing`, service pages | Client | `Pending` (Quote-first used) |
| **Ad Spend & GST Clarity** | Clarifies whether ad budget/taxes are extra | Pricing cards & notes | Client | `Pending` |
| **Terms of "6 Months Free Maintenance"** | Crucial to avoid legal disputes on scope | Service pages, `/pricing` | Client | `Pending` |
| **Terms of Service & Refund Policy** | Mandatory compliance for digital services | `/legal/terms`, `/legal/refund` | Client / Legal | `Pending` (Routes 404 until text supplied) |
| **Real Case Studies (4–6 Projects) with Permission** | Real proof of delivery and technical outcomes | `/work`, `/work/[slug]`, Home | Client | `Pending` (`features.work = false`) |
| **Original Testimonial Verification & Google Link** | Validates authentic 5-star Google review status | `/about`, Home testimonials | Client | `Pending` (Exact quotes rendered without rating badge) |
| **Full Surnames & High-Res Photos for Leaders** | Vikas has no surname; all photos need raw files | `/about` (LeadershipGrid) | Client | `Pending` |
| **Original High-Res Logo Files (Vector/SVG)** | Clear rendering on light and dark backgrounds | Header, Footer, Favicons | Client | `Pending` (Provisional SVG brand mark used) |
| **Google Business Profile Live URL** | Direct link for customer review verification | Footer, Contact | Client | `Pending` |
| **Hosting Target Decision** | Node.js host (Vercel) vs VPS vs Static Export | Deployment architecture | Client | `Pending Decision` |
| **Inquiry Form Delivery Target** | Email via Resend vs CRM webhook endpoint | Backend API route `/api/inquiry` | Client | `Pending Decision` |

---

## 2. Leaked Internal Development Copy to Purge

> [!CAUTION]  
> The following internal phrases were discovered on the legacy site (`cdmlko.com`). They **MUST NEVER** be carried over into any page, component, documentation, or metadata of the rebuild:

- ❌ `"clean PHP includes"`
- ❌ `"static placeholder modules"`
- ❌ `"Hostinger public_html upload"`
- ❌ `"future database path"`
- ❌ `"This first release is intentionally static and prepared for future modules"`
- ❌ `"managed from the Super Admin Panel"`
- ❌ `"Software UI"` (used inappropriately as a standalone public service name)
- ❌ `"Portfolio project information will be published here"`
- ❌ Razorpay recurring payment consent checkboxes on one-time development packages
- ❌ Formulaic 16.7% strike-through discount pricing (e.g. ₹9,600 → ₹8,000)
- ❌ Duplicate filler problem statements (e.g. "manual processes, disconnected tools" on the web design page)
