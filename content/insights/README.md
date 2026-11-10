# CODESYNC Insights & Editorial Publishing Guide

This directory contains editorial articles and practical marketing/technical guides for **CODESYNC Digi Marketing Pvt. Ltd.** (`cdmlko.com`).

---

## 1. Editorial Policy & Activation Gate

> [!IMPORTANT]
> **Activation Requirement:** The Insights section (`/insights` and `/insights/[slug]`) is currently disabled in production (`features.insights = false`). It will be enabled only when at least **3 real, fully written, client-approved articles** are provided. The old website's three title-only 1-sentence stubs are strictly barred from production.

---

## 2. Article Schema & Data Fields

Each article entry must conform to the `ArticleItem` data structure:

| Field | Type | Required | Description |
|---|---|---|---|
| `slug` | `string` | Yes | Unique URL path (e.g., `local-seo-lucknow-guide`) |
| `title` | `string` | Yes | Clear, value-driven editorial headline |
| `date` | `string` | Yes | ISO publication date (`YYYY-MM-DD`) |
| `updated` | `string` | Optional | Last modified date (`YYYY-MM-DD`) |
| `category` | `string` | Yes | Category tag (e.g., "Local SEO", "Performance Web", "Paid Ads", "Custom Software") |
| `author` | `string` | Yes | Author name and credential (e.g., "Gaurav Dixit, Head of Technology") |
| `summary` | `string` | Yes | 2-line introductory hook displayed on listing cards |
| `cover` | `string` | Optional | Cover illustration or screenshot URL/path |
| `body` | `string` | Yes | Full article content formatted in Markdown/HTML |
| `status` | `'draft' \| 'published'` | Yes | Editorial lifecycle status |
| `readingTime` | `string` | Optional | Estimated reading duration (e.g., "5 min read") |
| `variant` | `'image-led' \| 'text-led-pale' \| 'text-led-dark'` | Optional | Listing card visual presentation |
| `relatedServiceSlug` | `string` | Optional | Service slug for bottom contextual CTA card (e.g., `seo`, `google-ads-ppc`) |

---

## 3. Production Renderability Rules

To protect agency credibility and prevent stub or low-value content from degrading search engine rankings:

1. **Status Rule:** An article is renderable in production **only** if `status: 'published'`. Entries flagged as `'draft'` or `'pending'` are hidden.
2. **Word Count Gate:** An article must exceed **400 words** of substantive analysis. Articles below 400 words are treated as stubs and will trigger a 404 in production.
3. **Feature Flag Gate:** The entire `/insights` directory returns `notFound()` (404) unless `features.insights: true` in `src/data/features.ts`.

---

## 4. How to Add a Real Article

1. Add your article object to the production content array or create a markdown file under `content/insights/<slug>.md`.
2. Ensure the body text is over 400 words, informative, and relevant to Lucknow and Indian regional businesses.
3. Verify that `status` is set to `'published'`.
4. Once at least 3 genuine articles exist, open `src/data/features.ts` and set `insights: true`.
5. Run `npm run type-check` and `npm run build` to verify route generation and sitemap inclusion.
