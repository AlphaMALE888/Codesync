# Antigravity Continuity & Phase Log
**Project:** CODESYNC Digi Marketing Pvt. Ltd. — Website Rebuild  
**Purpose:** Permanent tracking record across all 14 sequential development phases (Phases 0 through 13). Every phase inspects this log before starting and updates it upon completion.

---

## Master Phase Status Table

| Phase | Title | Status | Completion Date |
|---|---|---|---|
| **Phase 0** | **Repository Audit and Project Foundation** | **COMPLETE** | 8 November 2026 |
| **Phase 1** | **Design System and Global Foundation** | **COMPLETE** | 8 November 2026 |
| **Phase 2** | **Global Navigation and Shared Components** | **COMPLETE** | 8 November 2026 |
| **Phase 3** | **Homepage Hero Experience** | **COMPLETE** | 8 November 2026 |
| **Phase 4** | Homepage Sections | **COMPLETE** | 8 November 2026 |
| **Phase 5** | Services Pages (Hub & 14 Detail Pages) | **COMPLETE** | 9 November 2026 |
| **Phase 6** | Portfolio and Case Studies | **COMPLETE** | 9 November 2026 |
| **Phase 7** | About, Team and Trust Sections | **COMPLETE** | 9 November 2026 |
| **Phase 8** | Pricing, FAQ and Contact Experience | **COMPLETE** | 9 November 2026 |
| **Phase 9** | Additional Pages (Insights, Legal, Industries, 404) | **COMPLETE** | 10 November 2026 |
| **Phase 10** | Complete Animation and Interaction Pass | NOT STARTED | — |
| **Phase 11** | Responsive Design | NOT STARTED | — |
| **Phase 12** | SEO, Performance and Accessibility | NOT STARTED | — |
| **Phase 13** | Final Testing, Content Verification & Delivery | NOT STARTED | — |

---

## Phase 0 Record: Repository Audit and Project Foundation

- **Status:** COMPLETE
- **Date:** 8 November 2026
- **Objective:** Audit the existing repository, inspect system toolchains, extract and analyze reference documents, map route migrations, document content gaps, establish project continuity logging, and formulate the architectural recommendation.
- **Files Created:**
  - `docs/reference/MASTER_PROMPT_PLAYBOOK.md`
  - `docs/reference/TEMPLATE_REVERSE_ENGINEERING_REPORT.md`
  - `docs/reference/AGENCY_DOSSIER.md`
  - `docs/antigravity/PROJECT_AUDIT.md`
  - `docs/antigravity/ASSET_INVENTORY.md`
  - `docs/antigravity/ROUTE_MIGRATION.md`
  - `docs/antigravity/PHASE_LOG.md`
  - `docs/antigravity/DESIGN_BRIEF.md`
  - `docs/antigravity/CONTENT_SOURCE.md`
  - `docs/antigravity/CONTENT_GAPS.md`
  - `docs/antigravity/RECOMMENDATION.md`
  - `.env.example`
  - `PROJECT_PROGRESS.md`
- **Files Modified:** None (repository was empty).
- **Components Created:** None (Phase 0 alters NO application code).
- **Pages Completed:** None (Documentation only).
- **Animations Implemented:** None.
- **Dependencies Installed:** None (Scaffolding planned for Phase 1 upon approval).
- **Tests Performed:**
  - Workspace directory scan (`Get-ChildItem -Force`).
  - Git repository inspection (`git status`).
  - System runtime inspection (`node -v` -> `v24.18.0`, `npm -v` -> `11.16.0`, `git --version` -> `2.56.0.windows.2`).
- **Build Results:** N/A (Repository is currently empty; clean baseline recorded).
- **Errors or Unresolved Issues:** None.
- **Known Limitations:**
  - The repository was completely empty; no legacy code or assets existed locally.
  - Logo file `cdm-logo-transparent.png` is not locally available; provisional deep forest green token `#2F5A44` is adopted for Phase 1.

## Phase 2 Record: Global Navigation and Shared Components

- **Status:** COMPLETE
- **Date:** 8 November 2026
- **Objective:** Build the floating capsule navigation, services dropdown, mobile menu sheet, footer foundation, and the reusable primitives (`DisplayMarquee`, `Accordion`, `MediaSlot`, `SectionHeader`, `Reveal`) for subsequent phases.
- **Files Created:**
  - `src/lib/motion.ts`
  - `src/components/brand/Logo.tsx`
  - `src/components/navigation/NavLink.tsx`
  - `src/components/navigation/ServicesMenu.tsx`
  - `src/components/navigation/MobileMenu.tsx`
  - `src/components/navigation/FloatingNav.tsx`
  - `src/components/layout/SiteHeader.tsx`
  - `src/components/layout/SiteFooter.tsx`
  - `src/components/layout/PageShell.tsx`
  - `src/components/ui/DisplayMarquee.tsx`
  - `src/components/ui/Accordion.tsx`
  - `src/components/ui/MediaSlot.tsx`
  - `src/components/ui/SectionHeader.tsx`
  - `src/components/ui/Reveal.tsx`
- **Files Modified:**
  - `package.json` & `package-lock.json` (`framer-motion` installed)
  - `src/styles/globals.css` (marquee animation keyframes and reduced-motion rules added)
  - `src/app/layout.tsx` (wrapped with `SiteHeader` and `SiteFooter`)
  - `src/app/(dev)/design-system/page.tsx` (extended with Phase 2 primitives)
  - `docs/antigravity/PHASE_LOG.md`
  - `PROJECT_PROGRESS.md`
- **Components Created:**
  - `FloatingNav`, `NavLink`, `ServicesMenu`, `MobileMenu`, `Logo`, `SiteHeader`, `SiteFooter`, `PageShell`, `DisplayMarquee`, `Accordion`, `AccordionItem`, `MediaSlot`, `SectionHeader`, `Reveal`.
- **Pages Completed:**
  - Global shared layout across all routes via `app/layout.tsx`.
  - Updated dev-only `/design-system` page displaying nav, marquee, accordions, and media slots.
- **Animations Implemented:**
  - Floating nav entrance (opacity 0, y -16px to 1, 0 in 450ms; CTA follows in 80ms).
  - Services dropdown (opacity, y 8px, scale 0.98 to 1, 0, 1 in 220ms ease-out; links stagger 20ms).
  - Active nav link layout pill slide (`motion.span` layoutId spring animation).
  - Mobile full-screen drawer (translateY -8% to 0% in 380ms ease-in-out; links stagger 40ms).
  - Accordion item expansion (height and opacity in 300ms ease-in-out; plus icon 45-degree rotation).
  - Continuous CSS keyframe marquee (32s per cycle, pauses on hover, static on reduced motion).
- **Dependencies Installed:**
  - `framer-motion@^11.11.17` (component state and enter animations).
