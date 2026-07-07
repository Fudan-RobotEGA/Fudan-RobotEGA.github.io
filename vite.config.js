import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { copyFile } from "node:fs/promises";
import { resolve } from "node:path";

const spaFallback = () => ({
  name: "spa-fallback",
  apply: "build",
  async closeBundle() {
    const distDir = resolve(process.cwd(), "dist");
    await copyFile(resolve(distDir, "index.html"), resolve(distDir, "404.html"));
  },
});

export default defineConfig({
  plugins: [vue(), spaFallback()],
});
