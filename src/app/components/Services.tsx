import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, useReducedMotion } from "motion/react";
import { badgeStyle, FONT, FONT_DISPLAY, themeVars } from "../theme";
import { scrollToSection } from "../lib/scroll";

const services = [
  {
    icon: "🎨",
    title: "Web Design",
    desc: "Pixel-perfect UI/UX designs that blend aesthetics with functionality. From wireframes to high-fidelity Figma prototypes.",
    features: ["UI/UX Research", "Responsive Design", "Design Systems", "Prototyping"],
    color: "#0891B2",
    bg: "rgba(8,145,178,0.12)",
    border: "rgba(8,145,178,0.3)",
    popular: false,
  },
  {
    icon: "💻",
    title: "Website Development",
    desc: "Custom landing pages, business websites, and full-stack web applications designed to help businesses grow, generate leads, and deliver seamless user experiences.",
    features: ["Landing Pages", "Business Websites", "Full-Stack Applications", "Deployment & Maintenance"],
    color: "#2563EB",
    bg: "rgba(37,99,235,0.12)",
    border: "rgba(37,99,235,0.3)",
    popular: true,
  },
  {
    icon: "✏️",
    title: "Branding & Logo Design",
    desc: "Distinctive brand identities that tell your story. Logos, color palettes, typography, and comprehensive brand guides.",
    features: ["Logo Design", "Brand Guidelines", "Color Systems", "Typography"],
    color: "#059669",
    bg: "rgba(5,150,105,0.12)",
    border: "rgba(5,150,105,0.3)",
    popular: false,
  },
] as const;

type Breakpoint = "desktop" | "tablet" | "mobile";

function useBreakpoint(): Breakpoint {
  const [bp, setBp] = useState<Breakpoint>(() => {
    if (typeof window === "undefined") return "desktop";
    const w = window.innerWidth;
    return w < 768 ? "mobile" : w < 1024 ? "tablet" : "desktop";
  });

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 768) {
        setBp("mobile");
      } else if (w < 1024) {
        setBp("tablet");
      } else {
        setBp("desktop");
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return bp;
}

// ─── Single 3D Service Card Component ──────────────────────────────────────────
function CinematicServiceCard({
  service,
  isActive,
}: {
  service: typeof services[number];
  isActive: boolean;
}) {
  const c = themeVars;

  return (
    <div
      className="relative z-10 flex flex-col h-full gap-4 sm:gap-5 p-6 sm:p-8 rounded-3xl min-h-[380px] sm:min-h-[420px] transition-all duration-300"
      style={{
        /* 100% solid, fully opaque card background - ZERO bleed-through */
        background: service.popular
          ? "var(--mv-accent-popular, #eff6ff)"
          : "var(--mv-card, #ffffff)",
        border: isActive
          ? `2px solid ${service.color}`
          : `1.5px solid ${c.border}`,
        boxShadow: isActive
          ? `0 20px 48px -12px ${service.color}35, ${c.shadowLg}`
          : c.shadow,
      }}
    >
      {service.popular && (
        <div
          className="absolute -top-3.5 right-6 px-4 py-1 rounded-full text-xs text-white whitespace-nowrap z-20 shadow-md"
          style={{ background: c.primary, fontFamily: FONT, fontWeight: 700 }}
        >
          Most Popular
        </div>
      )}

      <div className="flex items-center justify-between">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm"
          style={{ background: service.bg, border: `1.5px solid ${service.border}` }}
        >
          {service.icon}
        </div>
        <div
          className="w-3 h-3 rounded-full transition-all duration-300"
          style={{
            background: service.color,
            boxShadow: isActive ? `0 0 12px ${service.color}` : "none",
          }}
        />
      </div>

      <div>
        <h3 className="mb-2 text-xl sm:text-2xl font-bold" style={{ fontFamily: FONT_DISPLAY, color: c.heading, letterSpacing: "0.01em" }}>
          {service.title}
        </h3>
        <p className="text-xs sm:text-sm" style={{ fontFamily: FONT, color: c.body, lineHeight: 1.7 }}>
          {service.desc}
        </p>
      </div>

      <ul className="flex flex-col gap-2 mt-auto pt-2">
        {service.features.map((feat) => (
          <li key={feat} className="flex items-center gap-2.5 text-xs sm:text-sm font-medium" style={{ fontFamily: FONT, color: c.body }}>
            <span
              className="w-4.5 h-4.5 rounded-full flex items-center justify-center text-xs text-white flex-shrink-0"
              style={{ background: service.color }}
            >
              ✓
            </span>
            {feat}
          </li>
        ))}
      </ul>

      <a
        href="#contact"
        onClick={(e) => { e.preventDefault(); scrollToSection("contact"); }}
        className="group/cta mt-3 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-lg active:scale-95"
        style={{
          fontFamily: FONT,
          fontWeight: 700,
          background: service.popular ? c.primary : service.bg,
          color: service.popular ? c.onPrimary : service.color,
          border: `1.5px solid ${service.border}`,
        }}
      >
        Get Started <span className="transition-transform duration-300 group-hover/cta:translate-x-1">→</span>
      </a>
    </div>
  );
}

