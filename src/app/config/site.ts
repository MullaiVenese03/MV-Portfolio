/** Site-wide configuration — override VITE_SITE_URL at build time for production */
export const SITE_URL =
  (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, "") ||
  "https://MullaiVenese03.github.io/MV-Portfolio";

export const SITE = {
  name: "Mullai Venese",
  title: "Mullai Venese | Front-End Developer & UI/UX Designer",
  description:
    "Portfolio of Mullai Venese — Front-End Developer and UI/UX Designer specializing in web development, product design, branding, and digital experiences.",
  locale: "en_US",
  author: "Mullai Venese",
  email: "mullaivenesep@gmail.com",
  phone: "+91 86374 08125",
  location: "India",
  twitterHandle: "@mullai.dev",
  ogImage: `${SITE_URL}/og-image.svg`,
  themeColor: {
    light: "#2563EB",
    dark: "#3B82F6",
  },
} as const;

export const PAGE_META = {
  home: {
    title: SITE.title,
    description: SITE.description,
    path: "/",
  },
  projects: {
    title: `Projects | ${SITE.name}`,
    description:
      "Explore web development, UI/UX design, web design, and branding projects by Mullai Venese.",
    path: "/projects",
  },
  notFound: {
    title: `Page Not Found | ${SITE.name}`,
    description: "The page you are looking for does not exist.",
    path: "/404",
  },
} as const;

export function absoluteUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
