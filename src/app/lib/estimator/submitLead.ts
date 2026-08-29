import type { EstimateResult } from "./types";

// ── Formspree endpoint ───────────────────────────────────────────────────────
// Primary Formspree submission endpoint. Configurable via environment variable
// with a fallback to the project endpoint.
export const FORMSPREE_ENDPOINT =
  (import.meta.env.VITE_FORMSPREE_ESTIMATOR_ENDPOINT as string | undefined) ||
  (import.meta.env.VITE_LEAD_SUBMISSION_ENDPOINT as string | undefined) ||
  "https://formspree.io/f/xjyvkevv";

// ── Submission Result ────────────────────────────────────────────────────────
export type SubmitResult =
  | { ok: true }
  | { ok: false; error: string };

// ── Formspree Payload ────────────────────────────────────────────────────────
// Uses stable, meaningful field names matching Formspree email templates.
export interface FormspreePayload {
  // ── Formspree routing ──
  _subject: string;
  _gotcha?: string; // Honeypot anti-spam (must remain empty)

  // ── Client Information ──
  name: string;
  business_name: string;
  email: string;
  phone: string;
  message: string;

  // ── Service Information ──
  service: string;
  project_type: string;

  // ── Web Design / Development Fields (only if relevant) ──
  pages?: string;
  design_level?: string;
  features?: string;
  branding_status?: string;
  design_references?: string;

  // ── Web Development Specific Fields ──
  development_complexity?: string;
  existing_design?: string;
  timeline?: string;

  // ── Branding Specific Fields ──
  brand_stage?: string;
  brand_deliverables?: string;
  existing_logo?: string;
  branding_level?: string;
  brand_references?: string;
  brand_description?: string;

  // ── Pricing Information ──
  calculated_estimate: string;
  estimate_min: string;
  estimate_max: string;
  client_estimate: string;
  requires_manual_review: string;

  // ── System Information ──
  submission_timestamp: string;
  page_url: string;
  form_version: string;
}

// ── Human-Readable Option Label Mapping ───────────────────────────────────────
const OPTION_LABEL_MAP: Record<string, string> = {
  // Project Types
  "landing-page": "Landing Page",
  portfolio: "Portfolio Website",
  "business-website": "Business Website",
  "multi-page": "Multi-page Website",
  "ecommerce-ui": "E-commerce UI",
  "web-app-ui": "Web Application UI",
  "blog-cms": "Blog / CMS",
  ecommerce: "E-commerce",
  booking: "Booking Website",
  "web-app": "Custom Web Application",

  // Pages
  "1": "1 page",
  "2-5": "2 – 5 pages",
  "6-10": "6 – 10 pages",
  "10+": "10+ pages",

  // Design Level
  simple: "Simple & Clean",
  modern: "Modern & Custom",
  premium: "Premium & Highly Detailed",
  interactive: "Interactive / Animation Heavy",

  // Features (Web Design & Web Dev)
  "contact-form": "Contact Form",
  dashboard: "Dashboard",
  filtering: "Advanced Filtering",
  "custom-interactive": "Custom Interactive Sections",
  whatsapp: "WhatsApp",
  payment: "Payment Gateway",
  "user-login": "User Login",
  "admin-dashboard": "Admin Dashboard",
  "search-filter": "Search / Filtering",
  api: "API Integration",
  animation: "Advanced Animation",
  custom: "Custom Functionality",

  // Branding Status (Web Design)
  complete: "Complete Brand Identity",
  "logo-basic": "Logo + Basic Branding",
  "logo-only": "Logo Only",
  "no-branding": "No Branding Yet",

  // Design Ready (Web Dev)
  ready: "Yes, design is ready",
  "need-design": "No, I need design too",
  "rough-idea": "I have a rough idea",

  // Timeline (Web Dev)
  asap: "As soon as possible",
  "2-4-weeks": "Within 2 – 4 weeks",
  "1-2-months": "Within 1 – 2 months",
  flexible: "Flexible",

  // Branding: What do you need
  logo: "Logo Design",
  "logo-basic-brand": "Logo + Basic Brand Identity",
  "complete-brand": "Complete Brand Identity",
  refresh: "Brand Refresh / Redesign",

  // Branding: Stage
  new: "New Business",
  existing: "Existing Business",
  rebranding: "Rebranding",
  personal: "Personal Brand",

  // Branding: Materials
  "colour-palette": "Colour Palette",
  typography: "Typography",
  "brand-guidelines": "Brand Guidelines",
  "business-card": "Business Card",
  "social-media": "Social Media Assets",
  packaging: "Packaging",
  presentation: "Presentation Template",

  // Branding: Has Logo
  "old-redesign": "I have an old logo that needs redesign",

  // Branding: Level
  strategic: "Strategic / Extensive",

  // Common
  yes: "Yes",
  no: "No",
  other: "Other",
  "not-sure": "I’m not sure",
};

/**
 * Formats raw option keys or arrays into clean, human-readable strings.
 */
