import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { badgeStyle, FONT, FONT_DISPLAY, themeVars } from "../theme";

const timelineItems = [
  {
    year: "2022",
    type: "Education",
    title: "B.E. Computer Science & Engineering - Started",
    desc: "Started Bachelor of Engineering in Computer Science & Engineering, building a formal foundation in programming, algorithms, data structures, and software engineering.",
    tags: ["B.E. CSE", "College", "Computer Science", "Education"],
    color: "#DC2626",
  },
  {
    year: "2023",
    type: "Learning",
    title: "Frontend Development",
    desc: "Learned frontend development independently - HTML, CSS, JavaScript, React, and responsive build practices through personal projects and continuous experimentation.",
    tags: ["Frontend", "React", "JavaScript", "Self-Taught"],
    color: "#0EA5E9",
  },
  {
    year: "2024",
    type: "Learning",
    title: "UI/UX Design",
    desc: "Self-taught UI/UX design through practice projects, wireframing, prototyping in Figma, and user-centered interface thinking.",
    tags: ["UI/UX", "Figma", "Prototyping", "Self-Taught"],
    color: "#059669",
  },
  {
    year: "2024",
    type: "Learning",
    title: "Logo Design & Branding",
    desc: "Self-taught logo design and visual branding - building identity systems, mark design, color palettes, and brand guidelines for digital and print use.",
    tags: ["Logo Design", "Branding", "Visual Identity", "Self-Taught"],
    color: "#D97706",
  },
  {
    year: "2025",
    type: "Work",
    title: "Freelance Developer & Designer",
    desc: "Started freelancing independently - delivering web development, UI/UX design, and branding solutions while helping clients meet their requirements with clear communication and reliable delivery.",
    tags: ["Freelance", "Web Development", "UI/UX", "Branding", "Client Work"],
    color: "#7C3AED",
  },
  {
    year: "2026",
    type: "Education",
    title: "B.E. Computer Science & Engineering - Graduated",
    desc: "Graduated with a Bachelor of Engineering in Computer Science & Engineering, combining formal CS fundamentals with hands-on experience in development, design, and client work.",
    tags: ["B.E. CSE", "Graduation", "Computer Science"],
    color: "#0891B2",
  },
  {
    year: "2026",
    type: "Career",
    title: "Open to New Opportunities",
    desc: "Currently open to freelance projects, collaborations, and full-time opportunities where I can contribute full-stack development, UI/UX design, and branding expertise.",
    tags: ["Freelance", "Collaborations", "Full-Time", "Open to Work"],
    color: "#2563EB",
  },
] as const;

const sortedTimelineItems = [...timelineItems].sort(
  (a, b) => Number(a.year) - Number(b.year)
);

const TOTAL_ITEMS = sortedTimelineItems.length;
const WHEEL_THRESHOLD = 30;
const TRANSITION_LOCK_MS = 380;

function useResponsiveOffset() {
  const [screenSize, setScreenSize] = useState<"mobile" | "tablet" | "desktop">("desktop");

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 640) {
        setScreenSize("mobile");
      } else if (w < 1024) {
        setScreenSize("tablet");
      } else {
        setScreenSize("desktop");
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return screenSize;
}

