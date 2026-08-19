import { ArrowUpRight, ExternalLink, Github } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { projects as allProjects } from "../data/projects";
import { badgeStyle, FONT, FONT_DISPLAY, MOTION_EASE, themeVars, TIMING } from "../theme";

const projects = allProjects.slice(0, 6);

export function Projects() {
  const c = themeVars;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    e.currentTarget.style.transform = `perspective(1000px) rotateX(${(-y * 3).toFixed(2)}deg) rotateY(${(x * 3).toFixed(2)}deg) translateY(-4px)`;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
  };

  return (
    <section id="projects" className="py-28" style={{ background: c.section }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">

        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-16 gap-4"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: TIMING.reveal, ease: MOTION_EASE }}
        >
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full text-sm mb-4 border" style={badgeStyle(c)}>
              Featured Projects
            </span>
            <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 400, color: c.heading, letterSpacing: "0.02em" }}>
              Things I've <span style={{ color: c.primary }}>Built</span>
            </h2>
          </div>
          <Link
            to="/projects"
            className="group flex items-center gap-2 px-5 py-2.5 rounded-full text-sm border transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/15"
            style={{
              fontFamily: FONT,
              fontWeight: 600,
              color: c.primary,
              borderColor: c.primaryBorder,
              background: c.primaryMuted,
            }}
          >
            All Projects <ExternalLink size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: TIMING.card, ease: MOTION_EASE, delay: (i % 3) * 0.1 }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              data-theme-card
              className="group rounded-3xl border overflow-hidden flex flex-col transition-all duration-200 hover:shadow-2xl hover:shadow-blue-500/10"
              style={{ background: c.card, borderColor: c.border, boxShadow: c.shadow, transition: "transform 0.25s ease-out, box-shadow 0.25s ease" }}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.img}
                  alt={`Preview cover of ${project.title} - ${project.category}`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 60%)" }} />
              </div>

              <div className="p-6 flex flex-col gap-3 flex-1">
                <Link to={`/projects/${project.slug}`} className="transition-colors duration-300 hover:text-blue-600">
                  <h3 style={{ fontFamily: FONT, fontSize: "17px", fontWeight: 700, color: c.heading }}>{project.title}</h3>
                </Link>
                <p style={{ fontFamily: FONT, fontSize: "13px", fontWeight: 400, color: c.body, lineHeight: 1.7, flex: 1 }}>{project.description}</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg text-xs"
                      style={{ fontFamily: FONT, fontWeight: 600, background: c.pill, color: c.body }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-3 mt-2 pt-4" style={{ borderTop: `1px solid ${c.border}` }}>
                  {project.repoUrl && (
                    <a href={project.repoUrl} target="_blank" rel="noreferrer" className="group/link flex items-center gap-1.5 text-xs transition-all duration-300 hover:-translate-y-0.5 hover:text-blue-600" style={{ fontFamily: FONT, fontWeight: 600, color: c.body }}>
                      <Github size={13} className="transition-transform duration-300 group-hover/link:rotate-6 group-hover/link:scale-110" /> Code <ArrowUpRight size={12} className="transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                    </a>
                  )}
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer" className="group/link flex items-center gap-1.5 text-xs transition-all duration-300 hover:-translate-y-0.5 hover:text-blue-600" style={{ fontFamily: FONT, fontWeight: 600, color: c.primary }}>
                      <ExternalLink size={13} className="transition-transform duration-300 group-hover/link:rotate-6 group-hover/link:scale-110" /> Live Demo <ArrowUpRight size={12} className="transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                    </a>
                  )}
                  <Link to={`/projects/${project.slug}`} className="group/link ml-auto flex items-center gap-1.5 text-xs transition-all duration-300 hover:-translate-y-0.5" style={{ fontFamily: FONT, fontWeight: 600, color: c.primary }}>
                    Case Study <ArrowUpRight size={12} className="transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
