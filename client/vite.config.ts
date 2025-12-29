import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";
import { VitePWA } from "vite-plugin-pwa";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRootDir = resolve(__dirname);

export default defineConfig(({ mode }) => {
  const isProd = mode === "production";
  const isAnalyze = mode === "analyze";

  return {
    base: isProd ? "/build/" : "/",

    build: {
      sourcemap: !isProd,
      cssMinify: true,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ["react", "react-dom", "react-router-dom"],
            vendor: ["lodash", "axios"],
          },
        },
      },
    },

   esbuild: {
  pure: mode === "production" ? ["console.log"] : [],
},

    resolve: {
      alias: {
        "@": resolve(projectRootDir, "src"),
        "@pages": resolve(projectRootDir, "src/pages"),
        "@utils": resolve(projectRootDir, "src/utils"),
        "@layouts": resolve(projectRootDir, "src/components/layout"),
        "@ui": resolve(projectRootDir, "src/components/ui"),
        "@routers": resolve(projectRootDir, "src/routers"),
        "@assets": resolve(projectRootDir, "src/assets"),
      },
    },

    plugins: [
      tailwindcss(),
      react({
        babel: {
          plugins: [
            ["babel-plugin-styled-components", { displayName: true, fileName: false }],
          ],
        },
      }),

      isAnalyze &&
        visualizer({
          open: true,
          filename: "bundle-analysis.html",
          gzipSize: true,
          brotliSize: true,
        }),

      VitePWA({
  registerType: "autoUpdate",
  workbox: {
    globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
    maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
  },
}),
    ].filter(Boolean),

    server: {
      port: 3000,
      host: true,
      cors: true,
      strictPort: true,
      hmr: {
        overlay: false,
        clientPort: 3000,
      },
    },

    preview: {
      port: 3000,
    },
  };
});
