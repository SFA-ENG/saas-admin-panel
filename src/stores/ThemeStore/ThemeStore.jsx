import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getThemeNames } from "../../styles/theme";

const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: "default",

      // Set a specific theme
      setTheme: (newTheme) => {
        if (!getThemeNames().includes(newTheme)) {
          console.warn(
            `Theme "${newTheme}" does not exist. Using default theme.`
          );
          newTheme = "default";
        }

        set({ theme: newTheme });

        // Apply theme class to body for global styling
        document.body.classList.remove(
          ...getThemeNames().filter((t) => t !== "default")
        );
        if (newTheme !== "default") {
          document.body.classList.add(newTheme);
        }
      },

      // Cycle through available themes
      toggleTheme: () => {
        const allThemes = getThemeNames();
        const currentTheme = get().theme;
        const currentIndex = allThemes.indexOf(currentTheme);

        // Get next theme (cycle back to first if at end)
        const nextIndex = (currentIndex + 1) % allThemes.length;
        const nextTheme = allThemes[nextIndex];

        // Update theme using setTheme to ensure body class is updated
        get().setTheme(nextTheme);
      },

      // Helper function to check if dark theme is active
      isDarkTheme: () => get().theme === "dark-theme",

      // Retrieve a CSS variable value based on current theme
      getThemeValue: (varName) => {
        return getComputedStyle(document.documentElement).getPropertyValue(
          varName
        );
      },
    }),
    {
      name: "theme-storage", // unique name for localStorage

      // Handle rehydration from localStorage
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Apply theme when store is rehydrated
          document.body.classList.remove(
            ...getThemeNames().filter((t) => t !== "default")
          );
          if (state.theme && state.theme !== "default") {
            document.body.classList.add(state.theme);
          }
        }
      },
    }
  )
);

export default useThemeStore;
