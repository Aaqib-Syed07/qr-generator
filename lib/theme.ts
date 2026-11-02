/*
  Theme values shared between the inline script in app/layout.tsx and the
  ThemeToggle component. Light and dark values live in app/globals.css.
*/

export const THEME_STORAGE_KEY = "signet-theme";

export const THEME_VALUES = ["light", "system", "dark"] as const;

export type ThemeValue = (typeof THEME_VALUES)[number];

/*
  Runs before paint to set the .dark class and avoid a wrong-theme flash.
  Resolution order: stored choice (light, system, dark, or anything unknown
  which falls back to the OS preference), then the OS preference.
*/
export function buildThemeInitScript(): string {
  const script = `
    (function () {
      var root = document.documentElement;
      var stored = null;
      try {
        stored = localStorage.getItem("${THEME_STORAGE_KEY}");
      } catch (e) {}
      var dark = false;
      var systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (stored === "dark") dark = true;
      else if (stored === "system" || !stored) dark = systemDark;
      root.classList.toggle("dark", dark);
    })();
  `;
  return script.trim().replace(/\s{2,}/g, " ");
}
