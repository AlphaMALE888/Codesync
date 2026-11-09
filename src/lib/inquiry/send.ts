import { InquiryInput } from "./schema";

export type InquiryProvider = "resend" | "webhook" | "none";

export interface SendResult {
  success: boolean;
  error?: "not_configured" | "provider_error" | "rate_limited";
}

/**
 * In-memory best-effort IP rate limiter: 5 requests per 10 minutes.
 */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000; // 10 minutes
  const maxRequests = 5;

  const current = rateLimitMap.get(ip);
  if (!current || now > current.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (current.count >= maxRequests) {
    return false;
  }

  current.count += 1;
  return true;
}

/**
 * Escape HTML special characters for email delivery
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function sendInquiry(inquiry: InquiryInput): Promise<SendResult> {
  const provider = (process.env.INQUIRY_PROVIDER as InquiryProvider) || "none";

  if (provider === "none" || !provider) {
    return {
      success: false,
      error: "not_configured",
    };
  }

  // Provider 1: Resend Email API
  if (provider === "resend") {
    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.INQUIRY_TO_EMAIL || "support@cdmlko.com";
    const fromEmail = process.env.INQUIRY_FROM_EMAIL || "inquiry@cdmlko.com";

    if (!apiKey) {
      return { success: false, error: "not_configured" };
    }

    try {
      const htmlBody = `
        <h2>New Client Inquiry - CODESYNC</h2>
        <p><strong>Name:</strong> ${escapeHtml(inquiry.name)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(inquiry.phone)}</p>
        ${inquiry.email ? `<p><strong>Email:</strong> ${escapeHtml(inquiry.email)}</p>` : ""}
        ${inquiry.service ? `<p><strong>Service Interest:</strong> ${escapeHtml(inquiry.service)}</p>` : ""}
        ${inquiry.message ? `<p><strong>Message:</strong><br/>${escapeHtml(inquiry.message)}</p>` : ""}
        <hr/>
        <p><small>Submitted via CODESYNC Lead System (${new Date().toISOString()})</small></p>
      `;

      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: toEmail,
          subject: `New Inquiry from ${escapeHtml(inquiry.name)} [CODESYNC]`,
          html: htmlBody,
        }),
      });

      if (!res.ok) {
        return { success: false, error: "provider_error" };
      }

      return { success: true };
    } catch {
      return { success: false, error: "provider_error" };
    }
  }

  // Provider 2: Webhook Endpoint (CRM, Zapier, Google Apps Script)
  if (provider === "webhook") {
    const webhookUrl = process.env.INQUIRY_WEBHOOK_URL;
    if (!webhookUrl) {
      return { success: false, error: "not_configured" };
    }

    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          name: inquiry.name,
          phone: inquiry.phone,
          email: inquiry.email || null,
          service: inquiry.service || null,
          message: inquiry.message || null,
          source: "codesync-web-lead",
        }),
      });

      if (!res.ok) {
        return { success: false, error: "provider_error" };
      }

      return { success: true };
    } catch {
      return { success: false, error: "provider_error" };
    }
  }

  return { success: false, error: "not_configured" };
}
