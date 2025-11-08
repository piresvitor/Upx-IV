import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Otimizações de build
    target: "esnext",
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log em produção
        drop_debugger: true,
      },
    },
    // Code splitting otimizado
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar vendor chunks
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "ui-vendor": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-label",
            "@radix-ui/react-slot",
            "@origin-ui/components",
          ],
          "charts-vendor": ["recharts"],
          "maps-vendor": ["@react-google-maps/api"],
          "utils-vendor": ["axios", "clsx", "tailwind-merge", "class-variance-authority"],
        },
        // Otimização de nomes de chunks
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
      },
    },
    // Otimizações de assets
    assetsInlineLimit: 4096, // Inline assets pequenos (< 4kb)
    cssCodeSplit: true,
    sourcemap: false, // Desabilitar sourcemaps em produção para reduzir tamanho
    // Aumentar chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },
  // Otimizações de desenvolvimento
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@react-google-maps/api",
      "recharts",
    ],
  },
  // Preload de recursos críticos
  server: {
    headers: {
      "Cache-Control": "public, max-age=31536000",
    },
  },
});