function formatValue(v: string | string[] | null | undefined): string {
  if (!v) return "";
  if (Array.isArray(v)) {
    // If it's a conditional-text response: ["yes", "https://..."]
    if (v.length === 2 && (v[0] === "yes" || v[0] === "no")) {
      const [flag, text] = v;
      const label = OPTION_LABEL_MAP[flag] || flag;
      return text && text.trim() ? `${label} — ${text.trim()}` : label;
    }
    return v
      .map((item) => OPTION_LABEL_MAP[item] || item)
      .filter(Boolean)
      .join(", ");
  }
  return OPTION_LABEL_MAP[v] || v;
}

/**
 * Builds the structured Formspree payload containing all relevant questionnaire answers.
 */
export function buildFormspreePayload(params: {
  service: string;
  answers: Record<string, string | string[] | null>;
  clientName: string;
  businessName: string;
  email: string;
  phone: string;
  additionalMessage: string;
  estimate: EstimateResult;
}): FormspreePayload {
  const { service, answers, estimate } = params;

  const serviceName =
    {
      "web-design": "Web Design",
      "web-development": "Web Development",
      branding: "Branding & Logo Design",
    }[service] ?? service;

  const clientName = params.clientName.trim();
  const subject = `New Project Enquiry | ${serviceName} | ${clientName || "Unknown"}`;

  const payload: FormspreePayload = {
    _subject: subject,
    _gotcha: "", // Honeypot spam trap

    // Client Information
    name: clientName,
    business_name: params.businessName.trim(),
    email: params.email.trim(),
    phone: params.phone.trim(),
    message:
      params.additionalMessage.trim() ||
      formatValue(answers["anything-else"]) ||
      formatValue(answers["tell-us"]),

    // Service & Project Type
    service: serviceName,
    project_type: formatValue(answers["project-type"] ?? answers["what-need"]),

    // Pricing & Lead Evaluation
    calculated_estimate: `₹${estimate.calculatedValue.toLocaleString("en-IN")}`,
    estimate_min: `₹${estimate.minAmount.toLocaleString("en-IN")}`,
    estimate_max: `₹${estimate.maxAmount.toLocaleString("en-IN")}`,
    client_estimate: estimate.range,
    requires_manual_review: estimate.requiresManualReview ? "Yes" : "No",

    // System Information
    submission_timestamp: new Date().toISOString(),
    page_url: typeof window !== "undefined" ? window.location.href : "",
    form_version: "2.0",
  };

  // Service-Specific Fields
  if (service === "web-design") {
    if (answers["pages"]) payload.pages = formatValue(answers["pages"]);
    if (answers["design-level"]) payload.design_level = formatValue(answers["design-level"]);
    if (answers["features"]) payload.features = formatValue(answers["features"]);
    if (answers["branding"]) payload.branding_status = formatValue(answers["branding"]);
    if (answers["has-references"]) payload.design_references = formatValue(answers["has-references"]);
  } else if (service === "web-development") {
    if (answers["pages"]) payload.pages = formatValue(answers["pages"]);
    if (answers["features"]) payload.features = formatValue(answers["features"]);
    if (answers["complexity"]) payload.development_complexity = formatValue(answers["complexity"]);
    if (answers["design-ready"]) payload.existing_design = formatValue(answers["design-ready"]);
    if (answers["timeline"]) payload.timeline = formatValue(answers["timeline"]);
  } else if (service === "branding") {
    if (answers["brand-stage"]) payload.brand_stage = formatValue(answers["brand-stage"]);
    if (answers["brand-materials"]) payload.brand_deliverables = formatValue(answers["brand-materials"]);
    if (answers["has-logo"]) payload.existing_logo = formatValue(answers["has-logo"]);
    if (answers["branding-level"]) payload.branding_level = formatValue(answers["branding-level"]);
    if (answers["has-references"]) payload.brand_references = formatValue(answers["has-references"]);
    if (answers["tell-us"]) payload.brand_description = formatValue(answers["tell-us"]);
  }

  return payload;
}

/**
 * Submits the questionnaire data to Formspree via AJAX without full page reload.
 */
export async function submitLead(
  input:
    | FormspreePayload
    | {
        service: string;
        answers: Record<string, string | string[] | null>;
        clientName: string;
        businessName: string;
        email: string;
        phone: string;
        additionalMessage: string;
        estimate: EstimateResult;
      },
): Promise<SubmitResult> {
  const payload =
    "answers" in input && "clientName" in input
      ? buildFormspreePayload(input)
      : (input as FormspreePayload);

  try {
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      return { ok: true };
    }

    const data = await response.json().catch(() => null);
    const errorMsg =
      typeof data?.error === "string"
        ? data.error
        : typeof data?.errors?.[0]?.message === "string"
        ? data.errors[0].message
        : "Something went wrong while submitting your enquiry. Please try again.";

    return { ok: false, error: errorMsg };
  } catch (err) {
    console.error("[submitLead] Network or submission error:", err);
    return {
      ok: false,
      error: "Something went wrong while submitting your enquiry. Please try again.",
    };
  }
}

/**
 * Legacy compatibility alias for existing callers.
 */
export function buildLeadPayload(params: {
  service: string;
  answers: Record<string, string | string[] | null>;
  clientName: string;
  businessName: string;
  email: string;
  phone: string;
  additionalMessage: string;
  estimate: EstimateResult;
}) {
  return buildFormspreePayload(params);
}
