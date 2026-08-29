import { motion } from "motion/react";
import type { ServiceKey } from "../../lib/estimator/types";
import { FONT, FONT_DISPLAY, themeVars } from "../../theme";

interface ServiceOption {
  key: ServiceKey;
  icon: string;
  title: string;
  desc: string;
  color: string;
  bg: string;
  border: string;
}

const serviceOptions: ServiceOption[] = [
  {
    key: "web-design",
    icon: "🎨",
    title: "Web Design",
    desc: "UI/UX design, wireframes, Figma prototypes, and pixel-perfect visual design.",
    color: "#0891B2",
    bg: "rgba(8,145,178,0.10)",
    border: "rgba(8,145,178,0.25)",
  },
  {
    key: "web-development",
    icon: "💻",
    title: "Web Development",
    desc: "Custom websites, landing pages, and full-stack web applications.",
    color: "#2563EB",
    bg: "rgba(37,99,235,0.10)",
    border: "rgba(37,99,235,0.25)",
  },
  {
    key: "branding",
    icon: "✏️",
    title: "Branding & Logo Design",
    desc: "Brand identities, logo design, color palettes, and brand guidelines.",
    color: "#059669",
    bg: "rgba(5,150,105,0.10)",
    border: "rgba(5,150,105,0.25)",
  },
];

interface ServiceSelectorProps {
  selected: ServiceKey | null;
  onSelect: (key: ServiceKey) => void;
  error?: string | null;
}

export function ServiceSelector({ selected, onSelect, error }: ServiceSelectorProps) {
  const c = themeVars;

  return (
    <div className="w-full flex flex-col gap-4 sm:gap-5">
      <div className="text-center mb-1">
        <h3
          className="text-xl sm:text-2xl md:text-3xl font-bold mb-1.5"
          style={{ fontFamily: FONT_DISPLAY, color: c.heading, fontWeight: 400 }}
        >
          What are you looking for?
        </h3>
        <p className="text-sm" style={{ fontFamily: FONT, color: c.body }}>
          Select the service that best matches your project.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {serviceOptions.map((svc, i) => {
          const isSelected = selected === svc.key;
          return (
            <motion.button
              key={svc.key}
              type="button"
              id={`service-option-${svc.key}`}
              onClick={() => onSelect(svc.key)}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.35 }}
              whileHover={{ y: -3, transition: { duration: 0.18 } }}
              whileTap={{ scale: 0.98 }}
              className="relative flex flex-col items-start gap-3 p-5 sm:p-6 rounded-2xl text-left w-full transition-all duration-300 focus:outline-none focus-visible:ring-2"
              style={{
                background: isSelected ? svc.bg : c.card,
                border: isSelected ? `2px solid ${svc.color}` : `1.5px solid ${c.border}`,
                boxShadow: isSelected ? `0 8px 24px -6px ${svc.color}35` : "none",
              }}
              aria-pressed={isSelected}
            >
              {isSelected && (
                <span
                  className="absolute top-3.5 right-3.5 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: svc.color }}
                >
                  ✓
                </span>
              )}

              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ background: svc.bg, border: `1.5px solid ${svc.border}` }}
              >
                {svc.icon}
              </div>

              <div>
                <p
                  className="font-bold text-base mb-1"
                  style={{ fontFamily: FONT, color: isSelected ? svc.color : c.heading }}
                >
                  {svc.title}
                </p>
                <p
                  className="text-xs leading-relaxed"
                  style={{ fontFamily: FONT, color: c.body }}
                >
                  {svc.desc}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>

      {error && (
        <p className="text-xs text-red-500 text-center" style={{ fontFamily: FONT }}>
          {error}
        </p>
      )}
    </div>
  );
}
