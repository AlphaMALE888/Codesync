# Asset Inventory & Media Audit
**Date:** 8 November 2026  
**Auditor:** Antigravity  
**Phase:** Phase 0 (Repository Audit and Project Foundation)  

---

## 1. Local Repository Asset State

Currently, the local repository contains **0 image, font, video, or audio media assets**.

| Category | Count in Repo | Status |
|---|---|---|
| Logos | 0 | Pending client supply |
| Photography (Team / Office) | 0 | Pending client supply |
| Client Proof / Brand Logos | 0 | Pending written permission & assets |
| Custom SVG Illustrations | 0 | To be built originally in Phase 1-4 |
| Fonts | 0 | To be loaded via `next/font/google` (Inter & Inter Tight) |
| Videos / 3D Assets | 0 | None planned; original SVG/CSS layered hero |

---

## 2. Legacy Site Asset Audit (from Dossier cdmlko.com)

The legacy site referenced the following assets (not present in the local workspace):

| Asset Path (Remote/Old Site) | Description / Intended Use | Status & Findings |
|---|---|---|
| `/assets/images/cdm-logo-transparent.png` | Primary company brand logo (transparent PNG, versioned 20261006-1). | **NOT IN REPO**. Dominant hex colors cannot be extracted directly from disk. |
| `/assets/images/marketing/*.jpg` | Marketing pillar cards (analytics & dashboard illustrations). | Likely stock illustrations; do not reuse. |
| `/assets/images/software/*.jpg` | Software solutions showcase imagery. | Stock dashboard mockups; do not reuse. |
| `/assets/images/team/*.jpg` | Team photos for Gaurav Dixit, Pankaj Srivastwa, Sachin Anand Srivastava, Vikas. | **NOT IN REPO**. High priority item for client to provide original high-res files. |
| Client logos (alt text: SDN UPVC, Bamdev Properties, Entire Tax Solution, Tax Sahayog, Ozone Car Care, 2 generic) | Homepage client proof rail. | **NOT IN REPO**. Permission flags pending; cannot be rendered until verified. |

---

## 3. Brand Accent & Color Guidance for Phase 1

1. **Logo File Availability**:
   Because `cdm-logo-transparent.png` is not currently in the repository, we cannot read the dominant hex values from disk.
2. **Provisional Color Tokens (from Design Reference)**:
   In accordance with the Master Playbook and Reverse Engineering Report:
   - Primary Accent: `--accent: #2F5A44` (provisional deep forest green)
   - Secondary Accent: `--accent-soft: #49735A`
   - Canvas: `--canvas: #F5F5F3`
   - Primary Ink: `--ink: #121212`
   - Dark Surface: `--surface-dark: #111213`
   - Muted Surface: `--surface-muted: #EBEBE9`
3. **Verification Step**:
   Once the client provides the official vector/transparent logo file, its dominant colors will be audited. If there is a clash with `#2F5A44`, a tailored adjustment will be submitted for client approval.

---

## 4. MediaSlot Component Strategy (Phase 2+)

To ensure that the site never displays broken links, generic stock images, or blank missing boxes:
- Any missing image will be wrapped with the `<MediaSlot>` component.
- In `development` mode, it displays an informative striped box: `[ASSET NEEDED: <Asset Name>]`.
- In `production` mode, it cleanly hides the element or omits the card without causing layout shifts or console errors.
