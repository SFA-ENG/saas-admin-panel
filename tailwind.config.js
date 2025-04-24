module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"), // optional but gives nice base for inputs
  ],
};
