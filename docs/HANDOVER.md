# CODESYNC Rebuild — Client & Engineering Handover Guide (`HANDOVER.md`)

**Client / Agency:** CODESYNC Digi Marketing Pvt. Ltd. (Legal: `Codesync Digi Marketing (OPC) Pvt Ltd`)  
**Domain:** `cdmlko.com` (`https://www.cdmlko.com`)  
**System Architecture:** Next.js 14 App Router (React 18, TypeScript, Tailwind CSS, Lenis, GSAP, Framer Motion)  
**Date:** 11 November 2026  
**Build Status:** Production Ready (Phases 0–13 Complete)

---

## 1. Quick Start & Execution

### Prerequisites
- Node.js `v18.17.0` or higher (`v20.x` or `v24.x` recommended)
- `npm` (`v9.x` or higher)

### Installation & Commands
```bash
# 1. Install dependencies
npm install

# 2. Run local development server (http://localhost:3000)
npm run dev

# 3. Type check (strict TypeScript)
npm run type-check

# 4. Lint check (Next.js core web vitals)
npm run lint

# 5. Production build
npm run build

# 6. Production server preview
npm run start
```

---

## 2. Environment Variables & Configuration

All environment variables must be configured in `.env.local` for local development or within your cloud hosting dashboard (e.g., Vercel, Railway, Node VPS). **Never commit real secrets or production keys into Git.**

Template (`.env.example`):
```bash
# Public canonical base URL (used for metadata, OpenGraph, sitemap, and redirects)
NEXT_PUBLIC_SITE_URL=https://www.cdmlko.com

# Form Delivery Provider ('resend' | 'webhook')
INQUIRY_PROVIDER=resend

# If using Resend (https://resend.com):
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
INQUIRY_TO_EMAIL=support@cdmlko.com
INQUIRY_FROM_EMAIL=leads@cdmlko.com

# If using Webhook / CRM / Zapier / Make:
INQUIRY_WEBHOOK_URL=https://your-crm-endpoint.com/webhook

# Optional Google Analytics 4 Measurement ID
NEXT_PUBLIC_GA_ID=

# Development Preview Flags (KEEP FALSE / BLANK IN PRODUCTION)
NEXT_PUBLIC_SHOW_DEV_FIXTURES=false
NEXT_PUBLIC_SHOW_CANDIDATE_PRICES=false
```

---

## 3. The Content Status Rule (Governance)

Every factual statement, statistic, case study, team member, testimonial, and price in this website strictly follows three lifecycle states:

1. **`verified`**: The item is confirmed by the client or appears on verified legal/corporate records. Rendered freely in production.
2. **`draft`**: High-quality editorial copy crafted strictly from verified facts. Rendered in production, but flagged for client awareness.
3. **`pending`**: Information that has not yet been approved or confirmed (e.g., candidate prices, unpermissioned client logos, unverified ISO/Govt badges, placeholder founder stories). **Pending items are completely hidden from production renders by architecture.**

---

## 4. How to Manage Feature Flags (`src/data/features.ts`)

Feature flags give CODESYNC complete control over expanding site capabilities without touching component code.

File: `src/data/features.ts`

```typescript
export const features = {
  // Enables the /work case studies page and homepage Selected Work carousel.
  // DEFAULT: false. Turn true ONLY after client signs off on client naming permissions and case data.
  work: false,

  // Enables the /insights thought leadership article section.
  // DEFAULT: false. Turn true once editorial articles are finalized.
  insights: false,

  // Enables the /industries vertical landing pages.
  // DEFAULT: false. Turn true when specialized industry service pages are ready.
  industries: false,

  // Toggles between Quote-First pricing (false) and fixed starting numbers (true).
  // DEFAULT: false. Turn true ONLY after client confirms exact retainer packages.
  pricingNumbers: false,

  // Enables the Founder vision and agency manifesto block on the homepage.
  // DEFAULT: false. Turn true when founder biography is confirmed.
  vision: false,

  // Enables Govt/ISO certifications badge section.
  // DEFAULT: false. Turn true ONLY if registration certificates are uploaded.
  credentials: false,
};
```

---

