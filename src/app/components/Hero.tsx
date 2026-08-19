import { motion, useScroll, useTransform } from "motion/react";
import heroImage from "../../imports/hero cartton image.png";
import { FONT, FONT_DISPLAY, themeVars, prefersReducedMotion } from "../theme";

const ROLES = [
  "Front-End Developer",
  "UI/UX Designer",
];

// Cinematic entrance timing (seconds after heroReady triggers)
const ENTRANCE = {
  sidebar: { delay: 0.18, duration: 0.7 },
  greeting: { delay: 0.28, duration: 0.65 },
  name: { delay: 0.42, duration: 0.75 },
  roles: { delay: 0.58, duration: 0.6 },
  image: { delay: 0.22, duration: 0.85 },
} as const;

// Premium cinematic ease - expo-style for organic deceleration
const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface HeroProps {
  heroReady?: boolean;
}

export function Hero({ heroReady = false }: HeroProps) {
  const c = themeVars;
  const shouldReduceMotion = prefersReducedMotion();

  // Scroll parallax effects
  const { scrollY } = useScroll();
  const contentY = useTransform(scrollY, [0, 500], [0, 8]);
  const imageY = useTransform(scrollY, [0, 500], [0, -14]);
  const sidebarOpacity = useTransform(scrollY, [0, 400], [1, 0.35]);
  const bgWordY = useTransform(scrollY, [0, 600], [0, 30]);

  // ── Entrance animation helper ──────────────────────────────────────────────
  const makeEntrance = (
    delay: number,
    duration: number,
    fromY = 24,
    fromScale?: number,
  ) => {
    if (shouldReduceMotion) {
      return {
        initial: { opacity: 0 },
        animate: heroReady ? { opacity: 1 } : { opacity: 0 },
        transition: { duration: 0.01, delay: 0 },
      };
    }
    return {
      initial: {
        opacity: 0,
        y: fromY,
        ...(fromScale !== undefined ? { scale: fromScale } : {}),
      },
      animate: heroReady
        ? { opacity: 1, y: 0, ...(fromScale !== undefined ? { scale: 1 } : {}) }
        : { opacity: 0, y: fromY, ...(fromScale !== undefined ? { scale: fromScale } : {}) },
      transition: {
        duration,
        ease: EASE_OUT_EXPO,
        delay: heroReady ? delay : 0,
      },
    };
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-stretch overflow-x-clip overflow-y-visible"
      aria-labelledby="hero-heading"
    >
      {/*
        ── Layer 2: PORTFOLIO - 3D Floor Typography ────────────────────────
        The word appears to lie on a perspective floor plane, receding into
        the distance. The nearest portion faces the viewer; the top edge
        recedes away. z-index: 1 (behind all content layers).
      */}
      <motion.div
        aria-hidden
        style={{
          y: bgWordY,
          position: "absolute",
          bottom: 0,
          top: "35%",
          left: 0,
          right: 0,
          zIndex: 1,
          pointerEvents: "none",
          userSelect: "none",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          overflow: "hidden",
          // Perspective container - the actual 3D stage
          perspective: "clamp(320px, 45vw, 680px)",
          perspectiveOrigin: "50% 100%",
        }}
      >
        {/* 3D floor plane - tilted rotateX away from viewer */}
        <div
          className="portfolio-floor-plane"
          style={{
            transformStyle: "preserve-3d",
            transform: "rotateX(48deg) translateZ(-2px)",
            transformOrigin: "50% 100%",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            willChange: "transform",
          }}
        >
          {/* Main typography word */}
          <span
            className="portfolio-floor-word"
            style={{
              fontFamily: FONT_DISPLAY,
              // Intrinsically fluid - scales with viewport so it never overflows
              fontSize: "clamp(8vw, 16vw, 260px)",
              fontWeight: 400,
              letterSpacing: "0.18em",
              lineHeight: 1,
              whiteSpace: "nowrap",
              color: c.heading,
              opacity: "var(--mv-portfolio-word-opacity, 0.06)",
              // Depth gradient: bottom (near) → brighter, top (far) → fades
              WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.08) 100%)",
              maskImage: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.08) 100%)",
              display: "block",
              maxWidth: "100%",
            }}
          >
            PORTFOLIO
          </span>
        </div>
      </motion.div>

      {/* Layer 3: Vertical editorial sidebar - absolute so it doesn't shift the grid */}
      <motion.aside
        style={{ opacity: sidebarOpacity, position: "absolute", left: 0, top: 0, bottom: 0, zIndex: 3 }}
        className="hidden xl:flex flex-col items-center shrink-0 w-16 py-10 pl-6"
        aria-hidden
      >
        <motion.span
          {...makeEntrance(
            ENTRANCE.sidebar.delay,
            ENTRANCE.sidebar.duration,
            18,
          )}
          className="tracking-[0.22em] uppercase"
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            fontFamily: FONT_DISPLAY,
            fontSize: "12px",
            fontWeight: 500,
            color: c.primary,
            letterSpacing: "0.3em",
          }}
        >
          Front-End Developer
        </motion.span>
      </motion.aside>

      {/*
        Foreground layout grid container
      */}
      <div
        className="w-full flex items-center pt-20 pb-0 lg:pt-24 lg:pb-0"
        style={{ position: "relative", zIndex: 2 }}
      >
        <div className="w-full grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] items-center gap-8 lg:gap-0 min-h-[calc(100vh-5.5rem)]">

          {/*
            Layer 3: Main hero content container (z-index: 3).
            Vertically centered in usable space below navbar.
            All left text elements are wrapped inside ONE unified content container.
          */}
          <motion.div
            style={{ y: contentY, position: "relative", zIndex: 3 }}
            className="flex flex-col items-start justify-center h-full py-8 lg:py-0 px-6 lg:pl-[100px] lg:pr-8 max-w-[1400px] lg:max-w-none lg:ml-auto lg:w-full"
          >
            {/* Unified wrapper for centered content group */}
            <div className="flex flex-col items-start justify-center my-auto">
              {/* "Hello I'm," */}
              <motion.p
                {...makeEntrance(ENTRANCE.greeting.delay, ENTRANCE.greeting.duration, 25)}
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: "clamp(2rem, 4.8vw, 3.9rem)",
                  fontWeight: 400,
                  lineHeight: 1.1,
                  color: c.heading,
                  letterSpacing: "0.01em",
                  marginBottom: "0.35rem",
                }}
              >
                Hello I'm,
              </motion.p>

              {/* "Mullai Venese" */}
              <motion.h1
                id="hero-heading"
                {...makeEntrance(ENTRANCE.name.delay, ENTRANCE.name.duration, 30)}
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: "clamp(3.5rem, 9.5vw, 7.5rem)",
                  fontWeight: 400,
                  lineHeight: 0.95,
                  color: c.primary,
                  letterSpacing: "0.02em",
                }}
              >
                <span className="block">Mullai</span>
                <span className="block">Venese</span>
              </motion.h1>

              {/* "Front-End Developer | UI/UX Designer" */}
              <motion.div
                {...makeEntrance(ENTRANCE.roles.delay, ENTRANCE.roles.duration, 18)}
                className="mt-8 lg:mt-10 flex flex-wrap items-center gap-x-3 gap-y-2"
                style={{
                  fontFamily: FONT,
                  fontSize: "clamp(0.9rem, 1.4vw, 1.05rem)",
                  fontWeight: 500,
                  color: c.body,
                  letterSpacing: "0.01em",
                  lineHeight: 1.6,
                }}
              >
                {ROLES.map((role, index) => (
                  <span key={role} className="inline-flex items-center gap-3">
                    {index > 0 && (
                      <span
                        aria-hidden
                        style={{ color: c.muted, fontWeight: 300, opacity: 0.6 }}
                      >
                        |
                      </span>
                    )}
                    {role}
                  </span>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/*
            Layer 4: Character image (z-index: 10).
            Dominant ~75-92vh height on desktop, positioned on right.
            Head stays fully visible below navbar (pt-20 lg:pt-24).
            Extends 10-15% (-mb-[12vh] to -mb-[15vh]) past Hero bottom into About section for 3D overlap.
          */}
          <motion.div
            className="flex items-end justify-center lg:justify-end w-full relative"
            style={{
              y: imageY,
              position: "relative",
              zIndex: 10,
              minHeight: 0,
            }}
            {...makeEntrance(
              ENTRANCE.image.delay,
              ENTRANCE.image.duration,
              30,
              0.96,
            )}
          >
            <div className="relative w-full flex justify-center lg:justify-end items-end pt-16 lg:pt-24 lg:-mb-[14vh] md:-mb-[6vh] -mb-[2vh]">
              <img
                src={heroImage}
                alt="Mullai Venese - Front-End Developer and UI/UX Designer"
                draggable={false}
                fetchPriority="high"
                decoding="async"
                width={800}
                height={1200}
                className="h-[min(65vh,520px)] md:h-[clamp(550px,78vh,750px)] lg:h-[clamp(750px,92vh,1100px)] w-auto max-w-full object-contain object-bottom pointer-events-none select-none"
                style={{
                  display: "block",
                  filter: "drop-shadow(0 25px 35px rgba(0, 0, 0, 0.18)) drop-shadow(0 8px 16px rgba(0, 0, 0, 0.10))",
                }}
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
