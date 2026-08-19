import { Link, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronRight, ExternalLink, Github } from "lucide-react";
import { getProject, getAdjacent } from "../data/projects";
import { ProjectStructuredData } from "../components/StructuredData";
import { PAGE_META, SITE } from "../config/site";
import { usePageMeta } from "../hooks/usePageMeta";
import { badgeStyle, MOTION_EASE, themeVars, type ThemeColors } from "../theme";
import { NotFound } from "./NotFound";

type SectionProps = { title: string; children: React.ReactNode; c: ThemeColors };
function Section({ title, children, c }: SectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: MOTION_EASE }}
      className="mb-14"
    >
      <h2
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: "clamp(1.4rem, 2.6vw, 1.9rem)",
          fontWeight: 800,
          color: c.heading,
          letterSpacing: "-0.01em",
          marginBottom: 16,
        }}
      >
        {title}
      </h2>
      <div style={{ color: c.body, lineHeight: 1.75 }}>{children}</div>
    </motion.section>
  );
}

function Bullets({ items, c }: { items: string[]; c: ThemeColors }) {
  return (
    <ul className="space-y-2">
      {items.map((it) => (
        <li key={it} className="flex gap-3 items-start">
          <span
            className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: c.primary }}
          />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

function Pills({ items, c }: { items: string[]; c: ThemeColors }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((it) => (
        <span
          key={it}
          className="px-3 py-1.5 rounded-lg text-sm"
          style={{
            fontWeight: 600,
            background: c.pill,
            color: c.body,
          }}
        >
          {it}
        </span>
      ))}
    </div>
  );
}

export function ProjectDetail() {
  const { slug = "" } = useParams();
  const project = getProject(slug);
  const c = themeVars;

  usePageMeta({
    title: project ? `${project.title} | ${SITE.name}` : PAGE_META.notFound.title,
    description: project?.description ?? PAGE_META.notFound.description,
    path: project ? `/projects/${project.slug}` : `/projects/${slug}`,
    image: project?.img ?? SITE.ogImage,
    type: "article",
    noIndex: !project,
  });

  if (!project) return <NotFound />;
  const { prev, next } = getAdjacent(slug);
  const d = project.details;

  return (
    <article className="pt-32 pb-24" style={{ background: c.bg }}>
      <ProjectStructuredData project={project} />
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm mb-8 flex-wrap">
          <Link to="/" style={{ color: c.muted, fontWeight: 500 }} className="hover:opacity-70 transition-opacity">Home</Link>
          <ChevronRight size={14} style={{ color: c.muted }} />
          <Link to="/projects" style={{ color: c.muted, fontWeight: 500 }} className="hover:opacity-70 transition-opacity">Projects</Link>
          <ChevronRight size={14} style={{ color: c.muted }} />
          <span style={{ color: c.heading, fontWeight: 600 }}>{project.title}</span>
        </nav>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: MOTION_EASE }}
        >
          <span className="inline-block px-3 py-1 rounded-full text-xs mb-4 border" style={badgeStyle(c)}>
            {project.category}
          </span>
          <h1
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "clamp(2.2rem, 6vw, 4rem)",
              fontWeight: 800,
              color: c.heading,
              letterSpacing: "-0.02em",
            }}
          >
            {project.title}
          </h1>
          <p style={{ color: c.body, fontSize: 18, marginTop: 16, maxWidth: 760 }}>
            {project.description}
          </p>

          <div className="flex flex-wrap gap-3 mt-8">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm text-white transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25 active:scale-95"
                style={{ background: c.primary, fontWeight: 600 }}
              >
                <ExternalLink size={14} className="transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110" /> Live Demo <ArrowUpRight size={13} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm border transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-lg active:scale-95"
                style={{ borderColor: c.border, color: c.heading, fontWeight: 600 }}
              >
                <Github size={14} className="transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110" /> Repository <ArrowUpRight size={13} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            )}
          </div>
        </motion.div>

        {/* Hero image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: MOTION_EASE, delay: 0.1 }}
          className="mt-12 mb-20 rounded-3xl overflow-hidden border"
          style={{ borderColor: c.border }}
        >
          <img
            src={project.img}
            alt={`${project.title} - Main project banner and hero presentation`}
            className="w-full h-auto object-cover"
            loading="lazy"
            decoding="async"
          />
        </motion.div>

        {/* Sections */}
        <div className="grid lg:grid-cols-[1fr_320px] gap-12">
          <div>
            <Section title="Project Overview" c={c}><p>{d.overview}</p></Section>
            <Section title="Problem & Purpose" c={c}><p>{d.problem}</p></Section>
            {d.role && (
              <Section title="My Role" c={c}><p>{d.role}</p></Section>
            )}
            {d.goals && d.goals.length > 0 && (
              <Section title="Goals & Objectives" c={c}><Bullets items={d.goals} c={c} /></Section>
            )}
            {d.research && (
              <Section title="Research Process" c={c}><p>{d.research}</p></Section>
            )}
            {d.designProcess && (
              <Section title="Design Approach" c={c}><p>{d.designProcess}</p></Section>
            )}
            {d.developmentProcess && (
              <Section title="Development Approach" c={c}><p>{d.developmentProcess}</p></Section>
            )}
            <Section title="Main Features" c={c}><Bullets items={d.features} c={c} /></Section>
            <Section title="Technologies Used" c={c}><Pills items={d.techStack} c={c} /></Section>
            {d.uiUxDecisions && d.uiUxDecisions.length > 0 && (
              <Section title="UI/UX Decisions" c={c}><Bullets items={d.uiUxDecisions} c={c} /></Section>
            )}
            <Section title="Challenges Faced" c={c}><Bullets items={d.challenges} c={c} /></Section>
            <Section title="Solutions Implemented" c={c}><Bullets items={d.solutions} c={c} /></Section>
            <Section title="What I Learned" c={c}><Bullets items={d.learnings} c={c} /></Section>
            <Section title="Results & Outcome" c={c}><Bullets items={d.results} c={c} /></Section>
          </div>


          {/* Sidebar */}
          <aside className="lg:sticky lg:top-28 self-start">
            <div
              className="rounded-3xl border p-6"
              style={{ background: c.card, borderColor: c.border }}
            >
              <div style={{ color: c.muted, fontSize: 12, fontWeight: 600, letterSpacing: "0.08em" }}>
                CATEGORY
              </div>
              <div style={{ color: c.heading, fontWeight: 700, marginTop: 4, marginBottom: 16 }}>
                {project.category}
              </div>
              <div style={{ color: c.muted, fontSize: 12, fontWeight: 600, letterSpacing: "0.08em" }}>
                TAGS
              </div>
              <div className="mt-2 mb-4">
                <Pills items={project.tags} c={c} />
              </div>
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-center gap-1.5 text-center px-4 py-2.5 rounded-full text-sm text-white mt-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/25 active:scale-95"
                  style={{ background: c.primary, fontWeight: 600 }}
                >
                  Visit Live <ArrowUpRight size={13} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              )}
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-center gap-1.5 text-center px-4 py-2.5 rounded-full text-sm mt-2 border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:scale-95"
                  style={{ color: c.heading, borderColor: c.border, fontWeight: 600 }}
                >
                  View Code <ArrowUpRight size={13} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              )}
            </div>
          </aside>
        </div>

        {/* Design System — only rendered when designSystem data is present */}
        {d.designSystem && (
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: MOTION_EASE }}
            className="mt-20"
          >
            <h2
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "clamp(1.4rem, 2.6vw, 1.9rem)",
                fontWeight: 800,
                color: c.heading,
                letterSpacing: "-0.01em",
                marginBottom: 24,
              }}
            >
              Design System
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Colour Palette */}
              <div>
                <div style={{ color: c.muted, fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", marginBottom: 14 }}>COLOUR PALETTE</div>
                <div className="flex flex-col gap-3">
                  {d.designSystem.palette.map((col) => (
                    <div
                      key={col.hex}
                      className="flex items-center gap-3 rounded-xl border px-3 py-2"
                      style={{ borderColor: c.border, background: c.card }}
                    >
                      <div
                        className="rounded-md flex-shrink-0"
                        style={{ width: 36, height: 36, background: col.hex, border: "1px solid rgba(0,0,0,.08)" }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, color: c.heading, fontSize: 13 }}>{col.name}</div>
                        <div style={{ color: c.muted, fontSize: 11, fontFamily: "monospace" }}>{col.hex}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Typography */}
              <div>
                <div style={{ color: c.muted, fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", marginBottom: 14 }}>TYPOGRAPHY</div>
                <div className="flex flex-col gap-3">
                  {d.designSystem.fonts.map((f) => (
                    <div
                      key={f.name}
                      className="rounded-xl border px-4 py-3"
                      style={{ borderColor: c.border, background: c.card }}
                    >
                      <div style={{ fontWeight: 700, color: c.heading, fontSize: 15 }}>{f.name}</div>
                      <div style={{ color: c.muted, fontSize: 12, marginTop: 2 }}>{f.usage}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tools */}
              <div>
                <div style={{ color: c.muted, fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", marginBottom: 14 }}>TOOLS & STACK</div>
                <div className="flex flex-wrap gap-2">
                  {d.designSystem.tools.map((tool) => (
                    <span
                      key={tool}
                      className="px-3 py-1.5 rounded-lg text-sm"
                      style={{ fontWeight: 600, background: c.pill, color: c.body }}
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Gallery — Responsive Bento Grid */}
        <section className="mt-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-8">
            <div>
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 border"
                style={badgeStyle(c)}
              >
                Visual Showcase
              </span>
              <h2
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "clamp(1.4rem, 2.6vw, 1.9rem)",
                  fontWeight: 800,
                  color: c.heading,
                  letterSpacing: "-0.01em",
                }}
              >
                Screenshots & Visual Assets
              </h2>
            </div>
            <p style={{ color: c.muted, fontSize: 13 }}>
              {project.gallery.length} visual assets & specifications
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 [grid-auto-flow:dense]">
            {project.gallery.map((g, i) => {
              const size = g.size || "standard";
              const fit = g.objectFit || "contain";

              const spanClass =
                size === "featured" || size === "large"
                  ? "col-span-1 md:col-span-2 lg:col-span-2 md:row-span-2 min-h-[340px] sm:min-h-[420px] lg:min-h-[480px]"
                  : size === "wide"
                  ? "col-span-1 md:col-span-2 lg:col-span-2 md:row-span-1 min-h-[240px] sm:min-h-[280px]"
                  : size === "tall"
                  ? "col-span-1 md:col-span-1 lg:col-span-1 md:row-span-2 min-h-[340px] sm:min-h-[420px] lg:min-h-[480px]"
                  : "col-span-1 md:col-span-1 lg:col-span-1 md:row-span-1 min-h-[240px] sm:min-h-[280px]";

              const badgeLabel =
                size === "featured" || size === "large"
                  ? "Featured"
                  : size === "tall"
                  ? "Vertical"
                  : size === "wide"
                  ? "Wide"
                  : "Asset";

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (i % 6) * 0.05 }}
                  className={`rounded-2xl overflow-hidden border flex flex-col justify-between group transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-1 ${spanClass}`}
                  style={{
                    borderColor: c.border,
                    background: c.card,
                    boxShadow: c.shadow,
                  }}
                >
                  <div
                    className={`relative flex-1 w-full min-h-0 flex items-center justify-center overflow-hidden ${
                      fit === "cover"
                        ? "p-0"
                        : "p-4 sm:p-6 bg-black/[0.02] dark:bg-white/[0.01]"
                    }`}
                  >
                    <img
                      src={g.src}
                      alt={g.caption ? `${project.title} — ${g.caption}` : `${project.title} visual specification asset`}
                      className={`w-full h-full rounded-lg transition-transform duration-500 group-hover:scale-[1.02] ${
                        fit === "cover"
                          ? "object-cover h-full min-h-[220px]"
                          : "object-contain max-h-full"
                      }`}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  {g.caption && (
                    <div
                      className="px-4 py-3 border-t flex items-center justify-between gap-3 flex-shrink-0"
                      style={{ borderColor: c.border, background: c.card }}
                    >
                      <div
                        style={{
                          color: c.heading,
                          fontSize: 13,
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        title={g.caption}
                      >
                        {g.caption}
                      </div>
                      <span
                        className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded font-mono flex-shrink-0"
                        style={{
                          background: c.pill,
                          color: c.muted,
                          fontWeight: 700,
                        }}
                      >
                        {badgeLabel}
                      </span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Related Projects Nav */}
        <section className="mt-20 pt-10 border-t" style={{ borderColor: c.border }}>
          <h2
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "clamp(1.4rem, 2.6vw, 1.9rem)",
              fontWeight: 800,
              color: c.heading,
              marginBottom: 20,
            }}
          >
            Related Projects
          </h2>
          <nav className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prev && (
              <Link
                to={`/projects/${prev.slug}`}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="group p-6 rounded-2xl border flex items-center gap-4 hover:-translate-y-1 transition-transform"
                style={{ background: c.card, borderColor: c.border }}
              >
                <ArrowLeft size={20} style={{ color: c.primary }} />
                <div>
                  <div style={{ color: c.muted, fontSize: 12, fontWeight: 600 }}>Previous Project</div>
                  <div style={{ color: c.heading, fontWeight: 700, marginTop: 2 }}>{prev.title}</div>
                </div>
              </Link>
            )}
            {next && (
              <Link
                to={`/projects/${next.slug}`}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="group p-6 rounded-2xl border flex items-center justify-end gap-4 text-right hover:-translate-y-1 transition-transform"
                style={{ background: c.card, borderColor: c.border }}
              >
                <div>
                  <div style={{ color: c.muted, fontSize: 12, fontWeight: 600 }}>Next Project</div>
                  <div style={{ color: c.heading, fontWeight: 700, marginTop: 2 }}>{next.title}</div>
                </div>
                <ArrowRight size={20} style={{ color: c.primary }} />
              </Link>
            )}
          </nav>
        </section>
      </div>
    </article>
  );
}
