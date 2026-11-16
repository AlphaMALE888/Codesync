import { ImageResponse } from "next/og";

export const alt = "CODESYNC Digi Marketing | Lucknow Digital Marketing & Software Company";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: "#09090B",
          color: "#F5F5F5",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Soft Background Radial Gradient */}
        <div
          style={{
            position: "absolute",
            top: "-20%",
            right: "-10%",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(165, 31, 61, 0.42) 0%, rgba(100, 27, 48, 0.16) 45%, rgba(9, 9, 11, 0) 72%)",
          }}
        />

        {/* Top Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <span
              style={{
                fontSize: "32px",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                color: "#F5F5F5",
              }}
            >
              CODESYNC
            </span>
          </div>
          <span
            style={{
              fontSize: "14px",
              fontFamily: "monospace",
              letterSpacing: "0.15em",
              color: "#E02E4F",
              textTransform: "uppercase",
            }}
          >
            Lucknow, Uttar Pradesh
          </span>
        </div>

        {/* Middle Main Narrative */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            maxWidth: "960px",
          }}
        >
          <span
            style={{
              fontSize: "16px",
              fontFamily: "monospace",
              letterSpacing: "0.15em",
              color: "#E02E4F",
              textTransform: "uppercase",
            }}
          >
            GROW · BUILD · RUN
          </span>
          <h1
            style={{
              fontSize: "56px",
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: "-0.035em",
              color: "#F5F5F5",
              margin: 0,
            }}
          >
            Marketing that grows revenue. Software that moves business forward.
          </h1>
          <p
            style={{
              fontSize: "22px",
              lineHeight: 1.5,
              color: "#C4C4C9",
              margin: 0,
            }}
          >
            High-performance SEO, Google Ads, Meta lead generation, and custom business software for Lucknow enterprises.
          </p>
        </div>

        {/* Bottom Footer Info */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(245, 245, 245, 0.14)",
            paddingTop: "24px",
          }}
        >
          <span
            style={{
              fontSize: "16px",
              color: "#C4C4C9",
            }}
          >
            cdmlko.com · Codesync Digi Marketing (OPC) Pvt Ltd
          </span>
          <span
            style={{
              fontSize: "16px",
              color: "#E02E4F",
              fontWeight: 600,
            }}
          >
            +91 8948040913 · support@cdmlko.com
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
