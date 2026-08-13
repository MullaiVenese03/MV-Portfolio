import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { badgeStyle, FONT, FONT_DISPLAY, MOTION_EASE, themeVars } from "../theme";

// ─── Skill data (single source of truth) ──────────────────────────────────────
const iconBase = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

const techIcons = [
  { name: "React",       src: `${iconBase}/react/react-original.svg`,             glow: "rgba(97, 218, 251, 0.55)" },
  { name: "TypeScript",  src: `${iconBase}/typescript/typescript-original.svg`,   glow: "rgba(49, 120, 198, 0.55)" },
  { name: "JavaScript",  src: `${iconBase}/javascript/javascript-original.svg`,   glow: "rgba(247, 223, 30, 0.55)" },
  { name: "Next.js",     src: `${iconBase}/nextjs/nextjs-original.svg`,           glow: "rgba(255, 255, 255, 0.45)" },
  { name: "Node.js",     src: `${iconBase}/nodejs/nodejs-original.svg`,           glow: "rgba(51, 153, 51, 0.55)" },
  { name: "Python",      src: `${iconBase}/python/python-original.svg`,           glow: "rgba(55, 118, 171, 0.55)" },
  { name: "Tailwind CSS",src: `${iconBase}/tailwindcss/tailwindcss-original.svg`, glow: "rgba(6, 182, 212, 0.55)" },
  { name: "Figma",       src: `${iconBase}/figma/figma-original.svg`,             glow: "rgba(242, 78, 30, 0.55)" },
  { name: "HTML5",       src: `${iconBase}/html5/html5-original.svg`,             glow: "rgba(227, 79, 38, 0.55)" },
  { name: "CSS3",        src: `${iconBase}/css3/css3-original.svg`,               glow: "rgba(21, 114, 182, 0.55)" },
  { name: "MongoDB",     src: `${iconBase}/mongodb/mongodb-original.svg`,         glow: "rgba(71, 162, 72, 0.55)" },
  { name: "PostgreSQL",  src: `${iconBase}/postgresql/postgresql-original.svg`,   glow: "rgba(65, 105, 225, 0.55)" },
  { name: "Git",         src: `${iconBase}/git/git-original.svg`,                 glow: "rgba(240, 80, 50, 0.55)" },
  { name: "Docker",      src: `${iconBase}/docker/docker-original.svg`,           glow: "rgba(36, 150, 237, 0.55)" },
  { name: "Vue.js",      src: `${iconBase}/vuejs/vuejs-original.svg`,             glow: "rgba(79, 192, 141, 0.55)" },
  { name: "Redux",       src: `${iconBase}/redux/redux-original.svg`,             glow: "rgba(118, 74, 188, 0.55)" },
  { name: "Sass",        src: `${iconBase}/sass/sass-original.svg`,               glow: "rgba(204, 102, 153, 0.55)" },
  { name: "Photoshop",   src: `${iconBase}/photoshop/photoshop-original.svg`,     glow: "rgba(49, 168, 255, 0.55)" },
  { name: "Illustrator", src: `${iconBase}/illustrator/illustrator-plain.svg`,    glow: "rgba(255, 154, 0, 0.55)" },
  { name: "VS Code",     src: `${iconBase}/vscode/vscode-original.svg`,           glow: "rgba(0, 122, 204, 0.55)" },
];

const TOTAL = techIcons.length;

// ─── Responsive configuration ──────────────────────────────────────────────────
// All layout + 3D depth tuning lives here, keyed by measured container width.
// Changing the container width updates every parameter simultaneously — one
// source of truth for the entire responsive behaviour.
interface Cfg {
  cardSize:       number;  // px — card face size (square)
  gap:            number;  // px — space between cards
  visibleHalf:    number;  // slots rendered on each side of center
  perspective:    number;  // px — CSS perspective on the viewport
  rotateYMult:    number;  // deg per card-offset unit
  maxRotateY:     number;  // deg hard clamp
  translateZMult: number;  // px per card-offset unit (recedes)
  maxTranslateZ:  number;  // px hard clamp
  scaleFalloff:   number;  // scale decrease per unit
  scaleMin:       number;
  opacityFalloff: number;
  opacityMin:     number;
  fadeEdge:       number;  // offset beyond which opacity → 0
  speed:          number;  // cards / second (auto-scroll)
}

