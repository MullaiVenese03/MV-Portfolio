import { lazy, Suspense } from "react";
import { useOutletContext } from "react-router-dom";
import { Hero } from "../components/Hero";
import { PersonStructuredData, WebSiteStructuredData } from "../components/StructuredData";
import { PAGE_META, SITE } from "../config/site";
import { usePageMeta } from "../hooks/usePageMeta";

const About = lazy(() =>
  import("../components/About").then((m) => ({ default: m.About })),
);
const Skills = lazy(() =>
  import("../components/Skills").then((m) => ({ default: m.Skills })),
);
const Projects = lazy(() =>
  import("../components/Projects").then((m) => ({ default: m.Projects })),
);
const Services = lazy(() =>
  import("../components/Services").then((m) => ({ default: m.Services })),
);
const Timeline = lazy(() =>
  import("../components/Timeline").then((m) => ({ default: m.Timeline })),
);
const Testimonials = lazy(() =>
  import("../components/Testimonials").then((m) => ({ default: m.Testimonials })),
);
const Contact = lazy(() =>
  import("../components/Contact").then((m) => ({ default: m.Contact })),
);

export function Home() {
  const { darkMode, heroReady } = useOutletContext<{ darkMode: boolean; heroReady: boolean }>();

  usePageMeta({
    title: PAGE_META.home.title,
    description: PAGE_META.home.description,
    path: PAGE_META.home.path,
    image: SITE.ogImage,
  });

  return (
    <>
      <WebSiteStructuredData />
      <PersonStructuredData />
      <Hero heroReady={heroReady} />
      <Suspense fallback={null}>
        <About darkMode={darkMode} />
        <Skills />
        <Projects />
        <Services />
        <Timeline />
        <Testimonials darkMode={darkMode} />
        <Contact darkMode={darkMode} />
      </Suspense>
    </>
  );
}
