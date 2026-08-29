import { motion } from "motion/react";
import type { EstimateResult, ServiceKey } from "../../lib/estimator/types";
import { FONT, FONT_DISPLAY, themeVars } from "../../theme";

const SERVICE_COLORS: Record<ServiceKey, string> = {
  "web-design": "#0891B2",
  "web-development": "#2563EB",
  branding: "#059669",
};

interface EstimateSummaryProps {
  estimate: EstimateResult;
  service: ServiceKey;
}

export function EstimateSummary({ estimate, service }: EstimateSummaryProps) {
  const c = themeVars;
  const color = SERVICE_COLORS[service];

  return (
    <div className="w-full flex flex-col gap-5 sm:gap-6">
      {/* Top Header */}
      <div className="text-center flex flex-col items-center">
        <span
          className="inline-block px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-2 border"
          style={{
            fontFamily: FONT,
            background: `${color}15`,
            borderColor: `${color}35`,
            color,
          }}
        >
          {estimate.label}
        </span>
        <h3
          className="text-xl sm:text-2xl md:text-3xl font-bold"
          style={{ fontFamily: FONT_DISPLAY, color: c.heading, fontWeight: 400 }}
        >
          {estimate.serviceLabel}
        </h3>
        <p className="text-sm font-semibold mt-1" style={{ fontFamily: FONT, color }}>
          {estimate.projectTypeLabel}
        </p>
      </div>

      {/* Main estimate card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative rounded-2xl p-6 sm:p-8 text-center flex flex-col items-center justify-center gap-2"
        style={{
          background: `${color}0D`,
          border: `2px solid ${color}35`,
          boxShadow: `0 12px 32px -8px ${color}25`,
        }}
      >
        <span
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ fontFamily: FONT, color: c.muted }}
        >
          Estimated Investment
        </span>

        <p
          className="text-2xl sm:text-3xl md:text-4xl font-bold my-1"
          style={{ fontFamily: FONT_DISPLAY, color: c.heading, fontWeight: 400, letterSpacing: "0.01em" }}
        >
          {estimate.range}
        </p>

        <p className="text-xs sm:text-sm font-medium" style={{ fontFamily: FONT, color: c.body }}>
          Based on the requirements you&apos;ve provided.
        </p>

        <div
          className="mt-2 px-3 py-1 rounded-lg text-xs font-semibold"
          style={{
            fontFamily: FONT,
            background: `${color}18`,
            color,
          }}
        >
          {estimate.timeline}
        </div>
      </motion.div>

      {/* Secondary Disclaimer */}
      <div
        className="rounded-xl p-4 text-center"
        style={{
          background: c.surface,
          border: `1px solid ${c.border}`,
        }}
      >
        <p className="text-xs leading-relaxed" style={{ fontFamily: FONT, color: c.muted }}>
          <strong style={{ color: c.heading }}>Disclaimer:</strong> This is an initial estimate based
          on the information provided and is not a final quotation. Final pricing and timeline will
          be confirmed after a detailed review of your project requirements.
        </p>
      </div>
    </div>
  );
}