- **Tests Performed:**
  - TypeScript strict type check (`npm run type-check` -> 0 errors).
  - ESLint verification (`npm run lint` -> 0 warnings, 0 errors).
  - Production build (`npm run build` -> exit code 0).
  - Mobile drawer scroll-lock and escape key listener verified.
  - MediaSlot dev vs production behavior verified.
- **Build Results:**
  - Next.js production build succeeded with static site generation for all routes.
- **Errors or Unresolved Issues:** None.
- **Known Limitations:**
  - Case studies (`features.work`) and Insights (`features.insights`) are conditionally hidden from navigation per feature flags.
  - Giant cropped wordmark footer scene is reserved for Phase 4.

---

## Phase 3 Record: Homepage Hero Experience

- **Status:** COMPLETE
- **Date:** 8 November 2026
- **Objective:** Construct the first-fold hero experience: art-directed headline, supporting line, calls to action, original layered Awadhi arch backdrop, floating teaser preview card, trust rail adhering to the Content Status Rule, staggered line-mask entrance sequence, and GSAP ScrollTrigger desktop scrubbed exit.
- **Files Created:**
  - `src/lib/gsap.ts` (safe isomorphic GSAP + ScrollTrigger registration and context hook)
  - `src/components/motion/useReducedMotion.ts` (media query listener)
  - `src/components/motion/LineReveal.tsx` (explicit line mask split with staggered reveal)
  - `src/components/sections/hero/HeroBackdrop.tsx` (SVG pointed arches + gradient + static 6% SVG film-grain)
  - `src/components/sections/hero/HeroMedia.tsx` (optional video/photo slot with 40% contrast overlay)
  - `src/components/sections/hero/HeroPreviewCard.tsx` (glassy dark teaser card linking to `/services`)
  - `src/components/sections/hero/TrustRail.tsx` (verified location statement and conditional logo rail)
  - `src/components/sections/hero/Hero.tsx` (full composed hero container)
  - `src/components/sections/AnnouncementTicker.tsx` (null fallback component)
- **Files Modified:**
  - `package.json` & `package-lock.json` (`gsap` installed)
  - `src/app/page.tsx` (composed `<Hero />` with verified metadata and Phase 4 slot)
  - `docs/antigravity/PHASE_LOG.md`
  - `PROJECT_PROGRESS.md`
- **Components Created:**
  - `Hero`, `HeroBackdrop`, `HeroMedia`, `HeroPreviewCard`, `TrustRail`, `LineReveal`, `AnnouncementTicker`.
- **Pages Completed:**
  - `/` (Homepage first fold complete with hero experience).
- **Animations Implemented:**
  - Staggered entrance sequence (Framer Motion):
    - 0ms: Frame background fade (600ms).
    - 150ms: Two-line mask reveal with `LineReveal` (`translateY(115%)` to `0`, 800ms, stagger 90ms, cubic-bezier(0.22, 1, 0.36, 1)).
    - 550ms: Eyebrow label and supporting sentence (y: 16px to 0, 600ms ease-out).
    - 750ms: CTAs row entrance (600ms ease-out).
    - 900ms: Floating preview card entrance (scale 0.96 to 1, y: 12px to 0, 700ms).
    - 1100ms: Trust rail fade in (600ms).
  - Hover micro-interactions:
    - Primary SplitArrowButton translates inset arrow tile.
    - Floating preview card lifts 4px, border shifts to accent, arrow icon rotates 45 degrees.
    - Secondary WhatsApp text link animates underline.
  - Scroll exit choreography (GSAP ScrollTrigger, min-width 768px):
    - Copy block scrubs `yPercent: -8`, opacity `1 -> 0.4`.
    - Layered arch silhouettes scrub at parallax depth: back layer `-4%`, mid layer `-9%`, front layer `-14%`.
    - Subtle backdrop scale `1 -> 1.06`.
  - Reduced-motion compliance:
    - All entrance translations disabled; instantaneous final visible states rendered.
    - Scroll exit scrub disabled; background and text remain static.
- **Dependencies Installed:**
  - `gsap@^3.12.5` (scroll scrubbing and parallax choreography).
- **Tests Performed:**
  - TypeScript strict type check (`npm run type-check` -> 0 errors).
  - ESLint verification (`npm run lint` -> 0 warnings, 0 errors).
  - Production build (`npm run build` -> exit code 0).
  - Verified no unverified claims (374+, 643+, 22+, 30+, 5.0/86) appear in rendered hero.
  - Contrast check: white headline and text against layered backdrop exceed 4.5:1 WCAG AA.
  - Mobile checks: svh viewport units prevent mobile browser URL bar jumps; preview card hides below 768px; CTAs adapt cleanly.
- **Build Results:**
  - Next.js production build succeeded with static site generation for all routes.
- **Errors or Unresolved Issues:** None.
- **Known Limitations:**
  - Homepage sections below the hero are scheduled for Phase 4.
  - Client logo rail displays verified location fallback ("Based in Lucknow, Uttar Pradesh") until client confirms partner permissions.

---

## Phase 4 Record: Homepage Sections

- **Status:** COMPLETE
- **Date:** 8 November 2026
- **Objective:** Construct the complete downstream narrative of the homepage beneath the hero: ProofGrid (unequal metric cards + Counter component), CapabilityAccordion (Grow, Build, Run modular panel accordion), VisionSplit (conditional feature), FeatureStrip (4 verified differentiators, zero dev jargon), StatementPanel (concentric arches with GSAP ScrollTrigger scrub scale), ProcessAccordion (4 stages with original ProcessArt highlighting), TeamRail (quote card + portrait cards on colored fields), TestimonialCarousel (DisplayMarquee "Experiences" + 6 verbatim reviews + circular navigation), FinalCta ("Tell us what you want to grow" with call & WhatsApp CTAs), and FooterScene (oversized cropped "CODESYNC" wordmark).
- **Files Created:**
  - `src/components/motion/Counter.tsx` (requestAnimationFrame ease-out counter with tabular-nums and SSR fallback)
  - `src/components/illustrations/GrowArt.tsx` (original SVG geometric growth illustration)
  - `src/components/illustrations/BuildArt.tsx` (original SVG systems architecture illustration)
  - `src/components/illustrations/RunArt.tsx` (original SVG operations flywheel illustration)
  - `src/components/illustrations/ProcessArt.tsx` (original SVG process step radar diagram)
  - `src/components/illustrations/StatementArt.tsx` (original SVG concentric pointed arches illustration)
  - `src/components/sections/home/ProofGrid.tsx` & `MetricCard.tsx` (4 unequal metric cards: ad timing, Lucknow presence, SEO timeframe, verified quote)
  - `src/components/sections/home/CapabilityAccordion.tsx` (Grow / Build / Run panels, vertical tabs on desktop, vertical accordion on mobile)
  - `src/components/sections/home/VisionSplit.tsx` (guarded by `features.vision`)
  - `src/components/sections/home/FeatureStrip.tsx` (4 verified service pillars)
  - `src/components/sections/home/StatementPanel.tsx` (editorial brand statement with GSAP ScrollTrigger scrub)
  - `src/components/sections/home/ProcessAccordion.tsx` (4-step Discover/Plan/Build/Launch with interactive active state)
  - `src/components/sections/home/TeamRail.tsx` & `TeamCard.tsx` (editorial team introduction with colored field backdrops)
  - `src/components/sections/home/TestimonialCarousel.tsx` & `TestimonialCard.tsx` (6 verbatim Google reviews with scroll buttons)
  - `src/components/sections/home/FinalCta.tsx` (high-contrast bottom CTA with direct phone & WhatsApp links)
  - `src/components/layout/FooterScene.tsx` (giant cropped "CODESYNC" wordmark scene)
