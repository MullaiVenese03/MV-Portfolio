import type { Question, Answers, ClientDetails } from "./types";
import { validateEmail, validateRequired } from "../validation";

/**
 * Returns null if valid, or an error string if invalid.
 */
export function validateQuestion(question: Question, answers: Answers): string | null {
  if (!question.required) return null;
  const answer = answers[question.id];

  if (question.type === "single") {
    if (!answer || (typeof answer === "string" && !answer.trim())) {
      return "Please select an option to continue.";
    }
  } else if (question.type === "multi") {
    if (!answer || (Array.isArray(answer) && answer.length === 0)) {
      return "Please select at least one option to continue.";
    }
  } else if (question.type === "text") {
    if (!answer || (typeof answer === "string" && !answer.trim())) {
      return "This field is required.";
    }
  } else if (question.type === "conditional-text") {
    // Only validate the main choice (the text field is optional)
    if (!answer || (typeof answer === "string" && !answer.trim())) {
      return "Please select an option to continue.";
    }
  }

  return null;
}

export function validateClientDetails(details: ClientDetails): Partial<Record<keyof ClientDetails, string>> {
  const errors: Partial<Record<keyof ClientDetails, string>> = {};

  if (!validateRequired(details.fullName)) {
    errors.fullName = "Full name is required.";
  }
  if (!validateRequired(details.businessName)) {
    errors.businessName = "Business / Brand name is required.";
  }
  if (!validateEmail(details.email)) {
    errors.email = "Please enter a valid email address.";
  }

  return errors;
}
