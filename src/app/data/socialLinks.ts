import { Github, Linkedin, Instagram, Mail, type LucideIcon } from "lucide-react";

export type SocialLink = {
  icon: LucideIcon;
  label: string;
  href: string;
  color: string;
  darkColor?: string;
};

export const socialLinks: SocialLink[] = [
  {
    icon: Github,
    label: "GitHub",
    href: "https://github.com/MullaiVenese03",
    color: "#0B0F19",
    darkColor: "#E2E8F0",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/mullaivenese",
    color: "#0A66C2",
  },
  {
    icon: Instagram,
    label: "Instagram",
    href: "https://www.instagram.com/mullai.dev",
    color: "#E4405F",
  },
  {
    icon: Mail,
    label: "Email",
    href: "mailto:mullaivenesep@gmail.com",
    color: "#2563EB",
  },
];
