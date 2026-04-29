import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";

const timestamp = new Date().getTime();

// https://vite.dev/config/
export default defineConfig({
  base:
    process.env.RELEASE === "prod"
      ? "/twreporter/ddd/2025-12-roundabouts/js"
      : "/data-reporter-infographics/dev/2025-12-roundabouts/js",
  plugins: [
    svelte({
      compilerOptions: {
        customElement: true,
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        entryFileNames:
          process.env.RELEASE === "prod"
            ? `assets/[name]-${timestamp}.js`
            : `assets/[name].js`,
        chunkFileNames:
          process.env.RELEASE === "prod"
            ? `assets/[name]-${timestamp}.js`
            : `assets/[name].js`,
        assetFileNames:
          process.env.RELEASE === "prod"
            ? `assets/[name]-${timestamp}.[ext]`
            : `assets/[name].[ext]`,
      },
    },
  },
  define: {
    BUILD_TIME: JSON.stringify(new Date().valueOf()),
  },
});
