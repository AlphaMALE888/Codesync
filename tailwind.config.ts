import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "var(--canvas)",
        ink: "var(--ink)",
        "surface-dark": "var(--surface-dark)",
        "surface-dark-2": "var(--surface-dark-2)",
        "surface-muted": "var(--surface-muted)",
        hairline: "var(--hairline)",
        "text-secondary": "var(--text-secondary)",
        "text-secondary-on-dark": "var(--text-secondary-on-dark)",
        "on-dark": "var(--on-dark)",
        accent: {
          DEFAULT: "var(--accent)",
          soft: "var(--accent-soft)",
          deep: "var(--accent-deep)",
        },
        field: {
          1: "var(--field-1)",
          2: "var(--field-2)",
          3: "var(--field-3)",
        },
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        pill: "var(--radius-pill)",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      maxWidth: {
        container: "1440px",
      },
      spacing: {
        gutter: "clamp(8px, 1.2vw, 16px)",
      },
      transitionTimingFunction: {
        "out-custom": "cubic-bezier(0.22, 1, 0.36, 1)",
        "in-out-custom": "cubic-bezier(0.65, 0, 0.35, 1)",
      },
      transitionDuration: {
        fast: "180ms",
        base: "320ms",
        slow: "450ms",
        reveal: "700ms",
      },
    },
  },
  plugins: [],
};

export default config;
