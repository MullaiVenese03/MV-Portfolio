import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "lenis/react";
import { X } from "lucide-react";
import type {
  ServiceKey,
  Answers,
  AnswerValue,
  ClientDetails as ClientDetailsType,
} from "../../lib/estimator/types";
import { webDesignQuestions } from "../../data/estimator/webDesignQuestions";
import { webDevQuestions } from "../../data/estimator/webDevQuestions";
import { brandingQuestions } from "../../data/estimator/brandingQuestions";
import { calculateEstimate } from "../../lib/estimator/calculateEstimate";
import { submitLead, buildLeadPayload, FORMSPREE_ENDPOINT } from "../../lib/estimator/submitLead";
import { validateQuestion, validateClientDetails } from "../../lib/estimator/validateEstimator";
import { ProgressIndicator } from "./ProgressIndicator";
import { ServiceSelector } from "./ServiceSelector";
import { QuestionStep } from "./QuestionStep";
import { EstimateSummary } from "./EstimateSummary";
import { ClientDetails } from "./ClientDetails";
import { SuccessScreen } from "./SuccessScreen";
import { FONT, themeVars } from "../../theme";

// ── Constants ──────────────────────────────────────────────────────────────────

const SERVICE_COLORS: Record<ServiceKey, string> = {
  "web-design": "#0891B2",
  "web-development": "#2563EB",
  branding: "#059669",
};

const QUESTION_SETS: Record<ServiceKey, typeof webDesignQuestions> = {
  "web-design": webDesignQuestions,
  "web-development": webDevQuestions,
  branding: brandingQuestions,
};

const EMPTY_CLIENT: ClientDetailsType = {
  fullName: "",
  businessName: "",
  email: "",
  phone: "",
  additionalMessage: "",
};

// ── Step indices ───────────────────────────────────────────────────────────────
// Step 0 = Service Selection
// Step 1..N = Service questions (N = questions.length)
// Step N+1 = Estimate Summary
// Step N+2 = Client Details
// Step N+3 = Success

interface ProjectEstimatorProps {
  isOpen: boolean;
  initialService?: ServiceKey | null;
  onClose: () => void;
}

