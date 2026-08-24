# MV-Portfolio

> Personal portfolio showcasing my projects, frontend development, UI/UX design work, and professional journey.

**Live Site:** [https://mullai-venese.web.app](https://mullai-venese.web.app)  
**Repository:** [https://github.com/MullaiVenese03/MV-Portfolio](https://github.com/MullaiVenese03/MV-Portfolio)

---

## Overview

MV-Portfolio is a single-page application (SPA) with dedicated route views designed to present digital services, design systems, and software engineering capabilities. Built with emphasis on performance, motion design, and responsive usability, the portfolio features interactive 3D presentations, card stack interactions, accessible design patterns, and structured search engine metadata.

---

## Features

- **Animated Hero & Introduction**  
  Smooth intro presentation with video intro support, animated brand headline, and direct CTA actions.

- **Interactive 3D Services Stack**  
  Cinematic 3D scroll-driven presentation deck displaying web design, full-stack website development, and visual branding services.

- **Chronological Journey Timeline**  
  Interactive timeline deck showcasing education, self-taught learning, freelancing, and career graduation milestones sorted chronologically.

- **Project Showcase & Detail Views**  
  Filterable project gallery with category tags, live links, GitHub repository references, and dedicated project detail pages.

- **Categorized Skills Matrix**  
  Technical skills showcase organized by Frontend, UI/UX, Design, Tools, and Core CS with interactive category filters.

- **About & Philosophy**  
  Background overview, personal engineering approach, education summary, and key project metrics counters.

- **Contact Form & Info**  
  Interactive contact form powered by Formspree (AJAX, no page reload), with animated paper-plane submission button, input validation, direct email/phone links, and social channels.

- **Responsive Theme Switching**  
  Light and dark theme modes using custom CSS properties and smooth reveal transitions.

- **Accessibility & Motion Optimization**  
  Native keyboard focus states, semantic HTML5 structure, skip navigation link, and `prefers-reduced-motion` adaptivity.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI component framework |
| TypeScript | Static typing and type safety |
| Vite 6 | Frontend build tool and development server |
| Tailwind CSS v4 | Utility-first styling framework |
| Motion (`motion/react`) | Scroll-driven animations, 3D card transforms, and micro-interactions |
| React Router v6 | Client-side routing (`createBrowserRouter`) |
| Lenis | Smooth scrolling library |
| Lucide React | Modern UI iconography |
| @formspree/react | AJAX contact form submission |
| ESLint 9 | Code quality enforcement |

---

## Project Structure

```text
MV-Portfolio/
├── .env.example
├── .firebaserc
├── .gitignore
├── ATTRIBUTIONS.md
├── eslint.config.js
├── firebase.json
├── index.html
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
│   │   ├── config/
│   │   │   └── site.ts          ← site URL & metadata config
│   │   ├── data/
│   │   │   └── socialLinks.ts   ← social media links
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── routes.tsx
│   │   └── theme.ts
│   ├── imports/                 ← static assets (images, resume PDF)
│   ├── main.tsx
│   ├── styles/
│   └── vite-env.d.ts
├── tsconfig.json
├── vercel.json
└── vite.config.ts
```

---

## Getting Started

### Prerequisites

- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### Installation

```bash
git clone https://github.com/MullaiVenese03/MV-Portfolio.git
cd MV-Portfolio
npm install
```

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

Output goes to `dist/`.

### Additional Scripts

| Script | Command |
|---|---|
| Typecheck | `npm run typecheck` |
| Lint | `npm run lint` |
| Build | `npm run build` |

---

## Environment Variables

No private API keys or secrets are required. The only env variable controls the canonical site URL used in metadata and OG tags.

Copy `.env.example` to `.env` and set:

```env
VITE_SITE_URL=https://mullai-venese.web.app
```

> ⚠️ Never commit `.env` — it is gitignored. Only commit `.env.example`.

---

## Deployment

### 🔥 Firebase Hosting (Current)

The project is deployed to **Firebase Hosting** at [https://mullai-venese.web.app](https://mullai-venese.web.app).

```bash
npm run build
firebase deploy
```

Firebase config is in [`firebase.json`](./firebase.json) — public directory is `dist/`, SPA rewrites enabled.

---

### ↩️ Switching Back to GitHub Pages

If you need to redeploy to GitHub Pages (`https://mullaivenese03.github.io/MV-Portfolio/`), make these changes:

**1. `vite.config.ts`** — change base path:
```diff
- base: "/"
+ base: "/MV-Portfolio/"
```

**2. `index.html`** — update canonical, og:url, og:image, twitter:image:
```diff
- <link rel="canonical" href="https://mullai-venese.web.app/" />
+ <link rel="canonical" href="https://mullaivenese03.github.io/MV-Portfolio/" />
- <meta property="og:url" content="https://mullai-venese.web.app/" />
+ <meta property="og:url" content="https://mullaivenese03.github.io/MV-Portfolio/" />
- <meta property="og:image" content="https://mullai-venese.web.app/og-image.svg" />
+ <meta property="og:image" content="https://mullaivenese03.github.io/MV-Portfolio/og-image.svg" />
- <meta name="twitter:image" content="https://mullai-venese.web.app/og-image.svg" />
+ <meta name="twitter:image" content="https://mullaivenese03.github.io/MV-Portfolio/og-image.svg" />
```

**3. `src/app/config/site.ts`** — update fallback URL:
```diff
- "https://mullai-venese.web.app"
+ "https://mullaivenese03.github.io/MV-Portfolio"
```

**4. `public/sitemap.xml`** — replace all `https://mullai-venese.web.app` with `https://mullaivenese03.github.io/MV-Portfolio`

**5. `public/robots.txt`** — update Sitemap line:
```diff
- Sitemap: https://mullai-venese.web.app/sitemap.xml
+ Sitemap: https://mullaivenese03.github.io/MV-Portfolio/sitemap.xml
```

**6. `.env` / `.env.example`**:
```env
VITE_SITE_URL=https://mullaivenese03.github.io/MV-Portfolio
```

Then push to the `gh-pages` branch or run the GitHub Actions workflow.

---

### Other Platforms

- **Vercel**: SPA route rewrites configured in `vercel.json`. Set `base: "/"` in `vite.config.ts`.
- **Netlify / Cloudflare Pages**: SPA routing fallback configured in `public/_redirects`. Set `base: "/"`.

---

## Responsive Design

- **Desktop (≥ 1024px)**: Interactive 3D card presentations, 3-column service deck layout, and expanded header navigation.
- **Tablet (768px – 1023px)**: Adapted 2-column grid compositions, responsive scroll height constraints, and translated card stack containers.
- **Mobile (< 768px)**: Single-column vertical stacks, touch-driven scroll progress animations, mobile overlay navigation menu, and fluid viewport controls.

---

## Performance & Optimization

- **Code Splitting**: Manual Rollup chunking in `vite.config.ts` for React core, Motion, React Router, and Lucide icons.
- **GPU-Accelerated Animations**: Transformations use CSS `transform` and `opacity` to prevent layout thrashing.
- **Reduced Motion Support**: Motion transforms automatically disable when `prefers-reduced-motion: reduce` is enabled.
- **SEO & Metadata**: Static sitemap (`sitemap.xml`), robots policy (`robots.txt`), Open Graph image, and WebSite/Person JSON-LD structured data.

---

## Accessibility

- **Semantic HTML**: HTML5 structural elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`).
- **Focus Management**: Visible outline focus rings for keyboard navigation.
- **Skip Navigation**: Accessible `<SkipLink />` component for screen readers and keyboard users.
- **ARIA Standards**: Explicit ARIA attributes and live regions for form validation states.

---

## Security

- No private API keys are stored in the repository or exposed in the client bundle.
- The Formspree form ID (`mvkpjgdl`) is a public endpoint identifier — it is not a secret key.
- All environment variables prefixed with `VITE_` are baked into the client bundle at build time — never put secrets in them.

---

## Author

**Mullai Venese**  
Front-End Developer & UI/UX Designer

- **Portfolio**: [https://mullai-venese.web.app](https://mullai-venese.web.app)
- **GitHub**: [https://github.com/MullaiVenese03](https://github.com/MullaiVenese03)
- **LinkedIn**: [https://www.linkedin.com/in/mullaivenesep/](https://www.linkedin.com/in/mullaivenesep/)
- **Instagram**: [https://www.instagram.com/itsmadebymv/](https://www.instagram.com/itsmadebymv/)
- **Email**: [mullaivenesep@gmail.com](mailto:mullaivenesep@gmail.com)

---

## License

No explicit license has currently been specified for this repository. All rights reserved.