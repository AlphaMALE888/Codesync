"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Field } from "./Field";
import { SplitArrowButton } from "@/components/ui/SplitArrowButton";
import { siteConfig } from "@/data/site";
import { CheckCircle2, AlertCircle, Phone, MessageSquare, Loader2 } from "lucide-react";

const SERVICE_OPTIONS = [
  { value: "general-consultation", label: "General Project Consultation" },
  { value: "grow-marketing", label: "GROW — Digital Marketing & SEO" },
  { value: "build-website-app", label: "BUILD — Business Website or Mobile App" },
  { value: "run-software", label: "RUN — Custom CRM, ERP or Billing Software" },
  { value: "local-seo", label: "Local SEO & Google Business Profile" },
  { value: "seo", label: "Search Engine Optimization (SEO)" },
  { value: "google-ads", label: "Google Ads & PPC Management" },
  { value: "meta-ads", label: "Meta Ads & Social Lead Generation" },
  { value: "business-website", label: "Responsive Business Website" },
  { value: "ecommerce", label: "E-commerce Storefront Development" },
  { value: "mobile-app", label: "Custom Android / iOS Application" },
  { value: "crm-solution", label: "Sales CRM Pipeline Software" },
  { value: "erp-billing", label: "ERP & GST Invoicing Software" },
];

