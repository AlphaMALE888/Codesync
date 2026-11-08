/**
 * DEV-ONLY FIXTURES
 * WARNING: These fixtures are strictly for development and visual verification in /design-system.
 * They MUST NEVER be bundled or rendered in production.
 */

if (process.env.NODE_ENV === "production") {
  throw new Error("CRITICAL SAFETY ASSERTION: src/data/__dev__ fixtures imported in production!");
}

export const DEV_SAMPLE_DATA = {
  label: "SAMPLE, DEV ONLY",
  sampleStat: "99.9%",
  sampleMetric: "₹10M+ Revenue",
  sampleAuthor: "Dev Reviewer (SAMPLE, DEV ONLY)",
};
