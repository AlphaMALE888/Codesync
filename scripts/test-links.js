/**
 * scripts/test-links.js
 * Scans all rendered HTML files for clickable <a href="..."> links and anchors to ensure 0 dead links.
 */

import fs from "fs";
import path from "path";

const BUILD_APP_DIR = path.join(process.cwd(), ".next", "server", "app");

function getAllHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllHtmlFiles(fullPath, fileList);
    } else if (file.endsWith(".html")) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const htmlFiles = getAllHtmlFiles(BUILD_APP_DIR);
console.log(`Auditing <a> navigation links across ${htmlFiles.length} rendered HTML pages...\n`);

// Collect all known route paths
const knownRoutes = new Set([
  "",
  "/",
  "/services",
  "/services/local-seo-google-business-profile",
  "/services/seo",
  "/services/google-ads-ppc",
  "/services/meta-ads-lead-generation",
  "/services/social-content-email-sms",
  "/services/business-websites",
  "/services/ecommerce-websites",
  "/services/mobile-apps",
  "/services/ui-ux-graphic-design",
  "/services/domain-hosting-maintenance",
  "/services/crm",
  "/services/erp-billing-gst",
  "/services/hrms-payroll",
  "/services/custom-software",
  "/pricing",
  "/about",
  "/contact",
  "/legal/privacy",
  "/legal/terms",
  "/legal/refund-cancellation",
  "/work",
  "/insights",
  "/industries",
  "/design-system",
]);

// Map of legacy redirects known from next.config.mjs
const legacyRedirects = new Set([
  "/portfolio",
  "/blog",
  "/career",
  "/privacy-policy",
  "/seo-services-lucknow",
]);

let totalLinksChecked = 0;
let errors = [];

// Match only <a ... href="..."> tags
const aTagRegex = /<a\b[^>]*\bhref="([^"]+)"[^>]*>/gi;

for (const filePath of htmlFiles) {
  const relativeFile = path.relative(process.cwd(), filePath);
  const html = fs.readFileSync(filePath, "utf-8");

  // Collect IDs present in this document
  const idRegex = /id="([^"]+)"/g;
  const docIds = new Set();
  let idMatch;
  while ((idMatch = idRegex.exec(html)) !== null) {
    docIds.add(idMatch[1]);
  }

  let match;
  while ((match = aTagRegex.exec(html)) !== null) {
    const href = match[1];
    totalLinksChecked++;

    // Ignore external, tel, mailto, whatsapp
    if (
      href.startsWith("http://") ||
      href.startsWith("https://") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      href.startsWith("javascript:")
    ) {
      continue;
    }

    // Anchor-only links (#section)
    if (href.startsWith("#")) {
      const anchor = href.slice(1);
      if (!docIds.has(anchor)) {
        errors.push(`Broken in-page anchor "${href}" in ${relativeFile}`);
      }
      continue;
    }

    // Split route from hash/query
    const [pathPart, hashPart] = href.split("#");
    const cleanPath = pathPart.split("?")[0].replace(/\/$/, "");
    const testPath = cleanPath === "" ? "/" : cleanPath;

    // Check if path is known route or redirect
    if (!knownRoutes.has(testPath) && !legacyRedirects.has(testPath)) {
      errors.push(`Unresolved internal link "${href}" (normalized "${testPath}") in ${relativeFile}`);
    }
  }
}

console.log(`Audited ${totalLinksChecked} user-facing <a> navigation links.`);

if (errors.length === 0) {
  console.log("✓ ALL USER-FACING NAVIGATION LINKS AND ANCHORS RESOLVE: 0 dead links.");
  process.exit(0);
} else {
  console.error(`Found ${errors.length} broken link(s):`);
  errors.forEach((e) => console.error(" - " + e));
  process.exit(1);
}
