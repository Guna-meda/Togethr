import { create } from "zustand";

export const useAppStore = create((set) => ({
  darkTheme: false,
  isThemeLoaded: false,

  toggledarkTheme: () => {
    set((state) => {
      const newMode = !state.darkTheme;
      localStorage.setItem("theme", newMode ? "dark" : "light");
      return { darkTheme: newMode };
    });
  },
  setdarkTheme: (isDark) => {
    localStorage.setItem("theme", isDark ? "dark" : "light");
    set({ darkTheme: isDark, isThemeLoaded: true });
  },
}));
