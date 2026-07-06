import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// base: "./" makes all asset URLs relative so the site works at any path,
// including a GitHub Pages project subpath (https://user.github.io/repo/).
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  build: { outDir: "dist", assetsInlineLimit: 0 },
});
