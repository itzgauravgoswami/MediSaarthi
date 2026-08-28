"use client";

import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext({
  theme: "dark",
  toggleTheme: () => {},
  setTheme: () => {},
});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("dark");

  const applyThemeToDOM = (newTheme) => {
    const root = document.documentElement;
    if (newTheme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
      root.setAttribute("data-theme", "dark");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
      root.setAttribute("data-theme", "light");
    }
  };

  useEffect(() => {
    // Check if user has a saved theme preference in localStorage
    try {
      const savedTheme = localStorage.getItem("medisaarthi_theme");
      if (savedTheme === "light" || savedTheme === "dark") {
        setTheme(savedTheme);
        applyThemeToDOM(savedTheme);
      } else {
        // First time on device -> default to dark theme
        localStorage.setItem("medisaarthi_theme", "dark");
        setTheme("dark");
        applyThemeToDOM("dark");
      }
    } catch (e) {
      // Fallback if localStorage is unavailable
      applyThemeToDOM("dark");
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const nextTheme = prevTheme === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("medisaarthi_theme", nextTheme);
      } catch (e) {
        // Ignore storage errors
      }
      applyThemeToDOM(nextTheme);
      return nextTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
