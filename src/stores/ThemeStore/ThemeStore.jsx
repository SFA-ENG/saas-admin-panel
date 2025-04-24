import { create } from "zustand";
import { persist } from "zustand/middleware";

const useThemeStore = create(
  persist(
    (set) => ({
      theme: "default",

      setTheme: (newTheme) => set({ theme: newTheme }),

      toggleTheme: () =>
        set((state) => {
          switch (state.theme) {
            case "default":
              return { theme: "dark-theme" };
            case "dark-theme":
              return { theme: "sports-theme" };
            case "sports-theme":
              return { theme: "default" };
            default:
              return { theme: "default" };
          }
        }),
    }),
    {
      name: "theme-storage", // unique name for localStorage
    }
  )
);

export default useThemeStore;
