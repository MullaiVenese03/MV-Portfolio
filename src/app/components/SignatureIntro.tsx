import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState, useMemo, useRef, useCallback, type CSSProperties } from "react";
import { getIntroTheme, MOTION_EASE } from "../theme";

interface SignatureIntroProps {
  darkMode: boolean;
  onComplete: () => void;
}

type Phase = 1 | 2 | 3 | 4 | 5;

// Logo SVG path definitions (viewBox 0 0 100 77)
const LOGO_PATHS = [
  {
    d: "M65.2974 2.29578C68.4104 -0.76526 73.4026 -0.76526 76.5156 2.29578L96.8284 22.2698C100.016 25.4046 100.016 30.5436 96.8284 33.6783L55.1189 74.6922C52.006 77.7533 47.0137 77.7533 43.9007 74.6922L2.39115 33.8749C-0.796726 30.7402 -0.796724 25.6012 2.39115 22.4665L22.7684 2.42908C25.8814 -0.631968 30.8736 -0.63197 33.9866 2.42908L49.5743 17.7567L39.5905 27.5741L28.3775 16.5481L16.5578 28.1707L27.7708 39.1967L37.7546 49.014L49.5098 60.5732L61.3296 48.9506L71.3133 39.1333L82.6618 27.9741L70.9065 16.4148L59.5581 27.5741L49.5743 17.7567L65.2974 2.29578Z",
    fillLight: "#2563EB",
    fillDark: "#3B82F6",
    strokeLight: "#2563EB",
    strokeDark: "#60A5FA",
    opacity: 1,
  },
  {
    d: "M39.5905 27.5741L49.5743 17.7568L59.5581 27.5741L49.5743 37.3914L39.5905 27.5741Z",
    fillLight: "#0EA5E9",
    fillDark: "#38BDF8",
    strokeLight: "#0EA5E9",
    strokeDark: "#38BDF8",
    opacity: 1,
  },
  {
    d: "M39.5904 27.5741L49.5741 37.3914L37.7544 49.014L27.7706 39.1967L39.5904 27.5741Z",
    fillLight: "#2563EB",
    fillDark: "#3B82F6",
    strokeLight: "#2563EB",
    strokeDark: "#60A5FA",
    opacity: 0.55,
  },
  {
    d: "M71.3132 39.1333L61.3294 48.9506L49.5741 37.3914L59.5579 27.5741L71.3132 39.1333Z",
    fillLight: "#2563EB",
    fillDark: "#3B82F6",
    strokeLight: "#2563EB",
    strokeDark: "#60A5FA",
    opacity: 0.55,
  },
];

const LOGO_DISPLAY_SIZE = 220; // px on screen during intro
const NAVBAR_LOGO_SIZE = 36;   // px in navbar