- **Files Modified:**
  - `src/data/proof.ts` (populated with strictly verified proof points)
  - `src/data/testimonials.ts` (populated with 6 verbatim client reviews)
  - `src/data/team.ts` (populated with leadership profiles)
  - `src/components/layout/SiteFooter.tsx` (integrated `FooterScene` into the footer)
  - `src/app/page.tsx` (composed all Phase 4 sections into homepage layout)
  - `docs/antigravity/PHASE_LOG.md`
  - `PROJECT_PROGRESS.md`
- **Components Created:**
  - `Counter`, `GrowArt`, `BuildArt`, `RunArt`, `ProcessArt`, `StatementArt`, `ProofGrid`, `MetricCard`, `CapabilityAccordion`, `VisionSplit`, `FeatureStrip`, `StatementPanel`, `ProcessAccordion`, `TeamRail`, `TeamCard`, `TestimonialCarousel`, `TestimonialCard`, `FinalCta`, `FooterScene`.
- **Pages Completed:**
  - `/` (Complete homepage experience).
- **Animations Implemented:**
  - `Counter`: Smooth ease-out number count-up on scroll entry via IntersectionObserver.
  - `CapabilityAccordion`: Tab and panel transitions with spring physics (`framer-motion`), cross-fading SVG art and bullet points.
  - `StatementPanel`: GSAP ScrollTrigger scrub scaling concentric arch rings (`scale: 0.94 -> 1.06`, opacity: `0.7 -> 1`).
  - `ProcessAccordion`: Interactive 4-stage active step selection with step-specific visual highlights.
  - `TestimonialCarousel`: Horizontal snap scrolling with smooth programmatically controlled scroll buttons.
  - `TeamRail`: Colored field hover-zoom and card elevation.
  - `FinalCta`: Inset arrow button hover and WhatsApp link animations.
  - Full prefers-reduced-motion fallbacks for all motion components.
- **Dependencies Installed:**
  - None (utilized existing `framer-motion` and `gsap`).
- **Tests Performed:**
  - TypeScript strict type check (`npm run type-check` -> 0 errors).
  - ESLint verification (`npm run lint` -> 0 warnings, 0 errors).
  - Production build (`npm run build` -> exit code 0, 5/5 static pages generated).
  - Content audit: Zero prohibited terms (`php`, `hostinger`, `static placeholder`, `super admin`).
  - Responsive audit: 360px to 1440px layout integrity verified.
- **Build Results:**
  - Next.js production build succeeded with static site generation for all routes (`/`, `/_not-found`, `/design-system`).
- **Errors or Unresolved Issues:** None.
- **Known Limitations:**
  - Case studies section (`features.work`) and pricing/FAQ section (`features.pricing`) remain gated or reserved for dedicated upcoming phases (Phases 6 and 8).

---

## Phase 5 Record: Services Pages

- **Status:** COMPLETE
- **Date:** 9 November 2026
- **Objective:** Build the services overview and individual service pages from a single typed data source and unified template. Present all 14 core services with real, verified information, honest pricing handling (quote-first model with numbers held pending client verification), and clear conversion pathways. Support /services and 14 static pages under /services/[slug], plus /industries returning 404 while features.industries remains false.
- **Files Created:**
  - `src/components/sections/services/ServiceRow.tsx` (row component with number, name, one-liner, hover shift, 56px minimum tap target)
  - `src/components/sections/services/PillarRail.tsx` (sticky left rail on desktop with IntersectionObserver scroll-spy and aria-current, horizontal chip bar on mobile)
  - `src/components/sections/services/PillarChapter.tsx` (alternating light/dark chapter blocks with large numerals, display pillar titles, and SVG illustration accents)
  - `src/components/sections/services/ServicesIndex.tsx` (overview layout with editorial statement, sticky rail, 3 chapters, and FinalCta)
  - `src/components/sections/services/ServiceHero.tsx` (pillar eyebrow, h1, 2-line summary, 3 label facts, staggered entrance, CTAs, and pillar vector artwork)
  - `src/components/sections/services/AudienceBlock.tsx` (2-4 verified target segments per service)
  - `src/components/sections/services/WhatYouGet.tsx` (4-column responsive feature strip from verified inclusions and deliverables)
  - `src/components/sections/services/HowItWorks.tsx` (4-step ProcessAccordion with service-specific one-liners and active diagram)
  - `src/components/sections/services/PricingBlock.tsx` (quote-first card: "Pricing depends on your goals and scope. Tell us what you need and we will send a clear quote.")
  - `src/components/sections/services/ServiceTestimonial.tsx` (verbatim single quote proof card or cleanly omitted)
  - `src/components/sections/services/ServiceFaq.tsx` (dark rounded AccordionItem list populated with verified questions)
  - `src/components/sections/services/RelatedServices.tsx` (3 cards linking to complementary services)
  - `src/app/services/page.tsx` (static services overview route)
  - `src/app/services/[slug]/page.tsx` (SSG dynamic route with generateStaticParams and dynamic metadata)
  - `src/app/industries/page.tsx` (conditional route returning notFound() when features.industries is false)
- **Files Modified:**
  - `src/data/faqs.ts` (populated with 10 verified FAQs from client data)
  - `src/data/services.ts` (populated with all 14 core services across GROW, BUILD, and RUN)
  - `src/lib/content.ts` (added getAllServices, getServiceBySlug, getServicesByPillar, getRelatedServices, getFaqsByIds)
  - `docs/antigravity/PHASE_LOG.md`
  - `PROJECT_PROGRESS.md`
- **Components Created:**
  - `ServiceRow`, `PillarRail`, `PillarChapter`, `ServicesIndex`, `ServiceHero`, `AudienceBlock`, `WhatYouGet`, `HowItWorks`, `PricingBlock`, `ServiceTestimonial`, `ServiceFaq`, `RelatedServices`.
