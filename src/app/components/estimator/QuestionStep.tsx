import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { Question, AnswerValue } from "../../lib/estimator/types";
import { FONT, FONT_DISPLAY, themeVars } from "../../theme";

interface QuestionStepProps {
  question: Question;
  value: AnswerValue;
  onChange: (value: AnswerValue) => void;
  error?: string | null;
  serviceColor?: string;
}

export function QuestionStep({
  question,
  value,
  onChange,
  error,
  serviceColor = "var(--mv-primary)",
}: QuestionStepProps) {
  const c = themeVars;

  // Conditional text field value (stored alongside the selected option)
  const [conditionalText, setConditionalText] = useState<string>(() => {
    if (question.type === "conditional-text" && Array.isArray(value)) {
      return value[1] ?? "";
    }
    return "";
  });

  // Sync conditional text when value changes externally (e.g. navigating back)
  useEffect(() => {
    if (question.type === "conditional-text" && Array.isArray(value)) {
      setConditionalText(value[1] ?? "");
    }
  }, [question.id, question.type, value]);

  // ── Single-choice ──────────────────────────────────────────────────────────
  if (question.type === "single" || question.type === "conditional-text") {
    const selectedOption =
      question.type === "conditional-text" && Array.isArray(value)
        ? (value[0] as string)
        : (value as string | null);

    const showConditional =
      question.type === "conditional-text" &&
      selectedOption === question.conditionalTrigger;

    return (
      <div className="w-full flex flex-col gap-5">
        <QuestionHeading question={question} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {question.options?.map((opt) => {
            const isSelected = selectedOption === opt.value;
            return (
              <motion.button
                key={opt.value}
                type="button"
                id={`option-${question.id}-${opt.value}`}
                onClick={() => {
                  if (question.type === "conditional-text") {
                    onChange([opt.value, conditionalText]);
                  } else {
                    onChange(opt.value);
                  }
                }}
                whileHover={{ scale: 1.01, transition: { duration: 0.15 } }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 text-sm font-semibold"
                style={{
                  fontFamily: FONT,
                  background: isSelected ? `${serviceColor}15` : c.card,
                  border: isSelected ? `2px solid ${serviceColor}` : `1.5px solid ${c.border}`,
                  color: isSelected ? serviceColor : c.body,
                  boxShadow: isSelected ? `0 4px 14px -4px ${serviceColor}35` : "none",
                }}
                aria-pressed={isSelected}
              >
                <span
                  className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200"
                  style={{
                    borderColor: isSelected ? serviceColor : c.border,
                    background: isSelected ? serviceColor : "transparent",
                  }}
                >
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white block" />
                  )}
                </span>
                {opt.label}
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {showConditional && (
            <motion.div
              key="conditional"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <label className="flex flex-col gap-1.5">
                <span
                  className="text-sm font-semibold"
                  style={{ fontFamily: FONT, color: c.heading }}
                >
                  {question.conditionalLabel}
                </span>
                <textarea
                  rows={3}
                  placeholder={question.placeholder}
                  value={conditionalText}
                  onChange={(e) => {
                    const t = e.target.value;
                    setConditionalText(t);
                    onChange([selectedOption ?? "", t]);
                  }}
                  className="w-full px-4 py-3 rounded-xl text-sm resize-none outline-none portfolio-input"
                  style={{
                    fontFamily: FONT,
                    lineHeight: 1.65,
                  }}
                />
              </label>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <p className="text-xs text-red-500" style={{ fontFamily: FONT }}>
            {error}
          </p>
        )}
      </div>
    );
  }

  // ── Multi-choice ───────────────────────────────────────────────────────────
  if (question.type === "multi") {
    const selected = Array.isArray(value) ? value : [];

    const toggle = (v: string) => {
      const next = selected.includes(v)
        ? selected.filter((s) => s !== v)
        : [...selected, v];
      onChange(next);
    };

    return (
      <div className="w-full flex flex-col gap-5">
        <QuestionHeading question={question} hint="Select all that apply." />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {question.options?.map((opt) => {
            const isSelected = selected.includes(opt.value);
            return (
              <motion.button
                key={opt.value}
                type="button"
                id={`option-${question.id}-${opt.value}`}
                onClick={() => toggle(opt.value)}
                whileHover={{ scale: 1.01, transition: { duration: 0.15 } }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 text-sm font-semibold"
                style={{
                  fontFamily: FONT,
                  background: isSelected ? `${serviceColor}15` : c.card,
                  border: isSelected ? `2px solid ${serviceColor}` : `1.5px solid ${c.border}`,
                  color: isSelected ? serviceColor : c.body,
                  boxShadow: isSelected ? `0 4px 14px -4px ${serviceColor}35` : "none",
                }}
                aria-pressed={isSelected}
              >
                <span
                  className="w-4 h-4 rounded-sm border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200"
                  style={{
                    borderColor: isSelected ? serviceColor : c.border,
                    background: isSelected ? serviceColor : "transparent",
                  }}
                >
                  {isSelected && (
                    <span className="text-white text-[9px] font-black leading-none">✓</span>
                  )}
                </span>
                {opt.label}
              </motion.button>
            );
          })}
        </div>

        {error && (
          <p className="text-xs text-red-500" style={{ fontFamily: FONT }}>
            {error}
          </p>
        )}
      </div>
    );
  }

  // ── Text / paragraph ───────────────────────────────────────────────────────
  if (question.type === "text") {
    return (
      <div className="w-full flex flex-col gap-5">
        <QuestionHeading question={question} />

        <label className="flex flex-col gap-2">
          <textarea
            id={`question-${question.id}`}
            rows={5}
            placeholder={question.placeholder}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-3.5 rounded-xl text-sm resize-none outline-none portfolio-input"
            style={{
              fontFamily: FONT,
              lineHeight: 1.65,
            }}
          />
          {!question.required && (
            <span className="text-xs" style={{ fontFamily: FONT, color: c.muted }}>
              Optional — feel free to skip.
            </span>
          )}
        </label>


        {error && (
          <p className="text-xs text-red-500" style={{ fontFamily: FONT }}>
            {error}
          </p>
        )}
      </div>
    );
  }

  return null;
}

// ── Local helper ───────────────────────────────────────────────────────────────
function QuestionHeading({
  question,
  hint,
}: {
  question: Question;
  hint?: string;
}) {
  const c = themeVars;
  return (
    <div className="flex flex-col gap-1">
      <h3
        className="text-lg sm:text-xl md:text-2xl font-bold leading-snug"
        style={{ fontFamily: FONT_DISPLAY, color: c.heading, fontWeight: 400 }}
      >
        {question.question}
        {!question.required && (
          <span
            className="ml-2 text-xs font-medium align-middle"
            style={{ fontFamily: "inherit", color: c.muted }}
          >
            (optional)
          </span>
        )}
      </h3>
      {hint && (
        <p className="text-xs" style={{ fontFamily: FONT, color: c.muted }}>
          {hint}
        </p>
      )}
    </div>
  );
}