function getCfg(w: number): Cfg {
  // ── < 400 px — small phone (320, 360, 375, 390) ────────────────────────────
  if (w < 400) return {
    cardSize: 88,  gap: 10, visibleHalf: 1,
    perspective: 520,  rotateYMult: 7,   maxRotateY: 22,
    translateZMult: 30, maxTranslateZ: 90,
    scaleFalloff: 0.13, scaleMin: 0.66,
    opacityFalloff: 0.27, opacityMin: 0.30,
    fadeEdge: 2.4, speed: 0.28,
  };
  // ── 400–479 px — phone (414, 430) ──────────────────────────────────────────
  if (w < 480) return {
    cardSize: 96,  gap: 12, visibleHalf: 1,
    perspective: 600,  rotateYMult: 7,   maxRotateY: 24,
    translateZMult: 34, maxTranslateZ: 105,
    scaleFalloff: 0.12, scaleMin: 0.64,
    opacityFalloff: 0.25, opacityMin: 0.28,
    fadeEdge: 2.5, speed: 0.29,
  };
  // ── 480–639 px — large phone / small tablet (480, 600) ─────────────────────
  if (w < 640) return {
    cardSize: 108, gap: 14, visibleHalf: 2,
    perspective: 700,  rotateYMult: 8,   maxRotateY: 28,
    translateZMult: 42, maxTranslateZ: 130,
    scaleFalloff: 0.10, scaleMin: 0.62,
    opacityFalloff: 0.22, opacityMin: 0.26,
    fadeEdge: 3.0, speed: 0.31,
  };
  // ── 640–767 px — small tablet ──────────────────────────────────────────────
  if (w < 768) return {
    cardSize: 118, gap: 16, visibleHalf: 2,
    perspective: 820,  rotateYMult: 9,   maxRotateY: 32,
    translateZMult: 50, maxTranslateZ: 160,
    scaleFalloff: 0.09, scaleMin: 0.60,
    opacityFalloff: 0.20, opacityMin: 0.24,
    fadeEdge: 3.2, speed: 0.32,
  };
  // ── 768–1023 px — tablet (768, 820) ────────────────────────────────────────
  if (w < 1024) return {
    cardSize: 128, gap: 18, visibleHalf: 2,
    perspective: 920,  rotateYMult: 9,   maxRotateY: 36,
    translateZMult: 55, maxTranslateZ: 180,
    scaleFalloff: 0.09, scaleMin: 0.58,
    opacityFalloff: 0.18, opacityMin: 0.23,
    fadeEdge: 3.5, speed: 0.33,
  };
  // ── 1024–1279 px — small desktop (1024) ────────────────────────────────────
  if (w < 1280) return {
    cardSize: 138, gap: 20, visibleHalf: 3,
    perspective: 1050, rotateYMult: 10,  maxRotateY: 38,
    translateZMult: 62, maxTranslateZ: 200,
    scaleFalloff: 0.09, scaleMin: 0.56,
    opacityFalloff: 0.17, opacityMin: 0.22,
    fadeEdge: 4.2, speed: 0.34,
  };
  // ── >= 1280 px — desktop (1280, 1440, 1920, 2560) ──────────────────────────
  return {
    cardSize: 148, gap: 22, visibleHalf: 3,
    perspective: 1150, rotateYMult: 11,  maxRotateY: 42,
    translateZMult: 68, maxTranslateZ: 215,
    scaleFalloff: 0.09, scaleMin: 0.54,
    opacityFalloff: 0.17, opacityMin: 0.22,
    fadeEdge: 4.5, speed: 0.35,
  };
}