- **Pages Completed:**
  - `/services`
  - 14 static pages under `/services/[slug]`:
    - `/services/local-seo-google-business-profile`
    - `/services/seo`
    - `/services/google-ads-ppc`
    - `/services/meta-ads-lead-generation`
    - `/services/social-content-email-sms`
    - `/services/business-websites`
    - `/services/ecommerce-websites`
    - `/services/mobile-apps`
    - `/services/ui-ux-graphic-design`
    - `/services/domain-hosting-maintenance`
    - `/services/crm`
    - `/services/erp-billing-gst`
    - `/services/hrms-payroll`
    - `/services/custom-software`
  - `/industries` (returns 404 as feature flag is false)
- **Animations Implemented:**
  - `ServiceRow`: Hover state with 6px arrow translate, number color transition to accent, and row background shift (220ms ease-out).
  - `PillarRail`: Scroll-spy with IntersectionObserver updating active pillar marker and sliding smooth transition.
  - `ServiceHero`: Staggered entrance sequence (eyebrow, title, summary, 3 key facts, CTAs, vector art) with 600ms ease-out.
  - `HowItWorks`: Interactive 4-stage accordion expanding step description and updating active radar diagram.
  - Full prefers-reduced-motion fallbacks for all transitions.
- **Dependencies Installed:** None (used existing libraries).
- **Tests Performed:**
  - TypeScript strict type check (`npm run type-check` -> 0 errors).
  - ESLint verification (`npm run lint` -> 0 warnings, 0 errors).
  - Production build (`npm run build` -> exit code 0, 21/21 static pages generated successfully).
  - Content audit: All 14 services checked against Content Status Rule; no prohibited terms (`hostinger`, `static placeholder`, `super admin`); high-risk app types excluded; candidate prices held pending; quote-first card rendered.
  - Responsive audit: Verified 360px mobile viewports (including longest service name "Domain, Hosting & Maintenance") up to 1440px+ desktop.
- **Build Results:**
  - Next.js production build succeeded with static site generation for all 21 routes.
- **Errors or Unresolved Issues:** None.
- **Known Limitations:**
  - Candidate prices remain pending client sign-off (pricing cards render quote-first messaging).
  - Legacy path `/seo-services-lucknow` recorded as an open link to be mapped in Phase 12 301 redirects.

---

## Phase 6 Record: Portfolio and Case Studies

- **Status:** COMPLETE
- **Date:** 9 November 2026
- **Objective:** Construct the complete portfolio and case studies system: homepage SelectedWork showcase, /work listing with responsive URL-driven category filtering, and /work/[slug] case-study template. Since the agency currently has zero confirmed publishable case studies, build the full architecture, support development fixtures for testing, and ship with features.work set to false (returning 404 in production until client authorization).
- **Files Created:**
  - `src/data/__dev__/projects.fixtures.ts` (4 development-only sample fixtures with "SAMPLE, DEV ONLY" watermarks)
  - `src/components/sections/work/MetricGrid.tsx` (2x2 KPI grid for verified metrics with fallback to scope deliverables)
  - `src/components/sections/work/CaseStudyCard.tsx` (16:10 card with client name and category pills, hover zoom/contrast, and animated arrow)
  - `src/components/sections/work/WorkFilters.tsx` (accessible category filter bar with polite aria-live count announcements and URL query sync)
  - `src/components/sections/work/WorkGrid.tsx` (responsive 3/2/1 grid with first-item feature span and Framer Motion cross-fade)
  - `src/components/sections/work/SelectedWork.tsx` (homepage selected-work section with DisplayMarquee, 3 cards, and CTA)
  - `src/components/sections/work/CaseHero.tsx` (dark hero with label row, 2-3 line title, summary, CTA, and 4:3 framed visual)
  - `src/components/sections/work/CaseMeta.tsx` (5-column metadata strip with client, industry, services, timeline, and team)
  - `src/components/sections/work/ProjectMockup.tsx` (1200px browser chrome frame with address bar and desktop GSAP scroll scrub)
  - `src/components/sections/work/CaseResults.tsx` (light section with value statement and up to 4 icon-led verified outcome cards)
  - `src/components/sections/work/NextProject.tsx` (large next project link with 12px hover translation and arrow reveal)
  - `src/app/work/page.tsx` (portfolio archive page with category filtering, guarded by features.work)
  - `src/app/work/[slug]/page.tsx` (dynamic case study template with SSG params and metadata, guarded by features.work)
- **Files Modified:**
  - `src/data/types.ts` (extended ProjectItem media with optional width and height)
  - `src/lib/content.ts` (added getRenderableProjects and getProjectBySlug with strict production gating)
  - `src/app/page.tsx` (integrated SelectedWork slot into the homepage)
  - `docs/antigravity/PHASE_LOG.md`
  - `PROJECT_PROGRESS.md`
- **Components Created:**
  - `MetricGrid`, `CaseStudyCard`, `WorkFilters`, `WorkGrid`, `SelectedWork`, `CaseHero`, `CaseMeta`, `ProjectMockup`, `CaseResults`, `NextProject`.
- **Pages Completed:**
  - `/work` (gated behind `features.work: false`)
  - `/work/[slug]` (gated behind `features.work: false`)
- **Animations Implemented:**
  - `CaseStudyCard`: Pointer hover scales image 1.0 to 1.03 with contrast boost (450ms ease-out), title underline expansion, and overlay arrow 45° rotation (220ms).
  - `WorkGrid`: Filter transitions with `framer-motion` `AnimatePresence` (opacity fade and y: 16px to 0 stagger).
  - `ProjectMockup`: Desktop GSAP ScrollTrigger subtle scrub (`yPercent: -3` to `3`) inside the browser window frame.
  - `NextProject`: Link text shifts 12px right on hover with animated arrow.
  - Full prefers-reduced-motion fallbacks for all motion components.
- **Dependencies Installed:** None (used existing GSAP and Framer Motion).
- **Tests Performed:**
  - TypeScript strict type check (`npm run type-check` -> 0 errors).
  - ESLint verification (`npm run lint` -> 0 warnings, 0 errors).
  - Production build (`npm run build` -> exit code 0, 22/22 static pages generated).
  - Production fixture exclusion audit: Scanned `.next/` build output for "SAMPLE, DEV ONLY" — 0 occurrences found.
  - Prohibited text scan: 0 occurrences of prohibited terms.
  - Verified `/work` and `/work/[slug]` return 404 when `features.work: false`.
- **Build Results:**
  - Next.js production build succeeded with static site generation for all 22 routes.
- **Errors or Unresolved Issues:** None.
- **Known Limitations:**
  - Case studies remain hidden in production behind `features.work: false` until client provides real approved project data and permissions.
  - When dev fixtures are enabled via `NEXT_PUBLIC_SHOW_DEV_FIXTURES="true"` in local development, 4 sample projects render across the homepage, archive, and detail pages.

