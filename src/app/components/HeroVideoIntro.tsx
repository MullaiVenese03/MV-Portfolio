import { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "motion/react";
import { Volume2, VolumeX } from "lucide-react";
import heroVideo from "../../imports/Hero Video.mp4";
import { MOTION_EASE } from "../theme";

interface HeroVideoIntroProps {
  onComplete: () => void;
}

export function HeroVideoIntro({ onComplete }: HeroVideoIntroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [showUnmuteHint, setShowUnmuteHint] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const handleSkip = useCallback(() => {
    onCompleteRef.current();
  }, []);

  const toggleSound = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
    if (!nextMuted) {
      setShowUnmuteHint(false);
      video.play().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Default audio to ON
    video.muted = false;
    setIsMuted(false);

    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // Audio autoplay allowed by browser
          setIsMuted(false);
          setShowUnmuteHint(false);
        })
        .catch(() => {
          // Audio autoplay blocked by browser policy:
          // Mute temporarily so video never freezes, show unmute option
          video.muted = true;
          setIsMuted(true);
          setShowUnmuteHint(true);
          video.play().catch(() => {
            handleSkip();
          });
        });
    }

    // Safety watchdog: complete after 45s maximum to avoid locking screen
    const timeout = setTimeout(() => {
      handleSkip();
    }, 45000);

    return () => clearTimeout(timeout);
  }, [handleSkip]);

  return (
    <motion.div
      key="hero-video-intro"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: MOTION_EASE }}
      onClick={() => {
        if (isMuted) toggleSound();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#020202",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        cursor: isMuted ? "pointer" : "default",
      }}
    >
      <video
        ref={videoRef}
        src={heroVideo}
        autoPlay
        playsInline
        onEnded={handleSkip}
        onError={handleSkip}
        style={{
          width: "100vw",
          height: "100vh",
          objectFit: "cover",
          display: "block",
        }}
      />

      {/* Audio toggle & Autoplay hint */}
      <div
        style={{
          position: "absolute",
          bottom: 30,
          left: 30,
          display: "flex",
          alignItems: "center",
          gap: 12,
          zIndex: 10000,
        }}
      >
        <button
          onClick={toggleSound}
          aria-label={isMuted ? "Turn sound on" : "Turn sound off"}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 16px",
            borderRadius: 999,
            background: "rgba(255, 255, 255, 0.14)",
            border: "1px solid rgba(255, 255, 255, 0.25)",
            color: "#FFFFFF",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            backdropFilter: "blur(12px)",
            transition: "all 0.2s ease",
          }}
        >
          {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          <span>{isMuted ? "Sound: OFF (Unmute)" : "Sound: ON (Mute)"}</span>
        </button>

        {showUnmuteHint && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              color: "rgba(255, 255, 255, 0.75)",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            Click anywhere to enable audio
          </motion.span>
        )}
      </div>

      {/* Glassmorphic Skip Video button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleSkip();
        }}
        style={{
          position: "absolute",
          bottom: 30,
          right: 30,
          padding: "8px 18px",
          borderRadius: 999,
          background: "rgba(255, 255, 255, 0.14)",
          border: "1px solid rgba(255, 255, 255, 0.25)",
          color: "#FFFFFF",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.08em",
          cursor: "pointer",
          backdropFilter: "blur(12px)",
          transition: "transform 0.2s ease, opacity 0.2s ease",
          zIndex: 10000,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        Skip Video →
      </button>
    </motion.div>
  );
}
