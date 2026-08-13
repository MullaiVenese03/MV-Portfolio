import { useCallback, useEffect, useState } from "react";
import {
  applyDocumentTheme,
  getStoredDarkMode,
  prefersReducedMotion,
  THEME_STORAGE_KEY,
  themeOverlayColors,
} from "../theme";

export interface ThemeRevealState {
  id: number;
  origin: { x: number; y: number };
  toDark: boolean;
  color: string;
}

export function useTheme() {
  const [darkMode, setDarkMode] = useState(getStoredDarkMode);
  const [reveal, setReveal] = useState<ThemeRevealState | null>(null);

  useEffect(() => {
    applyDocumentTheme(getStoredDarkMode());
  }, []);

  const finishReveal = useCallback((toDark: boolean) => {
    setDarkMode(toDark);
    applyDocumentTheme(toDark);

    try {
      localStorage.setItem(THEME_STORAGE_KEY, toDark ? "dark" : "light");
    } catch {
      /* ignore */
    }

    setReveal(null);
  }, []);

  const toggleTheme = useCallback(
    (origin: { x: number; y: number }) => {
      const next = !darkMode;

      if (prefersReducedMotion()) {
        finishReveal(next);
        return;
      }

      setReveal({
        id: Date.now(),
        origin,
        toDark: next,
        color: next ? themeOverlayColors.dark : themeOverlayColors.light,
      });
    },
    [darkMode, finishReveal],
  );

  return { darkMode, toggleTheme, reveal, finishReveal };
}
