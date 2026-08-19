export type ProjectCategory =
  | "Web Development"
  | "Frontend Development"
  | "UI/UX Design"
  | "Web Design"
  | "Company Website"
  | "Logo Design";

export type BentoSize = "featured" | "large" | "wide" | "tall" | "standard";

export interface ProjectScreenshot {
  src: string;
  caption?: string;
  size?: BentoSize;
  objectFit?: "cover" | "contain";
}

export interface DesignSystem {
  palette: { name: string; hex: string }[];
  fonts: { name: string; usage: string }[];
  tools: string[];
}

export interface DevProjectDetails {
  kind: "dev";
  overview: string;
  problem: string;
  goals: string[];
  role?: string;
  research?: string;
  designProcess?: string;
  developmentProcess?: string;
  techStack: string[];
  features: string[];
  uiUxDecisions?: string[];
  challenges: string[];
  solutions: string[];
  learnings: string[];
  results: string[];
  designSystem?: DesignSystem;
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
  details: DevProjectDetails;
}

export const categories: ("All" | ProjectCategory)[] = [
  "All",
  "Frontend Development",
  "Company Website",
  "Logo Design",
];

/** Prefix a public-folder path with Vite's runtime base URL so assets
 *  resolve correctly on GitHub Pages (base: "/MV-Portfolio/").
 *  e.g. p("/projects/foo/bar.png") → "/MV-Portfolio/projects/foo/bar.png"
 */
const p = (path: string) =>
  `${import.meta.env.BASE_URL.replace(/\/$/, "")}${path}`;

