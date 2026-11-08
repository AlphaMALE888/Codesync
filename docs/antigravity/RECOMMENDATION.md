# Architectural Recommendation & Strategy
**Date:** 8 November 2026  
**Author:** Antigravity (Senior Full-Stack Developer & Frontend Architect)  
**Word Count:** Under 280 words  

---

## 1. Recommended Implementation Strategy: Fresh Scaffolding (Strategy C)

The workspace is an empty directory with no legacy codebase or pre-existing dependencies. Therefore, **Strategy (c) — initializing a clean, modern Next.js App Router project** — is the single viable and optimal technical approach. 

### Justification:
1. **Clean Foundation**: A fresh Next.js 14/15 App Router setup with strict TypeScript, Tailwind CSS, Lucide React, Framer Motion, GSAP ScrollTrigger, and Lenis avoids technical debt, legacy PHP remnants, and conflicting configuration.
2. **Deterministic Architecture**: It enables structuring `src/app`, `src/components`, `src/data`, and `src/lib` precisely as specified in the Master Playbook without refactoring risks.
3. **Strict Content Gating**: It enforces our Content Status Rule (`verified`, `draft`, `pending`) and feature flags from day one.

---

## 2. Critical Infrastructure Decision: Hosting Runtime

The legacy site reportedly ran on classic PHP shared hosting (Hostinger `public_html`). A modern Next.js App Router application with secure server-side form submission routes (`/api/inquiry`) and dynamic metadata **cannot run on classic PHP shared hosting**.

### Two Available Hosting Options:
- **Option 1 (Recommended — Node Runtime)**: Deploy to Vercel, a Node-capable cloud provider, or a Linux VPS running Node.js with PM2 and Nginx. This natively supports Next.js Server Components, Server Actions/API routes, and Edge caching.
- **Option 2 (Static Export + External Webhook)**: Build via `output: 'export'` to generate pure static HTML/CSS/JS. Forms must bypass the Next.js server and submit directly from the browser to an external third-party webhook (e.g., Zapier, Formspree, Google Apps Script).

*Decision Requested:* We recommend **Option 1 (Vercel/Node)**. Please confirm your desired hosting target.

---

> [!IMPORTANT]  
> **Repository Status:** The repository is currently empty. Per Phase 0 instructions, we stop here. Scaffolding will begin only upon your explicit authorization to begin Phase 1.
