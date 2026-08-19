import type { CSSProperties } from "react";

export const FONT = "'Plus Jakarta Sans', sans-serif";
/** Aquatico - used selectively for major display headings and branding text only */
export const FONT_DISPLAY = "'Aquatico', 'Plus Jakarta Sans', sans-serif";
export const MOTION_EASE = [0.22, 1, 0.36, 1] as const;
export const THEME_STORAGE_KEY = "mv-theme";
export const THEME_REVEAL_MS = 300;

export const TIMING = {
  hover: 0.18,
  button: 0.25,
  fade: 0.4,
  card: 0.45,
  scale: 0.5,
  reveal: 0.6,
  aboutImage: 0.8,
  counter: 1.2,
} as const;

/** Intro screen palette - mirrors portfolio light/dark themes */
export const introThemes = {
  light: {
    background:
      "radial-gradient(ellipse at 50% 40%, #FFFFFF 0%, #F1F5F9 60%, #E2E8F0 100%)",
    glowPrimary: "radial-gradient(circle, rgba(37,99,235,0.10) 0%, transparent 70%)",
    glowSecondary: "radial-gradient(circle, rgba(14,165,233,0.10) 0%, transparent 70%)",
    particle: "#2563EB",
    particleShadow: "rgba(37,99,235,0.28)",
    nameColor: "#0B0F19",
    titleColor: "#2563EB",
    divider: "linear-gradient(90deg, transparent, rgba(37,99,235,0.65), transparent)",
    pulseRing: "rgba(37,99,235,0.55)",
    pulseGlow:
      "radial-gradient(ellipse at center, rgba(37,99,235,0.35) 0%, transparent 65%)",
    logoShadow:
      "drop-shadow(0 12px 36px rgba(37,99,235,0.35)) drop-shadow(0 0 60px rgba(14,165,233,0.25))",
    skipBg: "rgba(37,99,235,0.08)",
    skipBorder: "rgba(37,99,235,0.25)",
    skipColor: "#2563EB",
  },
  dark: {
    background:
      "radial-gradient(ellipse at 50% 40%, #0C0C0E 0%, #111827 55%, #0F172A 100%)",
    glowPrimary: "radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)",
    glowSecondary: "radial-gradient(circle, rgba(14,165,233,0.14) 0%, transparent 70%)",
    particle: "#3B82F6",
    particleShadow: "rgba(59,130,246,0.35)",
    nameColor: "#F4F4F5",
    titleColor: "#60A5FA",
    divider: "linear-gradient(90deg, transparent, rgba(96,165,250,0.55), transparent)",
    pulseRing: "rgba(96,165,250,0.5)",
    pulseGlow:
      "radial-gradient(ellipse at center, rgba(59,130,246,0.4) 0%, transparent 65%)",
    logoShadow:
      "drop-shadow(0 12px 36px rgba(59,130,246,0.45)) drop-shadow(0 0 60px rgba(14,165,233,0.3))",
    skipBg: "rgba(59,130,246,0.12)",
    skipBorder: "rgba(59,130,246,0.3)",
    skipColor: "#60A5FA",
  },
} as const;

export function getIntroTheme(dark: boolean) {
  return dark ? introThemes.dark : introThemes.light;
}

/** Literal values for reveal overlay (not CSS vars - avoids mid-transition drift) */
export const themeOverlayColors = {
  light: "#F8FAFC",
  dark: "#0C0C0E",
} as const;

/** Static CSS variable references - colors animate when html[data-theme] changes */
export const themeVars = {
  bg: "var(--mv-bg)",
  section: "var(--mv-section)",
  sectionAlt: "var(--mv-section-alt)",
  surface: "var(--mv-surface)",
  card: "var(--mv-card)",
  cardHover: "var(--mv-card-hover)",
  border: "var(--mv-border)",
  borderStrong: "var(--mv-border-strong)",
  primary: "var(--mv-primary)",
  primaryHover: "var(--mv-primary-hover)",
  primaryMuted: "var(--mv-primary-muted)",
  primaryBorder: "var(--mv-primary-border)",
  primaryGlow: "var(--mv-primary-glow)",
  heading: "var(--mv-heading)",
  body: "var(--mv-body)",
  muted: "var(--mv-muted)",
  inverse: "var(--mv-inverse)",
  navBg: "var(--mv-nav-bg)",
  navBorder: "var(--mv-nav-border)",
  input: "var(--mv-input)",
  pill: "var(--mv-pill)",
  shadow: "var(--mv-shadow)",
  shadowLg: "var(--mv-shadow-lg)",
  line: "var(--mv-line)",
  accentPopular: "var(--mv-accent-popular)",
  dotRing: "var(--mv-dot-ring)",
  onPrimary: "var(--mv-on-primary)",
  footerGlow: "var(--mv-footer-glow)",
  revealOverlay: "var(--mv-reveal-overlay)",
} as const;

export type ThemeColors = typeof themeVars;

export const badgeStyle = (c: ThemeColors = themeVars): CSSProperties => ({
  fontFamily: FONT,
  fontWeight: 600,
  color: c.primary,
  background: c.primaryMuted,
  borderColor: c.primaryBorder,
});

export function getStoredDarkMode(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "dark") return true;
    if (stored === "light") return false;
  } catch {
    /* ignore */
  }
  return false;
}

export function applyDocumentTheme(dark: boolean) {
  const html = document.documentElement;
  html.setAttribute("data-theme", dark ? "dark" : "light");
  html.style.colorScheme = dark ? "dark" : "light";
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function getRevealRadius(origin: { x: number; y: number }): number {
  const { innerWidth, innerHeight } = window;
  return Math.ceil(
    Math.hypot(
      Math.max(origin.x, innerWidth - origin.x),
      Math.max(origin.y, innerHeight - origin.y),
    ),
  );
}
