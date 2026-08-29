// ─── Service Types ──────────────────────────────────────────────────────────────
export type ServiceKey = "web-design" | "web-development" | "branding";

// ─── Question Types ─────────────────────────────────────────────────────────────
export type QuestionType = "single" | "multi" | "text" | "conditional-text";

export interface QuestionOption {
  value: string;
  label: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: QuestionOption[];
  /** For conditional-text: which option value triggers the text field */
  conditionalTrigger?: string;
  conditionalLabel?: string;
  placeholder?: string;
  required?: boolean;
}

// ─── Answers ────────────────────────────────────────────────────────────────────
export type AnswerValue = string | string[] | null;

export interface Answers {
  [questionId: string]: AnswerValue;
}

// ─── Client Details ─────────────────────────────────────────────────────────────
export interface ClientDetails {
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  additionalMessage: string;
}

// ─── Estimate Result ────────────────────────────────────────────────────────────
export interface EstimateResult {
  /** Top badge / header */
  label: string;
  /** Human-readable service name (e.g. "Web Development") */
  serviceLabel: string;
  /** Human-readable project type name (e.g. "Business Website") */
  projectTypeLabel: string;
  /** Formatted investment range or starting price, e.g. "₹60,000 – ₹75,000" */
  range: string;
  /** Delivery time estimate */
  timeline: string;
  /** Raw internal calculated figure (for internal records / review) */
  calculatedValue: number;
  /** Client-facing minimum estimate (for analytics / records) */
  minAmount: number;
  /** Client-facing maximum estimate */
  maxAmount: number;
  /** Whether the estimate is a "Starting from" simple figure */
  isStartingFrom: boolean;
  /** Whether the estimate is 1L+ or highly custom */
  isHighComplexity: boolean;
  /** Internal review flag (included in lead payload) */
  requiresManualReview: boolean;
  /** Whether this is a placeholder */
  isPlaceholder: boolean;
  /** Helpful notes / context bullets */
  notes: string[];
}

// ─── Full Estimator State ───────────────────────────────────────────────────────
export interface EstimatorState {
  selectedService: ServiceKey | null;
  answers: Answers;
  clientDetails: ClientDetails;
  estimate: EstimateResult | null;
  isSubmitting: boolean;
  isSubmitted: boolean;
  submitError: string | null;
}

// ─── Submission Payload (Formspree Ready) ───────────────────────────────────────
export interface LeadPayload {
  // Formspree routing
  _subject: string;
  _gotcha?: string;
  // Client Information
  name: string;
  business_name: string;
  email: string;
  phone: string;
  message: string;
  // Service Information
  service: string;
  project_type: string;
  // Web Design / Development Fields
  pages?: string;
  design_level?: string;
  features?: string;
  branding_status?: string;
  design_references?: string;
  // Web Development Specific
  development_complexity?: string;
  existing_design?: string;
  timeline?: string;
  // Branding Specific
  brand_stage?: string;
  brand_deliverables?: string;
  existing_logo?: string;
  branding_level?: string;
  brand_references?: string;
  brand_description?: string;
  // Pricing Information
  calculated_estimate: string;
  estimate_min: string;
  estimate_max: string;
  client_estimate: string;
  requires_manual_review: string;
  // System Information
  submission_timestamp: string;
  page_url: string;
  form_version: string;
}

