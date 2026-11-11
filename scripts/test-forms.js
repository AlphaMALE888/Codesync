/**
 * scripts/test-forms.js
 * Verification of inquiry validation logic, rate-limiting, and error handling.
 */

// Phone validator: Indian mobile format
function isValidIndianPhone(phone) {
  if (!phone) return false;
  const cleaned = phone.replace(/[\s\-()]/g, "");
  const pattern = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/;
  return pattern.test(cleaned);
}

// Email validator
function isValidEmail(email) {
  if (!email) return true;
  const pattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return pattern.test(email.trim());
}

function containsControlChars(str) {
  return /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(str);
}

function validateInquiry(input) {
  if (!input || typeof input !== "object") {
    return { success: false, errors: { form: "Invalid request payload." } };
  }

  const data = input;
  const errors = {};

  if (data.honeypot && data.honeypot.trim().length > 0) {
    return { success: false, errors: { form: "Spam detected." } };
  }

  if (data.submittedAt && typeof data.submittedAt === "number") {
    const elapsed = Date.now() - data.submittedAt;
    if (elapsed < 2500) {
      return { success: false, errors: { form: "Submission received too quickly. Please take your time." } };
    }
  }

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

  const phone = typeof data.phone === "string" ? data.phone.trim() : "";
  if (!phone) {
    errors.phone = "Please enter your phone or WhatsApp number.";
  } else if (!isValidIndianPhone(phone)) {
    errors.phone = "Please enter a valid 10-digit Indian phone number.";
  }

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

  if (!data.consent) {
    errors.consent = "You must agree to the privacy policy to submit an enquiry.";
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return { success: true, data: { name, phone, email, consent: true } };
}

// In-memory rate limiting test simulation
const rateLimitMap = new Map();
function checkRateLimit(ip, limit = 5, windowMs = 60000) {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now - record.resetTime > windowMs) {
    rateLimitMap.set(ip, { count: 1, resetTime: now });
    return true;
  }
  if (record.count >= limit) {
    return false;
  }
  record.count += 1;
  return true;
}

console.log("Running inquiry form security and validation tests...\n");

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`PASS: ${message}`);
    passed++;
  } else {
    console.error(`FAIL: ${message}`);
    failed++;
  }
}

// Test 1: Valid lead payload
const valid = {
  name: "Alok Verma",
  phone: "8948040913",
  email: "test@example.com",
  service: "seo",
  consent: true,
  submittedAt: Date.now() - 5000,
};
assert(validateInquiry(valid).success === true, "Valid lead submission passes validation");

// Test 2: Honeypot trap
const bot = { ...valid, honeypot: "spam_bot_fill" };
const botRes = validateInquiry(bot);
assert(botRes.success === false && botRes.errors.form === "Spam detected.", "Honeypot field stops bot submission silently");

// Test 3: Fast timing trap (<2.5s)
const fastBot = { ...valid, submittedAt: Date.now() - 500 };
const fastRes = validateInquiry(fastBot);
assert(fastRes.success === false && fastRes.errors.form.includes("too quickly"), "Fast submission (< 2.5s) rejected");

// Test 4: Invalid phone formats
assert(validateInquiry({ ...valid, phone: "123456" }).success === false, "Short phone rejected");
assert(validateInquiry({ ...valid, phone: "5551234567" }).success === false, "Invalid starting digit rejected");
assert(validateInquiry({ ...valid, phone: "+91 9616530280" }).success === true, "+91 prefixed phone accepted");

// Test 5: Missing consent
assert(validateInquiry({ ...valid, consent: false }).success === false, "Missing privacy consent rejected");

// Test 6: Rate limit simulation
const testIp = "203.0.113.195";
let blocked = false;
for (let i = 0; i < 7; i++) {
  if (!checkRateLimit(testIp, 5)) {
    blocked = true;
    break;
  }
}
assert(blocked === true, "Rate limit triggers after 5 requests from same IP within window");

console.log(`\nInquiry security test suite: ${passed} passed, ${failed} failed.`);
if (failed > 0) process.exit(1);
