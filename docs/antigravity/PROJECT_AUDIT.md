# Project Audit & Repository Baseline
**Date:** 8 November 2026  
**Auditor:** Antigravity (Senior Full-Stack Developer & Frontend Architect)  
**Phase:** Phase 0 (Repository Audit and Project Foundation)  

---

## 1. Repository Environment & State

| Item | Current State | Notes |
|---|---|---|
| **Working Directory** | `C:\Users\shiva\Desktop\AI LEAD SYSTEM` | Clean, initial workspace |
| **Git Version** | `git version 2.56.0.windows.2` | Clean local git installation |
| **Git Repository Status** | Uninitialized (`fatal: not a git repository`) | Will be initialized when project scaffolding begins |
| **Node.js Version** | `v24.18.0` (LTS/current modern Node) | Fully compatible with Next.js 14/15 |
| **npm Version** | `11.16.0` | Modern package manager available |
| **Package Manager Lockfile** | None present | Greenfield repository |
| **Framework / Core Libraries** | None present | Fresh repository root |
| **TypeScript Configuration** | None present | Will be configured in strict mode upon initialization |
| **Tailwind Configuration** | None present | Will be configured with design tokens in Phase 1 |
| **Deployment Configuration** | None present (`vercel.json`, `Dockerfile`, etc.) | To be decided per hosting target selection |

---

## 2. Baseline Test Execution Results

- **`npm install`**: N/A (no `package.json` in repository).
- **`npm run lint`**: N/A (no linter configured).
- **`npm run type-check` / `tsc`**: N/A (no TypeScript project configured).
- **`npm run build`**: N/A (no build scripts configured).

> [!NOTE]  
> The repository is currently empty and contains no previous codebase or legacy files. Per Playbook Phase 0 Section G, this state is documented explicitly, and scaffolding is paused until explicit approval to proceed with Phase 1.

---

## 3. Existing Legacy Site Audit (from Dossier cdmlko.com)

- **Old Technology Stack**: PHP on shared hosting (Hostinger `public_html`), Bootstrap 4/5 responsive grid, jQuery/vanilla JavaScript, MySQL.
- **Viewport Meta**: Yes (`<meta name="viewport" content="width=device-width, initial-scale=1.0">`).
- **Responsive Breakpoints Observed**: Bootstrap standard breakpoints (`sm: 576px`, `md: 768px`, `lg: 992px`, `xl: 1200px`).
- **Baseline Performance / Lighthouse**: Not measurable directly against local files as no legacy code is hosted in this workspace. The old site suffered from unoptimized asset loading, leaked developer notes in HTML, and static placeholder stubs.

---

## 4. Environment Variables Checklist (.env.example)

No `.env` or `.env.local` files exist yet. Variable definitions required for the rebuild are documented in `.env.example`:
- `NEXT_PUBLIC_SITE_URL`
- `INQUIRY_PROVIDER` (`'resend'` | `'webhook'`)
- `RESEND_API_KEY`
- `INQUIRY_TO_EMAIL`
- `INQUIRY_FROM_EMAIL`
- `INQUIRY_WEBHOOK_URL`
- `NEXT_PUBLIC_GA_ID` (optional)
- `NEXT_PUBLIC_SHOW_DEV_FIXTURES` (dev-only)
- `NEXT_PUBLIC_SHOW_CANDIDATE_PRICES` (dev-only)

---

## 5. Architectural Findings & Constraints

1. **Hosting Runtime Constraint**:
   The legacy site was hosted on PHP shared hosting (`Hostinger public_html`). Next.js App Router with server-side form validation and dynamic routing requires a Node.js runtime environment (e.g., Vercel, Node-capable VPS/PaaS) OR a static HTML export paired with an external serverless webhook for forms. The default strategy recommended for this build is modern Node hosting (e.g., Vercel).
2. **Clean Project Separation**:
   Because the repository is empty, we do not need to perform complex surgery on legacy PHP/Bootstrap files. We will build a pristine, modern Next.js App Router application with strict TypeScript, Tailwind CSS, Framer Motion, GSAP ScrollTrigger, and Lenis.
