/**
 * Global Email Validation Pattern & Helpers
 * Enforces standard email formatting across all application forms:
 * - Local part allows alphanumeric, dots, underscores, percents, pluses, minuses
 * - @ symbol
 * - Domain name with valid labels
 * - TLD with at least 2 characters (e.g. .com, .io, .org, .co.uk)
 */

export const GLOBAL_EMAIL_PATTERN =
  "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";

export const GLOBAL_EMAIL_REGEX =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function validateEmail(email: string): boolean {
  if (!email) return false;
  return GLOBAL_EMAIL_REGEX.test(email.trim());
}

export function validateRequired(value: string): boolean {
  return value.trim().length > 0;
}
