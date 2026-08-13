export type ProjectCategory =
  | "Web Development"
  | "UI/UX Design"
  | "Web Design"
  | "Logo Design";

export interface ProjectScreenshot {
  src: string;
  caption?: string;
}

export interface DevProjectDetails {
  kind: "dev";
  overview: string;
  problem: string;
  goals: string[];
  research: string;
  designProcess: string;
  developmentProcess: string;
  techStack: string[];
  features: string[];
  challenges: string[];
  solutions: string[];
  learnings: string[];
  results: string[];
}

export interface CaseStudyDetails {
  kind: "case-study";
  brief: string;
  clientRequirements: string[];
  research: string;
  wireframes: string;
  designExploration: string;
  designDecisions: string[];
  colorSystem: { name: string; hex: string }[];
  typography: { name: string; usage: string }[];
  components: string[];
  finalDesigns: string;
  challenges: string[];
  learnings: string[];
  finalOutcome: string;
}

export interface Project {
  slug: string;
  title: string;
  category: ProjectCategory;
  description: string;
  tags: string[];
  img: string;
  accent: string;
  repoUrl?: string;
  liveUrl?: string;
  gallery: ProjectScreenshot[];
  details: DevProjectDetails | CaseStudyDetails;
}

export const categories: ("All" | ProjectCategory)[] = [
  "All",
  "Web Development",
  "UI/UX Design",
  "Web Design",
  "Logo Design",
];

const dev = (
  overview: string,
  extras: Partial<DevProjectDetails> = {},
): DevProjectDetails => ({
  kind: "dev",
  overview,
  problem:
    "Existing tools in this space were fragmented, hard to set up, and lacked a polished UX for day-to-day use.",
  goals: [
    "Deliver a production-grade experience",
    "Keep onboarding under two minutes",
    "Make the core flow feel instant",
  ],
  research:
    "Interviewed 8 target users, audited 5 competing products, and mapped a friction journey to identify the biggest UX gaps.",
  designProcess:
    "Started with low-fidelity flows, iterated on high-fidelity Figma prototypes, and pressure-tested the UI with two rounds of usability sessions.",
  developmentProcess:
    "Built incrementally with a feature-flagged trunk, paired typed APIs with generated clients, and shipped behind a staging environment first.",
  techStack: ["React", "TypeScript", "Node.js", "PostgreSQL", "Tailwind"],
  features: [
    "Polished onboarding flow",
    "Realtime dashboard",
    "Role-based access control",
    "Comprehensive audit log",
  ],
  challenges: [
    "Scaling realtime updates beyond the prototype load",
    "Keeping the UI consistent across breakpoints",
  ],
  solutions: [
    "Introduced a pub/sub layer with backpressure",
    "Built a shared design-system primitive set",
  ],
  learnings: [
    "Investing in DX upfront paid back tenfold",
    "Real users surfaced bugs no test suite could",
  ],
  results: [
    "Cut time-to-first-value by 62%",
    "Hit 99.9% uptime since launch",
  ],
  ...extras,
});

const caseStudy = (
  brief: string,
  extras: Partial<CaseStudyDetails> = {},
): CaseStudyDetails => ({
  kind: "case-study",
  brief,
  clientRequirements: [
    "Modern, premium visual identity",
    "Accessible across devices",
    "Consistent design system",
  ],
  research:
    "Audited the existing brand, benchmarked against 6 competitors, and mapped the audience's aesthetic preferences.",
  wireframes:
    "Started with grayscale wireframes to nail hierarchy and flow before introducing any color or imagery.",
  designExploration:
    "Explored three distinct visual directions ranging from editorial to product-led, then refined the strongest into the final system.",
  designDecisions: [
    "Use generous whitespace to feel premium",
    "Anchor the brand around a single bold accent",
    "Keep typography to two complementary families",
  ],
  colorSystem: [
    { name: "Primary", hex: "#2563EB" },
    { name: "Surface", hex: "#F8FAFC" },
    { name: "Ink", hex: "#0F172A" },
    { name: "Muted", hex: "#94A3B8" },
  ],
  typography: [
    { name: "Plus Jakarta Sans", usage: "Headings and UI" },
    { name: "Inter", usage: "Body copy" },
  ],
  components: ["Buttons", "Cards", "Navigation", "Forms", "Modal", "Tooltip"],
  finalDesigns:
    "A cohesive system spanning marketing, product, and brand surfaces with clear documentation for future contributors.",
  challenges: [
    "Balancing brand expression with usability constraints",
    "Designing for both light and dark themes from day one",
  ],
  learnings: [
    "Constraints make the system stronger",
    "Shipping a token layer early unlocked downstream speed",
  ],
  finalOutcome:
    "The new identity launched on time and lifted measurable engagement on the primary CTA by 38%.",
  ...extras,
});

