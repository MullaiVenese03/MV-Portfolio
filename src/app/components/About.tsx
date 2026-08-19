import { motion } from "motion/react";
import { Download } from "lucide-react";
import { socialLinks } from "../data/socialLinks";
import { SocialIconLink } from "./SocialIconLink";
import myImage from "../../imports/My-Image-1.png";
import signatureImage from "../../imports/Mullai-Signature-Image.png";
import { badgeStyle, FONT, FONT_DISPLAY, MOTION_EASE, themeVars } from "../theme";

interface AboutProps {
  darkMode: boolean;
}

export function About({ darkMode }: AboutProps) {
  const c = themeVars;

  return (
    <section
      id="about"
      className="relative pt-32 pb-28 lg:pt-36 lg:pb-28 overflow-hidden"
      style={{ background: c.section }}
    >
      {/* ── Container Reveal (opacity, translateY 70px, scale 0.98 -> 1) ── */}
      <motion.div
        className="max-w-[1400px] w-full mx-auto px-6 lg:px-10"
        initial={{ opacity: 0, y: 70, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.75, ease: MOTION_EASE }}
      >

        {/* ── Heading Reveal (fade, translateY, letter-spacing animation) ── */}
        <motion.div
          className="flex flex-col items-center mb-16 text-center"
          initial={{ opacity: 0, y: 28, letterSpacing: "-0.04em" }}
          whileInView={{ opacity: 1, y: 0, letterSpacing: "-0.02em" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, delay: 0.1, ease: MOTION_EASE }}
        >
          <span className="px-4 py-1.5 rounded-full text-sm mb-4 border" style={badgeStyle(c)}>
            About Me
          </span>
          <h2
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              fontWeight: 400,
              color: c.heading,
              letterSpacing: "0.02em",
            }}
          >
            Turning Ideas Into{" "}
            <span style={{ color: c.primary }}>Digital Reality</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* ── Profile Image Reveal (fade, scale 0.94->1, blur 10px->0, translateX) ── */}
          <motion.div
            className="relative flex justify-center"
            initial={{ opacity: 0, scale: 0.94, x: -24, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, scale: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: MOTION_EASE }}
          >
            <div className="relative inline-block">
              <img
                src={myImage}
                alt="Mullai Venese - Front-End Developer and UI/UX Designer"
                loading="lazy"
                decoding="async"
                width={400}
                height={533}
                style={{
                  width: "clamp(260px, 40vw, 400px)",
                  height: "auto",
                  objectFit: "contain",
                  display: "block",
                }}
              />

              {/* Signature autograph */}
              <img
                src={signatureImage}
                alt="Mullai Venese personal signature"
                draggable={false}
                style={{
                  position: "absolute",
                  left: "-40%",
                  bottom: "-10%",
                  width: "80%",
                  height: "auto",
                  objectFit: "contain",
                  filter: "drop-shadow(0 4px 10px rgba(37,99,235,0.25))",
                  pointerEvents: "none",
                }}
              />
            </div>
          </motion.div>

          {/* ── Right Content Container ── */}
          <div className="flex flex-col gap-6">

            {/* Paragraph Line-by-Line Stagger Reveal (80ms interval) */}
            <div className="flex flex-col gap-4">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, delay: 0.3, ease: MOTION_EASE }}
                style={{
                  fontFamily: FONT,
                  fontSize: "15px",
                  fontWeight: 400,
                  color: c.body,
                  lineHeight: 1.8,
                }}
              >
                I'm <strong style={{ color: c.heading, fontWeight: 700 }}>MullaiVenese</strong>, a passionate Front-End Developer and UI/UX Designer. I specialize in crafting pixel-perfect digital experiences that blend exceptional design with rock-solid engineering.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, delay: 0.38, ease: MOTION_EASE }}
                style={{
                  fontFamily: FONT,
                  fontSize: "15px",
                  fontWeight: 400,
                  color: c.body,
                  lineHeight: 1.8,
                }}
              >
                From building scalable web applications to designing intuitive user interfaces, I bring a holistic approach to every project - ensuring both beauty and performance in every line of code.
              </motion.p>
            </div>

            {/* ── Social Links & Resume Button Reveal (slight scale and soft glow) ── */}
            <div className="flex flex-col items-start gap-5 mt-2">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: 0.65, ease: MOTION_EASE }}
                className="flex flex-wrap items-center gap-3"
              >
                {socialLinks.map((link) => (
                  <SocialIconLink
                    key={link.label}
                    {...link}
                    darkMode={darkMode}
                    variant="default"
                  />
                ))}
              </motion.div>

              <motion.a
                initial={{ opacity: 0, scale: 0.92, y: 16 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, delay: 0.72, ease: MOTION_EASE }}
                href="/resume.pdf"
                download
                className="group relative flex items-center gap-2 px-6 py-3 rounded-full text-sm text-white transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.03] active:scale-95"
                style={{
                  background: c.primary,
                  fontFamily: FONT,
                  fontWeight: 700,
                  boxShadow: "0 4px 20px rgba(37,99,235,0.38)",
                }}
              >
                {/* Soft ambient glow overlay on reveal */}
                <div className="absolute -inset-1 rounded-full opacity-35 blur-md bg-blue-500/30 pointer-events-none transition-opacity duration-300 group-hover:opacity-75" />
                <Download size={15} className="relative z-10 transition-transform duration-300 group-hover:translate-y-0.5" />
                <span className="relative z-10">Download Resume</span>
              </motion.a>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
