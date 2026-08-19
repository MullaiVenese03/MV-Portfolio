import { ArrowUp } from "lucide-react";
import { motion } from "motion/react";
import mvLogo from "../../imports/MV-Logo.svg";
import { navSections } from "../data/navigation";
import { socialLinks } from "../data/socialLinks";
import { badgeStyle, FONT, FONT_DISPLAY, MOTION_EASE, themeVars, TIMING } from "../theme";
import { FooterLink } from "./FooterLink";
import { SocialIconLink } from "./SocialIconLink";
import { scrollToSection } from "../lib/scroll";

interface FooterProps {
  darkMode: boolean;
}

export function Footer({ darkMode }: FooterProps) {
  const c = themeVars;

  const scrollTo = (id: string) => {
    scrollToSection(id);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative overflow-hidden" style={{ background: c.sectionAlt }}>
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${c.footerGlow}, transparent)`,
        }}
      />

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="flex flex-col gap-6 pt-12 pb-10 sm:flex-row sm:items-center sm:justify-between">
          <nav
            className="flex flex-wrap items-center gap-x-6 gap-y-2"
            aria-label="Footer navigation"
          >
            {navSections.map((item) => (
              <FooterLink key={item.label} onClick={() => scrollTo(item.id)}>
                {item.label}
              </FooterLink>
            ))}
          </nav>

          <button
            onClick={scrollToTop}
            className="group self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-500/40 hover:bg-blue-500/10 hover:shadow-lg hover:shadow-blue-500/15 active:scale-95"
            style={{
              fontFamily: FONT,
              fontSize: "13px",
              fontWeight: 600,
              color: c.body,
              borderColor: c.border,
              background: c.card,
            }}
          >
            Back to Top
            <ArrowUp
              size={14}
              className="transition-transform duration-300 group-hover:-translate-y-1"
            />
          </button>
        </div>

        <motion.div
          className="relative py-14 md:py-20 lg:py-28 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: TIMING.reveal, ease: MOTION_EASE }}
        >
          <span
            className="relative z-10 inline-block px-4 py-1.5 rounded-full text-sm mb-6 border"
            style={badgeStyle(c)}
          >
            Have a Project in Mind?
          </span>

          <button
            onClick={() => scrollTo("contact")}
            className="footer-talk-btn group relative z-10 block w-full mx-auto cursor-pointer transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
            aria-label="Let's talk - go to contact section"
          >
            <span
              className="block transition-opacity duration-300 group-hover:opacity-80"
              style={{
                fontFamily: FONT_DISPLAY,
                fontSize: "clamp(2.5rem, 22vw, 16rem)",
                fontWeight: 400,
                color: c.heading,
                lineHeight: 1,
                letterSpacing: "0.03em",
              }}
            >
              LET&apos;S TALK
            </span>
          </button>
        </motion.div>

        <div className="flex flex-wrap items-center justify-center gap-3 pb-14 md:pb-16">
          {socialLinks.map((link) => (
            <SocialIconLink
              key={link.label}
              {...link}
              darkMode={darkMode}
              variant="footer"
              size={15}
            />
          ))}
        </div>

        <div
          className="py-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between"
          style={{ borderTop: `1px solid ${c.border}` }}
        >
          <p style={{ fontFamily: FONT, fontSize: "13px", color: c.muted }}>
            © 2026{" "}
            <span style={{ color: c.heading, fontWeight: 600 }}>Mullai Venese</span>
          </p>

          <div className="flex items-center gap-3 md:text-right">
            <div>
              <p
                style={{
                  fontFamily: FONT,
                  fontSize: "15px",
                  fontWeight: 700,
                  color: c.heading,
                  letterSpacing: "-0.01em",
                }}
              >
                MullaiVenese
              </p>
              <p
                className="mt-0.5 max-w-xs"
                style={{
                  fontFamily: FONT,
                  fontSize: "12px",
                  color: c.muted,
                  lineHeight: 1.5,
                }}
              >
                Front-End Developer & UI/UX Designer - crafting purposeful
                digital experiences.
              </p>
            </div>
            <img
              src={mvLogo}
              alt="Mullai Venese monogram logo"
              className="w-10 h-10 object-contain flex-shrink-0"
              draggable={false}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

