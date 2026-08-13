import { Link, useParams } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight, ExternalLink, Github } from "lucide-react";
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
        {/* Back */}
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-sm mb-8 hover:opacity-70"
          style={{ color: c.body, fontWeight: 600 }}
        >
          <ArrowLeft size={16} className="transition-transform duration-300 group-hover:-translate-x-1" /> All Projects
        </Link>

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
          <img src={project.img} alt={project.title} className="w-full h-auto object-cover" loading="lazy" decoding="async" />
        </motion.div>

        {/* Sections - branch on detail kind */}
        <div className="grid lg:grid-cols-[1fr_320px] gap-12">
          <div>
            {d.kind === "dev" ? (
              <>
                <Section title="Project Overview" c={c}><p>{d.overview}</p></Section>
                <Section title="Problem Statement" c={c}><p>{d.problem}</p></Section>
                <Section title="Goals & Objectives" c={c}><Bullets items={d.goals} c={c} /></Section>
                <Section title="Research Process" c={c}><p>{d.research}</p></Section>
                <Section title="Design Process" c={c}><p>{d.designProcess}</p></Section>
                <Section title="Development Process" c={c}><p>{d.developmentProcess}</p></Section>
                <Section title="Tech Stack" c={c}><Pills items={d.techStack} c={c} /></Section>
                <Section title="Features" c={c}><Bullets items={d.features} c={c} /></Section>
                <Section title="Challenges Faced" c={c}><Bullets items={d.challenges} c={c} /></Section>
                <Section title="Solutions Implemented" c={c}><Bullets items={d.solutions} c={c} /></Section>
                <Section title="Key Learnings" c={c}><Bullets items={d.learnings} c={c} /></Section>
                <Section title="Results & Outcomes" c={c}><Bullets items={d.results} c={c} /></Section>
              </>
            ) : (
              <>
                <Section title="Project Brief" c={c}><p>{d.brief}</p></Section>
                <Section title="Client Requirements" c={c}><Bullets items={d.clientRequirements} c={c} /></Section>
                <Section title="Research" c={c}><p>{d.research}</p></Section>
                <Section title="Wireframes" c={c}><p>{d.wireframes}</p></Section>
                <Section title="Design Exploration" c={c}><p>{d.designExploration}</p></Section>
                <Section title="Design Decisions" c={c}><Bullets items={d.designDecisions} c={c} /></Section>
                <Section title="Color System" c={c}>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {d.colorSystem.map((col) => (
                      <div
                        key={col.hex}
                        className="rounded-2xl overflow-hidden border"
                        style={{ borderColor: c.border }}
                      >
                        <div style={{ background: col.hex, height: 80 }} />
                        <div className="p-3">
                          <div style={{ fontWeight: 700, color: c.heading, fontSize: 14 }}>
                            {col.name}
                          </div>
                          <div style={{ color: c.muted, fontSize: 12 }}>{col.hex}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
                <Section title="Typography" c={c}>
                  <div className="space-y-3">
                    {d.typography.map((tp) => (
                      <div
                        key={tp.name}
                        className="p-4 rounded-2xl border flex justify-between items-center"
                        style={{ borderColor: c.border, background: c.card }}
                      >
                        <span style={{ fontWeight: 700, color: c.heading }}>{tp.name}</span>
                        <span style={{ color: c.muted, fontSize: 13 }}>{tp.usage}</span>
                      </div>
                    ))}
                  </div>
                </Section>
                <Section title="Components" c={c}><Pills items={d.components} c={c} /></Section>
                <Section title="Final Designs" c={c}><p>{d.finalDesigns}</p></Section>
                <Section title="Challenges" c={c}><Bullets items={d.challenges} c={c} /></Section>
                <Section title="Learnings" c={c}><Bullets items={d.learnings} c={c} /></Section>
                <Section title="Final Outcome" c={c}><p>{d.finalOutcome}</p></Section>
              </>
            )}
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

        {/* Gallery */}
        <section className="mt-20">
          <h2
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "clamp(1.4rem, 2.6vw, 1.9rem)",
              fontWeight: 800,
              color: c.heading,
              marginBottom: 24,
            }}
          >
            Screenshots
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {project.gallery.map((g, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="rounded-2xl overflow-hidden border"
                style={{ borderColor: c.border, background: c.card }}
              >
                <img src={g.src} alt={g.caption || project.title} className="w-full h-64 object-cover" loading="lazy" decoding="async" />
                {g.caption && (
                  <div className="p-4" style={{ color: c.muted, fontSize: 13 }}>{g.caption}</div>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* Prev / Next */}
        <nav className="mt-20 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {prev && (
            <Link
              to={`/projects/${prev.slug}`}
              className="group p-6 rounded-2xl border flex items-center gap-4 hover:-translate-y-1 transition-transform"
              style={{ background: c.card, borderColor: c.border }}
            >
              <ArrowLeft size={20} style={{ color: c.primary }} />
              <div>
                <div style={{ color: c.muted, fontSize: 12, fontWeight: 600 }}>Previous</div>
                <div style={{ color: c.heading, fontWeight: 700, marginTop: 2 }}>{prev.title}</div>
              </div>
            </Link>
          )}
          {next && (
            <Link
              to={`/projects/${next.slug}`}
              className="group p-6 rounded-2xl border flex items-center justify-end gap-4 text-right hover:-translate-y-1 transition-transform"
              style={{ background: c.card, borderColor: c.border }}
            >
              <div>
                <div style={{ color: c.muted, fontSize: 12, fontWeight: 600 }}>Next</div>
                <div style={{ color: c.heading, fontWeight: 700, marginTop: 2 }}>{next.title}</div>
              </div>
              <ArrowRight size={20} style={{ color: c.primary }} />
            </Link>
          )}
        </nav>
      </div>
    </article>
  );
}
