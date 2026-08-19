import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { projects, categories, type ProjectCategory } from "../data/projects";
import { PAGE_META, SITE } from "../config/site";
import { usePageMeta } from "../hooks/usePageMeta";
import { badgeStyle, MOTION_EASE, themeVars } from "../theme";

type Filter = "All" | ProjectCategory;

export function ProjectsPage() {
  const c = themeVars;
  const [filter, setFilter] = useState<Filter>("All");

  usePageMeta({
    title: PAGE_META.projects.title,
    description: PAGE_META.projects.description,
    path: PAGE_META.projects.path,
    image: SITE.ogImage,
  });

  const visible = useMemo(
    () => (filter === "All" ? projects : projects.filter((p) => p.category === filter)),
    [filter],
  );

  return (
    <section className="pt-36 pb-28" style={{ background: c.bg }}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm mb-6 flex-wrap">
          <Link to="/" style={{ color: c.muted, fontWeight: 500 }} className="hover:opacity-70 transition-opacity">Home</Link>
          <ChevronRight size={14} style={{ color: c.muted }} />
          <span style={{ color: c.heading, fontWeight: 600 }}>Projects</span>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: MOTION_EASE }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-sm mb-4 border" style={badgeStyle(c)}>
            Portfolio
          </span>
          <h1
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 800,
              color: c.heading,
              letterSpacing: "-0.02em",
            }}
          >
            All <span style={{ color: c.primary }}>Projects</span>
          </h1>
          <p style={{ color: c.body, marginTop: 12, maxWidth: 640 }}>
            A complete archive of products and brand systems I've shipped.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mt-10 mb-10">
          {categories.map((cat) => {
            const active = filter === cat;
            return (
              <button
                key={cat}
                onClick={() => setFilter(cat as Filter)}
                className="px-4 py-2 rounded-full text-sm border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                style={{
                  fontWeight: 600,
                  color: active ? "#FFFFFF" : c.body,
                  background: active ? c.primary : "transparent",
                  borderColor: active ? c.primary : c.border,
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {visible.map((p, i) => (
            <motion.div
              key={p.slug}
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: (i % 6) * 0.06 }}
            >
              <Link
                to={`/projects/${p.slug}`}
                className="group block rounded-3xl border overflow-hidden h-full hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10"
                style={{
                  background: c.card,
                  borderColor: c.border,
                  boxShadow: c.shadow,
                }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={p.img}
                    alt={`Preview cover of ${p.title} - ${p.category}`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 60%)" }}
                  />
                  <span
                    className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs"
                    style={{
                      background: "rgba(255,255,255,0.92)",
                      color: "#0F172A",
                      fontWeight: 600,
                    }}
                  >
                    {p.category}
                  </span>
                </div>
                <div className="p-6 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h3
                      style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: "18px",
                        fontWeight: 700,
                        color: c.heading,
                      }}
                    >
                      {p.title}
                    </h3>
                    <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" style={{ color: c.primary }} />
                  </div>
                  <p style={{ fontSize: 13, color: c.body, lineHeight: 1.7 }}>{p.description}</p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {p.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-lg text-xs"
                        style={{
                          fontWeight: 600,
                          background: c.pill,
                          color: c.body,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {visible.length === 0 && (
          <div className="text-center py-20" style={{ color: c.muted }}>
            No projects in this category yet.
          </div>
        )}
      </div>
    </section>
  );
}