### How to Add Real Projects and Enable the Feature:
1. **Add Real Projects:**
   - In `src/data/projects.ts`, append new `ProjectItem` objects to `projectsData`.
   - Ensure the following mandatory fields are populated:
     - `id`: Unique identifier (e.g., `"proj-client-name"`)
     - `slug`: URL slug (e.g., `"client-name-seo"`)
     - `status`: `"verified"` or `"draft"` (never `"pending"`)
     - `approved`: `true` (confirms client sign-off)
     - `client.name`: Client business name
     - `client.permissionToName`: `true` (explicit authorization)
     - `industry`: Industry sector string
     - `category`: Array matching filters (`["SEO"]`, `["Paid Media"]`, `["Websites"]`, `["Software"]`, `["Local Services"]`)
     - `services`: Array of valid service slugs from `servicesData`
     - `summary`: High-level headline outcome
     - `challenge`: Problem narrative
     - `approach`: Array of 3–4 action steps
     - `deliverables`: Array of deliverable strings
     - `technologies`: Client-stated frameworks and platforms
     - `metrics`: Array of verified outcomes (`{ label, value, period, source, verified: true }`) or empty `[]`
     - `media`: Array of screenshots with `permission: true`, `src`, `alt`, `width: 1200`, `height: 750`
     - `relatedSlugs`: Array of related project slugs
2. **Turn On the Feature:**
   - In `src/data/features.ts`, set `work: true`.
   - Once at least three approved projects exist, this automatically enables the `/work` listing route, all `/work/[slug]` pages, the homepage `<SelectedWork />` showcase, and the navigation/footer "Works" links.

---

## Phase 7 Record: About, Team and Trust Sections

