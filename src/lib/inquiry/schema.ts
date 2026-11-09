export interface InquiryInput {
  name: string;
  phone: string;
  email?: string;
  service?: string;
  message?: string;
  consent: boolean;
  honeypot?: string; // Bot protection
  submittedAt?: number; // Timing protection
}

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
}

// Phone validator: Indian mobile format (10 digits starting with 6-9, optional +91 or 0 prefix, optional spaces or dashes)
export function isValidIndianPhone(phone: string): boolean {
  if (!phone) return false;
  const cleaned = phone.replace(/[\s\-()]/g, "");
  // Matches +91XXXXXXXXXX, 91XXXXXXXXXX, 0XXXXXXXXXX, or XXXXXXXXXX where X is 10 digits starting with 6-9
  const pattern = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/;
  return pattern.test(cleaned);
}

// Email validator (RFC 5322 compliant regex)
export function isValidEmail(email: string): boolean {
  if (!email) return true; // optional field
  const pattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return pattern.test(email.trim());
}

// Check for dangerous control characters
function containsControlChars(str: string): boolean {
  // eslint-disable-next-line no-control-regex
  return /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(str);
}

export function validateInquiry(input: unknown): ValidationResult<InquiryInput> {
  if (!input || typeof input !== "object") {
    return {
      success: false,
      errors: { form: "Invalid request payload." },
    };
  }

  const data = input as Partial<InquiryInput>;
  const errors: Record<string, string> = {};

  // Honeypot check: If honeypot is filled, silently reject
  if (data.honeypot && data.honeypot.trim().length > 0) {
    return {
      success: false,
      errors: { form: "Spam detected." },
    };
  }

  // Minimum submission time check (2.5 seconds)
  if (data.submittedAt && typeof data.submittedAt === "number") {
    const elapsed = Date.now() - data.submittedAt;
    if (elapsed < 2500) {
      return {
        success: false,
        errors: { form: "Submission received too quickly. Please take your time." },
      };
    }
  }

  // 1. Name validation (2 to 80 chars)
  const name = typeof data.name === "string" ? data.name.trim() : "";
  if (!name) {
    errors.name = "Please enter your name.";
  } else if (name.length < 2) {
    errors.name = "Name must be at least 2 characters.";
  } else if (name.length > 80) {
    errors.name = "Name must not exceed 80 characters.";
  } else if (containsControlChars(name)) {
    errors.name = "Name contains invalid characters.";
  }

  // 2. Phone validation
  const phone = typeof data.phone === "string" ? data.phone.trim() : "";
  if (!phone) {
    errors.phone = "Please enter your phone or WhatsApp number.";
  } else if (!isValidIndianPhone(phone)) {
    errors.phone = "Please enter a valid 10-digit Indian phone number.";
  }

  // 3. Email validation (optional)
  const email = typeof data.email === "string" ? data.email.trim() : "";
  if (email) {
    if (!isValidEmail(email)) {
      errors.email = "Please enter a valid email address.";
    } else if (email.length > 100) {
      errors.email = "Email must not exceed 100 characters.";
    } else if (containsControlChars(email)) {
      errors.email = "Email contains invalid characters.";
    }
  }

  // 4. Message validation (optional, max 2000 chars)
  const message = typeof data.message === "string" ? data.message.trim() : "";
  if (message) {
    if (message.length > 2000) {
      errors.message = "Message must not exceed 2000 characters.";
    } else if (containsControlChars(message)) {
      errors.message = "Message contains invalid characters.";
    }
  }

  // 5. Service selection
  const service = typeof data.service === "string" ? data.service.trim() : "";

  // 6. Consent check (required)
  if (!data.consent) {
    errors.consent = "You must agree to the privacy policy to submit an enquiry.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      errors,
    };
  }

  return {
    success: true,
    data: {
      name,
      phone,
      email: email || undefined,
      service: service || undefined,
      message: message || undefined,
      consent: true,
    },
  };
}