export function InquiryForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState(SERVICE_OPTIONS[0].value);
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState(""); // hidden spam trap
  const [submittedAt, setSubmittedAt] = useState<number>(0);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "success" | "not_configured" | "error">("idle");

  useEffect(() => {
    setSubmittedAt(Date.now());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Client-side quick checks
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Please enter your name.";
    if (!phone.trim()) newErrors.phone = "Please enter your 10-digit phone number.";
    if (!consent) newErrors.consent = "You must agree to the privacy policy.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email: email || undefined,
          service,
          message: message || undefined,
          consent,
          honeypot,
          submittedAt,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus("success");
      } else if (res.status === 503 || data.error === "not_configured") {
        setStatus("not_configured");
      } else if (data.errors) {
        setErrors(data.errors);
        setStatus("idle");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  // SUCCESS STATE
  if (status === "success") {
    const firstName = name.split(" ")[0] || "there";
    return (
      <div className="p-8 sm:p-12 rounded-md bg-white border border-hairline shadow-sm text-center">
        <div className="w-12 h-12 rounded-full bg-accent/10 text-accent mx-auto flex items-center justify-center mb-4">
          <CheckCircle2 className="w-6 h-6 stroke-[2.2]" />
        </div>
        <h3 className="font-display font-medium text-2xl text-ink">
          Thank you, {firstName}.
        </h3>
        <p className="mt-3 text-base text-text-secondary max-w-md mx-auto leading-relaxed">
          Your enquiry has been received. Our team will review your requirements and reach out to you on{" "}
          <strong className="text-ink font-mono">{phone}</strong>.
        </p>

        <div className="mt-8 pt-6 border-t border-hairline flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={siteConfig.contact.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 bg-emerald-50 px-5 py-2.5 rounded-full border border-emerald-200 hover:bg-emerald-100 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            Message us on WhatsApp
          </Link>
        </div>
      </div>
    );
  }

  // HONEST ERROR / NOT CONFIGURED STATE
  if (status === "not_configured" || status === "error") {
    return (
      <div className="p-8 sm:p-12 rounded-md bg-white border border-hairline shadow-sm text-center">
        <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-700 mx-auto flex items-center justify-center mb-4 border border-amber-200">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="font-display font-medium text-2xl text-ink">
          Direct Inquiries Active
        </h3>
        <p className="mt-3 text-base text-text-secondary max-w-md mx-auto leading-relaxed">
          We could not send your message from this form right now. Please call or message us directly on WhatsApp for an immediate response:
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={`tel:${siteConfig.contact.phones[0]}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-soft transition-colors"
          >
            <Phone className="w-4 h-4" />
            Call {siteConfig.contact.phones[0]}
          </a>
          <Link
            href={siteConfig.contact.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface-muted text-ink text-sm font-medium border border-hairline hover:bg-[#E0E0DE] transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            WhatsApp Us
          </Link>
        </div>

        <button
          onClick={() => setStatus("idle")}
          className="mt-6 text-xs text-text-secondary underline hover:text-ink"
        >
          Try form again
        </button>
      </div>
    );
  }

  // STANDARD FORM STATE
  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="p-6 sm:p-10 rounded-md bg-white border border-hairline shadow-sm space-y-6"
    >
      <div>
        <h3 className="font-display font-medium text-2xl text-ink tracking-tight">
          Send an enquiry
        </h3>
        <p className="text-sm text-text-secondary mt-1">
          Tell us about your project or growth goals. We will reply promptly.
        </p>
      </div>

      {/* Hidden Spam Trap */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="inquiry-fax">Leave this field blank</label>
        <input
          id="inquiry-fax"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      {/* Name */}
      <Field id="inquiry-name" label="Your Name" error={errors.name} required>
        <input
          id="inquiry-name"
          type="text"
          required
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Gaurav Sharma"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "inquiry-name-error" : undefined}
          className="w-full h-12 px-4 rounded-sm border border-hairline bg-canvas text-base text-ink placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
        />
      </Field>

      {/* Phone */}
      <Field id="inquiry-phone" label="Phone or WhatsApp Number" error={errors.phone} required>
        <input
          id="inquiry-phone"
          type="tel"
          required
          inputMode="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="e.g. 8948040913"
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? "inquiry-phone-error" : undefined}
          className="w-full h-12 px-4 rounded-sm border border-hairline bg-canvas text-base text-ink placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-accent transition-all font-mono"
        />
      </Field>

      {/* Email (Optional) */}
      <Field id="inquiry-email" label="Email Address (Optional)" error={errors.email}>
        <input
          id="inquiry-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="e.g. client@company.com"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "inquiry-email-error" : undefined}
          className="w-full h-12 px-4 rounded-sm border border-hairline bg-canvas text-base text-ink placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
        />
      </Field>

      {/* Service Selection */}
      <Field id="inquiry-service" label="What do you want help with?">
        <select
          id="inquiry-service"
          value={service}
          onChange={(e) => setService(e.target.value)}
          className="w-full h-12 px-4 rounded-sm border border-hairline bg-canvas text-base text-ink focus:outline-none focus:ring-2 focus:ring-accent transition-all cursor-pointer"
        >
          {SERVICE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </Field>

      {/* Message (Optional) */}
      <Field id="inquiry-message" label="Project Details (Optional)" error={errors.message}>
        <textarea
          id="inquiry-message"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Briefly describe your objectives, timeframe, or specific deliverables..."
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "inquiry-message-error" : undefined}
          className="w-full p-4 rounded-sm border border-hairline bg-canvas text-base text-ink placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-accent transition-all resize-y min-h-[96px]"
        />
      </Field>

      {/* Consent Checkbox */}
      <div className="space-y-1">
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            required
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="w-4 h-4 mt-0.5 rounded border-hairline text-accent focus:ring-accent"
          />
          <span className="text-xs text-text-secondary leading-relaxed">
            I agree to CODESYNC contacting me regarding this project enquiry in accordance with the{" "}
            <Link href="/legal/privacy" className="text-ink underline hover:text-accent">
              privacy policy
            </Link>
            .
          </span>
        </label>
        {errors.consent && (
          <p className="text-xs text-red-600 font-sans mt-1" role="alert">
            {errors.consent}
          </p>
        )}
      </div>

      {/* General Form Error */}
      {errors.form && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700">
          {errors.form}
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 min-h-[48px] px-8 rounded-pill font-medium text-sm transition-all duration-200 bg-accent hover:bg-accent-soft text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent disabled:opacity-60 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Submitting enquiry...</span>
            </>
          ) : (
            <span>Send Enquiry</span>
          )}
        </button>
      </div>
    </form>
  );
}
