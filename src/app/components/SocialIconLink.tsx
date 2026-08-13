import type { CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import { themeVars } from "../theme";

type SocialIconVariant = "default" | "footer" | "contact";

interface SocialIconLinkProps {
  icon: LucideIcon;
  href: string;
  label: string;
  color: string;
  darkColor?: string;
  darkMode?: boolean;
  variant?: SocialIconVariant;
  size?: number;
}

const variantClasses: Record<SocialIconVariant, string> = {
  default:
    "w-11 h-11 rounded-full border transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:rotate-3 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 hover:text-blue-500",
  footer:
    "w-10 h-10 rounded-xl border transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:rotate-3 hover:shadow-lg hover:shadow-blue-500/25 hover:bg-blue-500/15",
  contact:
    "w-10 h-10 rounded-xl border transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:rotate-3 hover:shadow-lg hover:shadow-blue-500/20 hover:border-blue-500/50 hover:bg-blue-500/10",
};

export function SocialIconLink({
  icon: Icon,
  href,
  label,
  color,
  darkColor,
  darkMode = false,
  variant = "default",
  size = 17,
}: SocialIconLinkProps) {
  const isExternal = !href.startsWith("mailto:");
  const resolvedColor =
    label === "GitHub" && darkMode ? (darkColor ?? "#E2E8F0") : color;

  const variantStyles: Record<SocialIconVariant, CSSProperties> = {
    default: {
      background: themeVars.card,
      borderColor: themeVars.border,
      color: resolvedColor,
      boxShadow: themeVars.shadow,
    },
    footer: {
      background: themeVars.card,
      borderColor: themeVars.border,
      color: resolvedColor,
      boxShadow: themeVars.shadow,
    },
    contact: {
      background: themeVars.pill,
      borderColor: themeVars.border,
      color: resolvedColor,
    },
  };

  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      aria-label={label}
      className={`flex items-center justify-center ${variantClasses[variant]}`}
      style={variantStyles[variant]}
    >
      <Icon size={size} />
    </a>
  );
}