export function SignatureIntro({ darkMode, onComplete }: SignatureIntroProps) {
  const [phase, setPhase] = useState<Phase>(1);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const intro = getIntroTheme(darkMode);

  // Pre-calculate target vector for navbar logo
  const flyTarget = useMemo(() => {
    if (typeof window === "undefined") return { dx: 0, dy: 0, scale: 0.2 };
    const w = window.innerWidth;
    const h = window.innerHeight;
    const navbarPillWidth = Math.min(1200, w * 0.95);
    const navbarPillLeft = (w - navbarPillWidth) / 2;
    const navLogoCenterX = navbarPillLeft + 20 + NAVBAR_LOGO_SIZE / 2;
    const navLogoCenterY = 16 + 24;
    const logoCenterX = w / 2;
    const logoCenterY = h / 2 - 75;
    return {
      dx: navLogoCenterX - logoCenterX,
      dy: navLogoCenterY - logoCenterY,
      scale: NAVBAR_LOGO_SIZE / LOGO_DISPLAY_SIZE,
    };
  }, []);

  // Kinetic floating particle nodes
  const particles = useMemo(
    () =>
      Array.from({ length: 36 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2.8 + 1,
        delay: Math.random() * 3,
        duration: Math.random() * 3 + 2.5,
        yDelta: -(24 + Math.random() * 36),
        baseOpacity: Math.random() * 0.4 + 0.15,
      })),
    [],
  );

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(2), 1200), // Stroke draw completes → Facets illuminate
      setTimeout(() => setPhase(3), 2200), // Pulse ring & status badge appear
      setTimeout(() => setPhase(4), 3100), // Typographic slide-up sequence
      setTimeout(() => setPhase(5), 4900), // Targeted fly to navbar
      setTimeout(() => {
        onCompleteRef.current();
      }, 5700),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleSkip = useCallback(() => {
    onCompleteRef.current();
  }, []);

  const isFlying = phase === 5;
  const isFilled = phase >= 2;
  const showBadge = phase >= 3;
  const showText = phase >= 4;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isFlying ? 0 : 1 }}
      transition={{ duration: 0.8, delay: isFlying ? 0.45 : 0, ease: MOTION_EASE }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: intro.background,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        pointerEvents: isFlying ? "none" : "auto",
      }}
    >
      <style>{`
        @keyframes cyber-particle {
          0% {
            opacity: 0;
            transform: translateY(0) scale(0.5);
          }
          15% {
            opacity: var(--base-opacity);
            transform: translateY(calc(var(--y-delta) * 0.2)) scale(1.1);
          }
          75% {
            opacity: calc(var(--base-opacity) * 0.4);
            transform: translateY(calc(var(--y-delta) * 0.85)) scale(0.9);
          }
          100% {
            opacity: 0;
            transform: translateY(var(--y-delta)) scale(0.5);
          }
        }
        .cyber-grid-line {
          position: absolute;
          background: ${darkMode ? "rgba(59, 130, 246, 0.05)" : "rgba(37, 99, 235, 0.04)"};
          pointer-events: none;
        }
        .kinetic-particle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          animation: cyber-particle var(--duration) ease-in-out var(--delay) infinite;
        }
      `}</style>

      {/* ── Background Cyber Grid Lines ── */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.75 }}>
        {/* Horizontal beam lines */}
        <div className="cyber-grid-line" style={{ top: "25%", left: 0, right: 0, height: 1 }} />
        <div className="cyber-grid-line" style={{ top: "50%", left: 0, right: 0, height: 1 }} />
        <div className="cyber-grid-line" style={{ top: "75%", left: 0, right: 0, height: 1 }} />
        {/* Vertical beam lines */}
        <div className="cyber-grid-line" style={{ left: "25%", top: 0, bottom: 0, width: 1 }} />
        <div className="cyber-grid-line" style={{ left: "50%", top: 0, bottom: 0, width: 1 }} />
        <div className="cyber-grid-line" style={{ left: "75%", top: 0, bottom: 0, width: 1 }} />
      </div>

      {/* ── Ambient Radial Halos ── */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute", top: "12%", left: "10%",
            width: 500, height: 500, borderRadius: "50%",
            background: intro.glowPrimary,
            filter: "blur(90px)",
            transform: "translate3d(0,0,0)",
          }}
        />
        <div
          style={{
            position: "absolute", bottom: "14%", right: "8%",
            width: 440, height: 440, borderRadius: "50%",
            background: intro.glowSecondary,
            filter: "blur(100px)",
            transform: "translate3d(0,0,0)",
          }}
        />
      </div>

      {/* ── Kinetic Particles ── */}
      {phase < 5 &&
        particles.map((p) => (
          <div
            key={p.id}
            className="kinetic-particle"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              background: intro.particle,
              boxShadow: `0 0 ${p.size * 4}px ${intro.particleShadow}`,
              "--base-opacity": p.baseOpacity,
              "--y-delta": `${p.yDelta}px`,
              "--duration": `${p.duration}s`,
              "--delay": `${p.delay}s`,
            } as CSSProperties}
          />
        ))}

      {/* ── Center Column: Monogram + Typography ── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 36,
          zIndex: 10,
        }}
      >
        {/* Monogram Wrapper - morphs & flies to navbar position in Phase 5 */}
        <motion.div
          animate={
            isFlying
              ? { x: flyTarget.dx, y: flyTarget.dy, scale: flyTarget.scale }
              : { x: 0, y: 0, scale: 1 }
          }
          transition={
            isFlying
              ? { duration: 0.72, ease: [0.76, 0, 0.24, 1] }
              : { duration: 0.5, ease: MOTION_EASE }
          }
          style={{ position: "relative" }}
        >
          {/* Pulse ring halos (Phase 3) */}
          <AnimatePresence>
            {showBadge && !isFlying && (
              <motion.div
                key="pulse-ring"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: [0, 0.6, 0], scale: [0.8, 1.8, 2.6] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                style={{
                  position: "absolute",
                  inset: -20,
                  borderRadius: 24,
                  border: `1.5px solid ${intro.pulseRing}`,
                  pointerEvents: "none",
                }}
              />
            )}
          </AnimatePresence>

          {/* SVG Monogram with Neon Stroke Draw → Shutter Liquid Fill */}
          <div
            style={{
              filter: isFilled ? intro.logoShadow : "none",
              transition: "filter 0.8s ease",
            }}
          >
            <svg
              viewBox="0 0 100 77"
              width={LOGO_DISPLAY_SIZE}
              height={LOGO_DISPLAY_SIZE * (77 / 100)}
              style={{ overflow: "visible", display: "block" }}
            >
              {LOGO_PATHS.map((p, i) => {
                const fillCol = darkMode ? p.fillDark : p.fillLight;
                const strokeCol = darkMode ? p.strokeDark : p.strokeLight;

                return (
                  <g key={i}>
                    {/* Stroke Draw Path (Phase 1) */}
                    <motion.path
                      d={p.d}
                      fill="none"
                      stroke={strokeCol}
                      strokeWidth={2.2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0, opacity: 0.9 }}
                      animate={{ pathLength: 1, opacity: isFilled ? 0.2 : 1 }}
                      transition={{
                        duration: 1.15,
                        delay: i * 0.14,
                        ease: MOTION_EASE,
                      }}
                      style={{ transformOrigin: "50px 38.5px" }}
                    />

                    {/* Filled Shutter Facet (Phase 2+) */}
                    <motion.path
                      d={p.d}
                      fill={fillCol}
                      initial={{ opacity: 0, scale: 0.7, rotate: (i % 2 === 0 ? -12 : 12) }}
                      animate={
                        isFilled
                          ? { opacity: p.opacity, scale: 1, rotate: 0 }
                          : { opacity: 0, scale: 0.7 }
                      }
                      transition={{
                        duration: 0.75,
                        delay: 0.1 * i,
                        ease: [0.34, 1.56, 0.64, 1], // Spring pop
                      }}
                      style={{ transformOrigin: "50px 38.5px" }}
                    />
                  </g>
                );
              })}
            </svg>
          </div>
        </motion.div>

        {/* ── Status Badge Indicator (Phase 3+) ── */}
        <AnimatePresence>
          {showBadge && !isFlying && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: MOTION_EASE }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 14px",
                borderRadius: 999,
                background: intro.skipBg,
                border: `1px solid ${intro.skipBorder}`,
                backdropFilter: "blur(12px)",
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: intro.titleColor,
                  boxShadow: `0 0 10px ${intro.titleColor}`,
                }}
              />
              <span
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 10.5,
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  color: intro.titleColor,
                  textTransform: "uppercase",
                }}
              >
                Creative Developer
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Typographic Reveal (Phase 4+) ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: isFlying ? 0 : showText ? 1 : 0,
            y: showText ? 0 : 20,
          }}
          transition={{ duration: 0.65, ease: MOTION_EASE }}
          style={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              color: intro.nameColor,
              letterSpacing: "0.45em",
              fontSize: 22,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 800,
              textTransform: "uppercase",
            }}
          >
            Mullai Venese
          </div>

          <div
            style={{
              width: 56,
              height: 1.5,
              background: intro.divider,
            }}
          />

          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10 }}>
            {["Front-End Developer", "UI / UX Designer"].map((role, i) => (
              <motion.span
                key={role}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: showText ? 1 : 0, y: showText ? 0 : 10 }}
                transition={{
                  delay: 0.12 * i,
                  duration: 0.5,
                  ease: MOTION_EASE,
                }}
                style={{
                  color: intro.titleColor,
                  letterSpacing: "0.28em",
                  fontSize: 11,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  padding: "4px 10px",
                  borderRadius: 6,
                  background: intro.skipBg,
                  border: `1px solid ${intro.skipBorder}`,
                }}
              >
                {role}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Glassmorphic Skip Button ── */}
      <button
        onClick={handleSkip}
        style={{
          position: "absolute",
          bottom: 30,
          right: 30,
          padding: "8px 18px",
          borderRadius: 999,
          background: intro.skipBg,
          border: `1px solid ${intro.skipBorder}`,
          color: intro.skipColor,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.08em",
          cursor: "pointer",
          backdropFilter: "blur(12px)",
          transition: "transform 0.2s ease, opacity 0.2s ease",
          zIndex: 20,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        Skip Intro →
      </button>
    </motion.div>
  );
}
