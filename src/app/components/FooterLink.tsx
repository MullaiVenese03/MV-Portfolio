import { themeVars } from "../theme";

interface FooterLinkProps {
  children: React.ReactNode;
  onClick: () => void;
}

export function FooterLink({ children, onClick }: FooterLinkProps) {
  const c = themeVars;

  return (
    <button
      onClick={onClick}
      className="group relative inline-flex text-sm text-left transition-colors duration-300"
      style={
        {
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 500,
          color: c.muted,
          "--link-hover": c.heading,
        } as React.CSSProperties
      }
    >
      <span className="relative transition-colors duration-300 group-hover:[color:var(--link-hover)]">
        {children}
        <span
          className="absolute left-0 -bottom-0.5 h-px w-0 bg-blue-500 transition-all duration-300 ease-out group-hover:w-full"
          aria-hidden
        />
      </span>
    </button>
  );
}
