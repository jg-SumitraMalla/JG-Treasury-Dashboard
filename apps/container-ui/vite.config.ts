import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/ui",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Resolve local component package to its source during dev so Vite can scan deps
      "@apac-ui-warehouse/component-warehouse": path.resolve(
        __dirname,
        "../../packages/component-warehouse/src"
      ),
    },
    // Ensure single instance of react-router-dom across all packages
    dedupe: ["react", "react-dom", "react-router-dom"],
  },
  optimizeDeps: {
    // Pre-bundle these dependencies to avoid duplication issues
    include: ["react", "react-dom", "react-router-dom"],
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        // Keep react-router-dom in the main bundle to prevent context issues
        manualChunks: {
          // Bundle React and Router together to ensure context works
          "react-vendor": ["react", "react-dom", "react-router-dom"],
        },
      },
    },
  },
  css: {
    modules: {
      localsConvention: "camelCase",
      generateScopedName: "[name]__[local]___[hash:base64:5]",
    },
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
      scss: {
        additionalData: "",
      },
    },
  },
});
