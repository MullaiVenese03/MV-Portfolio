import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent, useReducedMotion } from "motion/react";
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
  const [activeCardIndex, setActiveCardIndex] = useState<number>(TOTAL_ITEMS - 1);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Driven by section scroll progress
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!shouldReduceMotion) {
      const scrollIndex = Math.min(
        Math.floor(latest * TOTAL_ITEMS),
        TOTAL_ITEMS - 1
      );
      if (scrollIndex !== activeCardIndex) {
        setActiveCardIndex(scrollIndex);
      }
    }
  });

  const handleCardClick = (index: number) => {
    setActiveCardIndex(index);
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
          height: calc(100vh + ${TOTAL_ITEMS * 15}vh);
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


