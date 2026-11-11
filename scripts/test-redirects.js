/**
 * scripts/test-redirects.js
 *
 * Antigravity Phase 12: Redirects Verification Script
 * Validates that next.config.mjs exports the required legacy 301 redirects.
 */

import nextConfig from "../next.config.mjs";

async function verifyRedirects() {
  console.log("Verifying Next.js 301 redirects configuration...");

  if (!nextConfig.redirects) {
    console.error("FAIL: nextConfig.redirects is not defined!");
    process.exit(1);
  }

  const redirects = await nextConfig.redirects();
  console.log(`Found ${redirects.length} defined redirect rules.\n`);

  const requiredSources = [
    { source: "/portfolio", destination: "/services" },
    { source: "/blog", destination: "/" },
    { source: "/career", destination: "/about#careers" },
    { source: "/privacy-policy", destination: "/legal/privacy" },
    { source: "/seo-services-lucknow", destination: "/services/seo" },
    { source: "/services/website-development", destination: "/services/business-websites" },
  ];

  let failed = false;

  for (const req of requiredSources) {
    const match = redirects.find((r) => r.source === req.source);
    if (!match) {
      console.error(`FAIL: Missing redirect for source "${req.source}"`);
      failed = true;
    } else if (match.destination !== req.destination) {
      console.error(`FAIL: Source "${req.source}" maps to "${match.destination}", expected "${req.destination}"`);
      failed = true;
    } else if (!match.permanent) {
      console.error(`FAIL: Source "${req.source}" is not marked permanent (301)`);
      failed = true;
    } else {
      console.log(`PASS: ${req.source} -> ${req.destination} (301 Permanent)`);
    }
  }

  if (failed) {
    console.error("\nRedirect validation failed!");
    process.exit(1);
  } else {
    console.log(`\nAll required legacy redirects passed validation! Total rules: ${redirects.length}`);
  }
}

verifyRedirects();
