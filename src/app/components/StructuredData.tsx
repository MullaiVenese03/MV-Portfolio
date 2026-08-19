import { useEffect } from "react";
import { absoluteUrl, SITE } from "../config/site";
import { socialLinks } from "../data/socialLinks";
import type { Project } from "../data/projects";

const SCRIPT_ID = "mv-structured-data";

function injectJsonLd(data: Record<string, unknown>) {
  if (typeof document === "undefined") return;
  let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

export function PersonStructuredData() {
  useEffect(() => {
    injectJsonLd({
      "@context": "https://schema.org",
      "@type": "Person",
      name: SITE.name,
      url: absoluteUrl("/"),
      email: SITE.email,
      jobTitle: "Front-End Developer & UI/UX Designer",
      address: {
        "@type": "PostalAddress",
        addressCountry: SITE.location,
      },
      sameAs: socialLinks
        .map((link) => link.href)
        .filter((href) => href.startsWith("http")),
    });
    return () => document.getElementById(SCRIPT_ID)?.remove();
  }, []);

  return null;
}

export function ProjectStructuredData({ project }: { project: Project }) {
  useEffect(() => {
    injectJsonLd({
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: project.title,
      description: project.description,
      url: absoluteUrl(`/projects/${project.slug}`),
      author: {
        "@type": "Person",
        name: SITE.name,
        url: absoluteUrl("/"),
      },
      image: absoluteUrl(project.img),
      keywords: project.tags.join(", "),
    });
    return () => document.getElementById(SCRIPT_ID)?.remove();
  }, [project]);

  return null;
}

export function WebSiteStructuredData() {
  useEffect(() => {
    injectJsonLd({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE.name,
      url: absoluteUrl("/"),
      description: SITE.description,
      author: {
        "@type": "Person",
        name: SITE.name,
      },
    });
    return () => document.getElementById(SCRIPT_ID)?.remove();
  }, []);

  return null;
}
