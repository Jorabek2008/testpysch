import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
// https://vite.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      external: ["prop-types"],
    },
  },
  plugins: [
    react({
      jsxRuntime: "automatic", // Bu sozlamani tekshiring
    }),
    svgr(),
  ],
});
