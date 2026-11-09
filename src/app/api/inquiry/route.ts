import { NextRequest, NextResponse } from "next/server";
import { validateInquiry } from "@/lib/inquiry/schema";
import { sendInquiry, checkRateLimit } from "@/lib/inquiry/send";

export async function POST(req: NextRequest) {
  try {
    // 1. IP Rate Limiting
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a few minutes." },
        { status: 429 }
      );
    }

    // 2. Parse Body with Max Size Guard (approx 10KB max)
    const bodyText = await req.text();
    if (bodyText.length > 10240) {
      return NextResponse.json(
        { error: "Payload too large." },
        { status: 413 }
      );
    }

    let json: unknown;
    try {
      json = JSON.parse(bodyText);
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON format." },
        { status: 400 }
      );
    }

    // 3. Schema & Anti-Spam Validation
    const validation = validateInquiry(json);
    if (!validation.success || !validation.data) {
      return NextResponse.json(
        { errors: validation.errors },
        { status: 400 }
      );
    }

    // 4. Send via Provider
    const result = await sendInquiry(validation.data);

    if (!result.success) {
      if (result.error === "not_configured") {
        return NextResponse.json(
          { error: "not_configured" },
          { status: 503 }
        );
      }
      return NextResponse.json(
        { error: "provider_error" },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "An unexpected server error occurred." },
      { status: 500 }
    );
  }
}
