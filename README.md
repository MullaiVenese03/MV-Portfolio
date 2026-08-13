# MV-Portfolio

Personal portfolio website for **Mullai Venese** — Front-End Developer & UI/UX Designer. This site showcases professional projects, interactive services, technical skills, career journey, and contact capabilities built with a modern React, TypeScript, and Tailwind CSS stack.

Live URL: [https://mullaivenese.dev](https://mullaivenese.dev)  
Repository: [https://github.com/MullaiVenese03/MV-Portfolio](https://github.com/MullaiVenese03/MV-Portfolio)

---

## Overview

MV-Portfolio is a single-page application (SPA) with dedicated route views designed to present digital services, design systems, and software engineering capabilities. Built with emphasis on performance, motion design, and responsive usability, the portfolio features interactive 3D presentations, card stack interactions, accessible design patterns, and structured search engine metadata.

---

## Features

- **Animated Hero & Introduction**: Smooth intro presentation with video intro support, animated brand headline, and direct CTA actions.
- **Interactive 3D Services Stack**: Cinematic 3D scroll-driven presentation deck displaying web design, full-stack website development, and visual branding services.
- **Chronological Journey Timeline**: Interactive timeline deck showcasing education, self-taught learning, freelancing, and career graduation milestones sorted chronologically.
- **Project Showcase & Detail Views**: Filterable project gallery with category tags, live links, GitHub repository references, and dedicated project detail pages.
- **Categorized Skills Matrix**: Technical skills showcase organized by Frontend, UI/UX, Design, Tools, and Core CS with interactive category filters.
- **About & Philosophy**: Background overview, personal engineering approach, education summary, and key project metrics counters.
- **Contact Form & Info**: Interactive contact form with input validation, animated flight button indicator, direct email/phone links, and social channels.
- **Responsive Theme Switching**: Light and dark theme modes using custom CSS properties and smooth reveal transitions.
- **Accessibility & Motion Optimization**: Native keyboard focus states, semantic HTML5 structure, skip navigation link, and `prefers-reduced-motion` adaptivity.

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI component framework |
| **TypeScript** | Static typing and type safety |
| **Vite 6** | Frontend build tool and development server |
| **Tailwind CSS v4** | Utility-first styling framework |
| **Motion** (`motion/react`) | Scroll-driven animations, 3D card transforms, and micro-interactions |
| **React Router v8** | Client-side routing (`createBrowserRouter`) |
| **Lenis** | Smooth scrolling library |
| **Lucide React** | Modern UI iconography |
| **ESLint 9** | Code quality enforcement |

---

## Project Structure

```text
MV-Portfolio/
├── .env.example
├── .gitignore
├── ATTRIBUTIONS.md
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── public/
│   ├── _redirects
│   ├── apple-touch-icon.svg
│   ├── browserconfig.xml
│   ├── favicon.svg
│   ├── manifest.json
│   ├── og-image.svg
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   ├── About.tsx
│   │   │   ├── Contact.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── FooterLink.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── HeroVideoIntro.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── PaperPlaneButton.tsx
│   │   │   ├── Projects.tsx
│   │   │   ├── Services.tsx
│   │   │   ├── SignatureIntro.tsx
│   │   │   ├── Skills.tsx
│   │   │   ├── SkipLink.tsx
│   │   │   ├── SocialIconLink.tsx
│   │   │   ├── StructuredData.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   ├── ThemeReveal.tsx
│   │   │   └── Timeline.tsx
│   │   ├── config/
│   │   │   └── site.ts
│   │   ├── data/
│   │   │   ├── navigation.ts
│   │   │   ├── projects.ts
│   │   │   └── socialLinks.ts
│   │   ├── hooks/
│   │   │   ├── usePageMeta.ts
│   │   │   └── useScrollSpy.ts
│   │   ├── layouts/
│   │   │   └── RootLayout.tsx
│   │   ├── lib/
│   │   │   ├── scroll.ts
│   │   │   └── validation.ts
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── NotFound.tsx
│   │   │   ├── ProjectDetail.tsx
│   │   │   └── ProjectsPage.tsx
│   │   ├── routes.tsx
│   │   └── theme.ts
│   ├── imports/
│   ├── main.tsx
│   ├── react-polyfill.ts
│   ├── styles/
│   │   ├── a11y.css
│   │   ├── fonts.css
│   │   ├── globals.css
│   │   ├── index.css
│   │   ├── portfolio-theme.css
│   │   ├── responsive.css
│   │   └── tailwind.css
│   └── vite-env.d.ts
├── tsconfig.json
├── vercel.json
└── vite.config.ts
```

---

## Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/MullaiVenese03/MV-Portfolio.git
cd MV-Portfolio
npm install
```

### Development

Start the Vite development server:

```bash
npm run dev
```

### Production Build

Typecheck and create the optimized production bundle:

```bash
npm run build
```

The output will be placed in the `dist/` directory.

### Additional Scripts

- **Typecheck**: `npm run typecheck`
- **Linting**: `npm run lint`

---

## Environment Variables

The project uses optional environment configuration for canonical URLs, Open Graph tags, and sitemap generation.

To configure a custom production URL:

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Set `VITE_SITE_URL`:
   ```env
   VITE_SITE_URL=https://mullaivenese.dev
   ```

*Note: No private API keys or secrets are required for running this project.*

---

## Responsive Design

The application is engineered with dynamic breakpoint adaptation:

- **Desktop (`>= 1024px`)**: Full 3D card presentations, 3-column service interactions, and expanded navigation layout.
- **Tablet (`768px – 1023px`)**: Adapted 2-column grid structures, translated scroll containers, and responsive card height constraints.
- **Mobile (`< 768px`)**: Single-column vertical stacks, touch-driven scroll progress animations, mobile overlay menu, and full width fluid controls.

---

## Performance & Optimization

- **Code Splitting**: Configured manual Rollup chunks in `vite.config.ts` for React core, Motion, React Router, and Lucide icons.
- **Asset Minimization**: CSS minification with Lightning CSS / PostCSS and target bundle optimization (`es2022`).
- **GPU-Accelerated Motion**: Transformations utilize CSS `transform` and `opacity` to prevent continuous layout thrashing.
- **Reduced Motion Support**: Non-essential motion transforms automatically disable when `prefers-reduced-motion: reduce` is detected.
- **SEO & Metadata**: Pre-rendered static sitemap (`sitemap.xml`), robots specification (`robots.txt`), Open Graph image (`og-image.svg`), and WebSite/Person JSON-LD structured data.

---

## Accessibility

- **Semantic HTML**: HTML5 structural tags (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<article>`).
- **Focus Management**: Visible outline focus rings for keyboard navigation.
- **Skip Navigation**: Accessible `<SkipLink />` component for screen readers and keyboard users.
- **ARIA Attributes**: Form error regions and interactive controls utilize explicit ARIA roles and live regions.

---

## Deployment

The repository includes deployment configuration for modern static hosts:

- **Vercel**: Rewrites defined in `vercel.json` for SPA routing.
- **Netlify / Cloudflare Pages**: SPA routing fallback defined in `public/_redirects`.

---

## Author

**Mullai Venese**  
Front-End Developer & UI/UX Designer

- **Portfolio**: [https://mullaivenese.dev](https://mullaivenese.dev)
- **GitHub**: [https://github.com/MullaiVenese03](https://github.com/MullaiVenese03)
- **LinkedIn**: [https://www.linkedin.com/in/mullaivenese](https://www.linkedin.com/in/mullaivenese)
- **Email**: [mullaivenesep@gmail.com](mailto:mullaivenesep@gmail.com)

---

## License

No explicit license has currently been specified for this repository. All rights reserved.
#   M V - P o r t f o l i o 
