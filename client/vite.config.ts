import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    proxy: {
      "/api": "http://85.198.87.33:3000",
    },
  },
  build: {
    outDir: "../dist/client",
    emptyOutDir: true,
  },
});