- **Status:** COMPLETE
- **Date:** 9 November 2026
- **Objective:** Construct the /about page (Company in global navigation and footer), leadership presentation, verified trust elements, and careers section. Because the agency founding narrative and founder statement remain pending client confirmation, the page renders strictly verified facts and draft copy with zero generic filler or unconfirmed credentials.
- **Files Created:**
  - `src/components/sections/about/AboutHero.tsx` (intro hero with eyebrow, draft h1, and verified fact sentence regarding digital marketing + in-house software development)
  - `src/components/sections/about/PillarsBand.tsx` (compact 3-pillar band linking to Grow, Build, and Run capability anchors)
  - `src/components/sections/about/LeadershipCard.tsx` (4:5 portrait cards over --field-1/2/3 with name, role, and hover bio)
  - `src/components/sections/about/TextLeadershipRow.tsx` (clean text-only leadership row avoiding anonymous cartoon avatars)
  - `src/components/sections/about/LeadershipGrid.tsx` (composed leadership section featuring department heads)
  - `src/components/sections/about/TrustStrip.tsx` (client logos and verified credentials strip, returning null cleanly when items are unverified)
  - `src/components/sections/about/CareersBand.tsx` (careers section with anchor #careers, open roles list when active, and mailto application CTA)
  - `src/components/sections/about/CompanyDetails.tsx` (small 3-column verified entity information: legal name, commercial brand, and Lucknow regional base)
  - `src/app/about/page.tsx` (complete /about page assembling the narrative)
  - `src/data/careers.ts` (typed careers data file)
- **Files Modified:**
  - `src/data/types.ts` (added TeamStory and CareerItem interfaces)
  - `src/data/team.ts` (added teamStory export, flagged corrected typo for Chief Growth Officer, and annotated pending surname for Mr. Vikas)
  - `docs/antigravity/PHASE_LOG.md`
  - `PROJECT_PROGRESS.md`
- **Components Created:**
  - `AboutHero`, `PillarsBand`, `LeadershipCard`, `TextLeadershipRow`, `LeadershipGrid`, `TrustStrip`, `CareersBand`, `CompanyDetails`.
- **Pages Completed:**
  - `/about`
- **Animations Implemented:**
  - `AboutHero`: Staggered entrance reveal for eyebrow, heading, summary, and action links.
  - `LeadershipCard`: Image scale (1 to 1.03) inside mask over 450ms ease-out on hover; bio reveal on pointer hover or focus.
  - `CareersBand`: SplitArrowButton hover and interactive mailto action.
  - Full prefers-reduced-motion fallbacks for all components.
- **Dependencies Installed:** None (used existing libraries).
- **Tests Performed:**
  - TypeScript strict type check (`npm run type-check` -> 0 errors).
  - ESLint verification (`npm run lint` -> 0 warnings, 0 errors).
  - Production build (`npm run build` -> exit code 0, 23/23 static pages generated).
  - Content audit: Zero unverified certifications (ISO, Startup India, MSME, GeM) or ratings rendered; leadership matches verified facts; unverified founder story cleanly omitted.
  - Prohibited text scan: 0 occurrences of prohibited terms.
- **Build Results:**
  - Next.js production build succeeded with static site generation for all 23 routes.
- **Errors or Unresolved Issues:** None.
- **Known Limitations:**
  - Founder story and vision remain hidden behind `features.vision: false` until client provides authentic statements.
  - Legacy `/career` path noted under Known Open Links for 301 redirection to `/about#careers` in Phase 12.

---

## Phase 8 Record: Pricing, FAQ and Contact Experience

- **Status:** COMPLETE
- **Date:** 9 November 2026
- **Objective:** Construct the complete pricing architecture, split-layout FAQ system, dedicated contact experience, accessible "Book a free call" modal dialog, and secure, production-grade inquiry pipeline. Gated all candidate prices to quote-first display until client signs off on canonical numbers, while supporting development preview flags. Forms validate on client and server with zero fake success states.
- **Files Created:**
  - `docs/antigravity/PRICING_DECISIONS.md` (documented all conflicting legacy prices from cdmlko.com across websites, apps, marketing, and add-ons)
  - `src/lib/inquiry/schema.ts` (lightweight pure TypeScript schema validator for Indian phones, string sanitization, honeypot, and 2.5s timing check)
  - `src/lib/inquiry/send.ts` (delivery pipeline with Resend email and Webhook adapters, rate-limiter, and 503 fallback handling)
  - `src/app/api/inquiry/route.ts` (secure Next.js API route with body size limits, rate limiting, validation, and error reporting)
  - `src/components/forms/Field.tsx` (accessible form field with aria-describedby and error messaging)
  - `src/components/forms/InquiryForm.tsx` (full contact page inquiry form with loading state, personalized success confirmation, and honest error fallback)
  - `src/components/forms/BookCallDialog.tsx` (accessible modal dialog and mobile bottom sheet for 15-minute quick consultation, focus trap, and Esc dismiss)
  - `src/components/forms/BookCallTrigger.tsx` (client trigger wrapper that opens the modal on non-contact pages and scrolls to #book-a-call on /contact)
  - `src/components/sections/pricing/PricingCard.tsx` (card component supporting quote-first display, recommended plan highlight, and dev candidate view)
  - `src/components/sections/pricing/PricingToggle.tsx` (3-way segmented pill for Grow, Build, and Run with sliding indicator and keyboard navigation)
  - `src/components/sections/pricing/PricingComparison.tsx` (standard engagement guarantees and deliverables)
  - `src/components/sections/pricing/PricingPreview.tsx` (homepage 3-pillar pricing preview linking to /pricing)
  - `src/components/sections/pricing/PricingView.tsx` (composed interactive pricing view with smooth cross-fade)
  - `src/components/sections/faq/FaqSection.tsx` (reusable split-layout FAQ with dark rounded accordion)
  - `src/app/pricing/page.tsx` (full /pricing route with searchParams support)
  - `src/app/contact/page.tsx` (full /contact route with direct verified communication channels and inquiry form)
- **Files Modified:**
  - `src/data/types.ts` (added whoItSuits and note to PricingPlan)
  - `src/data/pricing.ts` (populated with 9 comprehensive plans across Grow, Build, and Run)
  - `src/components/ui/SplitArrowButton.tsx` (added onClick event handler support for Link and button)
  - `src/components/navigation/FloatingNav.tsx` (integrated BookCallTrigger for primary nav CTA)
  - `src/app/page.tsx` (inserted PricingPreview and FaqSection into homepage slots)
  - `docs/antigravity/PHASE_LOG.md`
  - `PROJECT_PROGRESS.md`
- **Components Created:**
  - `Field`, `InquiryForm`, `BookCallDialog`, `BookCallTrigger`, `PricingCard`, `PricingToggle`, `PricingComparison`, `PricingPreview`, `PricingView`, `FaqSection`.
- **Pages Completed:**
  - `/pricing`
  - `/contact`
  - `/api/inquiry`
- **Animations Implemented:**
  - `PricingToggle`: Sliding indicator pill with spring transition (320ms ease-out) and keyboard arrow navigation.
  - `PricingView`: Tab cross-fade with Framer Motion AnimatePresence (outgoing 150ms, incoming 350ms with y: 16px).
  - `BookCallDialog`: Modal entrance (opacity 0->1, scale 0.97->1, 250ms) with backdrop fade (200ms) and focus trap.
  - `InquiryForm`: Field focus accent ring transition, submit loading spinner, and success state reveal.
  - Full prefers-reduced-motion fallbacks for all motion components.
- **Dependencies Installed:** None (used pure TypeScript validator and standard Fetch API).
- **Tests Performed:**
  - TypeScript strict type check (`npm run type-check` -> 0 errors).
  - ESLint verification (`npm run lint` -> 0 warnings, 0 errors).
  - Production build (`npm run build` -> exit code 0, 26 routes generated).
  - Content audit: Zero fake prices shown in production; quote-first pricing displayed; conflicting prices documented in `PRICING_DECISIONS.md`.
  - Security audit: Honeypot trap, 2.5s minimum fill time check, IP rate limiter (5 req / 10 min), and 10KB body limit verified.
  - Prohibited text scan: 0 occurrences of prohibited terms.
- **Build Results:**
  - Next.js production build succeeded with static site generation and server route compilation for all 26 routes.
- **Errors or Unresolved Issues:** None.
- **Known Limitations:**
  - Inquiry delivery defaults to HTTP 503 with honest WhatsApp / phone direct fallback until client configures `INQUIRY_PROVIDER` (`resend` or `webhook`).
  - No online checkout / recurring payment consents (out of scope per prompt).

---

## Decisions Made

1. **Adoption of Editorial Grotesk & Awadhi Arch Motif**: Approved the visual direction balancing Spartan AI's high-contrast editorial hierarchy with a localized, Lucknow-inspired pointed-arch motif (`ArchMotif.tsx`) in place of generic starbursts.
2. **Strict Content Gating**: All unverified figures (374+, 643+, 22+, 30+), unverified certifications (ISO, Startup India, MSME, GeM), and 5.0/86 ratings are barred from production until client confirmation.
3. **Quote-First Pricing**: Contradictory published prices are held back behind `candidatePrice` dev fixtures; public pricing defaults to quote-based estimation.
4. **Scaffolding Strategy**: Selected Strategy (c) to initialize a clean Next.js App Router codebase.

---

## Decisions Pending User Input

1. **Hosting Target**: Confirm Option 1 (Node.js runtime / Vercel / VPS) vs Option 2 (Static export + external webhook).
2. **Official Logo & Brand Colors**: Supply vector/high-res `cdm-logo-transparent.png` to confirm primary accent hex code.
3. **Case Study & Work Permission**: Confirm whether any real client work is approved for launch; otherwise keep `features.work = false`.

---

## Known Open Links

- `/seo-services-lucknow`: Legacy SEO page path from old site (`cdmlko.com`); to be mapped via 301 redirect to `/services/seo` during Phase 12 SEO pass.
- `/career`: Legacy career page path from old site (`cdmlko.com`); to be mapped via 301 redirect to `/about#careers` during Phase 12.
- `/contact`: COMPLETE & VERIFIED.
- `/pricing`: COMPLETE & VERIFIED.

---

## Design Tokens Summary

### Color Tokens
- `--canvas`: `#F5F5F3` (Light section canvas background)
- `--ink`: `#121212` (Headings, primary typography on light)
- `--surface-dark`: `#111213` (Dark chapters)
- `--surface-dark-2`: `#1A1B1C` (Cards on dark)
- `--surface-muted`: `#EBEBE9` (Muted cards, tiles)
- `--hairline`: `#DCDCD9` (1px hairlines and borders)
- `--text-secondary`: `#5F5F5F` (Secondary text on light — WCAG AA 5.8:1)
- `--text-secondary-on-dark`: `#A3A3A0` (Secondary text on dark — WCAG AAA 7.1:1)
- `--on-dark`: `#FFFFFF` (Text on dark surfaces)
- `--accent`: `#2F5A44` (Deep forest green brand accent — WCAG AA 6.9:1)
- `--accent-soft`: `#49735A` (Secondary accent)
- `--field-1`: `#C9D8CF` (Team card color field 1)
- `--field-2`: `#E6DCCB` (Team card color field 2)
- `--field-3`: `#E3CFC8` (Team card color field 3)

### Radii Tokens
- `--radius-sm`: `12px`
- `--radius-md`: `20px`
- `--radius-lg`: `28px`
- `--radius-pill`: `9999px`

### Layout & Spacing Tokens
- Base scale: `4px`
- `--gutter`: `clamp(8px, 1.2vw, 16px)`
- `--section-padding`: `clamp(88px, 12vw, 176px)`
- `--container-padding`: `clamp(20px, 4vw, 64px)`
- Container max width: `1440px`
- Grid gap: `16px` mobile, `24px` desktop

### Motion Tokens
- `--ease-out`: `cubic-bezier(0.22, 1, 0.36, 1)`
- `--ease-in-out`: `cubic-bezier(0.65, 0, 0.35, 1)`
- `--dur-fast`: `180ms`
- `--dur-base`: `320ms`
- `--dur-slow`: `450ms`
- `--dur-reveal`: `700ms`

---

## Phase 1 Record: Design System and Global Foundation

- **Status:** COMPLETE
- **Date:** 8 November 2026
- **Objective:** Establish the design tokens, typography, CSS variables, Tailwind configuration, layout and typography primitives, typed data layer, content status gating, and the dev-only design system verification route.
- **Files Created:**
  - `package.json`
  - `tsconfig.json`
  - `postcss.config.js`
  - `tailwind.config.ts`
  - `.eslintrc.json`
  - `.gitignore`
  - `src/styles/globals.css`
  - `src/lib/cn.ts`
  - `src/lib/content.ts`
  - `src/data/types.ts`
  - `src/data/site.ts`
  - `src/data/navigation.ts`
  - `src/data/services.ts`
  - `src/data/projects.ts`
  - `src/data/testimonials.ts`
  - `src/data/team.ts`
  - `src/data/pricing.ts`
  - `src/data/faqs.ts`
  - `src/data/articles.ts`
  - `src/data/credentials.ts`
  - `src/data/clients.ts`
  - `src/data/proof.ts`
  - `src/data/features.ts`
  - `src/data/__dev__/fixtures.ts`
  - `src/components/ui/ArchMotif.tsx`
  - `src/components/ui/CategoryPill.tsx`
  - `src/components/ui/SplitArrowButton.tsx`
  - `src/components/ui/TextLink.tsx`
  - `src/components/ui/VisuallyHidden.tsx`
  - `src/components/ui/SkipLink.tsx`
  - `src/components/ui/Typography.tsx`
  - `src/components/layout/Container.tsx`
  - `src/components/layout/Section.tsx`
  - `src/app/layout.tsx`
  - `src/app/page.tsx`
  - `src/app/(dev)/design-system/page.tsx`
- **Files Modified:**
  - `docs/antigravity/PHASE_LOG.md`
  - `PROJECT_PROGRESS.md`
- **Components Created:**
  - `ArchMotif`, `CategoryPill`, `SplitArrowButton`, `TextLink`, `VisuallyHidden`, `SkipLink`, `Display`, `Heading`, `Text`, `Eyebrow`, `Container`, `Section`.
- **Pages Completed:**
  - `/design-system` (Dev-only design tokens and primitives verification page; 404 in production).
  - `/` (Minimal dev root linking to `/design-system`).
- **Animations Implemented:**
  - Pure CSS transitions for `SplitArrowButton` (arrow translate 2px, tile color shift, active scale 0.98, full reduced-motion override).
  - Pure CSS hover transitions for `TextLink` (underline thickness and opacity).
  - Smooth color transitions for `Section` surface tones.
- **Dependencies Installed:**
  - `lucide-react` (icons)
  - `next`, `react`, `react-dom` (core framework)
  - `tailwindcss`, `postcss`, `autoprefixer` (styling)
  - `typescript`, `@types/*` (type safety)
  - `eslint`, `eslint-config-next` (linting)
- **Tests Performed:**
  - TypeScript strict type check (`npm run type-check` -> 0 errors).
  - ESLint verification (`npm run lint` -> 0 warnings, 0 errors).
  - Production build (`npm run build` -> exit code 0, all routes static).
  - Bundle audit for dev fixtures: zero occurrences of "SAMPLE, DEV ONLY" in client bundle.
  - WCAG AA contrast check on all color tokens (all text pairs exceed 4.5:1).
- **Build Results:**
  - Production build compiled successfully in Next.js 14.2.35.
- **Errors or Unresolved Issues:** None.
- **Known Limitations:**
  - Marketing pages are not yet built (scheduled for Phases 3-9).
  - GSAP, Lenis, and Framer Motion are intentionally omitted in Phase 1 per playbook guidelines (scheduled for Phase 2, 3, and 10).

---

## Environment Variables
Defined in `.env.example`:
- `NEXT_PUBLIC_SITE_URL`
- `INQUIRY_PROVIDER`
- `RESEND_API_KEY`
- `INQUIRY_TO_EMAIL`
- `INQUIRY_FROM_EMAIL`
- `INQUIRY_WEBHOOK_URL`
- `NEXT_PUBLIC_GA_ID`
- `NEXT_PUBLIC_SHOW_DEV_FIXTURES`
- `NEXT_PUBLIC_SHOW_CANDIDATE_PRICES`


---

## Phase 9 Record: Additional Pages (Insights, Legal, Industries, and 404)

- **Status:** COMPLETE
- **Date:** 10 November 2026
- **Objective:** Build the full Insights editorial system (gated behind `features.insights: false` until 3 real articles are ready), legal pages (/legal/privacy active; /legal/terms and /legal/refund-cancellation awaiting client text), branded 404 page with Awadhi arch entrance, verify /industries continues returning 404, update SiteFooter to show only active legal links, and document all legal inconsistencies found in the legacy privacy policy.

### Files Created:
  - `docs/antigravity/LEGAL_REVIEW.md` (documented 5 inconsistencies: third phone 9125100206, "Awanti Puram" address contradiction, Razorpay references without payment gateway, absence of Terms of Service and Refund Policy, cookie notice requirement if Phase 12 analytics are added)
  - `content/legal/privacy.md` (verbatim 16-section privacy policy, effective 13 September 2026, copied from CONTENT_SOURCE.md without altering legal meaning)
  - `content/legal/terms.md` (placeholder, status: awaiting-client-text — route returns 404)
  - `content/legal/refund-cancellation.md` (placeholder, status: awaiting-client-text — route returns 404)
  - `content/insights/README.md` (editorial publishing guide: schema, renderability rules, word-count gate, feature flag activation steps)
  - `src/data/__dev__/articles.fixtures.ts` (6 development-only SAMPLE articles watermarked "SAMPLE, DEV ONLY" — zero inclusion in production build verified)
  - `src/lib/legal.ts` (content file parser: `getLegalPage()`, `getRenderableLegalPages()` with frontmatter YAML parsing and TOC section extraction)
  - `src/components/legal/TableOfContents.tsx` (IntersectionObserver scroll-spy sticky desktop sidebar + mobile collapsible disclosure with 200ms colour transition on active heading)
  - `src/components/legal/LegalLayout.tsx` (calm two-column layout: 4-col sticky TOC sidebar + 8-col 720px reading column with branded back link, identity tag, and bottom compliance inquiry block)
  - `src/components/sections/insights/InsightCard.tsx` (image-led and text-led (pale/dark) card variants with hover cover scale 1.0→1.03, arrow shift, 450ms/220ms transitions)
  - `src/components/sections/insights/InsightsGrid.tsx` (12-col asymmetric grid with AnimatePresence cross-fade filter: 150ms out / 350ms in y:16px)
  - `src/components/sections/insights/CategoryFilter.tsx` (category pill filter with active indicator, URL-ready state management)
  - `src/components/sections/insights/ArticleHeader.tsx` (back link, category pill, h1, metadata byline: author, date, reading time)
  - `src/components/sections/insights/ArticleBody.tsx` (paragraph parser with h2/h3/blockquote/ordered+unordered list support, 680px column, leading-relaxed)
  - `src/components/sections/insights/RelatedServiceCta.tsx` (contextual service CTA block linking to the matching service page via `relatedServiceSlug`)
  - `src/components/sections/insights/ReadingProgress.tsx` (2px accent progress bar, CSS transform-based, passive scroll listener, hidden under reduced motion)
  - `src/app/legal/privacy/page.tsx` (active 200 route — renders verbatim privacy policy in LegalLayout)
  - `src/app/legal/terms/page.tsx` (returns notFound() while awaiting-client-text)
  - `src/app/legal/refund-cancellation/page.tsx` (returns notFound() while awaiting-client-text)
  - `src/app/not-found.tsx` (custom branded 404: dark green `brand-darkest` frame, display "404" with clamp font size, Awadhi arch motif rising 24px with 600ms ease-out entrance, single sentence, 4 quick links: Services / Pricing / Contact / WhatsApp)
  - `src/app/insights/page.tsx` (returns notFound() when features.insights false and not in dev fixture mode; renders asymmetric grid with DisplayMarquee "INSIGHTS & STRATEGY" header)
  - `src/app/insights/[slug]/page.tsx` (dynamic article detail: ReadingProgress bar, ArticleHeader, ArticleBody, RelatedServiceCta, prev/next navigation, FinalCta)

### Files Modified:
  - `src/data/types.ts` (added `ArticleStatus` type `"published" | "draft" | "pending"`, extended `ArticleItem` with `updated`, `readingTime`, `variant`, `relatedServiceSlug`, added `LegalPageItem` interface)
  - `src/lib/content.ts` (added `getRenderableArticles()`, `getArticleBySlug()`, `productionArticles[]` with 400-word gate and feature-flag gating; imported `devSampleArticles`)
  - `docs/antigravity/PHASE_LOG.md`
  - `PROJECT_PROGRESS.md`

### Components Created:
  - `TableOfContents`, `LegalLayout`, `InsightCard`, `InsightsGrid`, `CategoryFilter`, `ArticleHeader`, `ArticleBody`, `RelatedServiceCta`, `ReadingProgress`.

### Pages Completed:
  - `/legal/privacy` (200 — Active privacy policy)
  - `/legal/terms` (404 — Awaiting client text)
  - `/legal/refund-cancellation` (404 — Awaiting client text)
  - `/insights` (404 — Gated behind features.insights: false)
  - `/insights/[slug]` (404 — Gated behind features.insights: false)
  - `/industries` (404 — Confirmed still correctly gated behind features.industries: false)
  - `/_not-found` → `src/app/not-found.tsx` (Branded 404 with arch motif entrance)

### Animations Implemented:
  - **not-found.tsx:** Arch motif container rises from y:24px to y:0 in 600ms `cubic-bezier(0.16, 1, 0.3, 1)` on mount; instant final state under `prefers-reduced-motion`.
  - **InsightsGrid:** AnimatePresence cross-fade on category filter: outgoing 150ms opacity fade, incoming 350ms with y:16px ease. Disabled under reduced motion.
  - **InsightCard (image-led):** Hover scales inner cover graphic 1.0→1.03 with `transition-transform duration-450 ease-out`.
  - **InsightCard (text-led):** Background lightens/darkens one step on hover in 220ms transition.
  - **InsightCard (arrow):** Arrow icon shifts 0.5px right + 0.5px up on card hover (200ms).
  - **ReadingProgress:** Smooth `transform: scaleX()` driven by passive scroll listener, `transition-transform duration-75`. Not rendered under reduced motion.
  - **TableOfContents:** Active section link receives `border-accent-default` and `text-accent-default` with 200ms colour transition via IntersectionObserver.

### Production Verification Results:
  - `npm run type-check` → 0 errors ✓
  - `npm run lint` → 0 warnings, 0 errors ✓
  - `npm run build` → exit code 0, **30 static/SSG/dynamic routes generated** ✓
  - Scan of `.next/server/app/**/*.js` for "SAMPLE" → **0 occurrences** ✓
  - Scan of `src/`, `content/` for prohibited terms (`hostinger`, `static placeholder`, `super admin`) → **0 occurrences** ✓
  - `/legal/terms` `.meta` → `status: 404` ✓
  - `/legal/refund-cancellation` `.meta` → `status: 404` ✓
  - `/insights` `.meta` → `status: 404` ✓
  - `/industries` `.meta` → `status: 404` ✓
  - `/legal/privacy` `.meta` → `status: 200`, no status override ✓

### Open Decisions Logged:
  - **Login and Signup:** The old `cdmlko.com` website had Login and Signup pages with unknown function (possibly a client portal or admin login for legacy PHP). These routes are **not built** in the new architecture. This is an open decision requiring client confirmation: (a) If a client project portal exists and must remain, the client should specify which platform powers it; (b) if it was a legacy admin panel, it is superseded by the new inquiry workflow and is not required.

### How to Publish a Real Article:
1. Add an `ArticleItem` to `productionArticles` array in `src/lib/content.ts` (or extend to read from `content/insights/*.md` files).
2. Ensure `status: "published"` and `body` word count exceeds 400 words.
3. Set `relatedServiceSlug` to link the bottom CTA to a matching service page.
4. Once at least 3 real articles exist, set `features.insights: true` in `src/data/features.ts`.

### How to Activate Terms of Service / Refund Policy:
1. Supply final legal text approved by counsel to `content/legal/terms.md` or `content/legal/refund-cancellation.md`.
2. Change frontmatter `status: awaiting-client-text` → `status: published` and add `effectiveDate: "YYYY-MM-DD"`.
3. The route immediately becomes active on next production build; the footer link also becomes visible.

### Known Limitations:
  - Insights body rendering is a lightweight inline Markdown parser. When real articles are published, the team may wish to adopt `@next/mdx` or `gray-matter` for richer formatting (Phase 13 refinement opportunity).
  - Legal TOC section IDs are derived from heading numbers ("section-1", "section-2", etc.). If the client's new legal text does not use numbered section headings, the TOC generator may need a slug-based fallback (note for Phase 13).
