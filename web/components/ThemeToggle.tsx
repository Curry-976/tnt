"use client";

import { useEffect } from "react";

function syncThemeText(theme: string) {
  document.querySelectorAll<HTMLElement>("[data-dark][data-light]").forEach((node) => {
    const text = theme === "dark" ? node.dataset.dark : node.dataset.light;
    if (text) node.textContent = text;
  });
}

function currentTheme() {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

export function ThemeToggle() {
  // The inline beforeInteractive script (see layout.tsx) sets body[data-theme]
  // from localStorage before paint, but the server-rendered text nodes always
  // show the light-theme copy. Sync text once on mount to match.
  useEffect(() => {
    syncThemeText(currentTheme());
  }, []);

  function toggle() {
    const next = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    syncThemeText(next);
    try {
      localStorage.setItem("tnt-theme", next);
    } catch {
      // ignore storage errors
    }
  }

  return (
    <button
      type="button"
      className="iconbtn theme-toggle"
      title="Thème clair / sombre"
      aria-label="Basculer le thème"
      onClick={toggle}
    >
      <svg className="icon-moon" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z"></path>
      </svg>
      <svg className="icon-sun" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="12" cy="12" r="4.2"></circle>
        <path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6"></path>
      </svg>
    </button>
  );
}
