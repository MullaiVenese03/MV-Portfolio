import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { Send, Check, Loader2 } from "lucide-react";
import { FONT, themeVars } from "../theme";

interface PaperPlaneButtonProps {
  type?: "submit" | "button";
  isSending?: boolean;
  isSent?: boolean;
  disabled?: boolean;
  label?: string;
  sendingLabel?: string;
  sentLabel?: string;
  onFlightStart?: () => boolean; // return false to abort if validation fails
  onFlightComplete?: () => void;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  style?: React.CSSProperties;
}

export function PaperPlaneButton({
  type = "submit",
  isSending = false,
  isSent = false,
  disabled = false,
  label = "Send Message",
  sendingLabel = "Sending...",
  sentLabel = "Message Sent",
  onFlightStart,
  onFlightComplete,
  onClick,
  className = "",
  style = {},
}: PaperPlaneButtonProps) {
  const c = themeVars;
  const iconRef = useRef<HTMLDivElement>(null);
  const [isFlying, setIsFlying] = useState(false);
  const [flyingPos, setFlyingPos] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isFlying || isSending || isSent) return;

    if (onClick) {
      onClick(e);
    }

    if (onFlightStart) {
      const isValid = onFlightStart();
      if (!isValid) return; // Validation failed, do not launch plane
    }

    // Capture starting position of paper plane icon for detachment portal
    if (iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      setFlyingPos({
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
      });
      setIsFlying(true);
    } else {
      onFlightComplete?.();
    }
  };

  const handleFlightComplete = () => {
    setIsFlying(false);
    setFlyingPos(null);
    onFlightComplete?.();
  };

  return (
    <>
      <button
        type={type}
        onClick={handleClick}
        disabled={disabled || isFlying || isSending || isSent}
        aria-busy={isFlying || isSending}
        className={`group relative inline-flex items-center justify-center gap-2.5 overflow-hidden px-7 py-3.5 rounded-xl text-white font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-90 ${className}`}
        style={{
          background: c.primary,
          fontFamily: FONT,
          fontSize: "15px",
          fontWeight: 700,
          boxShadow: "0 4px 20px rgba(37,99,235,0.32)",
          minWidth: "170px",
          height: "48px",
          ...style,
        }}
      >
        {/* Subtle sheen highlight */}
        <span className="absolute inset-y-0 -left-1/3 w-1/3 bg-white/20 blur-sm transition-transform duration-700 group-hover:translate-x-[450%]" />

        <AnimatePresence mode="wait">
          {isSent ? (
            <motion.div
              key="sent-state"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 inline-flex items-center gap-2 text-white"
            >
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <Check size={13} strokeWidth={3} className="text-white" />
              </div>
              <span className="tracking-tight">{sentLabel}</span>
            </motion.div>
          ) : isSending ? (
            <motion.div
              key="sending-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 inline-flex items-center gap-2 text-white"
            >
              <Loader2 size={16} className="animate-spin text-white/90" />
              <span>{sendingLabel}</span>
            </motion.div>
          ) : (
            <motion.div
              key="idle-state"
              initial={{ opacity: 1 }}
              animate={{ opacity: isFlying ? 0.4 : 1 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 inline-flex items-center gap-2.5"
            >
              <span>{label}</span>

              {/* Anchor element for Paper Plane Icon */}
              <div
                ref={iconRef}
                className="relative flex items-center justify-center w-4 h-4"
              >
                <Send
                  size={16}
                  strokeWidth={2}
                  className={`transition-opacity duration-150 ${
                    isFlying ? "opacity-0" : "opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
                  }`}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Screen-Wide Detached Paper Plane Flight Portal Overlay */}
      {isFlying && flyingPos && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden">
          <motion.div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: flyingPos.width || 20,
              height: flyingPos.height || 20,
              transformOrigin: "center center",
            }}
            initial={{
              x: flyingPos.x,
              y: flyingPos.y,
              rotate: 0,
              scale: 1,
            }}
            animate={{
              x: [
                flyingPos.x,
                flyingPos.x + 60,
                flyingPos.x + 320,
                window.innerWidth + 200,
              ],
              y: [
                flyingPos.y,
                flyingPos.y,
                flyingPos.y,
                flyingPos.y,
              ],
              rotate: [0, 0, 0, 0],
              scale: [1, 1.1, 1.05, 0.95],
            }}
            transition={{
              duration: 0.85,
              ease: [0.32, 0, 0.15, 1], // Progressive realistic acceleration curve
            }}
            onAnimationComplete={handleFlightComplete}
            className="relative flex items-center justify-center"
          >
            {/* Aerodynamic Air-Flow Wind Streaks Trailing Behind Plane */}
            <motion.div
              className="absolute right-full top-1/2 -translate-y-1/2 flex flex-col justify-between pointer-events-none"
              style={{
                height: "16px",
                marginRight: "2px",
                transformOrigin: "right center",
              }}
              animate={{
                width: ["0px", "40px", "95px", "140px", "20px"],
                opacity: [0, 0.9, 0.95, 0.6, 0],
              }}
              transition={{
                duration: 0.85,
                ease: [0.32, 0, 0.15, 1],
              }}
            >
              {/* Top aerodynamic streak line */}
              <div
                className="h-[1.5px] w-full rounded-full"
                style={{
                  background:
                    "linear-gradient(270deg, rgba(255,255,255,0.95) 0%, rgba(147,197,253,0.7) 45%, transparent 100%)",
                  boxShadow: "0 0 6px rgba(147,197,253,0.5)",
                }}
              />
              {/* Middle aerodynamic streak line */}
              <div
                className="h-[1px] w-[85%] rounded-full self-end my-0.5"
                style={{
                  background:
                    "linear-gradient(270deg, rgba(255,255,255,0.85) 0%, rgba(191,219,254,0.5) 50%, transparent 100%)",
                }}
              />
              {/* Bottom aerodynamic streak line */}
              <div
                className="h-[1.5px] w-[95%] rounded-full"
                style={{
                  background:
                    "linear-gradient(270deg, rgba(255,255,255,0.9) 0%, rgba(147,197,253,0.6) 40%, transparent 100%)",
                  boxShadow: "0 0 6px rgba(147,197,253,0.4)",
                }}
              />
            </motion.div>

            {/* Outlined Paper Plane Icon with subtle glow */}
            <Send
              size={18}
              strokeWidth={2}
              className="text-white drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]"
            />
          </motion.div>
        </div>,
        document.body
      )}
    </>
  );
}
