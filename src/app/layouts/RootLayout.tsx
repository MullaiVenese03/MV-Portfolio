import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router";
import { AnimatePresence } from "motion/react";
import { ReactLenis } from "lenis/react";
import { SignatureIntro } from "../components/SignatureIntro";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { ThemeReveal } from "../components/ThemeReveal";
import { SkipLink } from "../components/SkipLink";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { RouteFallback } from "../components/RouteFallback";
import { useTheme } from "../hooks/useTheme";
import { FONT, themeVars } from "../theme";
import { scrollToSection } from "../lib/scroll";

type IntroStep = "logo" | "done";

export function RootLayout() {
  const { darkMode, toggleTheme, reveal, finishReveal } = useTheme();
  const location = useLocation();
  const portfolioRef = useRef<HTMLDivElement>(null);

  const [introStep, setIntroStep] = useState<IntroStep>(() => {
    try {
      return sessionStorage.getItem("intro_played") === "true" ? "done" : "logo";
    } catch {
      return "logo";
    }
  });

  const isDone = introStep === "done";

  const handleLogoComplete = useCallback(() => {
    try {
      sessionStorage.setItem("intro_played", "true");
    } catch (e) {
      console.warn("sessionStorage is not available:", e);
    }
    setIntroStep("done");
  }, []);

  useEffect(() => {
    document.body.style.overflow = isDone ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDone]);

  useEffect(() => {
    document.body.style.fontFamily = FONT;
  }, []);

  useEffect(() => {
    if (location.pathname === "/" && location.hash) {
      const id = location.hash.slice(1);
      requestAnimationFrame(() => {
        scrollToSection(id);
      });
      return;
    }
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const el = portfolioRef.current;
    if (!el) return;
    if (!isDone) {
      el.setAttribute("inert", "");
      el.setAttribute("aria-hidden", "true");
    } else {
      el.removeAttribute("inert");
      el.removeAttribute("aria-hidden");
    }
  }, [isDone]);

  return (
    <ReactLenis root options={{ lerp: 0.1, smoothWheel: true }}>
      <SkipLink />
      <div
        style={{
          background: themeVars.bg,
          minHeight: "100vh",
          fontFamily: FONT,
          overflowX: "clip",
        }}
      >
        <ThemeReveal reveal={reveal} onComplete={finishReveal} />

        <AnimatePresence mode="wait">
          {introStep === "logo" && (
            <SignatureIntro key="intro-logo" darkMode={darkMode} onComplete={handleLogoComplete} />
          )}
        </AnimatePresence>

        <div
          ref={portfolioRef}
          style={{
            opacity: isDone ? 1 : 0,
            transition: "opacity 850ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <Navbar darkMode={darkMode} onToggleTheme={toggleTheme} heroReady={isDone} />
          <main id="main-content" tabIndex={-1}>
            <ErrorBoundary>
              <Suspense fallback={<RouteFallback />}>
                {isDone && <Outlet context={{ darkMode, heroReady: isDone }} />}
              </Suspense>
            </ErrorBoundary>
          </main>
          <Footer darkMode={darkMode} />
        </div>
      </div>
    </ReactLenis>
  );
}
