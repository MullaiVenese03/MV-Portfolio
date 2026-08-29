import type { ClientDetails as ClientDetailsType } from "../../lib/estimator/types";
import { FONT, FONT_DISPLAY, themeVars } from "../../theme";

interface ClientDetailsProps {
  details: ClientDetailsType;
  onChange: (field: keyof ClientDetailsType, value: string) => void;
  errors: Partial<Record<keyof ClientDetailsType, string>>;
}

export function ClientDetails({
  details,
  onChange,
  errors,
}: ClientDetailsProps) {
  const c = themeVars;

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="text-center">
        <h3
          className="text-xl sm:text-2xl md:text-3xl font-bold mb-1.5"
          style={{ fontFamily: FONT_DISPLAY, color: c.heading, fontWeight: 400 }}
        >
          Want to discuss your project?
        </h3>
        <p className="text-sm" style={{ fontFamily: FONT, color: c.body }}>
          Fill in your details and I&apos;ll get back to you with the next steps.
        </p>
      </div>

      <div className="flex flex-col gap-4">
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

        {/* Full Name */}
        <Field
          id="client-full-name"
          label="Full Name"
          required
          error={errors.fullName}
        >
          <input
            id="client-full-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Your full name"
            value={details.fullName}
            onChange={(e) => onChange("fullName", e.target.value)}
            className={`w-full px-4 py-3 rounded-xl text-sm outline-none portfolio-input ${
              errors.fullName ? "input-error" : ""
            }`}
            style={{ fontFamily: FONT }}
          />
        </Field>

        {/* Business Name */}
        <Field
          id="client-business-name"
          label="Business / Brand Name"
          required
          error={errors.businessName}
        >
          <input
            id="client-business-name"
            name="business_name"
            type="text"
            required
            autoComplete="organization"
            placeholder="Your business or brand name"
            value={details.businessName}
            onChange={(e) => onChange("businessName", e.target.value)}
            className={`w-full px-4 py-3 rounded-xl text-sm outline-none portfolio-input ${
              errors.businessName ? "input-error" : ""
            }`}
            style={{ fontFamily: FONT }}
          />
        </Field>

        {/* Email */}
        <Field
          id="client-email"
          label="Email Address"
          required
          error={errors.email}
        >
          <input
            id="client-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            value={details.email}
            onChange={(e) => onChange("email", e.target.value)}
            className={`w-full px-4 py-3 rounded-xl text-sm outline-none portfolio-input ${
              errors.email ? "input-error" : ""
            }`}
            style={{ fontFamily: FONT }}
          />
        </Field>

        {/* Phone */}
        <Field id="client-phone" label="Phone / WhatsApp" error={errors.phone}>
          <input
            id="client-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+91 98765 43210 (optional)"
            value={details.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            className={`w-full px-4 py-3 rounded-xl text-sm outline-none portfolio-input ${
              errors.phone ? "input-error" : ""
            }`}
            style={{ fontFamily: FONT }}
          />
        </Field>

        {/* Additional Message */}
        <Field id="client-message" label="Additional Message">
          <textarea
            id="client-message"
            name="message"
            rows={4}
            placeholder="Any additional notes or context about your project… (optional)"
            value={details.additionalMessage}
            onChange={(e) => onChange("additionalMessage", e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-sm resize-none outline-none portfolio-input"
            style={{ fontFamily: FONT, lineHeight: 1.65 }}
          />
        </Field>
      </div>

      <p className="text-xs text-center" style={{ fontFamily: FONT, color: c.muted }}>
        Your information is kept private and will only be used to respond to your enquiry.
      </p>
    </div>
  );
}

function Field({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  const c = themeVars;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="flex items-center gap-1">
        <span className="text-sm font-semibold" style={{ fontFamily: FONT, color: c.heading }}>
          {label}
        </span>
        {required && (
          <span className="text-red-500 text-xs leading-none">*</span>
        )}
        {!required && (
          <span className="text-xs ml-1" style={{ fontFamily: FONT, color: c.muted }}>
            (optional)
          </span>
        )}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-500 font-medium" style={{ fontFamily: FONT }}>
          {error}
        </p>
      )}
    </div>
  );
}

