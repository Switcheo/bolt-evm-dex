import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import Inspect from "vite-plugin-inspect";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: "es2020",
    outDir: "./build",
  },
  plugins: [react(), svgr(), Inspect()],
});
