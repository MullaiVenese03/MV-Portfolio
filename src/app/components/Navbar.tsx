import { useState, useEffect, useId, useCallback, type MouseEvent } from "react";
import { motion } from "motion/react";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import mvLogo from "../../imports/MV-Logo.svg";
import { navSections } from "../data/navigation";
import { useScrollSpy } from "../hooks/useScrollSpy";
import { FONT, FONT_DISPLAY, themeVars } from "../theme";
import { scrollToSection } from "../lib/scroll";

interface NavbarProps {
  darkMode: boolean;
  onToggleTheme: (origin: { x: number; y: number }) => void;
  heroReady?: boolean;
}

const sectionIds = navSections.map((section) => section.id);

export function Navbar({ darkMode, onToggleTheme, heroReady = false }: NavbarProps) {
  const c = themeVars;

  const handleThemeToggle = (event: MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    onToggleTheme({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
  };

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === "/";
  const isProjectsPage = location.pathname.startsWith("/projects");
  const activeSection = useScrollSpy(isHome ? sectionIds : []);

  // Determine active link ID: if on /projects, set "projects"; otherwise scrollSpy or "home"
  const activeId = isProjectsPage ? "projects" : (activeSection || "home");

  const mobileNavId = useId();
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMobile();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen, closeMobile]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNav = (id: string) => {
    if (location.pathname !== "/") {
      navigate(`/#${id}`);
      setTimeout(() => {
        scrollToSection(id);
      }, 120);
    } else {
      scrollToSection(id);
    }
    setMobileOpen(false);
  };

  return (
    <motion.nav
      aria-label="Primary navigation"
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${scrolled ? "shadow-lg shadow-black/10" : ""} rounded-[90px]`}
      style={{ width: "min(1200px, 95vw)" }}
      initial={{ opacity: 0, y: -20 }}
      animate={heroReady ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
      transition={{
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1],
        delay: heroReady ? 0.05 : 0,
      }}
    >
      <div
        className="flex items-center justify-between px-5 py-3 rounded-full border"
        style={{
          background: c.navBg,
          backdropFilter: "var(--mv-nav-blur, blur(20px) saturate(1.8))",
          WebkitBackdropFilter: "var(--mv-nav-blur, blur(20px) saturate(1.8))",
          borderColor: c.navBorder,
          boxShadow: scrolled
            ? "var(--mv-nav-shadow, 0 4px 24px rgba(15,23,42,0.07))"
            : "0 2px 12px rgba(15, 23, 42, 0.04)",
        }}
      >
        <a
          href="#home"
          aria-label="Mullai Venese — go to home section"
          onClick={(e) => {
            e.preventDefault();
            handleNav("home");
          }}
          className="group flex items-center gap-2 transition-transform duration-300 hover:-translate-y-0.5"
        >
          <img
            src={mvLogo}
            alt="MV"
            className="w-9 h-9 object-contain transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110"
            draggable={false}
          />
          <span
            className="hidden sm:block text-sm"
            style={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 400,
              letterSpacing: "0.04em",
              color: c.heading,
            }}
          >
            Mullai
          </span>
        </a>

        {/* Desktop Links Container with Framer Motion layoutId Selection Indicator Pill */}
        <div className="relative hidden md:flex items-center gap-1">
          {navSections.map((link) => {
            const isActive = activeId === link.id;
            return (
              <a
                key={link.label}
                href={`#${link.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNav(link.id);
                }}
                className="relative px-3.5 py-1.5 rounded-full text-sm transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.03]"
                style={{
                  fontFamily: FONT,
                  fontWeight: 600,
                  color: isActive ? c.primary : c.body,
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{
                      background: c.primaryMuted,
                      border: `1px solid ${c.primaryBorder}`,
                    }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </a>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            onClick={handleThemeToggle}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5 hover:scale-110 hover:rotate-6"
            style={{
              background: c.pill,
              color: c.body,
            }}
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              handleNav("contact");
            }}
            className="group hidden sm:flex items-center px-4 py-2 rounded-full text-sm text-white transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 active:scale-95"
            style={{
              background: c.primary,
              fontFamily: FONT,
              fontWeight: 600,
            }}
          >
            Hire Me
          </a>

          <button
            type="button"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
            aria-controls={mobileNavId}
            className="md:hidden w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-3"
            style={{
              background: c.pill,
              color: c.body,
            }}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div
          id={mobileNavId}
          role="dialog"
          aria-label="Mobile navigation"
          className="mt-2 rounded-2xl border p-4 flex flex-col gap-1"
          style={{
            background: c.navBg,
            backdropFilter: "var(--mv-nav-blur, blur(20px) saturate(1.8))",
            WebkitBackdropFilter: "var(--mv-nav-blur, blur(20px) saturate(1.8))",
            borderColor: c.navBorder,
            boxShadow: "var(--mv-nav-shadow, 0 4px 24px rgba(15,23,42,0.07))",
          }}
        >
          {navSections.map((link) => {
            const isActive = activeId === link.id;
            return (
              <a
                key={link.label}
                href={`#${link.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNav(link.id);
                }}
                className="relative px-4 py-2.5 rounded-xl text-sm transition-all duration-300"
                style={{
                  fontFamily: FONT,
                  fontWeight: 500,
                  color: isActive ? c.primary : c.body,
                  background: isActive ? c.primaryMuted : "transparent",
                }}
              >
                {link.label}
              </a>
            );
          })}
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              handleNav("contact");
            }}
            className="mt-1 px-4 py-2.5 rounded-xl text-sm text-white text-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/25 active:scale-95"
            style={{
              background: c.primary,
              fontFamily: FONT,
              fontWeight: 600,
            }}
          >
            Hire Me
          </a>
        </div>
      )}
    </motion.nav>
  );
}
