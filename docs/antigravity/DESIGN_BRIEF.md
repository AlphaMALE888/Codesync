# Design Brief & Visual Digest
**Reference:** `docs/reference/TEMPLATE_REVERSE_ENGINEERING_REPORT.md` (Spartan AI Framer Template Analysis)  
**Date:** 8 November 2026  
**Auditor:** Antigravity  

---

## 1. OBSERVED (Safe to Reproduce Exactly)

The following traits and components are visually proven by direct evidence in the reference capture:

- **Section 01 & 04: Visual DNA & Contrast Scaling**: Extreme scale contrast between massive display typography (up to ~11rem via `clamp()`) and tiny utility metadata/labels (11–12px uppercase).
- **Section 03: Capsule Floating Navigation**: White/off-white rounded pill navigation centered at top with 5 links (`Works`, `Services`, `Insights`, `Pricing`, `Company`), plus a detached primary CTA button on the right ("Hire Team" / "Book a free call") with a distinct dark square inset icon tile.
- **Section 04: High-Contrast Light/Dark Chaptering**: Controlled alternating chapters between warm off-white (`#F5F5F3`) and charcoal/near-black (`#111213`).
- **Section 05.2: Asymmetric Proof Metrics Cluster**: Four cards of unequal visual weight (dark revenue tile, team/agent avatar stack, radial speed emblem, customer quote card) featuring animated number count-ups on viewport entry.
- **Section 05.4: Oversized Display Marquee / Repeated Headings**: Repeated oversized section titles (e.g., "Our Works", "Experiences", "Pricing") with a distinct visual separator between repetitions.
- **Section 05.5: Modular Capabilities Accordion**: Dark section with left narrative block and right panel group featuring one expanded active panel with illustrations and two narrow collapsed vertical tabs with rotated labels.
- **Section 05.7: Technical Capability Feature Strip**: 4-column compact feature row with line icons, benefit titles, and concise copy.
- **Section 05.9: Process Accordion**: Numbered implementation steps with one active expanded step showing copy and category pills, paired with an architectural visual.
- **Section 05.10: Team Collective Presentation**: Editorial quote card paired with portrait cards on distinct saturated color fields with names and roles anchored at the bottom.
- **Section 05.11: Testimonial Carousel**: Horizontal scroll-snap card rail with previous/next circular arrow controls.
- **Section 05.12: Pricing Presentation**: 4 package cards (Core, Growth, Pro, Scale) with the 3rd card visually highlighted in dark with texture, paired with a monthly/billing toggle.
- **Section 05.13: Split FAQ Accordion**: Left-hand editorial prompt and CTA; right-hand dark rounded accordion rows with plus/close toggle states.
- **Section 05.14: Asymmetric Insights Grid**: Editorial grid mixing image-led cards and text-led cards with distinct visual spans.
- **Section 05.15: Designed Cinematic Closing Scene**: Oversized white brand wordmark cropped across the bottom edge within a deep atmospheric environment.

---

## 2. LIKELY (Reproduce Only if Subtle, Lightweight, and Testable)

These patterns are suggested by the visual behavior, but the exact technical implementation was not directly provable:

- **Section 05.4 & 08: Case Card Media Zoom**: A gentle, subtle scale (1.02 to 1.04) and contrast elevation on hover for cards and images on fine pointers only.
- **Section 07 & 08: Split Arrow Button Micro-Motion**: Arrow inside the inset tile translating 2–4px on hover/focus.
- **Section 05.6: Vision Statement Line/Word Reveal**: Staggered fade and slide-in for the manifesto statement upon reaching 30% viewport visibility.
- **Section 08: Section Entrances**: Subtle viewport entrance reveals (opacity and y: 24px to 0) triggering once per load.

---

## 3. UNKNOWN (Do NOT Invent; Guardrails & Prohibitions)

The following properties could not be established from the video recording. We will NOT assume or invent them:

- **Section 05.1: Hero Scene Technology**: Whether the landscape is real-time 3D (Three.js), pre-rendered WebM video, or a layered still composition. *Playbook Decision:* Build an original SVG/CSS layered pointed-arch composition with an optional `<MediaSlot>` for real video/photo. **No Three.js/WebGL.**
- **Section 08: Custom Cursor / Magnetic Buttons / Loading Screen**: Not observed in the reference. **Strictly forbidden.**
- **Section 08: Character-by-Character Text Splitting**: Not observed. Only line-level or word-level reveals will be used.
- **Section 11: Proprietary Fonts & Source Code**: The exact font and Framer source code are unknown and protected. We use self-hosted open-license fonts: **Inter Tight** (Display) and **Inter** (Body).
- **Section 15: Exact CSS Values, Breakpoints & Mobile Behaviors**: Recreated using standard Tailwind responsive defaults (`640px`, `768px`, `1024px`, `1280px`, `1536px`) and fluid `clamp()` formulas.