## 5. How to Edit Content & Data

All website content is managed through strongly typed TypeScript data files in `src/data/`:

### A. Editing Services (`src/data/services.ts`)
Each of the 14 core services is structured with:
- `slug`: Canonical URL slug (e.g. `seo`, `google-ads-ppc`, `business-websites`).
- `name`: Display title.
- `summary`: One-sentence positioning.
- `pillar`: `'grow' | 'build' | 'run'`.
- `deliverables`: Array of bulleted deliverables.
- `outcomes`: Realistic expected business results.
- `faqs`: Array of FAQ IDs linked to this service.

### B. Adding a Team Member (`src/data/team.ts`)
```typescript
{
  id: "team-05",
  name: "Pooja Sharma",
  role: "Senior SEO Strategist",
  status: "verified", // Must be 'verified' or 'draft'
  source: "Client confirmation 11 Nov 2026",
  bio: "Specializes in technical crawling, local citation clusters, and Google Business Profile optimization.",
}
```

### C. Adding a Verified Testimonial (`src/data/testimonials.ts`)
Only add testimonials with verified client permission:
```typescript
{
  id: "test-07",
  clientName: "Rajesh Kapoor",
  company: "Lucknow Logistics Hub",
  service: "CRM & ERP Software",
  quote: "Codesync developed our dispatch and invoicing system. Reduced paperwork across three branches.",
  status: "verified",
  source: "Client feedback WhatsApp 10 Nov 2026",
}
```

### D. Managing FAQs (`src/data/faqs.ts`)
FAQs are categorized (`general`, `seo`, `marketing`, `websites`, `software`). Updating `faqs.ts` automatically updates both the visible accordion UI and the Schema.org `FAQPage` JSON-LD structured data.

### E. Adding a Work Project / Case Study (`src/data/projects.ts`)
Projects only render when `features.work: true` and all client permissions are set:
```typescript
{
  id: "proj-01",
  slug: "regional-diagnostic-seo",
  title: "Multi-Location Diagnostic Lab",
  summary: "Local Search & Call Inflow Infrastructure",
  pillar: "grow",
  client: {
    name: "Diagnostic Healthcare Network",
    permissionToName: true,
  },
  approved: true,
  status: "verified",
  // ... metrics, approach, and media
}
```

---

## 6. Design & Motion System Architecture

### Design Tokens (`src/styles/tokens.ts` & `tailwind.config.ts`)
- **Canvas (Background):** `#F5F5F3`
- **Surface Muted:** `#EAEAE7`
- **Surface Dark:** `#111213`
- **Ink (Text Primary):** `#111213`
- **Text Secondary:** `#555552`
- **Accent Default:** `#2F5A44` (Spartan Forest Green)
- **Arch Green:** `#49735A` (Muted Architectural Green)
- **Highlight (Neon):** `#C8E64A` (Used sparingly for active badges)
- **Typography Scale:** Fluid typography using CSS `clamp()` scaling smoothly from 320px mobile to 2560px ultra-wide.

### Motion Architecture (`src/lib/motion-tokens.ts`)
- **Lenis Smooth Scroll:** Mounted globally in `src/app/layout.tsx`. Honors `data-lenis-prevent` on modals and mobile drawers.
- **GSAP ScrollTrigger:** Debounced resize handling (`200ms`).
- **Accessibility:** Global `prefers-reduced-motion: reduce` listener immediately bypasses all scroll scrubbing, counter increments, and staggering.

---

## 7. Known Architectural Boundaries

1. **Static Export Limitation:**
   The site uses Next.js server features (API route `/api/inquiry`, Edge runtime dynamic OpenGraph image `opengraph-image.tsx`, dynamic `sitemap.ts` and `robots.ts`). Therefore, **it cannot be exported to a plain static HTML bucket (`output: 'export'`)** without replacing these server capabilities with static assets or third-party hosted forms.
2. **PHP Shared Hosting Incompatibility:**
   Classic cPanel PHP shared hosting cannot execute Next.js Node.js applications. A modern Node-capable cloud host (Vercel, Railway, Render, DigitalOcean, or AWS EC2/Lightsail) is required.
