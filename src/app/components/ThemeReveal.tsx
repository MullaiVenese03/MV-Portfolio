import { motion } from "motion/react";
import { useEffect, useMemo } from "react";
import { getRevealRadius, MOTION_EASE, prefersReducedMotion, THEME_REVEAL_MS } from "../theme";
import type { ThemeRevealState } from "../hooks/useTheme";

interface ThemeRevealProps {
  reveal: ThemeRevealState | null;
  onComplete: (toDark: boolean) => void;
}

export function ThemeReveal({ reveal, onComplete }: ThemeRevealProps) {
  const reducedMotion = prefersReducedMotion();

  const radius = useMemo(() => {
    if (!reveal) return 0;
    return getRevealRadius(reveal.origin);
  }, [reveal]);

  useEffect(() => {
    if (reveal && reducedMotion) {
      onComplete(reveal.toDark);
    }
  }, [reveal, reducedMotion, onComplete]);

  if (!reveal || reducedMotion) return null;

  const { x, y } = reveal.origin;
  const duration = THEME_REVEAL_MS / 1000;

  return (
    <motion.div
      key={reveal.id}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9999]"
      initial={{
        clipPath: `circle(0px at ${x}px ${y}px)`,
      }}
      animate={{
        clipPath: `circle(${radius}px at ${x}px ${y}px)`,
      }}
      transition={{
        duration,
        ease: MOTION_EASE,
      }}
      onAnimationComplete={() => onComplete(reveal.toDark)}
      style={{
        background: reveal.color,
        willChange: "clip-path",
      }}
    />
  );
}