export function ProjectEstimator({
  isOpen,
  initialService,
  onClose,
}: ProjectEstimatorProps) {
  const c = themeVars;
  const scrollRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  // ── State ──────────────────────────────────────────────────────────────────
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [selectedService, setSelectedService] = useState<ServiceKey | null>(
    initialService ?? null,
  );
  const [answers, setAnswers] = useState<Answers>({});
  const [clientDetails, setClientDetails] =
    useState<ClientDetailsType>(EMPTY_CLIENT);
  const [stepError, setStepError] = useState<string | null>(null);
  const [clientErrors, setClientErrors] = useState<
    Partial<Record<keyof ClientDetailsType, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Pre-seed service if opened from a specific card
  useEffect(() => {
    if (isOpen && initialService) {
      setSelectedService(initialService);
    }
  }, [isOpen, initialService]);

  // Lock background/body scrolling and pause Lenis smooth scroll while modal is open
  useEffect(() => {
    if (isOpen) {
      lenis?.stop();
      const prevBodyOverflow = document.body.style.overflow;
      const prevHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      return () => {
        lenis?.start();
        document.body.style.overflow = prevBodyOverflow;
        document.documentElement.style.overflow = prevHtmlOverflow;
      };
    }
  }, [isOpen, lenis]);

  // Scroll content area to top on every step change
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  // Reset on close
  const handleClose = useCallback(() => {
    onClose();
    // Delay reset so exit animation can play
    setTimeout(() => {
      setStep(0);
      setDirection(1);
      setSelectedService(initialService ?? null);
      setAnswers({});
      setClientDetails(EMPTY_CLIENT);
      setStepError(null);
      setClientErrors({});
      setIsSubmitting(false);
      setSubmitError(null);
      setIsSuccess(false);
    }, 400);
  }, [onClose, initialService]);

  // ── Derived helpers ────────────────────────────────────────────────────────
  const questions = useMemo(
    () => (selectedService ? QUESTION_SETS[selectedService] : []),
    [selectedService],
  );
  const TOTAL_STEPS = questions.length + 3; // service + questions + estimate + client
  const estimateStep = questions.length + 1;
  const clientStep = questions.length + 2;
  const successStep = questions.length + 3;

  const serviceColor = selectedService
    ? SERVICE_COLORS[selectedService]
    : "var(--mv-primary)";

  // Steps for progress bar: service=1, questions=2..N+1, estimate=N+2, client=N+3
  const progressStep = step; // 0-indexed, but display as 1-indexed
  const progressTotal = TOTAL_STEPS;

  // ── Submission ─────────────────────────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    if (!selectedService) return;
    const estimate = calculateEstimate(selectedService, answers);

    setIsSubmitting(true);
    setSubmitError(null);

    const payload = buildLeadPayload({
      service: selectedService,
      answers,
      clientName: clientDetails.fullName,
      businessName: clientDetails.businessName,
      email: clientDetails.email,
      phone: clientDetails.phone,
      additionalMessage: clientDetails.additionalMessage,
      estimate,
    });

    const result = await submitLead(payload);
    setIsSubmitting(false);

    if (!result.ok) {
      setSubmitError(result.error);
      return;
    }

    setDirection(1);
    setStep(successStep);
    setIsSuccess(true);
  }, [selectedService, answers, clientDetails, successStep]);

  // ── Navigation ─────────────────────────────────────────────────────────────
  const goNext = useCallback(() => {
    setStepError(null);

    // Step 0: service selection
    if (step === 0) {
      if (!selectedService) {
        setStepError("Please select a service to continue.");
        return;
      }
      setDirection(1);
      setStep(1);
      return;
    }

    // Step 1..N: question steps
    if (step >= 1 && step <= questions.length) {
      const question = questions[step - 1];
      const answer = answers[question.id] ?? null;
      const error = validateQuestion(question, { ...answers, [question.id]: answer });
      if (error) {
        setStepError(error);
        return;
      }
      setDirection(1);
      setStep((s) => s + 1);
      return;
    }

    // Estimate step → client details
    if (step === estimateStep) {
      setDirection(1);
      setStep(clientStep);
      return;
    }

    // Client details → submit
    if (step === clientStep) {
      const errors = validateClientDetails(clientDetails);
      if (Object.keys(errors).length > 0) {
        setClientErrors(errors);
        return;
      }
      setClientErrors({});
      handleSubmit();
    }
  }, [
    step,
    selectedService,
    questions,
    answers,
    clientDetails,
    estimateStep,
    clientStep,
    handleSubmit,
  ]);

  const goBack = useCallback(() => {
    setStepError(null);
    setClientErrors({});
    if (step > 0) {
      setDirection(-1);
      setStep((s) => s - 1);
    }
  }, [step]);

  // ── Estimate (memoised) ────────────────────────────────────────────────────
  const estimate =
    selectedService && step >= estimateStep
      ? calculateEstimate(selectedService, answers)
      : null;

  // ── Button labels ──────────────────────────────────────────────────────────
  const nextLabel = (() => {
    if (isSubmitting) return "Submitting\u2026";
    if (step === clientStep) return "Submit Enquiry";
    if (step === estimateStep) return "Continue";
    return "Next";
  })();

  const isLastInputStep = step === clientStep;
  const isSuccessStep = step === successStep;
  const showProgress = step > 0 && !isSuccessStep;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="estimator-overlay"
          id="project-estimator-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Project enquiry questionnaire"
          data-lenis-prevent
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-hidden"
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
          onWheel={(e) => {
            // Stop wheel events on overlay background from leaking to page
            e.stopPropagation();
          }}
        >
          <motion.form
            key="estimator-panel"
            action={FORMSPREE_ENDPOINT}
            method="POST"
            onSubmit={(e) => {
              e.preventDefault();
              if (step === clientStep) {
                goNext();
              }
            }}
            data-lenis-prevent
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 340, damping: 32 }}
            className="relative w-full sm:max-w-2xl md:max-w-3xl flex flex-col rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl"
            style={{
              background: c.bg,
              border: `1.5px solid ${c.border}`,
              maxHeight: "min(90vh, 780px)",
              height: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Formspree honeypot spam protection (visually hidden, excluded from tab navigation) */}
            <input
              type="text"
              name="_gotcha"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              style={{
                position: "absolute",
                width: "1px",
                height: "1px",
                padding: 0,
                margin: "-1px",
                overflow: "hidden",
                clip: "rect(0, 0, 0, 0)",
                whiteSpace: "nowrap",
                border: 0,
                opacity: 0,
                pointerEvents: "none",
              }}
            />
            <input
              type="hidden"
              name="_subject"
              value={`New Project Enquiry | ${selectedService || ""} | ${clientDetails.fullName || "Client"}`}
            />
            <input type="hidden" name="service" value={selectedService || ""} />
            <input
              type="hidden"
              name="calculated_estimate"
              value={estimate ? `₹${estimate.calculatedValue.toLocaleString("en-IN")}` : ""}
            />
            <input
              type="hidden"
              name="estimate_min"
              value={estimate ? `₹${estimate.minAmount.toLocaleString("en-IN")}` : ""}
            />
            <input
              type="hidden"
              name="estimate_max"
              value={estimate ? `₹${estimate.maxAmount.toLocaleString("en-IN")}` : ""}
            />
            <input type="hidden" name="client_estimate" value={estimate?.range || ""} />
            <input
              type="hidden"
              name="requires_manual_review"
              value={estimate?.requiresManualReview ? "Yes" : "No"}
            />
            <input type="hidden" name="submission_timestamp" value={new Date().toISOString()} />
            <input
              type="hidden"
              name="page_url"
              value={typeof window !== "undefined" ? window.location.href : ""}
            />
            <input type="hidden" name="form_version" value="2.0" />
            {/* ── Header bar (Fixed at top of modal) ────────────────────────── */}
            <div
              className="shrink-0 flex items-center justify-between px-5 sm:px-8 py-4 sm:py-5 z-20"
              style={{
                borderBottom: `1px solid ${c.border}`,
                background: c.card,
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
                  style={{ background: `${serviceColor}18`, border: `1.5px solid ${serviceColor}35` }}
                >
                  {selectedService === "web-design"
                    ? "🎨"
                    : selectedService === "web-development"
                    ? "💻"
                    : selectedService === "branding"
                    ? "✏️"
                    : "✨"}
                </div>
                <span
                  className="text-sm font-bold"
                  style={{ fontFamily: FONT, color: c.heading }}
                >
                  Project Enquiry
                </span>
              </div>
              <button
                type="button"
                id="estimator-close-btn"
                onClick={handleClose}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:opacity-80 hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 cursor-pointer"
                style={{
                  color: c.body,
                  background: c.surface,
                  border: `1px solid ${c.border}`,
                }}
                aria-label="Close questionnaire"
              >
                <X size={16} strokeWidth={2.2} className="shrink-0" />
              </button>
            </div>

            {/* ── Progress (Fixed below header) ─────────────────────────────── */}
            {showProgress && (
              <div
                className="shrink-0 px-5 sm:px-8 py-3 z-10"
                style={{ borderBottom: `1px solid ${c.border}`, background: c.bg }}
              >
                <ProgressIndicator
                  currentStep={progressStep}
                  totalSteps={progressTotal}
                  serviceColor={serviceColor}
                />
              </div>
            )}

            {/* ── Scrollable content (Independently scrollable) ─────────────── */}
            <div
              ref={scrollRef}
              data-lenis-prevent
              className="flex-1 min-h-0 overflow-y-auto px-5 sm:px-8 py-6 sm:py-8 overscroll-contain"
              style={{
                overscrollBehavior: "contain",
                WebkitOverflowScrolling: "touch",
              }}
              tabIndex={0}
            >
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={step}
                  custom={direction}
                  variants={{
                    enter: (dir: number) => ({
                      x: dir > 0 ? 48 : -48,
                      opacity: 0,
                    }),
                    center: { x: 0, opacity: 1 },
                    exit: (dir: number) => ({
                      x: dir > 0 ? -48 : 48,
                      opacity: 0,
                    }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Step 0: Service Selection */}
                  {step === 0 && (
                    <ServiceSelector
                      selected={selectedService}
                      onSelect={(k) => {
                        setSelectedService(k);
                        setStepError(null);
                        // Reset answers when service changes
                        setAnswers({});
                      }}
                      error={stepError}
                    />
                  )}

                  {/* Steps 1..N: Question steps */}
                  {step >= 1 && step <= questions.length && (
                    <QuestionStep
                      key={`${selectedService}-${step}`}
                      question={questions[step - 1]}
                      value={answers[questions[step - 1].id] ?? null}
                      onChange={(val: AnswerValue) => {
                        setAnswers((prev) => ({
                          ...prev,
                          [questions[step - 1].id]: val,
                        }));
                        setStepError(null);
                      }}
                      error={stepError}
                      serviceColor={serviceColor}
                    />
                  )}

                  {/* Estimate summary */}
                  {step === estimateStep && estimate && selectedService && (
                    <EstimateSummary estimate={estimate} service={selectedService} />
                  )}

                  {/* Client details */}
                  {step === clientStep && (
                    <ClientDetails
                      details={clientDetails}
                      onChange={(field, value) => {
                        setClientDetails((prev) => ({ ...prev, [field]: value }));
                        setClientErrors((prev) => ({ ...prev, [field]: undefined }));
                      }}
                      errors={clientErrors}
                    />
                  )}

                  {/* Success */}
                  {step === successStep && isSuccess && (
                    <SuccessScreen onClose={handleClose} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ── Footer nav ───────────────────────────────────────────────── */}
            {!isSuccessStep && (
              <div
                className="shrink-0 px-5 sm:px-8 py-4 sm:py-5 flex items-center gap-3"
                style={{
                  borderTop: `1px solid ${c.border}`,
                  background: c.card,
                }}
              >
                {step > 0 && (
                  <button
                    type="button"
                    id="estimator-back-btn"
                    onClick={goBack}
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-80 focus:outline-none focus-visible:ring-2 disabled:opacity-40"
                    style={{
                      fontFamily: FONT,
                      background: c.surface,
                      border: `1.5px solid ${c.border}`,
                      color: c.body,
                    }}
                  >
                    ← Back
                  </button>
                )}

                <button
                  type="button"
                  id="estimator-next-btn"
                  onClick={goNext}
                  disabled={isSubmitting}
                  className="ml-auto flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:opacity-90 focus:outline-none focus-visible:ring-2 disabled:opacity-60"
                  style={{
                    fontFamily: FONT,
                    background: serviceColor,
                    boxShadow: `0 4px 16px -4px ${serviceColor}55`,
                  }}
                >
                  {isSubmitting && (
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  )}
                  {nextLabel}
                  {!isLastInputStep && !isSubmitting && (
                    <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                      →
                    </span>
                  )}
                </button>
              </div>
            )}

            {/* Submit error */}
            {submitError && (
              <div
                className="shrink-0 px-5 sm:px-8 py-3 text-xs text-red-500 font-medium text-center"
                style={{ fontFamily: FONT, borderTop: `1px solid ${c.border}` }}
              >
                {submitError}
              </div>
            )}
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
