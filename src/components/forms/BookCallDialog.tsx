"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, CheckCircle2, Phone, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "@/lib/motion";
import { siteConfig } from "@/data/site";
import { isValidIndianPhone } from "@/lib/inquiry/schema";

interface BookCallDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BookCallDialog({ isOpen, onClose }: BookCallDialogProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [submittedAt, setSubmittedAt] = useState<number>(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "success" | "not_configured" | "error">("idle");

  const dialogRef = useRef<HTMLDivElement>(null);
  const initialFocusRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSubmittedAt(Date.now());
      setError(null);
      setStatus("idle");
      document.body.style.overflow = "hidden";

      // Focus trap initial input
      setTimeout(() => {
        initialFocusRef.current?.focus();
      }, 50);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!phone.trim() || !isValidIndianPhone(phone)) {
      setError("Please enter a valid 10-digit Indian phone number.");
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
          service: "Free Consultation Call",
          consent: true,
          honeypot,
          submittedAt,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatus("success");
      } else if (res.status === 503 || data.error === "not_configured") {
        setStatus("not_configured");
      } else {
        setError(data.error || "Unable to send request right now.");
      }
    } catch {
      setError("Network error. Please try again or call us.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-ink/70 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="book-call-title"
        >
          {/* Backdrop click dismiss */}
          <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

          {/* Modal / Bottom Sheet Box */}
          <motion.div
            ref={dialogRef}
            data-lenis-prevent
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 32, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full sm:max-w-md max-h-[90svh] overflow-y-auto bg-white rounded-t-xl sm:rounded-lg p-6 sm:p-8 shadow-2xl z-10 border border-hairline"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-surface-muted hover:bg-hairline flex items-center justify-center text-text-secondary hover:text-ink transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>

            {status === "success" ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-full bg-accent/10 text-accent mx-auto flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-6 h-6 stroke-[2.2]" />
                </div>
                <h3 className="font-display font-medium text-2xl text-ink">
                  Call Request Received
                </h3>
                <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                  Thanks, <strong className="text-ink">{name}</strong>. A member of our Lucknow team will call you on{" "}
                  <strong className="text-ink font-mono">{phone}</strong> shortly.
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 px-6 py-2.5 rounded-pill bg-accent text-white text-xs font-mono uppercase tracking-wider hover:bg-accent-soft transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            ) : status === "not_configured" ? (
              <div className="text-center py-4">
                <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-700 mx-auto flex items-center justify-center mb-3 border border-amber-200">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <h3 className="font-display font-medium text-xl text-ink">
                  Direct Line Active
                </h3>
                <p className="mt-2 text-xs text-text-secondary leading-relaxed">
                  Call or WhatsApp us directly for an immediate free strategy call:
                </p>
                <div className="mt-4 flex flex-col gap-2">
                  <a
                    href={`tel:${siteConfig.contact.phones[0]}`}
                    className="flex items-center justify-center gap-2 p-3 rounded-md bg-accent text-white text-sm font-medium hover:bg-accent-soft transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    Call {siteConfig.contact.phones[0]}
                  </a>
                  <a
                    href={siteConfig.contact.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 p-3 rounded-md bg-surface-muted text-ink text-sm font-medium border border-hairline hover:bg-hairline transition-colors"
                  >
                    Message on WhatsApp
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest text-accent font-semibold block mb-1">
                    FAST 15-MINUTE CALL
                  </span>
                  <h3 id="book-call-title" className="font-display font-medium text-2xl text-ink tracking-tight">
                    Book a free call
                  </h3>
                  <p className="text-xs text-text-secondary mt-1">
                    Discuss your growth targets directly with our Lucknow tech and marketing leads.
                  </p>
                </div>

                {/* Honeypot */}
                <input
                  type="text"
                  tabIndex={-1}
                  className="hidden"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1">
                    Your Name *
                  </label>
                  <input
                    ref={initialFocusRef}
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Gaurav Sharma"
                    className="w-full h-11 px-3.5 rounded-sm border border-hairline bg-canvas text-base text-ink placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1">
                    Phone or WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    inputMode="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 8948040913"
                    className="w-full h-11 px-3.5 rounded-sm border border-hairline bg-canvas text-base text-ink placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-accent font-mono"
                  />
                </div>

                {error && (
                  <p className="text-xs text-red-600 font-sans" role="alert">
                    {error}
                  </p>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-pill bg-accent hover:bg-accent-soft text-white text-sm font-medium transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Connecting...</span>
                      </>
                    ) : (
                      <span>Request Free Call</span>
                    )}
                  </button>
                </div>

                <p className="text-[11px] text-text-secondary/80 text-center leading-relaxed">
                  No automated spam. We value your privacy.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