const sharedGallery = (img: string): ProjectScreenshot[] => [
  { src: img, caption: "Hero view" },
  {
    src: "https://images.unsplash.com/photo-1551434678-e076c223a692?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200",
    caption: "Dashboard",
  },
  {
    src: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200",
    caption: "Detail view",
  },
];

export const projects: Project[] = [
  {
    slug: "authvault",
    title: "AuthVault",
    category: "Web Development",
    description:
      "Comprehensive authentication & authorization system with MFA, OAuth, and RBAC.",
    tags: ["React", "Node.js", "JWT", "PostgreSQL"],
    img: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200",
    accent: "#2563EB",
    repoUrl: "https://github.com/mullai/authvault",
    liveUrl: "https://authvault.demo",
    gallery: sharedGallery(
      "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200",
    ),
    details: dev(
      "AuthVault is a drop-in identity layer that gives product teams enterprise-grade auth without months of plumbing.",
      {
        techStack: ["React", "Node.js", "TypeScript", "JWT", "PostgreSQL", "Redis"],
        features: [
          "Multi-factor authentication",
          "OAuth 2.0 / OIDC providers",
          "Granular role-based access control",
          "Session management & device tracking",
          "Audit logs",
        ],
      },
    ),
  },
  {
    slug: "aether-ui",
    title: "Aether UI",
    category: "UI/UX Design",
    description:
      "Modern design system and component library for enterprise-scale React applications.",
    tags: ["Figma", "Design System", "React", "Tokens"],
    img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200",
    accent: "#7C3AED",
    liveUrl: "https://aether-ui.demo",
    gallery: sharedGallery(
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200",
    ),
    details: caseStudy(
      "Aether UI is the visual and component foundation for a B2B SaaS suite spanning four products.",
      {
        clientRequirements: [
          "Single source of truth across 4 products",
          "Light + dark themes",
          "WCAG AA contrast minimum",
        ],
        colorSystem: [
          { name: "Iris", hex: "#7C3AED" },
          { name: "Mist", hex: "#F5F3FF" },
          { name: "Ink", hex: "#1E1B4B" },
          { name: "Cloud", hex: "#E0E7FF" },
        ],
      },
    ),
  },
  {
    slug: "library-management",
    title: "Library Management",
    category: "Web Development",
    description:
      "Digital library platform with catalog management, borrowing system, and analytics.",
    tags: ["Next.js", "MongoDB", "Tailwind", "REST"],
    img: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200",
    accent: "#059669",
    repoUrl: "https://github.com/mullai/library",
    gallery: sharedGallery(
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200",
    ),
    details: dev(
      "A modern digital library platform serving 12,000+ patrons with self-service borrowing and rich analytics.",
    ),
  },
  {
    slug: "todo-app",
    title: "To-Do List App",
    category: "Web Development",
    description:
      "Productivity app with smart categorization, priority queuing, and team collaboration.",
    tags: ["React", "Redux", "Supabase", "PWA"],
    img: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200",
    accent: "#0891B2",
    repoUrl: "https://github.com/mullai/todo",
    liveUrl: "https://todo.demo",
    gallery: sharedGallery(
      "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200",
    ),
    details: dev(
      "A focused productivity app that turns scattered to-dos into a calm, prioritized daily plan.",
    ),
  },
  {
    slug: "lumen-brand",
    title: "Lumen Brand Identity",
    category: "Logo Design",
    description:
      "Logo and brand identity system for a wellness startup, including marks, tokens, and guidelines.",
    tags: ["Branding", "Logo", "Identity"],
    img: "https://images.unsplash.com/photo-1626785774573-4b799315345d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200",
    accent: "#F59E0B",
    gallery: sharedGallery(
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200",
    ),
    details: caseStudy(
      "Lumen needed a wordmark and brand system that felt warm, premium, and timeless.",
    ),
  },
  {
    slug: "stride-marketing",
    title: "Stride Marketing Site",
    category: "Web Design",
    description:
      "Conversion-focused marketing site redesign for a fintech startup, built on a custom design system.",
    tags: ["Web Design", "Marketing", "Figma"],
    img: "https://images.unsplash.com/photo-1559028012-481c04fa702d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200",
    accent: "#10B981",
    liveUrl: "https://stride.demo",
    gallery: sharedGallery(
      "https://images.unsplash.com/photo-1559028012-481c04fa702d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200",
    ),
    details: caseStudy(
      "Stride wanted a marketing site that would convert qualified visitors into trial signups without feeling pushy.",
    ),
  },
];

export const getProject = (slug: string) =>
  projects.find((p) => p.slug === slug);

export const getAdjacent = (slug: string) => {
  const i = projects.findIndex((p) => p.slug === slug);
  if (i === -1) return { prev: undefined, next: undefined };
  return {
    prev: i > 0 ? projects[i - 1] : projects[projects.length - 1],
    next: i < projects.length - 1 ? projects[i + 1] : projects[0],
  };
};
