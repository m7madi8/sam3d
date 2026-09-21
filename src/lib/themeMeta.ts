export const THEME_META_COLORS = {
  light: "#f6f4f0",
  dark: "#161514",
} as const;

export function applyThemeMeta(theme: "light" | "dark") {
  const color = THEME_META_COLORS[theme];
  document.documentElement.style.colorScheme = theme;

  let meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", "theme-color");
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", color);
}