// ─── Single Timeline Card Content (Solid Opaque 100% Fill) ─────────────────────
function TimelineCardContent({
  item,
  isFront = true,
}: {
  item: typeof sortedTimelineItems[number];
  isFront?: boolean;
}) {
  const c = themeVars;

  return (
    <div
      className="relative z-10 flex flex-col h-full gap-3 sm:gap-4 p-5 sm:p-6 md:p-7 rounded-2xl sm:rounded-3xl min-h-[260px] sm:min-h-[280px]"
      style={{
        /* 100% solid, fully opaque card background - ZERO bleed-through */
        background: "var(--mv-card, #ffffff)",
        border: `1.5px solid ${c.border}`,
        boxShadow: c.shadowLg,
      }}
    >
      <div className="flex items-center gap-2">
        <span
          className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0"
          style={{ background: item.color, boxShadow: `0 0 8px ${item.color}aa` }}
        />
        <span
          className="px-2.5 py-0.5 rounded-full text-xs font-bold"
          style={{ fontFamily: FONT, background: item.color + "20", color: item.color }}
        >
          {item.type}
        </span>
        <span className="text-xs sm:text-sm font-semibold" style={{ fontFamily: FONT, color: c.body }}>
          {item.year}
        </span>
      </div>

      {isFront && (
        <>
          <div>
            <h3 className="mb-1.5 text-base sm:text-lg md:text-xl font-bold" style={{ fontFamily: FONT, color: c.heading }}>
              {item.title}
            </h3>
            <p className="text-xs sm:text-sm" style={{ fontFamily: FONT, color: c.body, lineHeight: 1.6 }}>
              {item.desc}
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                style={{ fontFamily: FONT, background: c.pill, color: c.body }}
              >
                {tag}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Main Timeline Component ───────────────────────────────────────────────────
export function Timeline() {
  const c = themeVars;
  const shouldReduceMotion = useReducedMotion() ?? false;
  const screenSize = useResponsiveOffset();
  const isMobile = screenSize === "mobile";

  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);

  const activeCardIndexRef = useRef(activeCardIndex);
  activeCardIndexRef.current = activeCardIndex;

  const isTransitioningRef = useRef(false);
  const gestureActiveRef = useRef(false);
  const wheelAccumulatorRef = useRef(0);
  const gestureEndTimerRef = useRef<NodeJS.Timeout | null>(null);
  const transitionTimerRef = useRef<NodeJS.Timeout | null>(null);

  const readyToExitDownRef = useRef(false);
  const readyToExitUpRef = useRef(false);

  // Controlled wheel gesture handler - strictly advances 1 card per intentional gesture
  useEffect(() => {
    if (shouldReduceMotion) return;

    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const handleWheel = (e: WheelEvent) => {
      const rect = sectionEl.getBoundingClientRect();
      const isSticky = rect.top <= 15 && rect.bottom >= window.innerHeight - 15;

      if (!isSticky) {
        return;
      }

      const delta = e.deltaY;
      if (Math.abs(delta) < 2) return;

      const isDown = delta > 0;
      const currentIndex = activeCardIndexRef.current;

      // Reset gesture decay timer on every incoming wheel event
      if (gestureEndTimerRef.current) {
        clearTimeout(gestureEndTimerRef.current);
      }
      gestureEndTimerRef.current = setTimeout(() => {
        gestureActiveRef.current = false;
        wheelAccumulatorRef.current = 0;

        // When the user has settled on the final card and stopped scrolling,
        // arm readyToExitDown so the NEXT separate gesture releases page scroll.
        if (activeCardIndexRef.current === TOTAL_ITEMS - 1) {
          readyToExitDownRef.current = true;
        }
        // When the user has settled on the first card and stopped scrolling,
        // arm readyToExitUp so the NEXT separate gesture releases page scroll.
        if (activeCardIndexRef.current === 0) {
          readyToExitUpRef.current = true;
        }
      }, 180);

      // If a transition is currently animating or inside an active gesture stream:
      if (isTransitioningRef.current || gestureActiveRef.current) {
        // Prevent scroll momentum from skipping cards or jumping while sticky
        e.preventDefault();
        return;
      }

      // Accumulate wheel delta
      wheelAccumulatorRef.current += delta;

      if (Math.abs(wheelAccumulatorRef.current) >= WHEEL_THRESHOLD) {
        if (isDown) {
          readyToExitUpRef.current = false;

          if (currentIndex < TOTAL_ITEMS - 1) {
            e.preventDefault();
            gestureActiveRef.current = true;
            isTransitioningRef.current = true;
            wheelAccumulatorRef.current = 0;
            readyToExitDownRef.current = false;

            const nextIndex = currentIndex + 1;
            activeCardIndexRef.current = nextIndex;
            setActiveCardIndex(nextIndex);

            if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
            transitionTimerRef.current = setTimeout(() => {
              isTransitioningRef.current = false;
            }, TRANSITION_LOCK_MS);
          } else {
            // Currently on the final card (TOTAL_ITEMS - 1)
            if (readyToExitDownRef.current) {
              // User performed a subsequent intentional gesture AFTER the final card settled
              // Allow page scroll down to next section
              wheelAccumulatorRef.current = 0;
            } else {
              // Keep final card locked and fully visible during the current arrival stream
              e.preventDefault();
              gestureActiveRef.current = true;
              wheelAccumulatorRef.current = 0;
            }
          }
        } else {
          // Scrolling UP
          readyToExitDownRef.current = false;

          if (currentIndex > 0) {
            e.preventDefault();
            gestureActiveRef.current = true;
            isTransitioningRef.current = true;
            wheelAccumulatorRef.current = 0;
            readyToExitUpRef.current = false;

            const prevIndex = currentIndex - 1;
            activeCardIndexRef.current = prevIndex;
            setActiveCardIndex(prevIndex);

            if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
            transitionTimerRef.current = setTimeout(() => {
              isTransitioningRef.current = false;
            }, TRANSITION_LOCK_MS);
          } else {
            // Currently on the first card (0)
            if (readyToExitUpRef.current) {
              // User performed a subsequent intentional gesture AFTER the first card settled
              // Allow page scroll up to previous section
              wheelAccumulatorRef.current = 0;
            } else {
              // Keep first card locked and fully visible during the current arrival stream
              e.preventDefault();
              gestureActiveRef.current = true;
              wheelAccumulatorRef.current = 0;
            }
          }
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      if (gestureEndTimerRef.current) clearTimeout(gestureEndTimerRef.current);
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    };
  }, [shouldReduceMotion]);

  // Touch gesture support on mobile devices
  useEffect(() => {
    if (shouldReduceMotion) return;

    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    let touchStartY = 0;
    let isTouchActive = false;

    const handleTouchStart = (e: TouchEvent) => {
      const rect = sectionEl.getBoundingClientRect();
      const isSticky = rect.top <= 15 && rect.bottom >= window.innerHeight - 15;
      if (!isSticky) return;

      touchStartY = e.touches[0].clientY;
      isTouchActive = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isTouchActive || isTransitioningRef.current) return;

      const rect = sectionEl.getBoundingClientRect();
      const isSticky = rect.top <= 15 && rect.bottom >= window.innerHeight - 15;
      if (!isSticky) return;

      const currentY = e.touches[0].clientY;
      const diffY = touchStartY - currentY; // positive = swipe up (scroll down)
      const TOUCH_THRESHOLD = 45;

      if (Math.abs(diffY) >= TOUCH_THRESHOLD) {
        const isDown = diffY > 0;
        const currentIndex = activeCardIndexRef.current;

        if (isDown) {
          readyToExitUpRef.current = false;

          if (currentIndex < TOTAL_ITEMS - 1) {
            if (e.cancelable) e.preventDefault();
            isTransitioningRef.current = true;
            touchStartY = currentY;
            readyToExitDownRef.current = false;

            const nextIndex = currentIndex + 1;
            activeCardIndexRef.current = nextIndex;
            setActiveCardIndex(nextIndex);

            if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
            transitionTimerRef.current = setTimeout(() => {
              isTransitioningRef.current = false;
              if (nextIndex === TOTAL_ITEMS - 1) {
                readyToExitDownRef.current = true;
              }
            }, TRANSITION_LOCK_MS);
          } else {
            // On final card
            if (readyToExitDownRef.current) {
              // Allow native page scroll
            } else {
              if (e.cancelable) e.preventDefault();
              readyToExitDownRef.current = true;
            }
          }
        } else {
          // Swipe down (scroll up)
          readyToExitDownRef.current = false;

          if (currentIndex > 0) {
            if (e.cancelable) e.preventDefault();
            isTransitioningRef.current = true;
            touchStartY = currentY;
            readyToExitUpRef.current = false;

            const prevIndex = currentIndex - 1;
            activeCardIndexRef.current = prevIndex;
            setActiveCardIndex(prevIndex);

            if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
            transitionTimerRef.current = setTimeout(() => {
              isTransitioningRef.current = false;
              if (prevIndex === 0) {
                readyToExitUpRef.current = true;
              }
            }, TRANSITION_LOCK_MS);
          } else {
            // On first card
            if (readyToExitUpRef.current) {
              // Allow native page scroll
            } else {
              if (e.cancelable) e.preventDefault();
              readyToExitUpRef.current = true;
            }
          }
        }
      }
    };

    const handleTouchEnd = () => {
      isTouchActive = false;
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [shouldReduceMotion]);

  const handleCardClick = (index: number) => {
    activeCardIndexRef.current = index;
    setActiveCardIndex(index);
    readyToExitDownRef.current = index === TOTAL_ITEMS - 1;
    readyToExitUpRef.current = index === 0;
  };

  // Responsive vertical offset so EVERY stacked card exposes its category tag + year clearly
  const stepOffset = screenSize === "mobile" ? 34 : screenSize === "tablet" ? 40 : 48;
  const scaleStep = isMobile ? 0.01 : 0.012;
  const maxStackOffset = (TOTAL_ITEMS - 1) * stepOffset;

  return (
    <section
      ref={sectionRef}
      className={shouldReduceMotion ? "" : "journey-scroll-area"}
      id="timeline"
    >
      <div className={shouldReduceMotion ? "" : "journey-sticky-container"} style={{ background: c.section }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-4 sm:pt-6 pb-8 sm:pb-12 w-full flex flex-col items-center justify-center min-h-screen">
          {/* Section header - STRUCTURALLY STABLE at top */}
          <motion.div
            className="flex flex-col items-center text-center shrink-0 mb-3 sm:mb-4 z-30 pointer-events-auto"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="px-4 py-1.5 rounded-full text-xs sm:text-sm mb-2 border" style={badgeStyle(c)}>
              My Journey
            </span>
            <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 400, color: c.heading, letterSpacing: "0.02em" }}>
              Professional <span style={{ color: c.primary }}>Timeline</span>
            </h2>
          </motion.div>

          {/* Compact Deck Container - strictly bounded BELOW the header */}
          {shouldReduceMotion ? (
            <div className="flex flex-col gap-5 max-w-[760px] mx-auto w-full">
              {sortedTimelineItems.map((item, i) => (
                <div key={i} className="relative">
                  <TimelineCardContent item={item} isFront={true} />
                </div>
              ))}
            </div>
          ) : (
            <div
              className="relative w-full max-w-[760px] mx-auto min-h-[260px] sm:min-h-[280px]"
              style={{
                width: isMobile ? "calc(100vw - 32px)" : "min(760px, calc(100vw - 48px))",
                marginTop: `${maxStackOffset}px`,
              }}
            >
              {sortedTimelineItems.map((item, i) => {
                const isFront = i === activeCardIndex;
                const rank = (activeCardIndex - i + TOTAL_ITEMS) % TOTAL_ITEMS;

                // NEGATIVE translateY so background cards layer UPWARD behind the front card
                const yOffset = isFront ? 0 : -1 * rank * stepOffset;
                const scale = isFront ? 1 : Math.max(1 - rank * scaleStep, 0.90);
                const zIndex = isFront ? 100 : 100 - rank * 5;

                return (
                  <motion.div
                    key={i}
                    onClick={() => handleCardClick(i)}
                    animate={{
                      y: yOffset,
                      scale: scale,
                      opacity: 1,
                      zIndex: zIndex,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 28,
                      mass: 0.8,
                    }}
                    whileHover={
                      !isFront
                        ? { y: yOffset - 3, scale: scale + 0.008 }
                        : {}
                    }
                    className="absolute inset-x-0 top-0 w-full cursor-pointer select-none"
                    style={{
                      zIndex,
                    }}
                  >
                    <TimelineCardContent item={item} isFront={isFront} />
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .journey-scroll-area {
          height: calc(100vh + ${TOTAL_ITEMS * 60}vh);
          position: relative;
          box-sizing: border-box;
        }
        .journey-sticky-container {
          position: sticky;
          top: 0;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          box-sizing: border-box;
        }
      `}</style>
    </section>
  );
}


