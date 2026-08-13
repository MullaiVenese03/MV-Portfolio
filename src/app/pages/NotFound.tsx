import { Link } from "react-router";
import { ArrowLeft, Home } from "lucide-react";
import { PAGE_META, SITE } from "../config/site";
import { usePageMeta } from "../hooks/usePageMeta";
import { FONT, themeVars } from "../theme";

export function NotFound() {
  const c = themeVars;

  usePageMeta({
    title: PAGE_META.notFound.title,
    description: PAGE_META.notFound.description,
    path: PAGE_META.notFound.path,
    noIndex: true,
  });

  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center px-6 py-24"
      style={{ background: c.bg, fontFamily: FONT }}
      aria-labelledby="not-found-heading"
    >
      <p
        style={{
          color: c.primary,
          fontWeight: 700,
          letterSpacing: "0.2em",
          fontSize: "0.875rem",
        }}
      >
        404
      </p>
      <h1
        id="not-found-heading"
        style={{
          fontSize: "clamp(2rem, 5vw, 3.5rem)",
          fontWeight: 800,
          color: c.heading,
          marginTop: 12,
          textAlign: "center",
        }}
      >
        Page not found
      </h1>
      <p
        style={{
          color: c.body,
          marginTop: 12,
          maxWidth: 480,
          textAlign: "center",
          lineHeight: 1.7,
        }}
      >
        The page you&apos;re looking for has moved or never existed. Try heading back home or
        browsing projects.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white transition-opacity hover:opacity-90 focus-visible:outline-offset-4"
          style={{ background: c.primary, fontWeight: 600 }}
        >
          <Home size={16} aria-hidden />
          Back to home
        </Link>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border transition-opacity hover:opacity-80 focus-visible:outline-offset-4"
          style={{ borderColor: c.border, color: c.heading, fontWeight: 600 }}
        >
          <ArrowLeft size={16} aria-hidden />
          View projects
        </Link>
      </div>
      <p className="sr-only">{SITE.name} — {PAGE_META.notFound.description}</p>
    </section>
  );
}
