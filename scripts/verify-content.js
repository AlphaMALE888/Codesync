/**
 * scripts/verify-content.js
 * Accurate scan for prohibited text, leaks, unverified claims, and prices in .next/server/app
 */

import fs from "fs";
import path from "path";

const BUILD_APP_DIR = path.join(process.cwd(), ".next", "server", "app");

if (!fs.existsSync(BUILD_APP_DIR)) {
  console.error("ERROR: .next/server/app not found. Run 'npm run build' first.");
  process.exit(1);
}

// 1. Fabrication and leak tokens (in user-visible prose)
const FABRICATION_TOKENS = [
  "lorem",
  "ipsum",
  "coming soon",
  "TODO",
  "FIXME",
  "SAMPLE",
  "DEV ONLY",
  "Hostinger",
  "public_html",
  "PHP include",
  "Super Admin",
  "first release",
  "intentionally static",
  "will be published here",
  "Software UI",
  "view project",
];

// 2. Unverified claims tokens (literal numbers and prohibited marketing badges)
const UNVERIFIED_EXACT_TERMS = [
  "374",
  "643",
  "22+",
  "30+",
  "ISO",
  "GeM",
  "Startup India",
  "MSME",
  "Digital India",
  "MCA",
  "5.0",
  "86 reviews",
  "Google rating",
  "award-winning",
  "#1 agency",
];

// 3. Price tokens (when features.pricingNumbers is false)
const PRICE_TOKENS = ["₹", "INR", "Rs."];

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, fileList);
    } else if (file.endsWith(".html")) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractVisibleText(html) {
  // Strip <script>, <style>, <svg> blocks
  let clean = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ");
  clean = clean.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ");
  clean = clean.replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, " ");
  // Strip all HTML tags
  clean = clean.replace(/<[^>]+>/g, " ");
  // Decode common HTML entities
  clean = clean.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"');
  return clean;
}

const files = getAllFiles(BUILD_APP_DIR);
console.log(`Scanning visible text of ${files.length} rendered HTML pages in .next/server/app/...\n`);

let errors = [];

for (const filePath of files) {
  const relativePath = path.relative(process.cwd(), filePath);
  if (relativePath.includes("design-system")) continue;

  const html = fs.readFileSync(filePath, "utf-8");
  const visibleText = extractVisibleText(html);

  // Check fabrication tokens
  for (const token of FABRICATION_TOKENS) {
    const regex = new RegExp(`\\b${escapeRegex(token)}\\b`, "i");
    if (regex.test(visibleText)) {
      errors.push(`[FABRICATION LEAK] "${token}" in ${relativePath}`);
    }
  }

  // Check unverified claims
  for (const token of UNVERIFIED_EXACT_TERMS) {
    const regex = new RegExp(`\\b${escapeRegex(token)}\\b`, "i");
    if (regex.test(visibleText)) {
      errors.push(`[UNVERIFIED CLAIM] "${token}" in ${relativePath}`);
    }
  }

  // Check price symbols
  for (const token of PRICE_TOKENS) {
    if (visibleText.includes(token)) {
      errors.push(`[PRICE TOKEN] "${token}" in ${relativePath}`);
    }
  }
}

if (errors.length === 0) {
  console.log("✓ ALL SCANS PASSED: 0 fabrication tokens, 0 unverified claims, 0 price leaks found in visible page content.");
  process.exit(0);
} else {
  console.error(`Found ${errors.length} issue(s):`);
  errors.forEach((e) => console.error(" - " + e));
  process.exit(1);
}