// ─── 3D card transform ─────────────────────────────────────────────────────────
// `offset` is a continuous float (0 = exactly centred).
// All curve parameters come from the responsive config so depth/rotation
// scales correctly across every viewport.
function getTransform(offset: number, reducedMotion: boolean, cfg: Cfg) {
  const absOff = Math.abs(offset);
  if (reducedMotion) {
    return {
      scale:      absOff < 0.5 ? 1 : Math.max(0.82, 1 - absOff * 0.06),
      rotateY:    0,
      translateZ: 0,
      opacity:    absOff > cfg.fadeEdge ? 0
                  : Math.max(cfg.opacityMin, 1 - absOff * cfg.opacityFalloff),
    };
  }
  const scale      = Math.max(cfg.scaleMin, 1 - absOff * cfg.scaleFalloff);
  const rotateY    = Math.sign(offset) * Math.min(absOff * cfg.rotateYMult, cfg.maxRotateY);
  const translateZ = Math.max(-cfg.maxTranslateZ, -absOff * cfg.translateZMult);
  const opacity    = absOff > cfg.fadeEdge ? 0
                     : Math.max(cfg.opacityMin, 1 - absOff * cfg.opacityFalloff);
  return { scale, rotateY, translateZ, opacity };
}

// ─── Container width via ResizeObserver ────────────────────────────────────────
// Measures the ACTUAL rendered width of the gallery viewport div so the stage
// width and centerX are always pixel-perfect — even with section padding,
// max-width constraints, and browser resizing.
// Returns a ref (attach to the element) and a width value that only updates
// when the measured width actually changes — not on every frame.
function useContainerWidth(): [React.MutableRefObject<HTMLDivElement | null>, number] {
  const ref = useRef<HTMLDivElement | null>(null);
  // Start with a reasonable SSR/first-paint guess based on window width.
  const [width, setWidth] = useState(() =>
    typeof window !== "undefined" ? Math.min(window.innerWidth, 1400) : 1280
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Immediate synchronous measurement after mount.
    const initial = el.getBoundingClientRect().width;
    if (initial > 0) setWidth(initial);

    // ResizeObserver handles all subsequent changes (resize, orientation, zoom).
    // Width is only set when it actually changes — no continuous re-renders.
    const ro = new ResizeObserver(entries => {
      const w = entries[0].contentRect.width;
      if (w > 0) setWidth(prev => (prev !== w ? w : prev));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []); // ref object is stable — safe empty dep array

  return [ref, width];
}

// ─── Slot pool size ────────────────────────────────────────────────────────────
// Maximum visibleHalf across all breakpoints is 3.
// We render slots from -(3+2) to +(3+2) = 11 total card wrappers.
// These DOM nodes are created once and reused; the rAF loop swaps their
// content and transforms imperatively — no React reconciliation overhead.
const MAX_VISIBLE_HALF = 3;
const POOL_EXTRA       = 2;                     // one extra each side for fade-in/out
const POOL_RANGE       = MAX_VISIBLE_HALF + POOL_EXTRA; // 5 slots each side
const POOL_SIZE        = POOL_RANGE * 2 + 1;    // 11 wrappers total

// ─── Main component ────────────────────────────────────────────────────────────
export function Skills() {
  const c = themeVars;

  // ── Reduced motion ─────────────────────────────────────────────────────────
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // ── Measured container width → responsive config ───────────────────────────
  // galleryRef attaches to the perspective-viewport div so width is exact.
  const [galleryRef, containerWidth] = useContainerWidth();
  const cfg = getCfg(containerWidth);

  // Keep refs so the rAF loop always reads current values without causing
  // re-renders or requiring rAF restart on every config change.
  const cfgRef          = useRef(cfg);
  cfgRef.current        = cfg;
  const reducedMotionRef = useRef(reducedMotion);
  reducedMotionRef.current = reducedMotion;

  // ── Layout geometry (calculated outside rAF — reused every frame) ──────────
  // These are derived from containerWidth and cfg, which only change on resize.
  const CARD_SIZE   = cfg.cardSize;
  const STRIDE      = cfg.cardSize + cfg.gap;
  const stageW      = containerWidth;
  // Center offset for translateX: positions the card so its center aligns with
  // the stage's horizontal midpoint. Using transform not `left`.
  const centerX     = stageW / 2 - CARD_SIZE / 2;

  // Keep geometry in a ref so rAF reads the latest value after resize.
  const geomRef = useRef({ CARD_SIZE, STRIDE, stageW, centerX });
  geomRef.current = { CARD_SIZE, STRIDE, stageW, centerX };

  // ── Single continuous rAF animation ───────────────────────────────────────
  // positionRef is the single carousel progress value (fractional card index).
  // It lives entirely outside React state — no setState on every frame.
  const positionRef = useRef(0);
  const pausedRef   = useRef(false);
  const rafRef      = useRef<number>(0);
  const lastTimeRef = useRef<number | null>(null);
  const speedRef    = useRef(cfg.speed);
  // Update speed on every render (sync with config) — rAF restart not needed.
  speedRef.current = reducedMotion ? 0.12 : cfg.speed;

  // ── Active skill label — React state, updated only on center-card change ──
  // This is the only React state that changes during normal animation.
  // It updates at most once per ~1/speed seconds, not 60× per second.
  const [activeSkillName, setActiveSkillName] = useState(techIcons[0].name);
  const lastFocusedIdxRef = useRef(-1);

  // ── DOM refs for imperative card updates ───────────────────────────────────
  // cardWrapperRefs: the outermost positioned div for each pool slot.
  // cardFaceRefs:    the inner tile div (background, border, shadow).
  // cardImgRefs:     the img element (filter, scale).
  // cardLabelRefs:   the name span (color).
  const cardWrapperRefs = useRef<(HTMLDivElement | null)[]>(Array(POOL_SIZE).fill(null));
  const cardFaceRefs    = useRef<(HTMLDivElement | null)[]>(Array(POOL_SIZE).fill(null));
  const cardImgRefs     = useRef<(HTMLImageElement | null)[]>(Array(POOL_SIZE).fill(null));
  const cardLabelRefs   = useRef<(HTMLSpanElement | null)[]>(Array(POOL_SIZE).fill(null));

  // ── Theme color refs (updated on render, read in rAF) ─────────────────────
  const themeRef = useRef(c);
  themeRef.current = c;

  // ── Single rAF loop — pure imperative DOM mutations ────────────────────────
  useEffect(() => {
    function tick(ts: number) {
      if (lastTimeRef.current === null) lastTimeRef.current = ts;
      const dt = Math.min((ts - lastTimeRef.current) / 1000, 0.1); // cap at 100 ms
      lastTimeRef.current = ts;

      if (!pausedRef.current) {
        positionRef.current = (positionRef.current + speedRef.current * dt + TOTAL) % TOTAL;
      }

      const pos  = positionRef.current;
      const cfg_ = cfgRef.current;
      const rm   = reducedMotionRef.current;
      const { CARD_SIZE: cs, STRIDE: stride, centerX: cx } = geomRef.current;

      const base = Math.floor(pos);
      const frac = pos - base;

      // Determine which data index is visually centered.
      const focusedIdx = ((base + (frac >= 0.5 ? 1 : 0)) % TOTAL + TOTAL) % TOTAL;

      // Update active label only when center card changes — not every frame.
      if (focusedIdx !== lastFocusedIdxRef.current) {
        lastFocusedIdxRef.current = focusedIdx;
        setActiveSkillName(techIcons[focusedIdx].name);
      }

      const colors = themeRef.current;

      // Update each pool slot imperatively.
      for (let i = 0; i < POOL_SIZE; i++) {
        const slot    = i - POOL_RANGE;              // −POOL_RANGE … +POOL_RANGE
        const offset  = slot - frac;
        const absOff  = Math.abs(offset);
        const dataIdx = ((base + slot) % TOTAL + TOTAL) % TOTAL;
        const icon    = techIcons[dataIdx];
        const { scale, rotateY, translateZ, opacity } = getTransform(offset, rm, cfg_);

        const wrapper = cardWrapperRefs.current[i];
        if (!wrapper) continue;

        const isCenter = absOff < 0.5;

        // Hide invisible cards entirely — avoids compositing cost.
        if (opacity <= 0.01) {
          wrapper.style.opacity    = "0";
          wrapper.style.visibility = "hidden";
          continue;
        }

        // ── Position: translateX replaces `left` — no layout thrash ──────────
        const posX = cx + offset * stride;

        wrapper.style.visibility = "visible";
        wrapper.style.opacity    = String(opacity);
        wrapper.style.zIndex     = String(Math.round(100 - absOff * 10));
        // GPU-composited properties only: transform (translateX + translateZ + rotateY + scale)
        wrapper.style.transform  =
          `translateX(${posX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
        wrapper.style.pointerEvents = isCenter ? "auto" : "none";
        wrapper.style.width      = `${cs}px`;
        wrapper.setAttribute("aria-hidden", isCenter ? "false" : "true");

        // ── Card face: update content when slot's dataIdx changes ─────────────
        // We track which icon was last painted on this wrapper to skip
        // redundant DOM writes when the same card stays in the same slot.
        const prevIcon = wrapper.dataset.iconName;
        const face     = cardFaceRefs.current[i];
        const img      = cardImgRefs.current[i];
        const label    = cardLabelRefs.current[i];

        if (face && img && label) {
          // Update icon source only when the slot content changes.
          if (prevIcon !== icon.name) {
            wrapper.dataset.iconName = icon.name;
            img.src = icon.src;
            img.alt = icon.name;
            label.textContent = icon.name;
          }

          // Always update visual state (center vs non-center styling).
          face.style.width  = `${cs}px`;
          face.style.height = `${cs}px`;

          if (isCenter) {
            face.style.background  =
              `radial-gradient(ellipse at 40% 30%, ${icon.glow.replace("0.55", "0.10")}, transparent 70%), ${colors.card}`;
            face.style.border      = `1px solid ${icon.glow.replace("0.55", "0.35")}`;
            face.style.boxShadow   =
              `0 8px 32px -8px ${icon.glow}, 0 0 0 0.5px ${icon.glow.replace("0.55", "0.15")} inset, ${colors.shadowLg}`;
            img.style.filter  = `drop-shadow(0 0 8px ${icon.glow})`;
            img.style.transform    = "scale(1.08)";
            label.style.color      = colors.heading;
          } else {
            face.style.background  = colors.card;
            face.style.border      = `1px solid ${colors.border}`;
            face.style.boxShadow   = colors.shadow;
            img.style.filter  = "none";
            img.style.transform    = "scale(1)";
            label.style.color      = colors.body;
          }

          const imgSize = `${Math.round(cs * 0.37)}px`;
          img.style.width  = imgSize;
          img.style.height = imgSize;

          const fontSize = `${Math.max(10, Math.round(cs * 0.082))}px`;
          label.style.fontSize = fontSize;
        }
      }

      // Apply perspective to viewport element imperatively too (on resize only
      // would require a ref + direct write; keeping it here is cheap since it's
      // a string comparison that no-ops if unchanged).
      const viewport = galleryRef.current;
      if (viewport) {
        const perspStr = rm ? "none" : `${cfg_.perspective}px`;
        if (viewport.style.perspective !== perspStr) {
          viewport.style.perspective = perspStr;
        }
        // Update stage height imperatively.
        const stage = viewport.firstElementChild as HTMLDivElement | null;
        if (stage) {
          const h = `${cs + 56}px`;
          if (stage.style.height !== h) stage.style.height = h;
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      lastTimeRef.current = null;
    };
    // speedRef, cfgRef, reducedMotionRef, geomRef, themeRef handle changes
    // via refs — only restart on reducedMotion toggle or TOTAL change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  // ── Pause / resume helpers ─────────────────────────────────────────────────
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pauseAuto = useCallback(() => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    pausedRef.current = true;
  }, []);

  const resumeAuto = useCallback((delay = 1200) => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => { pausedRef.current = false; }, delay);
  }, []);

  // Cleanup resume timer on unmount.
  useEffect(() => () => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
  }, []);

  // ── Touch — direction-aware, non-passive ───────────────────────────────────
  // Problem with React's onTouchMove: synthetic events are passive by default,
  // so e.preventDefault() is silently ignored — the gallery competes with
  // vertical page scroll and both happen simultaneously.
  //
  // Solution: one native touchmove listener with { passive: false }.
  // We detect swipe axis on the first significant movement:
  //   horizontal → take over the gesture, block page scroll
  //   vertical   → do nothing, browser scrolls the page naturally
  const touchStartXRef   = useRef<number | null>(null);
  const touchStartYRef   = useRef<number | null>(null);
  const touchAxisRef     = useRef<"horizontal" | "vertical" | null>(null);
  const touchStartPosRef = useRef(0);

  // React handlers (passive is fine for start/end)
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartXRef.current   = e.touches[0].clientX;
    touchStartYRef.current   = e.touches[0].clientY;
    touchAxisRef.current     = null;
    touchStartPosRef.current = positionRef.current;
    pauseAuto();
  }, [pauseAuto]);

  const onTouchEnd = useCallback(() => {
    touchStartXRef.current = null;
    touchAxisRef.current   = null;
    resumeAuto(1500);
  }, [resumeAuto]);

  // Non-passive native listener — registered once after mount, reads state via refs.
  useEffect(() => {
    const el = galleryRef.current;
    if (!el) return;

    function handleTouchMove(e: TouchEvent) {
      if (touchStartXRef.current === null || touchStartYRef.current === null) return;

      const dx = e.touches[0].clientX - touchStartXRef.current;
      const dy = e.touches[0].clientY - touchStartYRef.current;

      // Determine swipe axis once, on the first 5 px of movement.
      if (touchAxisRef.current === null) {
        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
          touchAxisRef.current = Math.abs(dx) >= Math.abs(dy) ? "horizontal" : "vertical";
        }
        return; // wait until axis is confirmed
      }

      if (touchAxisRef.current === "horizontal") {
        e.preventDefault(); // block horizontal page scroll only
        const { cardSize, gap } = cfgRef.current;
        const stride      = cardSize + gap;
        const deltaCards  = -dx / stride; // swipe right → position goes backward
        positionRef.current = ((touchStartPosRef.current + deltaCards) % TOTAL + TOTAL) % TOTAL;
      }
      // "vertical" → fall through, browser handles page scroll naturally
    }

    el.addEventListener("touchmove", handleTouchMove, { passive: false });
    return () => el.removeEventListener("touchmove", handleTouchMove);
    // galleryRef.current is stable after mount; all carousel state via refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Keyboard (accessibility) ───────────────────────────────────────────────
  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      pauseAuto();
      positionRef.current = ((positionRef.current - 1) % TOTAL + TOTAL) % TOTAL;
      resumeAuto(2000);
    }
    if (e.key === "ArrowRight") {
      pauseAuto();
      positionRef.current = (positionRef.current + 1) % TOTAL;
      resumeAuto(2000);
    }
  }, [pauseAuto, resumeAuto]);

  // ── Render — static DOM pool ───────────────────────────────────────────────
  // The card wrappers are rendered once with static structure.
  // The rAF loop mutates them imperatively without triggering re-renders.
  // `key` is the slot index — stable across renders, no reconciliation churn.
  return (
    <motion.section
      id="skills"
      className="py-28 overflow-hidden"
      style={{ background: c.sectionAlt }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: MOTION_EASE }}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">

        {/* ── Section Header ───────────────────────────────────────────────── */}
        <motion.div
          className="flex flex-col items-center mb-14 text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: MOTION_EASE }}
        >
          <span className="px-4 py-1.5 rounded-full text-sm mb-4 border" style={badgeStyle(c)}>
            My Skills
          </span>
          <h2 style={{
            fontFamily:    FONT_DISPLAY,
            fontSize:      "clamp(1.8rem, 4vw, 2.8rem)",
            fontWeight:    400,
            color:         c.heading,
            letterSpacing: "0.02em",
          }}>
            Tools &amp; <span style={{ color: c.primary }}>Proficiency</span>
          </h2>
          <p className="mt-3 max-w-xl" style={{
            fontFamily: FONT,
            fontSize:   "15px",
            color:      c.body,
            lineHeight: 1.7,
          }}>
            A curated toolkit spanning frontend, backend, and design — used daily to ship polished products.
          </p>
        </motion.div>

        {/* ── 3D Gallery ───────────────────────────────────────────────────── */}
        <div
          role="region"
          aria-label="Technology skills gallery — automatically scrolling"
          style={{
            display:       "flex",
            flexDirection: "column",
            alignItems:    "center",
            gap:           "1.75rem",
          }}
        >
          {/*
            Perspective viewport
            ─────────────────────────────────────────────────────────────────
            • ref={galleryRef}   → ResizeObserver measures this element;
                                   rAF loop also writes perspective imperatively
            • overflow: hidden   → clips cards that extend outside
            • perspective        → all cards share one vanishing point
                                   (initial value; updated imperatively by rAF)
            • contain: layout paint style → hard paint-clip including 3D transforms
            • isolation: isolate → new stacking context, prevents z-index leaks
          */}
          <div
            ref={galleryRef}
            className="skills-gallery-viewport"
            style={{
              width:             "100%",
              overflow:          "hidden",
              perspective:       reducedMotion ? "none" : `${cfg.perspective}px`,
              perspectiveOrigin: "50% 50%",
              contain:           "layout paint style",
              isolation:         "isolate",
            }}
            onMouseEnter={pauseAuto}
            onMouseLeave={() => resumeAuto(800)}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            onKeyDown={onKeyDown}
            tabIndex={0}
            aria-label="Use arrow keys or swipe to browse skills"
          >
            {/*
              Stage
              ───────────────────────────────────────────────────────────────
              Width matches measured container → centerX is always correct.
              Height = card height + label space (updated imperatively by rAF).
              transformStyle: preserve-3d — all cards share the 3D context.
            */}
            <div
              className="skills-gallery-stage"
              style={{
                transformStyle: "preserve-3d",
                position:       "relative",
                width:          `${stageW}px`,
                height:         `${CARD_SIZE + 56}px`,
                cursor:         "grab",
              }}
            >
              {/*
                Fixed pool of POOL_SIZE card wrappers.
                ─────────────────────────────────────────────────────────────
                These nodes are created once and never removed.
                The rAF loop mutates their transform/opacity/content
                imperatively — zero React reconciliation during animation.

                Initial visibility: hidden + opacity 0 so there's no flash
                of unstyled content before the first rAF tick.
              */}
              {Array.from({ length: POOL_SIZE }, (_, i) => {
                const slot = i - POOL_RANGE; // -POOL_RANGE … +POOL_RANGE
                // Initial content: use slot index to spread icons out
                const initIdx = ((slot) % TOTAL + TOTAL) % TOTAL;
                const icon    = techIcons[initIdx];
                return (
                  <div
                    key={slot}
                    ref={el => { cardWrapperRefs.current[i] = el; }}
                    data-icon-name=""
                    aria-hidden="true"
                    style={{
                      position:   "absolute",
                      top:        0,
                      left:       0,
                      width:      `${CARD_SIZE}px`,
                      // GPU-composited only — transform includes translateX
                      transform:  "translateX(-9999px)",
                      opacity:    0,
                      visibility: "hidden",
                      willChange: "transform, opacity",
                    }}
                  >
                    {/* ── Card face — design UNCHANGED ───────────────────── */}
                    <div
                      ref={el => { cardFaceRefs.current[i] = el; }}
                      className="skill-3d-tile"
                      style={{
                        display:        "flex",
                        flexDirection:  "column",
                        alignItems:     "center",
                        justifyContent: "center",
                        gap:            "10px",
                        width:          `${CARD_SIZE}px`,
                        height:         `${CARD_SIZE}px`,
                        borderRadius:   "20px",
                        background:     c.card,
                        border:         `1px solid ${c.border}`,
                        boxShadow:      c.shadow,
                      }}
                    >
                      <img
                        ref={el => { cardImgRefs.current[i] = el; }}
                        src={icon.src}
                        alt={icon.name}
                        loading="lazy"
                        draggable={false}
                        style={{
                          width:     `${Math.round(CARD_SIZE * 0.37)}px`,
                          height:    `${Math.round(CARD_SIZE * 0.37)}px`,
                          objectFit: "contain",
                          filter:    "none",
                          transform: "scale(1)",
                        }}
                      />
                      <span
                        ref={el => { cardLabelRefs.current[i] = el; }}
                        style={{
                          fontFamily:    FONT,
                          fontSize:      `${Math.max(10, Math.round(CARD_SIZE * 0.082))}px`,
                          fontWeight:    600,
                          color:         c.body,
                          letterSpacing: "0.02em",
                          textAlign:     "center",
                          lineHeight:    1.2,
                        }}
                      >
                        {icon.name}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Active skill label — synchronized with visual center ────────
              AnimatePresence enables the exit animation when the key changes.
              State updates at most once per ~1/speed seconds — not per frame.
          */}
          <AnimatePresence mode="wait">
            <motion.p
              key={activeSkillName}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              aria-live="polite"
              aria-atomic="true"
              style={{
                fontFamily:    FONT,
                fontSize:      "13px",
                fontWeight:    500,
                color:         c.muted,
                letterSpacing: "0.10em",
                textTransform: "uppercase",
                marginTop:     "0.25rem",
              }}
            >
              {activeSkillName}
            </motion.p>
          </AnimatePresence>
        </div>

      </div>

      <style>{`
        /* ── Focus ring — keyboard accessibility ────────────────────────── */
        .skills-gallery-viewport:focus {
          outline: 2px solid var(--mv-primary-border);
          outline-offset: 4px;
          border-radius: 8px;
        }
        .skills-gallery-viewport:focus:not(:focus-visible) {
          outline: none;
        }

        /* ── Reduced-motion overrides ───────────────────────────────────── */
        @media (prefers-reduced-motion: reduce) {
          /*
            The rAF loop already reads reducedMotionRef and:
            • Sets speed to 0.12 cards/s (greatly reduced, not stopped)
            • Sets rotateY = 0, translateZ = 0 (flat layout)
            These CSS rules act as an additional safety net.
          */
          .skill-3d-tile        { transition: none !important; }
          .skills-gallery-stage { perspective: none !important; }
        }

        /*
          Gallery is self-contained.
          contain: layout style — prevents the section from contributing to
          document layout/width even when 3D transforms extend beyond its box.
        */
        #skills { contain: layout style; }
      `}</style>
    </motion.section>
  );
}
