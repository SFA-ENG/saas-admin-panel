import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
// @ts-ignore
import eslint from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    eslint({
      cache: false,
      include: ["src/**/*.js", "src/**/*.jsx"],
      exclude: ["node_modules/**", "dist/**"],
      failOnError: false,
      emitWarning: true,
      emitError: true,
      fix: true,
    }),
  ],
  resolve: {
    alias: {
      stores: path.resolve(__dirname, "./src/stores"),
      Components: path.resolve(__dirname, "./src/Components"),
      helpers: path.resolve(__dirname, "./src/helpers"),
      "http-client": path.resolve(__dirname, "./src/http-client"),
      pages: path.resolve(__dirname, "./src/pages"),
      assets: path.resolve(__dirname, "./src/assets"),
      hoc: path.resolve(__dirname, "./src/hoc"),
      hooks: path.resolve(__dirname, "./src/hooks"),
    },
    extensions: [".js", ".jsx", ".json"],
  },
  server: {
    port: 3000,
    open: true,
  },
  publicDir: "public",
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx",
      },
    },
  },
  esbuild: {
    loader: "jsx",
    include: /src\/.*\.[tj]sx?$/,
    exclude: [],
  },
  build: {
    sourcemap: true, // Ensure this is added to generate source maps
  },
});
