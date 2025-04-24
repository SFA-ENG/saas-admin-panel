/**
 * Theme configuration for the entire application
 * This centralizes all theme definitions and provides utility functions
 */

// Theme definitions - these match the CSS variables in index.css
export const themes = {
  default: {
    name: "Default",
    colors: {
      primary: "#4f46e5",
      primaryLight: "#818cf8",
      primaryDark: "#3730a3",
      secondary: "#8b5cf6",
      secondaryLight: "#a78bfa",
      secondaryDark: "#6d28d9",
      accent: "#ec4899",
      accentLight: "#f472b6",
      accentDark: "#db2777",
      textPrimary: "#111827",
      textSecondary: "#4b5563",
      textTertiary: "#9ca3af",
      backgroundPrimary: "#ffffff",
      backgroundSecondary: "#f9fafb",
      backgroundTertiary: "#f3f4f6",
      border: "rgba(229, 231, 235, 0.8)",
    },
  },
  "dark-theme": {
    name: "Dark",
    colors: {
      primary: "#818cf8",
      primaryLight: "#a5b4fc",
      primaryDark: "#4f46e5",
      secondary: "#a78bfa",
      secondaryLight: "#c4b5fd",
      secondaryDark: "#7c3aed",
      accent: "#f472b6",
      accentLight: "#fb7185",
      accentDark: "#e11d48",
      textPrimary: "#f9fafb",
      textSecondary: "#e5e7eb",
      textTertiary: "#9ca3af",
      backgroundPrimary: "#111827",
      backgroundSecondary: "#1f2937",
      backgroundTertiary: "#374151",
      border: "rgba(75, 85, 99, 0.8)",
    },
  },
  "sports-theme": {
    name: "Sports",
    colors: {
      primary: "#10b981",
      primaryLight: "#34d399",
      primaryDark: "#059669",
      secondary: "#f59e0b",
      secondaryLight: "#fbbf24",
      secondaryDark: "#d97706",
      accent: "#f97316",
      accentLight: "#fb923c",
      accentDark: "#ea580c",
      textPrimary: "#374151",
      textSecondary: "#4b5563",
      textTertiary: "#9ca3af",
      backgroundPrimary: "#ffffff",
      backgroundSecondary: "#f0fdf4",
      backgroundTertiary: "#ecfdf5",
      border: "rgba(209, 250, 229, 0.8)",
    },
  },
};

/**
 * Converts a camelCase color name to a CSS variable name
 * @param {string} camelCaseName - The camelCase color name
 * @returns {string} The CSS variable name
 */
export const toCssVariableName = (camelCaseName) => {
  // Convert camelCase to kebab-case and prefix with --color-
  return `--color-${camelCaseName.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
};

/**
 * Gets the CSS value for a particular theme property
 * @param {string} themeName - The theme name
 * @param {string} propertyName - The property name in camelCase
 * @returns {string} The CSS value
 */
export const getThemePropertyValue = (themeName, propertyName) => {
  const theme = themes[themeName];
  return theme && theme.colors[propertyName]
    ? theme.colors[propertyName]
    : themes.default.colors[propertyName];
};

/**
 * Gets all available theme names
 * @returns {Array} Array of theme names
 */
export const getThemeNames = () => {
  return Object.keys(themes);
};

/**
 * Gets theme display names for UI
 * @returns {Array} Array of objects with id and name
 */
export const getThemeOptions = () => {
  return Object.entries(themes).map(([id, theme]) => ({
    id,
    name: theme.name,
  }));
};

export default themes;