export const projects: Project[] = [
  {
    slug: "nebulasafetech-landing-page",
    title: "NebulaSafeTech Landing Page",
    category: "Frontend Development",
    description:
      "Official landing page for NebulaSafeTech featuring responsive service showcases, custom toast alerts, Cloudflare Turnstile bot protection, and zero-framework performance optimization.",
    tags: ["HTML5", "CSS3", "JavaScript", "Cloudflare Turnstile", "Formspree", "GA4"],
    img: p("/projects/nebulasafetech-landing-page/mockup.png"),
    accent: "#3B82F6",
    repoUrl: "https://github.com/MullaiVenese03/NST-Landing-Page",
    liveUrl: "https://mullaivenese03.github.io/NST-Landing-Page",
    gallery: [
      { src: p("/projects/nebulasafetech-landing-page/mockup-device.png"), caption: "Laptop & Mobile Responsive UI", size: "featured", objectFit: "contain" },
      { src: p("/projects/nebulasafetech-landing-page/home-overview.png"), caption: "Full Landing Page — Section Flow", size: "tall", objectFit: "contain" },
      { src: p("/projects/nebulasafetech-landing-page/hero-section.png"), caption: "Hero Header & Brand Trust Marquee", size: "wide", objectFit: "cover" },
      { src: p("/projects/nebulasafetech-landing-page/services-grid.png"), caption: "Cybersecurity & Web Dev Services", size: "standard", objectFit: "cover" },
      { src: p("/projects/nebulasafetech-landing-page/testimonials.png"), caption: "Value Propositions & Testimonials", size: "standard", objectFit: "cover" },
      { src: p("/projects/nebulasafetech-landing-page/contact-footer.png"), caption: "Contact Form & Footer", size: "wide", objectFit: "cover" },
    ],
    details: {
      kind: "dev",
      overview:
        "NebulaSafeTech is a premier cybersecurity and digital solutions platform based in Hosur, Tamil Nadu. This project is the official static landing page built to present core services-such as Vulnerability Assessment and Penetration Testing (VAPT), Cloud & API Security, Mobile App Hardening, and EdTech Awareness programs-with zero framework bloat and maximum security.",
      problem:
        "Traditional marketing landing pages built with heavy JavaScript frameworks often suffer from slow initial loading, high memory overhead, and contact form vulnerability to automated spam bots.",
      role:
        "Frontend Developer & UI Designer - responsible for end-to-end architecture, responsive CSS layout, interactive DOM scripting, form security integration, and performance optimization.",
      goals: [
        "Achieve zero-framework lightning performance with pure HTML5, CSS3, and ES6+ JavaScript",
        "Deliver a mobile-first responsive layout with dynamic scroll-spy navigation",
        "Implement multi-layered contact form protection against automated bot submissions",
        "Showcase institutional MoU collaborations and client testimonials in a continuous marquee",
      ],
      research:
        "Audited competing cybersecurity and software agency sites, analyzed target user conversion paths, and defined a high-contrast dark aesthetic that highlights security authority.",
      designProcess:
        "Designed a cybersecurity-focused UI theme using high-contrast dark backgrounds, glowing accent indicators, custom typography (General Sans), card-based service matrices, and non-intrusive notification overlays.",
      developmentProcess:
        "Developed with zero external build dependencies using standard ES6+ JavaScript, custom CSS Flexbox/Grid, native IntersectionObserver APIs for active section tracking, and lightweight DOM manipulation for dynamic toast notifications.",
      techStack: [
        "HTML5",
        "CSS3",
        "JavaScript (ES6+)",
        "Cloudflare Turnstile",
        "Formspree",
        "Google Analytics (GA4)",
        "General Sans Font",
      ],
      features: [
        "Pure Vanilla Tech Stack with zero framework overhead and lightweight execution",
        "Dynamic responsive navigation with hamburger toggle and IntersectionObserver scroll-spy",
        "Multi-layered form security featuring Content Security Policy (CSP) headers, Cloudflare Turnstile CAPTCHA, and client-side input sanitization",
        "Custom DOM-rendered toast notification engine for instant form feedback",
        "Infinite auto-scroll marquee for institutional MoU partners and clients",
        "Full SEO setup with Open Graph meta, Twitter Cards, canonical links, favicons, and sitemap.xml",
      ],
      uiUxDecisions: [
        "Adopted a dark cybersecurity aesthetic with high-contrast elements for brand authority",
        "Used sticky header navigation with real-time section scroll-spy indicators",
        "Implemented asynchronous toast alerts so users receive instant contact confirmation without leaving the page",
        "Structured institutional logos in an infinite continuous marquee to build immediate social proof",
      ],
      challenges: [
        "Eliminating contact form spam without degrading user experience through intrusive traditional CAPTCHAs",
        "Maintaining accurate active nav link updates during fast scrolling without causing layout reflow lag",
      ],
      solutions: [
        "Integrated Cloudflare Turnstile for silent, frictionless bot verification alongside Formspree backend processing",
        "Leveraged native IntersectionObserver with configured rootMargins for smooth section detection",
      ],
      learnings: [
        "Native browser APIs can replace framework dependencies while dramatically reducing bundle sizes and load times",
        "Front-loading security controls (CSP headers, Turnstile, client sanitization) protects form endpoints effectively",
      ],
      results: [
        "Delivered an ultra-fast, zero-dependency landing page with instant initial page load",
        "Successfully established brand presence and captured client inquiries with zero bot spam",
      ],
      designSystem: {
        palette: [
          { name: "Deep Navy", hex: "#0A0F1E" },
          { name: "Surface", hex: "#111827" },
          { name: "Accent Blue", hex: "#2563EB" },
          { name: "Muted Text", hex: "#6B7280" },
          { name: "White", hex: "#F9FAFB" },
        ],
        fonts: [
          { name: "General Sans", usage: "Headings, body & UI" },
        ],
        tools: [
          "HTML5", "CSS3", "JavaScript (ES6+)",
          "Cloudflare Turnstile", "Formspree", "Google Analytics (GA4)",
          "Figma", "VS Code",
        ],
      },
    },
  },
  {
    slug: "nebulasafetech-website",
    title: "NebulaSafeTech Website",
    category: "Company Website",
    description:
      "Production React 18 & TypeScript application for NebulaSafeTech featuring deep SPA routing, Sharp image optimization, Framer Motion animations, and multi-tier telemetry.",
    tags: ["React", "TypeScript", "Vite", "Tailwind CSS", "Framer Motion", "React Router", "Formspree", "Sharp"],
    img: p("/projects/nebulasafetech-website/cover.png"),
    accent: "#7C3AED",
    repoUrl: "https://github.com/MullaiVenese03/NST-Website",
    liveUrl: "https://www.nebulasafetech.com",
    gallery: [
      { src: p("/projects/nebulasafetech-website/mockup.png"), caption: "Laptop & Mobile Responsive UI", size: "featured", objectFit: "contain" },
      { src: p("/projects/nebulasafetech-website/website-image.png"), caption: "Full Website — Desktop & Mobile", size: "tall", objectFit: "contain" },
      { src: p("/projects/nebulasafetech-website/hero-screenshot.png"), caption: "Hero — Cybersecurity SPA Homepage", size: "wide", objectFit: "cover" },
      { src: p("/projects/nebulasafetech-website/slice-01.png"), caption: "Hero & About — Animated Stats", size: "standard", objectFit: "cover" },
      { src: p("/projects/nebulasafetech-website/slice-02.png"), caption: "Services — Cybersecurity & Web Dev", size: "standard", objectFit: "cover" },
      { src: p("/projects/nebulasafetech-website/slice-03.png"), caption: "Clients, EdTech & Footer", size: "standard", objectFit: "cover" },
      { src: p("/projects/nebulasafetech-website/design-styles.png"), caption: "Design System — Typography & Colours", size: "wide", objectFit: "contain" },
    ],
    details: {
      kind: "dev",
      overview:
        "The main production web application for NebulaSafeTech-a comprehensive cybersecurity and digital engineering firm based in Hosur, Tamil Nadu. Built on React 18, Vite, and Tailwind CSS, this web app provides dedicated service deep-dives, blog insights, institutional EdTech program details, and interactive quote requests.",
      problem:
        "As NebulaSafeTech expanded into institutional cybersecurity awareness workshops and specialized enterprise VAPT services, a static single-page layout could no longer support structured service detail pages, deep SPA routing, dynamic JSON-LD schemas, and comprehensive telemetry.",
      role:
        "Full-Stack Frontend Engineer - responsible for React component architecture, TypeScript typing, build-time asset optimization scripts (Sharp), SPA routing, SEO schemas, and multi-tier analytics integration.",
      goals: [
        "Build a scalable, type-safe React 18 SPA supporting deep routing across 8+ specialized page views",
        "Automate build-time asset optimization to generate high-performance WebP and AVIF responsive srcsets",
        "Implement structured JSON-LD schemas and SEO metadata for maximum search engine and AI discoverability",
        "Deploy a non-duplicating multi-tier analytics telemetry architecture (GTM, GA4, Clarity, Cloudflare)",
      ],
      research:
        "Evaluated enterprise B2B SaaS and cybersecurity web platforms to establish content hierarchy, user flow mapping for corporate vs academic clients, and accessibility standards.",
      designProcess:
        "Constructed a responsive design system using Tailwind CSS 4 utility tokens, custom neon gradient accents, interactive Framer Motion micro-animations, structured FAQ accordions, and dark mode contrast compliance.",
      developmentProcess:
        "Engineered with React 18, Vite 6, TypeScript (strict target), and React Router 7 with code-split lazy loading. Authored custom Node.js build scripts using Sharp to optimize public media assets into modern WebP/AVIF formats during compilation.",
      techStack: [
        "React 18",
        "TypeScript",
        "Vite 6",
        "Tailwind CSS 4",
        "React Router 7",
        "Motion (Framer Motion)",
        "react-helmet-async",
        "Formspree",
        "Lucide React",
        "Sharp",
        "GTM / GA4 / Clarity",
      ],
      features: [
        "Code-split SPA routing spanning 8+ pages (Home, About, Services, Cybersecurity Detail, Web Dev Detail, UI/UX Detail, EdTech Training, Clients, Blog, Legal)",
        "Build-time media engine using Sharp to generate 39+ responsive asset directories in WebP and AVIF formats",
        "Interactive components including hero parallax, animated stat counters, FAQ accordions, custom dropdowns, and blog table-of-contents",
        "Comprehensive SEO architecture with react-helmet-async, dynamic JSON-LD schemas, robots.txt crawler rules, and llms.txt context manifest",
        "Multi-tier telemetry stack combining Google Tag Manager, GA4, Microsoft Clarity heatmaps, Cloudflare Web Analytics, and Vercel Speed Insights",
        "Formspree React integration with client-side regex field validation and custom error formatting",
      ],
      uiUxDecisions: [
        "Structured multi-route navigation separating corporate VAPT offerings from academic EdTech awareness initiatives",
        "Integrated responsive picture srcsets to ensure crisp visual delivery on high-DPI displays without performance degradation",
        "Designed clean interactive elements (accordions, tab controls, scroll-to-top buttons) with full keyboard accessibility",
        "Used subtle motion animations to guide user focus without causing cognitive clutter",
      ],
      challenges: [
        "Serving high-resolution media and dynamic graphics without triggering layout shifts (CLS) or slowing mobile load times",
        "Preventing duplicate pageview telemetry events when navigating between code-split routes in a single-page app",
      ],
      solutions: [
        "Created Node build scripts leveraging Sharp to generate multi-resolution WebP/AVIF images with predefined aspect ratios",
        "Designed a custom useRouteAnalytics hook that listens to router location changes and pushes GTM events cleanly while skipping duplicate initial page load triggers",
      ],
      learnings: [
        "Combining build-time automated optimization scripts with React lazy loading ensures high Web Vitals scores even for media-rich sites",
        "Providing structured JSON-LD schemas and AI manifests (llms.txt) significantly improves search indexing and LLM reference accuracy",
      ],
      results: [
        "Successfully launched production application on Vercel with high performance scores across desktop and mobile",
        "Scalably handles multi-route user journeys for enterprise cybersecurity clients and academic workshop partners",
      ],
      designSystem: {
        palette: [
          { name: "White", hex: "#FFFFFF" },
          { name: "Brand Blue", hex: "#015AAA" },
          { name: "Dark Background", hex: "#0B0F19" },
        ],
        fonts: [
          { name: "Geist", usage: "Headings, body & UI" },
        ],
        tools: [
          "React 18", "TypeScript", "Vite 6", "Tailwind CSS 4",
          "Framer Motion", "React Router 7", "Sharp",
          "GTM / GA4", "Microsoft Clarity", "Figma", "VS Code",
        ],
      },
    },
  },
  {
    slug: "nex-logo",
    title: "NEX Logo",
    category: "Logo Design",
    description:
      "Brand identity and logo design for NEX — a NebulaSafeTech cybersecurity product built around zero-trust access and encrypted file exchange. Features a keyhole-embedded 'X' mark across primary, secondary, submark, and monochrome variants.",
    tags: ["Logo Design", "Brand Identity", "Figma", "Typography", "Colour System"],
    img: p("/projects/nex-logo/cover.png"),
    accent: "#2563EB",
    gallery: [
      { src: p("/projects/nex-logo/case-study.png"), caption: "NEX Brand Identity — Case Study Overview", size: "large", objectFit: "contain" },
      { src: p("/projects/nex-logo/primary-colors.png"), caption: "Brand Colour Specification — Mirror Blue & Casual Navy", size: "tall", objectFit: "contain" },
      { src: p("/projects/nex-logo/primary-logo.png"), caption: "Primary Logo — Light Background", size: "standard", objectFit: "contain" },
      { src: p("/projects/nex-logo/primary-logo-dark.png"), caption: "Primary Logo — Dark Background", size: "standard", objectFit: "contain" },
      { src: p("/projects/nex-logo/primary-logo-mono.png"), caption: "Primary Logo — Monochrome (Mirror Blue)", size: "standard", objectFit: "contain" },
      { src: p("/projects/nex-logo/secondary-logo.png"), caption: "Secondary Logo — Light Background", size: "wide", objectFit: "contain" },
      { src: p("/projects/nex-logo/secondary-logo-dark.png"), caption: "Secondary Logo — Dark Background", size: "wide", objectFit: "contain" },
      { src: p("/projects/nex-logo/secondary-logo-mono.png"), caption: "Secondary Logo — Monochrome (Mirror Blue)", size: "standard", objectFit: "contain" },
      { src: p("/projects/nex-logo/submark-logo.png"), caption: "Submark — Light Background", size: "standard", objectFit: "contain" },
      { src: p("/projects/nex-logo/submark-logo-dark.png"), caption: "Submark — Dark Background", size: "standard", objectFit: "contain" },
      { src: p("/projects/nex-logo/submark-logo-mono.png"), caption: "Submark — Monochrome (Mirror Blue)", size: "standard", objectFit: "contain" },
      { src: p("/projects/nex-logo/favicon-logo.png"), caption: "Favicon & Social Media Icon", size: "standard", objectFit: "contain" },
    ],
    details: {
      kind: "dev",
      overview:
        "NEX is a cybersecurity product developed by NebulaSafeTech that enables zero-trust file access and encrypted exchange — sharing nothing, yet accessing everything. This project covers the complete brand identity and logo system for NEX, delivering primary, secondary, submark, and monochrome logo variants with a strict two-colour brand palette and NEXA typography.",
      problem:
        "NEX required a distinct visual identity that immediately communicates its core promise: maximum security through zero-trust access. The mark needed to work across app icons, documentation, presentations, and marketing materials without losing legibility or brand authority.",
      role:
        "Brand Designer — responsible for concept development, logotype construction, iconographic submark design, colour system definition, and multi-variant asset production across light, dark, and monochrome contexts.",
      goals: [
        "Design a mark that encodes NEX's zero-trust and encrypted-exchange philosophy into the letterform itself",
        "Produce a complete variant set covering primary, secondary, submark, light, dark, and monochrome versions",
        "Establish a strict two-colour brand palette (Mirror Blue #2563EB and Casual Navy #0B0F19)",
        "Ensure the logo system scales cleanly from 16×16 favicon to large-format print without detail loss",
      ],
      research:
        "Analysed brand identities of leading cybersecurity and zero-trust access platforms to map visual conventions, then deliberately diverged — using the 'X' letterform as both a wordmark element and an icon embedding a shielded keyhole at its intersection.",
      designProcess:
        "Began with concept sketches exploring security metaphors, converging on the 'X + keyhole' motif that encodes exchange (the X) and access control (the keyhole) in a single mark. Iterated across weight, proportion, and submark crops before finalising the three-tier system: Primary (wordmark + tagline), Secondary (horizontal lockup), and Submark (icon-only).",
      developmentProcess:
        "All variants were constructed in Figma using vector paths with defined grid anchors, exported as optimised PNGs across three colour contexts (light, dark, monochrome) and as a square favicon at 512×512 for social and app usage.",
      techStack: [
        "Figma",
        "Vector Design",
        "Brand Strategy",
        "Typography (NEXA)",
        "Colour Theory",
        "Export Optimization",
      ],
      features: [
        "Three-tier logo system: Primary wordmark, Secondary horizontal lockup, and Submark icon",
        "Twelve production-ready PNG exports across light, dark, and monochrome colour contexts",
        "Keyhole-embedded 'X' mark encoding zero-trust access and encrypted exchange symbolism",
        "NEXA typeface selected for its geometric authority and modern-secure aesthetic",
        "Two-colour brand palette — Mirror Blue (#2563EB) and Casual Navy (#0B0F19) — documented with RGB, HEX, CMYK, HSV, and HSL values",
        "Square favicon and social media icon variant cropped from the submark",
      ],
      uiUxDecisions: [
        "Chose the letter 'X' as the hero form — immediately readable as 'NEX' while carrying iconographic weight on its own as the submark",
        "Embedded a shielded keyhole at the X intersection to encode the core product concept without a separate icon element",
        "Selected NEXA typeface for the wordmark to complement the angular geometry of the X icon",
        "Constrained the palette to exactly two brand colours to ensure maximum recognition and reproduction fidelity across any medium",
      ],
      challenges: [
        "Ensuring the keyhole detail at the centre of the X remained legible at small sizes such as 32px favicon",
        "Balancing the visual weight between the 'NE' letterforms and the dominant blue 'X' icon across all three colour contexts",
      ],
      solutions: [
        "Simplified the keyhole to a clean shield-slot shape without fine detail so it reads clearly at any scale",
        "Adjusted stroke weights and letter spacing per variant to maintain optical balance across light, dark, and monochrome backgrounds",
      ],
      learnings: [
        "A strong brand concept encoded in the mark itself — rather than applied through colour or styling — ensures the identity works in every context",
        "Producing all variants systematically in Figma from a single master frame ensures consistency and accelerates future brand extension",
      ],
      results: [
        "Delivered a complete 12-asset logo system ready for deployment across app, web, documentation, and marketing surfaces",
        "Established a brand identity that clearly differentiates NEX from generic cybersecurity visual conventions while remaining professional and scalable",
      ],
      designSystem: {
        palette: [
          { name: "Mirror Blue", hex: "#2563EB" },
          { name: "Casual Navy", hex: "#0B0F19" },
          { name: "White", hex: "#FFFFFF" },
        ],
        fonts: [
          { name: "NEXA", usage: "Wordmark & brand typography" },
        ],
        tools: [
          "Figma", "Vector Design", "PNG Export",
          "Brand Strategy", "Colour Theory",
        ],
      },
    },
  },
  {
    slug: "nebulasafetech-logo",
    title: "NebulaSafeTech Logo",
    category: "Logo Design",
    description:
      "Brand identity and logo design for NebulaSafeTech — featuring a geometric wolf-and-shield motif symbolizing vigilance, security, and digital innovation, complemented by the Overcame-Demo typeface and Endeavour Blue color palette.",
    tags: ["Logo Design", "Brand Identity", "Figma", "Typography", "Vector Design"],
    img: p("/projects/nst-logo/cover.png"),
    accent: "#0056A7",
    gallery: [
      { src: p("/projects/nst-logo/case-study.png"), caption: "NebulaSafeTech Brand Identity — Case Study Overview", size: "large", objectFit: "contain" },
      { src: p("/projects/nst-logo/primary-colors.png"), caption: "Brand Colour Specification — Endeavour Blue, Beyond Black & Full White", size: "tall", objectFit: "contain" },
      { src: p("/projects/nst-logo/primary-logo-light.png"), caption: "Primary Logo with Tagline — Light Background", size: "standard", objectFit: "contain" },
      { src: p("/projects/nst-logo/primary-logo-dark.png"), caption: "Primary Logo with Tagline — Dark Background", size: "standard", objectFit: "contain" },
      { src: p("/projects/nst-logo/primary-logo-blue.png"), caption: "Primary Logo — Endeavour Blue Background", size: "standard", objectFit: "contain" },
      { src: p("/projects/nst-logo/secondary-logo-light.png"), caption: "Secondary Horizontal Logo — Light Background", size: "wide", objectFit: "contain" },
      { src: p("/projects/nst-logo/secondary-logo-dark.png"), caption: "Secondary Horizontal Logo — Dark Background", size: "wide", objectFit: "contain" },
      { src: p("/projects/nst-logo/secondary-logo-blue.png"), caption: "Secondary Horizontal Logo — Endeavour Blue Background", size: "wide", objectFit: "contain" },
      { src: p("/projects/nst-logo/secondary-wordmark-blue.png"), caption: "Wordmark Logo — Endeavour Blue Background", size: "standard", objectFit: "contain" },
      { src: p("/projects/nst-logo/submark-badge.png"), caption: "Submark Emblem & Official Circular Seal", size: "standard", objectFit: "contain" },
      { src: p("/projects/nst-logo/social-media-square.png"), caption: "Social Media Icon — Square Format (Light)", size: "standard", objectFit: "contain" },
      { src: p("/projects/nst-logo/social-media-circle.png"), caption: "Social Media Icon — Circular Avatar (Endeavour Blue)", size: "standard", objectFit: "contain" },
    ],
    details: {
      kind: "dev",
      overview:
        "NebulaSafeTech is a premier cybersecurity and digital solutions firm. This project represents the complete brand identity design for NebulaSafeTech, centering on a geometric wolf-head motif constructed from circuit-inspired lines and an inverted shield-triangle that communicates vigilance, intelligence, defense, and digital transformation.",
      problem:
        "NebulaSafeTech required a powerful, recognizable, and scalable brand identity that projects uncompromising cybersecurity authority while feeling modern, tech-forward, and adaptable across web platforms, physical badges, merchandise, corporate seals, and social media channels.",
      role:
        "Brand Designer & Visual Strategist — responsible for core concept development, geometric grid construction of the wolf mark, logotype selection and kerning, colour palette formulation, circular emblem design, and multi-format asset exports.",
      goals: [
        "Craft a distinctive wolf-head symbol embodying vigilance, intelligence, and fearless cybersecurity defense",
        "Integrate circuit-inspired geometric lines and a triangular shield structure representing technology and stability",
        "Establish a cohesive three-color brand palette: Endeavour Blue (#0056A7), Beyond Black (#030108), and Full White (#FFFFFF)",
        "Design versatile variations including primary vertical lockups, secondary horizontal formats, a circular seal submark, and social media avatars",
      ],
      research:
        "Audited visual identities across enterprise cybersecurity, defense contracting, and EdTech institutions. Identified that most brands rely on generic locks or shields. Diverged by fusing an organic metaphor of vigilance (the wolf) with precision angular vector geometry and circuitry.",
      designProcess:
        "Constructed the wolf mark on an equilateral triangle grid using sharp 45-degree and 90-degree vector intersections. Iterated on line weight optical consistency to ensure the nose, ears, and cheek facets remain distinct at both 16px favicon scale and large-format exhibition banners. Paired the mark with the futuristic Overcame-Demo typeface.",
      developmentProcess:
        "Engineered the entire vector brand asset system in Figma with precise stroke alignments. Exported high-resolution assets categorized by background theme (light, dark, monochrome, branded blue) and application type (primary lockup, horizontal lockup, wordmark, circular seal, square/circular social icons).",
      techStack: [
        "Figma",
        "Vector Design",
        "Brand Strategy",
        "Typography (Overcame-Demo)",
        "Colour Theory",
        "Asset Optimization",
      ],
      features: [
        "Geometric wolf symbol with integrated shield and circuit aesthetics",
        "Complete multi-variant system: Primary, Secondary horizontal, Wordmark-only, Circular emblem, and Social avatars",
        "Full background context compatibility: Light, Dark, Endeavour Blue, and Single Color",
        "Endeavour Blue (#0056A7) brand color system with complete RGB, HEX, CMYK, HSV, and HSL specifications",
        "Customized Overcame-Demo logotype with distinctive angular 'A' letterforms",
        "Production-ready vector and high-resolution PNG exports for digital, print, and physical collateral",
      ],
      uiUxDecisions: [
        "Constructed the wolf head from interlocking circuit vectors to immediately establish a connection to high-tech digital systems",
        "Embedded an inverted triangle backdrop to represent stability, direction, and shield-like defense",
        "Created a dedicated circular seal submark with star accents for official certificates, institutional MoUs, and academic workshop badges",
        "Maintained strict high-contrast color pairings to ensure instant readability and WCAG compliance across dark and light interfaces",
      ],
      challenges: [
        "Maintaining clean visual separation between intricate circuit-line facets when reducing the wolf mark to small avatar and favicon dimensions",
        "Balancing the commanding visual presence of the wolf emblem with the extended typography of 'NEBULASAFETECH' in horizontal lockups",
      ],
      solutions: [
        "Designed simplified single-color and circular emblem adaptations with adjusted stroke weights for small-scale applications",
        "Calibrated letter-spacing and proportional sizing in the horizontal secondary logo to create balanced harmony between mark and wordmark",
      ],
      learnings: [
        "A multi-layered symbol (wolf + shield + circuitry) provides rich visual storytelling that strengthens brand recall across both corporate and academic audiences",
        "Providing pre-composed dark, light, and brand-color variants prevents improper brand asset usage across disparate marketing and development teams",
      ],
      results: [
        "Successfully established the core visual identity adopted across all NebulaSafeTech digital properties, official communications, and workshop materials",
        "Delivered a complete, scalable design system spanning 13 production-ready identity assets",
      ],
      designSystem: {
        palette: [
          { name: "Endeavour Blue", hex: "#0056A7" },
          { name: "Beyond Black", hex: "#030108" },
          { name: "Full White", hex: "#FFFFFF" },
        ],
        fonts: [
          { name: "Overcame-Demo", usage: "Logotype & wordmark" },
          { name: "Plus Jakarta Sans", usage: "Taglines & brand communications" },
        ],
        tools: [
          "Figma", "Vector Design", "PNG Export",
          "Brand Strategy", "Colour Theory",
        ],
      },
    },
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
