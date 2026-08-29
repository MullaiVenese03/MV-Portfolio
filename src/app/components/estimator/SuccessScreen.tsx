import { motion } from "motion/react";
import { FONT, FONT_DISPLAY, themeVars } from "../../theme";

interface SuccessScreenProps {
  onClose: () => void;
}

export function SuccessScreen({ onClose }: SuccessScreenProps) {
  const c = themeVars;

  return (
    <div className="w-full flex flex-col items-center justify-center gap-6 py-8 text-center">
      {/* Animated tick */}
      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 340, damping: 24, delay: 0.1 }}
        className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
        style={{
          background: "rgba(5,150,105,0.12)",
          border: "2px solid rgba(5,150,105,0.4)",
        }}
      >
        🎉
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        className="flex flex-col items-center gap-2"
      >
        <h3
          className="text-2xl sm:text-3xl font-bold"
          style={{ fontFamily: FONT_DISPLAY, color: c.heading, fontWeight: 400 }}
        >
          Thank You for Your Enquiry!
        </h3>
        <p className="text-sm max-w-md" style={{ fontFamily: FONT, color: c.body, lineHeight: 1.7 }}>
          Your project details have been successfully submitted. I&apos;ll review your requirements
          and get back to you with the next steps.
        </p>
      </motion.div>

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="rounded-xl p-4 max-w-md w-full"
        style={{
          background: c.surface,
          border: `1px solid ${c.border}`,
        }}
      >
        <p className="text-xs leading-relaxed" style={{ fontFamily: FONT, color: c.body }}>
          <strong style={{ color: c.heading }}>Please note:</strong> The estimate shown is an
          initial estimate based on the information provided. Final pricing will be confirmed after
          a detailed review of your project requirements.
        </p>
      </motion.div>

      {/* CTA */}
      <motion.button
        type="button"
        id="success-back-to-portfolio"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.35 }}
        onClick={onClose}
        whileHover={{ scale: 1.03, transition: { duration: 0.15 } }}
        whileTap={{ scale: 0.97 }}
        className="px-8 py-3.5 rounded-2xl text-sm font-bold text-white transition-all duration-200"
        style={{
          fontFamily: FONT,
          background: "var(--mv-primary)",
          boxShadow: "0 8px 24px -6px var(--mv-primary-glow)",
        }}
      >
        Back to Portfolio
      </motion.button>
    </div>
  );
}
