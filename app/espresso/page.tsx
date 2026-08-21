"use client";

import { useEffect, useState } from "react";
import { EspressoPlanner } from "@/app/components/espresso-planner";
import { SiteFooter, SiteHeader } from "@/app/components/site-chrome";

type Theme = "light" | "dark";

export default function EspressoPage() {
  const [theme, setTheme] = useState<Theme>("light");

  useThemeInitialization(setTheme);

  function toggleTheme() {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem("coffee-theme", nextTheme);
  }

  return (
    <main className="espresso-page" id="top">
      <SiteHeader theme={theme} activePage="espresso" onToggleTheme={toggleTheme} />
      <EspressoPlanner />
      <SiteFooter />
    </main>
  );
}

function useThemeInitialization(setTheme: (theme: Theme) => void) {
  useEffect(() => {
    const storedTheme = window.localStorage.getItem("coffee-theme");
    const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const initialTheme: Theme = storedTheme === "dark" || storedTheme === "light" ? storedTheme : preferredTheme;
    setTheme(initialTheme);
    document.documentElement.dataset.theme = initialTheme;
  }, [setTheme]);
}
