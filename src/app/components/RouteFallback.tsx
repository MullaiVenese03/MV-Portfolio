import { themeVars } from "../theme";

/** Minimal route loading state — matches page background, no layout shift */
export function RouteFallback() {
  return (
    <div
      aria-hidden
      className="min-h-[50vh]"
      style={{ background: themeVars.bg }}
    />
  );
}