// ─── Main Services Component ───────────────────────────────────────────────────
export function Services() {
  const c = themeVars;
  const shouldReduceMotion = useReducedMotion() ?? false;
  const breakpoint = useBreakpoint();

  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const activeScrollJacking = !shouldReduceMotion;

  // Track active card index based on scroll progress
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!shouldReduceMotion) {
      if (latest < 0.33) {
        if (activeIndex !== 0) setActiveIndex(0);
      } else if (latest < 0.66) {
        if (activeIndex !== 1) setActiveIndex(1);
      } else {
        if (activeIndex !== 2) setActiveIndex(2);
      }
    }
  });

  const stepY = breakpoint === "mobile" ? 16 : breakpoint === "tablet" ? 22 : 28;

  // Card 0 (Web Design) transforms
  const opacity0 = useTransform(scrollYProgress, [0.0, 0.28, 0.38, 0.65], [1, 1, 0.78, 0.58]);
  const y0 = useTransform(scrollYProgress, [0.0, 0.28, 0.38, 0.65, 0.95], [0, 0, -stepY, -2 * stepY, -2 * stepY]);
  const scale0 = useTransform(scrollYProgress, [0.0, 0.28, 0.38, 0.65, 0.95], [1, 1, 0.94, 0.88, 0.88]);
  const rotateX0 = useTransform(scrollYProgress, [0.0, 0.28, 0.38, 0.65], [0, 0, 2, 4]);

  // Card 1 (Website Development) transforms
  const opacity1 = useTransform(scrollYProgress, [0.0, 0.28, 0.38, 0.62, 0.72], [0.78, 0.78, 1, 1, 0.78]);
  const y1 = useTransform(scrollYProgress, [0.0, 0.28, 0.38, 0.62, 0.72], [-stepY, -stepY, 0, 0, -stepY]);
  const scale1 = useTransform(scrollYProgress, [0.0, 0.28, 0.38, 0.62, 0.72], [0.94, 0.94, 1, 1, 0.94]);
  const rotateX1 = useTransform(scrollYProgress, [0.0, 0.28, 0.38, 0.62, 0.72], [2, 2, 0, 0, 2]);

  // Card 2 (Branding & Logo Design) transforms
  const opacity2 = useTransform(scrollYProgress, [0.0, 0.28, 0.62, 0.72, 1.0], [0.58, 0.58, 0.78, 1, 1]);
  const y2 = useTransform(scrollYProgress, [0.0, 0.28, 0.62, 0.72, 1.0], [-2 * stepY, -2 * stepY, -stepY, 0, 0]);
  const scale2 = useTransform(scrollYProgress, [0.0, 0.28, 0.62, 0.72, 1.0], [0.88, 0.88, 0.94, 1, 1]);
  const rotateX2 = useTransform(scrollYProgress, [0.0, 0.28, 0.62, 0.72, 1.0], [4, 4, 2, 0, 0]);

  const cardTransforms = [
    { opacity: opacity0, y: y0, scale: scale0, rotateX: rotateX0 },
    { opacity: opacity1, y: y1, scale: scale1, rotateX: rotateX1 },
    { opacity: opacity2, y: y2, scale: scale2, rotateX: rotateX2 },
  ];

  const zIndices = [
    activeIndex === 0 ? 30 : activeIndex === 1 ? 20 : 10,
    activeIndex === 1 ? 30 : activeIndex === 0 ? 20 : 20,
    activeIndex === 2 ? 30 : activeIndex === 1 ? 10 : 10,
  ];

  return (
    <section
      ref={sectionRef}
      className={activeScrollJacking ? `services-scroll-wrapper-${breakpoint}` : ""}
      id="services"
    >
      <div className={activeScrollJacking ? "services-sticky-viewport" : ""} style={{ background: c.sectionAlt }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-4 sm:pt-6 pb-8 sm:pb-12 w-full flex flex-col items-center justify-center min-h-screen">
          {/* Section header - STRUCTURALLY STABLE at top */}
          <motion.div
            className="flex flex-col items-center text-center shrink-0 mb-6 sm:mb-8 lg:mb-10 z-40 pointer-events-auto"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="px-4 py-1.5 rounded-full text-xs sm:text-sm mb-2.5 border" style={badgeStyle(c)}>
              Services
            </span>
            <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 400, color: c.heading, letterSpacing: "0.02em" }}>
              What I <span style={{ color: c.primary }}>Offer</span>
            </h2>
            <p className="mt-2 max-w-xl text-xs sm:text-sm" style={{ fontFamily: FONT, color: c.body, lineHeight: 1.6 }}>
              End-to-end digital services from concept to deployment - built with precision, creativity, and purpose.
            </p>
          </motion.div>

          {/* 3D Stack Container or Static Grid Fallback */}
          {activeScrollJacking ? (
            <div className="w-full flex flex-col items-center gap-6">
              <div
                className="relative w-full max-w-[800px] mx-auto min-h-[400px] sm:min-h-[440px] pt-12"
                style={{
                  perspective: "1200px",
                }}
              >
                {services.map((service, i) => {
                  const isActive = activeIndex === i;
                  const tf = cardTransforms[i];
                  const zIndex = zIndices[i];

                  return (
                    <motion.div
                      key={service.title}
                      onClick={() => setActiveIndex(i)}
                      style={{
                        opacity: tf.opacity,
                        y: tf.y,
                        scale: tf.scale,
                        rotateX: tf.rotateX,
                        zIndex: zIndex,
                      }}
                      className="absolute inset-x-0 top-12 w-full cursor-pointer select-none"
                    >
                      <CinematicServiceCard service={service} isActive={isActive} />
                    </motion.div>
                  );
                })}
              </div>

              {/* Service Tab Indicators */}
              <div className="flex items-center gap-2 mt-4 z-40">
                {services.map((service, i) => {
                  const isActive = activeIndex === i;
                  return (
                    <button
                      key={service.title}
                      onClick={() => setActiveIndex(i)}
                      className="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 flex items-center gap-1.5"
                      style={{
                        fontFamily: FONT,
                        background: isActive ? service.color : c.card,
                        color: isActive ? "#ffffff" : c.body,
                        border: `1.5px solid ${isActive ? service.color : c.border}`,
                        boxShadow: isActive ? `0 4px 12px ${service.color}40` : "none",
                      }}
                    >
                      <span>{service.icon}</span>
                      <span>{service.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-[1350px] w-full mx-auto">
              {services.map((service) => (
                <div key={service.title} className="h-full">
                  <CinematicServiceCard service={service} isActive={false} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .services-scroll-wrapper-desktop {
          height: calc(100vh + 140vh);
          position: relative;
          box-sizing: border-box;
        }
        .services-scroll-wrapper-tablet {
          height: calc(100vh + 140vh);
          position: relative;
          box-sizing: border-box;
        }
        .services-scroll-wrapper-mobile {
          height: calc(100vh + 160vh);
          position: relative;
          box-sizing: border-box;
        }
        .services-sticky-viewport {
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
