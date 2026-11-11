/**
 * scripts/detect-overflow.js
 *
 * Antigravity Phase 11: Responsive Overflow Detector
 * Run this snippet in the browser DevTools Console on any route
 * or import it in automated test runners to identify elements wider than clientWidth.
 *
 * Usage:
 *   1. Open browser DevTools (F12) -> Console tab.
 *   2. Copy & paste this file's contents and press Enter.
 *   3. It will scan every element in the DOM and print a summary table of any overflowing nodes.
 */

function detectHorizontalOverflow() {
  const docWidth = document.documentElement.clientWidth;
  const elements = document.querySelectorAll("*");
  const overflowingElements = [];

  elements.forEach((el) => {
    // Ignore script, style, head tags
    if (["SCRIPT", "STYLE", "HEAD", "META", "LINK", "TITLE"].includes(el.tagName)) return;

    const rect = el.getBoundingClientRect();
    // Allow 1px tolerance for sub-pixel anti-aliasing / rounding
    if (rect.right > docWidth + 1 || rect.width > docWidth + 1) {
      // Check if this element has an ancestor with overflow: hidden that clips it
      let isClipped = false;
      let parent = el.parentElement;
      while (parent && parent !== document.body && parent !== document.documentElement) {
        const computed = window.getComputedStyle(parent);
        if (computed.overflowX === "hidden" || computed.overflow === "hidden") {
          isClipped = true;
          break;
        }
        parent = parent.parentElement;
      }

      if (!isClipped) {
        overflowingElements.push({
          tag: el.tagName.toLowerCase(),
          id: el.id || "(none)",
          className: typeof el.className === "string" ? el.className.slice(0, 80) : "(svg/complex)",
          rectWidth: Math.round(rect.width),
          rectRight: Math.round(rect.right),
          viewportWidth: docWidth,
          overflowPx: Math.round(Math.max(rect.right - docWidth, rect.width - docWidth)),
          node: el,
        });
      }
    }
  });

  const isOverflowing = document.documentElement.scrollWidth > docWidth + 1;

  if (overflowingElements.length === 0 && !isOverflowing) {
    console.log(
      `%c[PASS] Zero horizontal overflow detected! Viewport: ${docWidth}px (scrollWidth: ${document.documentElement.scrollWidth}px).`,
      "color: #2F5A44; font-weight: bold; font-size: 13px;"
    );
  } else {
    console.warn(
      `%c[FAIL] Detected ${overflowingElements.length} overflowing elements at viewport ${docWidth}px (scrollWidth: ${document.documentElement.scrollWidth}px):`,
      "color: #D32F2F; font-weight: bold; font-size: 13px;"
    );
    console.table(overflowingElements.map(({ node, ...rest }) => rest));
  }

  return {
    passed: overflowingElements.length === 0 && !isOverflowing,
    viewportWidth: docWidth,
    scrollWidth: document.documentElement.scrollWidth,
    overflowingCount: overflowingElements.length,
    elements: overflowingElements,
  };
}

if (typeof window !== "undefined") {
  window.__detectOverflow = detectHorizontalOverflow;
}

if (typeof module !== "undefined") {
  module.exports = { detectHorizontalOverflow };
}
