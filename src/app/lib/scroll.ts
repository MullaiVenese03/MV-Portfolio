export function scrollToSection(id: string) {
  if (typeof window === "undefined") return;
  const element = document.getElementById(id);
  if (element) {
    const navHeight = 90;
    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - navHeight;

    window.scrollTo({
      top: Math.max(0, offsetPosition),
      behavior: "smooth",
    });
  }
}
